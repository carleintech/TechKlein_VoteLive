/**
 * Validation schemas for vote submission
 */

import { z } from 'zod';

/**
 * Vote submission schema (Step 1)
 */
export const voteSubmissionSchema = z.object({
  firstName: z
    .string()
    .min(2, 'Prenon dwe gen omwen 2 lèt')
    .max(50, 'Prenon twò long')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Prenon ka gen sèlman lèt ak espas'),
  
  lastName: z
    .string()
    .min(2, 'Siyati dwe gen omwen 2 lèt')
    .max(50, 'Siyati twò long')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Siyati ka gen sèlman lèt ak espas'),
  
  dob: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Fòma dat pa valab (YYYY-MM-DD)')
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 18 && age <= 120;
    }, 'Ou dwe gen omwen 18 zan'),
  
  email: z
    .string()
    .email('Fòma email pa valab')
    .min(1, 'Email obligatwa'),
  
  candidateId: z
    .number()
    .int('ID kandida dwe yon nonm antye')
    .positive('Chwazi yon kandida'),
  
  country: z.string().optional().or(z.literal('')),
  
  region: z.string().optional().or(z.literal('')),
  
  mediaCode: z.string().optional().or(z.literal('')),
  
  language: z.enum(['ht', 'fr', 'en', 'es']).default('ht'),
});

/**
 * OTP verification schema (Step 2)
 */
export const otpVerificationSchema = z.object({
  code: z
    .string()
    .length(6, 'Kòd dwe gen 6 chif')
    .regex(/^\d{6}$/, 'Kòd ka gen sèlman chif'),
  
  submissionId: z.string().uuid('ID soumisyon pa valab'),
  
  candidateId: z.number().int().positive(),
  
  metadata: z.object({
    normalizedName: z.string(),
    dob: z.string(),
    phoneE164: z.string(),
    country: z.string().nullable(),
    region: z.string().nullable(),
    mediaCode: z.string().nullable(),
  }),
});

/**
 * Resend OTP schema
 */
export const resendOtpSchema = z.object({
  submissionId: z.string().uuid(),
  phoneE164: z.string(),
  language: z.enum(['ht', 'fr', 'en', 'es']).default('ht'),
});

/**
 * Type exports
 */
export type VoteSubmissionInput = z.infer<typeof voteSubmissionSchema>;
export type OtpVerificationInput = z.infer<typeof otpVerificationSchema>;
export type ResendOtpInput = z.infer<typeof resendOtpSchema>;
