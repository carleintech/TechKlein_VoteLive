/**
 * Vote Page - Main voting interface
 * Flow: Select Candidate → User Details → OTP → Submit → Success
 */

'use client';

import * as React from 'react';
import { useState } from 'react';
import { CandidateGrid } from '@/components/CandidateGrid';
import { CandidateSearch } from '@/components/CandidateSearch';
import { VotingForm } from '@/components/VotingForm';
import { OtpInput } from '@/components/OtpInput';
import { VoteSuccess } from '@/components/VoteSuccess';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, CheckCircle2, Shield, UserCheck, Vote } from 'lucide-react';
import type { VoteSubmissionInput } from '@/lib/validations/vote';
import Link from 'next/link';

type VoteStep = 'select' | 'details' | 'otp' | 'success';

interface VoteData extends VoteSubmissionInput {
  otpHash?: string;
}

export default function VotePage() {
  const [step, setStep] = useState<VoteStep>('select');
  const [selectedCandidateId, setSelectedCandidateId] = useState<number | null>(null);
  const [candidateName, setCandidateName] = useState<string>('');
  const [voteData, setVoteData] = useState<VoteData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voteReceiptId, setVoteReceiptId] = useState<string | null>(null);

  // Calculate progress
  const progressMap: Record<VoteStep, number> = {
    select: 25,
    details: 50,
    otp: 75,
    success: 100,
  };

  // Handle candidate selection
  const handleCandidateSelect = (id: number, name: string) => {
    setSelectedCandidateId(id);
    setCandidateName(name);
    setStep('details');
    setError(null);
  };

  // Handle form submission (sends OTP)
  const handleFormSubmit = async (data: VoteSubmissionInput & { verificationMethod?: 'phone' | 'email' }) => {
    setLoading(true);
    setError(null);

    try {
      const verificationMethod = 'email';
      console.log('Form submission data:', { 
        ...data, 
        email: data.email ? '***' : undefined,
        verificationMethod 
      });
      
      // Determine which endpoint to use based on verification method
      const endpoint = verificationMethod === 'email' 
        ? '/api/vote/send-email-otp' 
        : '/api/otp/send';
      
      // Send OTP
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          {
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
          }
        ),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send OTP');
      }

      const otpResponse = await response.json();
      console.log('OTP sent successfully:', otpResponse);

      // Store form data and move to OTP step
      setVoteData(data);
      setStep('otp');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification and vote submission
  const handleOtpVerify = async (code: string) => {
    if (!voteData) {
      setError('Vote data not found. Please start over.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Starting OTP verification...');
      
      // Verify OTP
      const verifyResponse = await fetch('/api/vote/verify-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: voteData.email,
          code,
        }),
      });

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json();
        throw new Error(errorData.error || 'Invalid OTP code');
      }

      const verifyResult = await verifyResponse.json();
      console.log('OTP verified successfully');

      if (!verifyResult.otpHash) {
        throw new Error('OTP verification failed - no hash returned');
      }

      const submitPayload = {
        candidateId: selectedCandidateId,
        firstName: voteData.firstName,
        lastName: voteData.lastName,
        dateOfBirth: voteData.dob,
        email: voteData.email,
        country: voteData.country,
        otpHash: verifyResult.otpHash,
        verificationMethod: 'email' as const,
      };

      console.log('Submitting vote with:', {
        ...submitPayload,
        email: '***',
        otpHash: '***',
      });

      // Submit vote
      const submitResponse = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitPayload),
      });

      if (!submitResponse.ok) {
        const errorData = await submitResponse.json();
        console.error('Vote submission failed:', errorData);
        throw new Error(errorData.error || 'Failed to submit vote');
      }

      const result = await submitResponse.json();
      console.log('Vote submitted successfully:', result);
      
      setVoteReceiptId(result.voteId || result.receiptId);
      setStep('success');
    } catch (err) {
      console.error('Error in handleOtpVerify:', err);
      setError(err instanceof Error ? err.message : 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  // Reset to start new vote
  const handleReset = () => {
    setStep('select');
    setSelectedCandidateId(null);
    setCandidateName('');
    setVoteData(null);
    setSearchQuery('');
    setError(null);
    setVoteReceiptId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b-2 border-gray-200 bg-white/90 backdrop-blur-xl shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-[#006CFF] to-[#7F00FF] bg-clip-text text-transparent">
              HaitiVote
            </span>
          </Link>
          <div className="flex items-center gap-4">
            {step !== 'select' && step !== 'success' && (
              <Button variant="outline" onClick={handleReset} className="gap-2 border-2 hover:border-blue-500 hover:bg-blue-50 transition-all">
                <ArrowLeft size={18} />
                <span className="font-semibold">Rekòmanse</span>
              </Button>
            )}
            <Link
              href="/live"
              className="text-base font-semibold text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-lg hover:bg-blue-50"
            >
              Rezilta LIVE
            </Link>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="border-b-2 border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="mx-auto max-w-6xl px-4 py-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {step === 'select' && '1. Chwazi Kandida'}
              {step === 'details' && '2. Enfòmasyon'}
              {step === 'otp' && '3. Verifikasyon'}
              {step === 'success' && '✓ Konplete!'}
            </span>
            <span className="text-base font-bold text-gray-700">{progressMap[step]}%</span>
          </div>
          <Progress value={progressMap[step]} className="h-3 shadow-sm" />
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Step 1: Select Candidate */}
        {step === 'select' && (
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Chwazi kandida ou
              </h1>
              <p className="text-lg text-gray-700 font-medium max-w-2xl mx-auto">
                Klike sou yon kandida pou wè pwofi li epi vote pou li
              </p>
            </div>

            {/* Search */}
            <div className="mx-auto max-w-md">
              <CandidateSearch
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Chèche pa non..."
              />
            </div>

            {/* Candidate Grid */}
            <CandidateGrid
              selectedCandidateId={selectedCandidateId}
              onSelectCandidate={(id) => {
                // Get candidate name from grid (simplified - in real app would use candidate data)
                setSelectedCandidateId(id);
              }}
              searchQuery={searchQuery}
            />

            {/* Selection Info */}
            {selectedCandidateId && (
              <Card className="mx-auto max-w-md border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-xl">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full">
                        <CheckCircle2 className="text-white" size={28} />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">Kandida chwazi</p>
                        <p className="text-base font-semibold text-gray-700">{candidateName}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleCandidateSelect(selectedCandidateId, candidateName)}
                      className="bg-gradient-to-r from-[#006CFF] to-[#7F00FF] hover:shadow-lg transition-all h-12 px-6 text-base font-bold"
                    >
                      Kontinye
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Step 2: User Details Form */}
        {step === 'details' && selectedCandidateId && (
          <div className="mx-auto max-w-2xl space-y-8">
            <div className="text-center space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Enfòmasyon ou
              </h1>
              <p className="text-lg text-gray-700 font-medium">
                Ranpli enfòmasyon ou pou verifye vòt ou
              </p>
            </div>

            {/* Selected Candidate Info */}
            <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full">
                    <Vote size={22} className="text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Vòt pou: {candidateName}
                  </span>
                </CardTitle>
              </CardHeader>
            </Card>

            {/* Voting Form */}
            <VotingForm
              candidateId={selectedCandidateId}
              candidateName={candidateName}
              onSubmit={handleFormSubmit}
              loading={loading}
            />
          </div>
        )}

        {/* Step 3: OTP Verification */}
        {step === 'otp' && voteData && (
          <div className="mx-auto max-w-md space-y-8">
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#006CFF] to-[#7F00FF] shadow-xl">
                <Shield className="text-white" size={40} />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Verifikasyon Kòd
              </h1>
              <p className="text-lg text-gray-700 font-medium">
                {(voteData as any).verificationMethod === 'email' 
                  ? `Nou voye yon kòd 6 chif sou email ${voteData.email}`
                  : `Nou voye yon kòd 6 chif nan email ${voteData.email}`}
              </p>
            </div>

            <OtpInput
              phoneNumber={voteData.email || ''}
              expiresAt={new Date(Date.now() + 10 * 60 * 1000).toISOString()}
              onVerify={handleOtpVerify}
              onResend={async () => {
                alert('OTP resent!');
              }}
              loading={loading}
            />

            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => setStep('details')}
                disabled={loading}
                className="border-2 hover:border-blue-500 hover:bg-blue-50 font-semibold transition-all"
              >
                Chanje email
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 'success' && voteReceiptId && (
          <div className="mx-auto max-w-2xl">
            <VoteSuccess
              voteId={voteReceiptId}
              candidateName={candidateName}
              country={voteData?.country || null}
            />
          </div>
        )}
      </main>
    </div>
  );
}
