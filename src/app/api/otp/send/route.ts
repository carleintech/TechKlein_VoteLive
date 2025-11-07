/**
 * POST /api/otp/send
 * Send OTP code via SMS
 */

import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { parseAndValidatePhone } from '@/lib/phone';
import { generateOtpCode, hashOtpCode, generateOtpMessage } from '@/lib/otp';
import { sendOtpSms } from '@/lib/twilio';
import { getClientIp, getUserAgent } from '@/lib/utils';
import { otpSendLimiter } from '@/lib/rate-limit';

interface SendOtpRequest {
  phone: string;
  language?: 'ht' | 'fr' | 'en' | 'es';
}

export async function POST(request: Request) {
  try {
    const body: SendOtpRequest = await request.json();
    const { phone, language = 'ht' } = body;

    // Validate required fields
    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Get client info
    const clientIp = getClientIp(request);
    const userAgent = getUserAgent(request);

    // Rate limiting per phone number
    const rateLimitKey = `otp:send:${phone}`;
    const { success: rateLimitOk, reset } = await otpSendLimiter.limit(rateLimitKey);

    if (!rateLimitOk) {
      return NextResponse.json(
        { 
          error: 'Too many OTP requests. Please try again later.',
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

    // Generate OTP code
    const otpCode = generateOtpCode();
    const otpHash = hashOtpCode(otpCode);

    console.log('📤 Sending OTP:', {
      phone: normalizedPhone,
      otpCode: process.env.NODE_ENV === 'development' ? otpCode : '***',
      hashGenerated: !!otpHash,
    });

    // Store OTP in database
    const admin = getAdminClient();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const { error: insertError } = await (admin as any)
      .from('private_otps')
      .insert({
        phone: normalizedPhone,
        otp_hash: otpHash,
        expires_at: expiresAt.toISOString(),
        ip: clientIp,
        user_agent: userAgent,
      });

    if (insertError) {
      console.error('❌ Error storing OTP:', insertError);
      return NextResponse.json(
        { error: 'Failed to generate OTP. Please try again.' },
        { status: 500 }
      );
    }

    console.log('✅ OTP stored successfully in database');

    // Generate message in requested language
    const message = generateOtpMessage(otpCode, language);

    // Send SMS
    try {
      await sendOtpSms(normalizedPhone, otpCode, language);
    } catch (smsError) {
      console.error('Error sending SMS:', smsError);
      return NextResponse.json(
        { error: 'Failed to send OTP. Please check your phone number and try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      expiresAt: expiresAt.toISOString(),
      // For development only - remove in production
      ...(process.env.NODE_ENV === 'development' && { otpCode }),
    });

  } catch (error) {
    console.error('Unexpected error in POST /api/otp/send:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
