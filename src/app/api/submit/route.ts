/**
 * POST /api/submit
 * Submit a vote for a candidate
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { parseAndValidatePhone } from '@/lib/phone';
import { normalizeName, validateDateOfBirth } from '@/lib/normalize';
import { getClientIp, getUserAgent } from '@/lib/utils';
import { checkFraudActivity, logFraudActivity } from '@/lib/fraud-detection';
import { submitVoteLimiter } from '@/lib/rate-limit';

interface SubmitVoteRequest {
  candidateId: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phone?: string;
  email?: string;
  otpHash: string;
  verificationMethod: 'phone' | 'email';
  country?: string;
}

export async function POST(request: Request) {
  try {
    const body: SubmitVoteRequest = await request.json();
    const { candidateId, firstName, lastName, dateOfBirth, phone, email, otpHash, verificationMethod } = body;

    // Log received data for debugging
    console.log('✅ Vote submission received:', {
      candidateId,
      firstName,
      lastName,
      dateOfBirth,
      phone: phone ? `***${phone.slice(-4)}` : undefined,
      email: email ? '***' : undefined,
      otpHash: otpHash ? '***' : undefined,
      verificationMethod,
    });

    // Validate required fields
    if (!candidateId || !firstName || !lastName || !dateOfBirth || (!phone && !email) || !otpHash || !verificationMethod) {
      console.error('❌ Missing required fields:', {
        candidateId: !!candidateId,
        firstName: !!firstName,
        lastName: !!lastName,
        dateOfBirth: !!dateOfBirth,
        phone: !!phone,
        email: !!email,
        otpHash: !!otpHash,
        verificationMethod: !!verificationMethod,
      });
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          details: {
            candidateId: !!candidateId,
            firstName: !!firstName,
            lastName: !!lastName,
            dateOfBirth: !!dateOfBirth,
            phone: !!phone,
            email: !!email,
            otpHash: !!otpHash,
            verificationMethod: !!verificationMethod,
          }
        },
        { status: 400 }
      );
    }

    // Get client info
    const clientIp = getClientIp(request);
    const userAgent = getUserAgent(request);

    // Rate limiting
    const rateLimitKey = `vote:${clientIp}`;
    const { success: rateLimitOk, reset } = await submitVoteLimiter.limit(rateLimitKey);

    if (!rateLimitOk) {
      return NextResponse.json(
        { 
          error: 'Too many vote submissions. Please try again later.',
          resetAt: new Date(reset).toISOString(),
        },
        { status: 429 }
      );
    }

    // Parse and validate identifier based on verification method
    let normalizedPhone: string | null = null;
    let normalizedEmail: string | null = null;

    if (verificationMethod === 'phone') {
      const phoneResult = parseAndValidatePhone(phone!);
      if (!phoneResult.valid || !phoneResult.e164) {
        return NextResponse.json(
          { error: 'Invalid phone number format' },
          { status: 400 }
        );
      }
      normalizedPhone = phoneResult.e164;
    } else {
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email!)) {
        return NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400 }
        );
      }
      normalizedEmail = email!.toLowerCase();
    }

    // Normalize data
    const normalizedFirstName = normalizeName(firstName);
    const normalizedLastName = normalizeName(lastName);

    // Validate date of birth
    if (!validateDateOfBirth(dateOfBirth)) {
      return NextResponse.json(
        { error: 'Invalid date of birth. Voter must be at least 18 years old.' },
        { status: 400 }
      );
    }

    // Check for fraud
    const fraudCheck = await checkFraudActivity({
      ipAddress: clientIp,
      phoneE164: normalizedPhone || undefined,
      normalizedName: `${normalizedFirstName} ${normalizedLastName}`,
      dob: dateOfBirth,
    });
    if (fraudCheck.isSuspicious) {
      await logFraudActivity({
        eventType: 'vote_submission',
        severity: fraudCheck.score > 7 ? 'high' : 'medium',
        ipAddress: clientIp,
        phoneE164: normalizedPhone || undefined,
        deviceFingerprint: userAgent,
        details: { reasons: fraudCheck.reasons },
      });

      return NextResponse.json(
        { 
          error: 'Your vote cannot be processed at this time. Please contact support.',
          code: 'FRAUD_DETECTED',
        },
        { status: 403 }
      );
    }

    const admin = getAdminClient();
    const supabase = getAdminClient();

    // Verify OTP was validated for this phone or email
    let otpQuery = (admin as any)
      .from('private_otps')
      .select('*')
      .eq('otp_hash', otpHash)
      .eq('is_verified', true)
      .eq('is_used', false);

    if (verificationMethod === 'email') {
      otpQuery = otpQuery.eq('email', normalizedEmail);
    } else {
      otpQuery = otpQuery.eq('phone', normalizedPhone);
    }

    const { data: otpRecord, error: otpError } = await otpQuery.single();

    if (otpError || !otpRecord) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP. Please verify your phone number first.' },
        { status: 400 }
      );
    }

    // Check if OTP is still valid (10 minutes)
    const otpCreatedAt = new Date(otpRecord.created_at).getTime();
    const now = Date.now();
    const tenMinutesInMs = 10 * 60 * 1000;

    if (now - otpCreatedAt > tenMinutesInMs) {
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new code.' },
        { status: 400 }
      );
    }

    // Check if candidate exists and is active
    const { data: candidate, error: candidateError } = await supabase
      .from('candidates')
      .select('id, is_active')
      .eq('id', candidateId)
      .maybeSingle();

    if (candidateError || !candidate || !(candidate as any).is_active) {
      return NextResponse.json(
        { error: 'Invalid candidate' },
        { status: 400 }
      );
    }

    // Check for duplicate vote (same normalized name + DOB + phone/email)
    let duplicateQuery = (admin as any)
      .from('private_voter_records')
      .select('id')
      .eq('normalized_first_name', normalizedFirstName)
      .eq('normalized_last_name', normalizedLastName)
      .eq('date_of_birth', dateOfBirth);

    if (verificationMethod === 'email') {
      duplicateQuery = duplicateQuery.eq('normalized_email', normalizedEmail);
    } else {
      duplicateQuery = duplicateQuery.eq('normalized_phone', normalizedPhone);
    }

    const { data: existingVote, error: duplicateError } = await duplicateQuery.single();

    if (existingVote) {
      return NextResponse.json(
        { 
          error: 'You have already voted. Each person can only vote once.',
          code: 'DUPLICATE_VOTE',
        },
        { status: 409 }
      );
    }

    // Submit vote - Insert voter record and vote
    const voteId = crypto.randomUUID();
    const voterId = crypto.randomUUID();

    // Insert into private_voter_records
    const voterRecord: any = {
      id: voterId,
      normalized_first_name: normalizedFirstName,
      normalized_last_name: normalizedLastName,
      date_of_birth: dateOfBirth,
      ip_address: clientIp,
      user_agent: userAgent,
    };

    if (verificationMethod === 'email') {
      voterRecord.email = email;
      voterRecord.normalized_email = normalizedEmail;
      voterRecord.email_verified_at = new Date().toISOString();
    } else {
      voterRecord.normalized_phone = normalizedPhone;
      voterRecord.country_code = (parseAndValidatePhone(phone!)).country || null;
      voterRecord.phone_verified_at = new Date().toISOString();
    }

    const { error: voterError } = await (admin as any)
      .from('private_voter_records')
      .insert(voterRecord);

    if (voterError) {
      console.error('Error creating voter record:', voterError);
      if (voterError.code === '23505') { // Unique constraint violation
        return NextResponse.json(
          {
            error: 'You have already voted. Each person can only vote once.',
            code: 'DUPLICATE_VOTE',
          },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to submit vote. Please try again.' },
        { status: 500 }
      );
    }

    // Insert into public.votes
    const { data: voteData, error: voteError } = await supabase
      .from('votes')
      // @ts-expect-error - votes table insert type mismatch
      .insert({
        candidate_id: candidateId,
        country: body.country,
      })
      .select('id')
      .single();

    if (voteError) {
      console.error('Error submitting vote:', voteError);
      
      // Check if it's a duplicate vote error
      if (voteError.message.includes('duplicate') || voteError.message.includes('already voted')) {
        return NextResponse.json(
          { 
            error: 'You have already voted. Each person can only vote once.',
            code: 'DUPLICATE_VOTE',
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to submit vote. Please try again.' },
        { status: 500 }
      );
    }

    // Mark OTP as used
    await (admin as any)
      .from('private_otps')
      .update({ is_used: true, used_at: new Date().toISOString() })
      .eq('id', otpRecord.id);

    return NextResponse.json({
      success: true,
      message: 'Your vote has been recorded successfully!',
      voteId: voteData,
    });

  } catch (error) {
    console.error('Unexpected error in POST /api/submit:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
