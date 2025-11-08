/**
 * POST /api/submit
 * Submit a vote for a candidate
 */

import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { normalizeName, validateDateOfBirth } from '@/lib/normalize';
import { getClientIp, getUserAgent } from '@/lib/utils';
import { checkFraudActivity, logFraudActivity } from '@/lib/fraud-detection';
import { submitVoteLimiter } from '@/lib/rate-limit';

interface SubmitVoteRequest {
  candidateId: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  country?: string;
}

export async function POST(request: Request) {
  try {
    const body: SubmitVoteRequest = await request.json();
    const { candidateId, firstName, lastName, dateOfBirth, country } = body;

    // Log received data for debugging
    console.log('✅ Vote submission received:', {
      candidateId,
      firstName,
      lastName,
      dateOfBirth,
      country,
    });

    // Validate required fields
    if (!candidateId || !firstName || !lastName || !dateOfBirth) {
      console.error('❌ Missing required fields:', {
        candidateId: !!candidateId,
        firstName: !!firstName,
        lastName: !!lastName,
        dateOfBirth: !!dateOfBirth,
      });
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          details: {
            candidateId: !!candidateId,
            firstName: !!firstName,
            lastName: !!lastName,
            dateOfBirth: !!dateOfBirth,
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

    // Check for fraud (but don't block, just log for now)
    try {
      const fraudCheck = await checkFraudActivity({
        ipAddress: clientIp,
        normalizedName: `${normalizedFirstName} ${normalizedLastName}`,
        dob: dateOfBirth,
      });
      if (fraudCheck.isSuspicious) {
        console.log('⚠️ Suspicious activity detected (not blocking):', fraudCheck.reasons);
        await logFraudActivity({
          eventType: 'vote_submission',
          severity: fraudCheck.score > 7 ? 'high' : 'medium',
          ipAddress: clientIp,
          deviceFingerprint: userAgent,
          details: { reasons: fraudCheck.reasons },
        });
        // Don't block for now - just log
      }
    } catch (fraudError) {
      console.error('Error in fraud check (continuing anyway):', fraudError);
    }

    const admin = getAdminClient();
    const supabase = getAdminClient();

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

    // Check for duplicate vote (same normalized name + DOB)
    const { data: existingVote } = await (admin as any)
      .from('private_voter_records')
      .select('id')
      .eq('normalized_first_name', normalizedFirstName)
      .eq('normalized_last_name', normalizedLastName)
      .eq('date_of_birth', dateOfBirth)
      .maybeSingle();

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
    const voterId = crypto.randomUUID();

    // Insert into private_voter_records
    // Note: normalized_phone is required by schema but we no longer collect it
    // Using a placeholder value based on name+dob hash to maintain uniqueness
    const phoneePlaceholder = `placeholder_${Buffer.from(`${normalizedFirstName}${normalizedLastName}${dateOfBirth}`).toString('base64').substring(0, 15)}`;
    
    const { error: voterError } = await (admin as any)
      .from('private_voter_records')
      .insert({
        id: voterId,
        normalized_first_name: normalizedFirstName,
        normalized_last_name: normalizedLastName,
        date_of_birth: dateOfBirth,
        normalized_phone: phoneePlaceholder,
        country_code: country || null,
        ip_address: clientIp,
        user_agent: userAgent,
      });

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
    const { data: voteResult, error: voteError } = await supabase
      .from('votes')
      // @ts-expect-error - votes table insert type mismatch
      .insert({
        candidate_id: candidateId,
        country: country || null,
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

    return NextResponse.json({
      success: true,
      message: 'Your vote has been recorded successfully!',
      voteId: (voteResult as any)?.id,
    });

  } catch (error) {
    console.error('❌ Unexpected error in POST /api/submit:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
