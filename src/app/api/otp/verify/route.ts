/**
 * POST /api/otp/verify
 * Verify OTP code
 */

import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { parseAndValidatePhone } from '@/lib/phone';
import { hashOtpCode } from '@/lib/otp';
import { getClientIp } from '@/lib/utils';
import { otpVerifyLimiter } from '@/lib/rate-limit';

interface VerifyOtpRequest {
  phone: string;
  code: string;
}

export async function POST(request: Request) {
  try {
    const body: VerifyOtpRequest = await request.json();
    const { phone, code } = body;

    // Validate required fields
    if (!phone || !code) {
      return NextResponse.json(
        { error: 'Phone number and code are required' },
        { status: 400 }
      );
    }

    // Get client info
    const clientIp = getClientIp(request);

    // Rate limiting per phone number
    const rateLimitKey = `otp:verify:${phone}`;
    const { success: rateLimitOk, reset } = await otpVerifyLimiter.limit(rateLimitKey);

    if (!rateLimitOk) {
      return NextResponse.json(
        { 
          error: 'Too many verification attempts. Please try again later.',
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

    const normalizedPhone = phoneResult.e164;

    // Hash the provided code
    const otpHash = hashOtpCode(code);

    console.log('🔍 Verifying OTP:', {
      phone: normalizedPhone,
      codeLength: code.length,
      hashGenerated: !!otpHash,
    });

    // Find matching OTP
    const admin = getAdminClient();
    const { data: otpRecord, error: otpError } = await (admin as any)
      .from('private_otps')
      .select('*')
      .eq('phone', normalizedPhone)
      .eq('otp_hash', otpHash)
      .eq('is_verified', false)
      .eq('is_used', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    console.log('🔍 OTP lookup result:', {
      found: !!otpRecord,
      error: otpError?.message,
      phone: normalizedPhone,
    });

    if (otpError || !otpRecord) {
      // Log failed attempt
      await (admin as any)
        .from('private_otps')
        .update({ 
          attempts: (admin as any).rpc('increment_attempts'),
        })
        .eq('phone', normalizedPhone)
        .eq('is_verified', false);

      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      );
    }

    // Check if OTP has expired
    const expiresAt = new Date(otpRecord.expires_at).getTime();
    const now = Date.now();

    if (now > expiresAt) {
      return NextResponse.json(
        { error: 'Verification code has expired. Please request a new code.' },
        { status: 400 }
      );
    }

    // Check if too many attempts (max 5)
    if (otpRecord.attempts >= 5) {
      return NextResponse.json(
        { error: 'Too many failed attempts. Please request a new code.' },
        { status: 400 }
      );
    }

    // Mark OTP as verified
    const { error: updateError } = await (admin as any)
      .from('private_otps')
      .update({ 
        is_verified: true,
        verified_at: new Date().toISOString(),
        verified_ip: clientIp,
      })
      .eq('id', otpRecord.id);

    if (updateError) {
      console.error('Error updating OTP:', updateError);
      return NextResponse.json(
        { error: 'Failed to verify code. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Phone number verified successfully',
      otpHash, // Return hash for use in vote submission
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 min to submit vote
    });

  } catch (error) {
    console.error('Unexpected error in POST /api/otp/verify:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
