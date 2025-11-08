/**
 * API Route: Send Email OTP
 * Alternative to SMS OTP for email verification
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { Resend } from 'resend';
import crypto from 'crypto';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Send email OTP via Resend
async function sendEmailOTP(email: string, code: string) {
  // For development without API key, log the code
  if (!process.env.RESEND_API_KEY) {
    console.log(`📧 [DEV MODE] Email OTP for ${email}: ${code}`);
    return true;
  }
  
  // Production: Send via Resend
  const { data, error } = await resend.emails.send({
    from: 'VoteLive <onboarding@resend.dev>',
    to: email,
    subject: 'Kòd Verifikasyon VoteLive - Your Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #006CFF; margin: 0;">🇭🇹 HaitiVote</h1>
          <p style="color: #666; margin: 5px 0;">Sondaj Ayiti Global</p>
        </div>
        
        <h2 style="color: #333; margin-bottom: 20px;">Kòd Verifikasyon / Verification Code</h2>
        
        <p style="font-size: 16px; color: #555;">Antre kòd sa pou verifye vòt ou:</p>
        <p style="font-size: 16px; color: #555;">Enter this code to verify your vote:</p>
        
        <div style="background: linear-gradient(135deg, #006CFF 0%, #7F00FF 100%); padding: 30px; text-align: center; border-radius: 10px; margin: 30px 0;">
          <h1 style="color: white; font-size: 48px; letter-spacing: 12px; margin: 0; font-weight: bold;">${code}</h1>
        </div>
        
        <p style="color: #d9534f; font-weight: bold;">⏱️ Kòd sa ap ekspire nan 10 minit.</p>
        <p style="color: #d9534f;">This code will expire in 10 minutes.</p>
        
        <div style="background: #f8f9fa; padding: 15px; border-left: 4px solid #006CFF; margin: 20px 0;">
          <p style="margin: 0; color: #555;"><strong>🔒 Sekirite:</strong> Pa pataje kòd sa ak pèsonn.</p>
          <p style="margin: 5px 0 0 0; color: #555;"><strong>Security:</strong> Never share this code with anyone.</p>
        </div>
        
        <p style="color: #999; font-size: 14px;">Si ou pa mande kòd sa, ignore email sa.</p>
        <p style="color: #999; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="color: #999; font-size: 12px; text-align: center;">
          © 2025 TechKlein VoteLive - Powered by Haitian Innovation<br>
          <a href="https://www.haitivote.org" style="color: #006CFF;">www.haitivote.org</a>
        </p>
      </div>
    `
  });
  
  if (error) {
    console.error('Resend email error:', error);
    throw new Error('Failed to send email');
  }
  
  console.log(`📧 Email sent successfully to ${email}`, data);
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, candidateId, voterData } = body;

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const supabase = getAdminClient();

    // Check if email already used with verified vote
    const { data: existingVoter } = await (supabase as any)
      .from('private_voter_records')
      .select('id, email_verified_at')
      .eq('email', email.toLowerCase())
      .not('email_verified_at', 'is', null)
      .maybeSingle();

    if (existingVoter) {
      return NextResponse.json(
        { error: 'This email has already been used to vote' },
        { status: 409 }
      );
    }

    // Generate 6-digit OTP
    const code = crypto.randomInt(100000, 999999).toString();
    const codeHash = crypto.createHash('sha256').update(code).digest('hex');
    const submissionId = crypto.randomUUID();

    // Store OTP with email method
    const { error: otpError } = await (supabase as any)
      .from('private_otps')
      .insert({
        email: email.toLowerCase(),
        otp_hash: codeHash,
        verification_method: 'email',
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
      });

    if (otpError) {
      console.error('OTP storage error:', otpError);
      return NextResponse.json(
        { error: 'Failed to generate verification code' },
        { status: 500 }
      );
    }

    // Send email
    try {
      await sendEmailOTP(email, code);
    } catch (emailError) {
      console.error('Email send error:', emailError);
      return NextResponse.json(
        { error: 'Failed to send verification email' },
        { status: 500 }
      );
    }

    // Return submission ID for verification
    return NextResponse.json({
      success: true,
      submissionId,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      method: 'email',
    });

  } catch (error) {
    console.error('Email OTP error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
