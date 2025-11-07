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
  phone: string;
  otpHash: string;
}

export async function POST(request: Request) {
  try {
    const body: SubmitVoteRequest = await request.json();
    const { candidateId, firstName, lastName, dateOfBirth, phone, otpHash } = body;

    // Log received data for debugging
    console.log('✅ Vote submission received:', {
      candidateId,
      firstName,
      lastName,
      dateOfBirth,
      phone: phone ? `***${phone.slice(-4)}` : undefined,
      otpHash: otpHash ? '***' : undefined,
    });

    // Validate required fields
    if (!candidateId || !firstName || !lastName || !dateOfBirth || !phone || !otpHash) {
      console.error('❌ Missing required fields:', {
        candidateId: !!candidateId,
        firstName: !!firstName,
        lastName: !!lastName,
        dateOfBirth: !!dateOfBirth,
        phone: !!phone,
        otpHash: !!otpHash,
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
            otpHash: !!otpHash,
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

    // Parse and validate phone number
    const phoneResult = parseAndValidatePhone(phone);
    if (!phoneResult.valid || !phoneResult.e164) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Normalize data
    const normalizedFirstName = normalizeName(firstName);
    const normalizedLastName = normalizeName(lastName);
    const normalizedPhone = phoneResult.e164;

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
      phoneE164: normalizedPhone,
      normalizedName: `${normalizedFirstName} ${normalizedLastName}`,
      dob: dateOfBirth,
    });
    if (fraudCheck.isSuspicious) {
      await logFraudActivity({
        eventType: 'vote_submission',
        severity: fraudCheck.score > 7 ? 'high' : 'medium',
        ipAddress: clientIp,
        phoneE164: normalizedPhone,
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
    const supabase = await createClient();

    // Verify OTP was validated for this phone
    // @ts-ignore - private schema access
    const { data: otpRecord, error: otpError } = await admin
      .schema('private')
      .from('otps')
      .select('*')
      .eq('phone', normalizedPhone)
      .eq('otp_hash', otpHash)
      .eq('is_verified', true)
      .eq('is_used', false)
      .single();

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

    // Check for duplicate vote (same normalized name + DOB + phone)
    // @ts-ignore - private schema access
    const { data: existingVote, error: duplicateError } = await admin
      .schema('private')
      .from('voter_records')
      .select('id')
      .eq('normalized_first_name', normalizedFirstName)
      .eq('normalized_last_name', normalizedLastName)
      .eq('date_of_birth', dateOfBirth)
      .eq('normalized_phone', normalizedPhone)
      .single();

    if (existingVote) {
      return NextResponse.json(
        { 
          error: 'You have already voted. Each person can only vote once.',
          code: 'DUPLICATE_VOTE',
        },
        { status: 409 }
      );
    }

    // Submit vote (atomic transaction)
    // @ts-ignore - RPC function parameters
    const { data: voteData, error: voteError } = await admin.rpc('submit_vote_transaction', {
      p_candidate_id: candidateId,
      p_first_name: firstName,
      p_last_name: lastName,
      p_normalized_first_name: normalizedFirstName,
      p_normalized_last_name: normalizedLastName,
      p_date_of_birth: dateOfBirth,
      p_phone: phone,
      p_normalized_phone: normalizedPhone,
      p_country_code: phoneResult.country || null,
      p_ip: clientIp,
      p_user_agent: userAgent,
      p_otp_id: otpRecord.id,
    });

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
    // @ts-ignore - private schema access
    await admin
      .schema('private')
      .from('otps')
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
