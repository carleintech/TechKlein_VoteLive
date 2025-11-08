/**
 * Hook for managing the complete voting flow
 */

'use client';

import { useState, useCallback } from 'react';
import { useToast } from './use-toast';
import type {
  VoteSubmissionInput,
  OtpVerificationInput,
} from '@/lib/validations/vote';

type VoteFlowStep = 'candidate' | 'details' | 'otp' | 'success';

interface VoteFlowState {
  step: VoteFlowStep;
  candidateId: number | null;
  submissionId: string | null;
  metadata: {
    normalizedName: string;
    dob: string;
    phoneE164?: string;
    email?: string;
    verificationMethod: 'phone' | 'email';
    country: string | null;
    region: string | null;
    mediaCode: string | null;
  } | null;
  expiresAt: string | null;
  voteId: string | null;
}

interface UseVoteFlowResult {
  state: VoteFlowState;
  loading: boolean;
  error: string | null;
  submitVote: (data: VoteSubmissionInput) => Promise<void>;
  verifyOtp: (code: string) => Promise<void>;
  resendOtp: () => Promise<void>;
  reset: () => void;
  setCandidate: (candidateId: number) => void;
  goToStep: (step: VoteFlowStep) => void;
}

const initialState: VoteFlowState = {
  step: 'candidate',
  candidateId: null,
  submissionId: null,
  metadata: null,
  expiresAt: null,
  voteId: null,
};

export function useVoteFlow(): UseVoteFlowResult {
  const [state, setState] = useState<VoteFlowState>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const setCandidate = useCallback((candidateId: number) => {
    setState((prev) => ({
      ...prev,
      candidateId,
      step: 'details',
    }));
  }, []);

  const goToStep = useCallback((step: VoteFlowStep) => {
    setState((prev) => ({ ...prev, step }));
  }, []);

  const submitVote = useCallback(
    async (data: VoteSubmissionInput & { verificationMethod?: 'email' }) => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔵 Submitting vote - Step 1: Send OTP');
        console.log('Form data:', { 
          ...data, 
          email: '***',
        });

        // Step 1: Send OTP via email
        const otpResponse = await fetch('/api/vote/send-email-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: data.email,
            candidateId: data.candidateId,
            voterData: {
              firstName: data.firstName,
              lastName: data.lastName,
              dob: data.dob,
              country: data.country || null,
              region: data.region || null,
              mediaCode: data.mediaCode || null,
            },
          }),
        });

        const otpResult = await otpResponse.json();

        if (!otpResponse.ok) {
          throw new Error(otpResult.error || 'Failed to send OTP');
        }

        console.log('✅ OTP sent successfully');

        // Store metadata for OTP verification
        setState((prev) => ({
          ...prev,
          step: 'otp',
          candidateId: data.candidateId,
          metadata: {
            normalizedName: `${data.firstName} ${data.lastName}`,
            dob: data.dob,
            email: data.email,
            country: data.country || null,
            region: data.region || null,
            mediaCode: data.mediaCode || null,
            firstName: data.firstName,
            lastName: data.lastName,
            verificationMethod: 'email',
          } as any,
          expiresAt: otpResult.expiresAt,
        }));

        toast({
          title: 'Kòd voye!',
          description: 'Nou voye yon kòd verifikasyon sou email ou.',
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Submission failed';
        setError(errorMessage);
        
        toast({
          variant: 'destructive',
          title: 'Erè',
          description: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  const verifyOtp = useCallback(
    async (code: string) => {
      if (!state.candidateId || !state.metadata) {
        toast({
          variant: 'destructive',
          title: 'Erè',
          description: 'Done soumisyon manke',
        });
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log('🔵 Verifying OTP - Step 2');

        // Step 2: Verify OTP and get hash
        const verifyPayload: any = { code };
        if (state.metadata.verificationMethod === 'email') {
          verifyPayload.email = state.metadata.email;
        } else {
          verifyPayload.phone = state.metadata.phoneE164;
        }

        const verifyResponse = await fetch('/api/otp/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(verifyPayload),
        });

        const verifyResult = await verifyResponse.json();

        if (!verifyResponse.ok) {
          throw new Error(verifyResult.error || 'Invalid OTP code');
        }

        console.log('✅ OTP verified successfully');

        if (!verifyResult.otpHash) {
          throw new Error('OTP verification failed - no hash returned');
        }

        // Step 3: Submit vote with OTP hash
        console.log('🔵 Submitting vote - Step 3');

        const metadata = state.metadata as any;
        const submitPayload: any = {
          candidateId: state.candidateId,
          firstName: metadata.firstName,
          lastName: metadata.lastName,
          dateOfBirth: metadata.dob,
          otpHash: verifyResult.otpHash,
          verificationMethod: metadata.verificationMethod,
        };

        // Add phone or email based on verification method
        if (metadata.verificationMethod === 'email') {
          submitPayload.email = metadata.email;
        } else {
          submitPayload.phone = metadata.phoneE164;
        }

        console.log('Submit payload:', {
          ...submitPayload,
          phone: submitPayload.phone ? '***' : undefined,
          email: submitPayload.email ? '***' : undefined,
          otpHash: '***',
        });

        const submitResponse = await fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submitPayload),
        });

        const submitResult = await submitResponse.json();

        if (!submitResponse.ok) {
          throw new Error(submitResult.error || 'Failed to submit vote');
        }

        console.log('✅ Vote submitted successfully');

        // Success!
        setState((prev) => ({
          ...prev,
          step: 'success',
          voteId: submitResult.voteId,
        }));

        toast({
          title: 'Siksè!',
          description: 'Vòt ou konte. Mèsi!',
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Verification failed';
        setError(errorMessage);
        console.error('❌ Error:', errorMessage);
        
        toast({
          variant: 'destructive',
          title: 'Erè',
          description: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    },
    [state.candidateId, state.metadata, toast]
  );

  const resendOtp = useCallback(async () => {
    if (!state.submissionId || !state.metadata) {
      toast({
        variant: 'destructive',
        title: 'Erè',
        description: 'Done soumisyon manke',
      });
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/otp/resend-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: state.submissionId,
          email: state.metadata.email,
          language: 'ht',
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to resend OTP');
      }

      toast({
        title: 'Kòd revoye!',
        description: isEmail 
          ? 'Yon nouvo kòd voye sou email ou.'
          : 'Yon nouvo kòd voye sou telefòn ou.',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Resend failed';
      setError(errorMessage);
      
      toast({
        variant: 'destructive',
        title: 'Erè',
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }, [state.submissionId, state.metadata, toast]);

  const reset = useCallback(() => {
    setState(initialState);
    setError(null);
  }, []);

  return {
    state,
    loading,
    error,
    submitVote,
    verifyOtp,
    resendOtp,
    reset,
    setCandidate,
    goToStep,
  };
}
