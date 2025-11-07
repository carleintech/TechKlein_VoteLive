/**
 * Main Landing Page - TechKlein VoteLive
 * Integrated voting flow with candidate selection
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { useVoteFlow } from '@/hooks/use-vote-flow';
import { useCandidates } from '@/hooks/use-candidates';
import { useVoteStats } from '@/hooks/use-vote-stats';
import { CandidateGrid } from '@/components/CandidateGrid';
import { CandidateSearch } from '@/components/CandidateSearch';
import { VotingForm } from '@/components/VotingForm';
import { OtpInput } from '@/components/OtpInput';
import { VoteSuccess } from '@/components/VoteSuccess';
import { VoteCard } from '@/components/VoteCard';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  BarChart3,
  TrendingUp,
  Users,
  Globe,
  Shield,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Info,
} from 'lucide-react';
import { formatNumber } from '@/lib/utils';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const { candidates } = useCandidates();
  const { totalVotes, isLive } = useVoteStats(true);
  const {
    state,
    loading,
    submitVote,
    verifyOtp,
    resendOtp,
    setCandidate,
    goToStep,
  } = useVoteFlow();

  // Get selected candidate details
  const selectedCandidate = React.useMemo(() => {
    if (!state.candidateId) return null;
    return candidates.find((c) => c.id === state.candidateId);
  }, [state.candidateId, candidates]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation Header */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center">
                <img src="/haitivote-logo.svg" alt="HaitiVote" className="h-10" />
              </Link>
              <div className="hidden md:flex items-center gap-4">
                <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-[#006CFF] transition-colors">
                  Sou Nou
                </Link>
                <Link href="/live" className="text-sm font-medium text-gray-700 hover:text-[#006CFF] transition-colors">
                  Rezilta Live
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              {state.candidateId && state.step === 'candidate' && (
                <Button
                  size="lg"
                  className="hidden md:flex bg-gradient-to-r from-[#006CFF] to-[#7F00FF] hover:opacity-90 text-white"
                  onClick={() => goToStep('details')}
                >
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Kontinye
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="relative overflow-hidden bg-gradient-to-r from-[#006CFF] to-[#7F00FF] text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        
        <div className="relative container mx-auto px-4 py-12 md:py-20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Branding & Title */}
            <div className="text-center lg:text-left space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                <Sparkles className="h-4 w-4 animate-pulse" />
                <span className="text-sm font-semibold">Sondaj Ofisyèl 2025-2026</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                HaitiVote
              </h1>
              
              <p className="text-2xl md:text-3xl font-semibold text-blue-100">
                "Yon Pèp. Yon Vwa. Yon Sondaj."
              </p>
              
              <p className="text-lg md:text-xl text-blue-50 leading-relaxed">
                Patisipe nan pi gwo sondaj dijital pou eleksyon prezidansyèl Ayiti. 
                Kèlkeswa kote w ye nan mond lan, vwa w konte!
              </p>

              <div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-4">
                <Link href="/about">
                  <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm">
                    <Info className="h-5 w-5 mr-2" />
                    Aprann Plis
                  </Button>
                </Link>
              </div>
            </div>

            {/* Stats Card */}
            <div className="flex flex-col items-center gap-4">
              <Card className="w-full lg:w-auto border-2 border-white/30 bg-white/10 backdrop-blur-md shadow-2xl">
                <CardContent className="p-8 text-center space-y-3">
                  {isLive && (
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                      <span className="text-sm font-bold text-red-200">LIVE</span>
                    </div>
                  )}
                  <p className="text-sm text-blue-100 font-medium uppercase tracking-wide">
                    Total Vòt Konte
                  </p>
                  <p className="text-6xl md:text-7xl font-bold text-white">
                    {formatNumber(totalVotes)}
                  </p>
                  <div className="flex items-center justify-center gap-2 text-green-300 text-sm">
                    <TrendingUp className="h-4 w-4" />
                    <span className="font-semibold">Ap ogmante chak minit</span>
                  </div>
                  <Link href="/live" className="block pt-2">
                    <Button variant="outline" size="lg" className="w-full gap-2 bg-white text-[#006CFF] hover:bg-blue-50 border-white">
                      <BarChart3 className="h-5 w-5" />
                      Wè Rezilta Konplè
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Step 1: Candidate Selection */}
        {state.step === 'candidate' && (
          <div className="space-y-8 animate-fade-in">
            {/* Instructions */}
            <Card className="border-2 border-[#006CFF]/30 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#006CFF] to-[#7F00FF] flex items-center justify-center flex-shrink-0">
                    <Info className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Etap 1 sou 3: Chwazi Kandida Ou</h3>
                    <p className="text-gray-700">
                      Chwazi kandida ou pami <strong>{candidates.length} kandida ofisyèl</strong>. 
                      Apre sa, w ap ranpli enfòmasyon w epi konfime vòt ou ak yon kòd SMS.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Search bar */}
            <div className="max-w-2xl mx-auto">
              <CandidateSearch
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Rechèch pa non kandida..."
              />
            </div>

            {/* Candidate Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Users className="h-6 w-6 text-primary" />
                  Kandida Yo ({candidates.length})
                </h2>
                
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchQuery('')}
                  >
                    Efase rechèch
                  </Button>
                )}
              </div>

              <CandidateGrid
                selectedCandidateId={state.candidateId}
                onSelectCandidate={setCandidate}
                searchQuery={searchQuery}
              />
            </div>

            {/* Features showcase */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
              <Card className="border-2 border-transparent hover:border-[#006CFF]/50 transition-all hover:shadow-xl hover:-translate-y-1">
                <CardContent className="p-8 text-center space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900">100% Sekirite</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Yon vòt pa telefòn. Sistèm anti-doub avanse. Verifikasyon SMS obligatwa.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-transparent hover:border-[#7F00FF]/50 transition-all hover:shadow-xl hover:-translate-y-1">
                <CardContent className="p-8 text-center space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#006CFF] to-blue-600 flex items-center justify-center shadow-lg">
                    <Globe className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900">Mondyal</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Vote soti nenpòt kote nan mond lan. Dyaspora akeyi! Tout vwa konte menm jan.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-transparent hover:border-[#006CFF]/50 transition-all hover:shadow-xl hover:-translate-y-1">
                <CardContent className="p-8 text-center space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#7F00FF] to-purple-600 flex items-center justify-center shadow-lg">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900">Tan Reyèl</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Rezilta mizajou chak minit. Transparans total. Data vizib pou tout moun.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Step 2: Details Form */}
        {state.step === 'details' && selectedCandidate && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            {/* Progress */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-medium">Kandida</span>
              </div>
              <div className="w-12 h-0.5 bg-primary" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <span className="text-sm font-medium">Enfòmasyon</span>
              </div>
              <div className="w-12 h-0.5 bg-border" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <span className="text-sm text-muted-foreground">Verifikasyon</span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => goToStep('candidate')}
              className="mb-4"
            >
              ← Retounen
            </Button>

            <VotingForm
              candidateId={state.candidateId!}
              candidateName={selectedCandidate.name}
              onSubmit={submitVote}
              loading={loading}
            />
          </div>
        )}

        {/* Step 3: OTP Verification */}
        {state.step === 'otp' && state.metadata && (
          <div className="max-w-md mx-auto space-y-6 animate-fade-in">
            {/* Progress */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-medium">Kandida</span>
              </div>
              <div className="w-12 h-0.5 bg-green-500" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-medium">Enfòmasyon</span>
              </div>
              <div className="w-12 h-0.5 bg-primary" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <span className="text-sm font-medium">Verifikasyon</span>
              </div>
            </div>

            <div className="text-center mb-6">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#006CFF] to-[#7F00FF]">
                <Shield className="text-white" size={32} />
              </div>
              <h2 className="text-2xl font-bold">Verifikasyon Kòd</h2>
              <p className="mt-2 text-muted-foreground">
                Nou voye yon kòd 6 chif nan {state.metadata.phoneE164}
              </p>
            </div>

            <OtpInput
              phoneNumber={state.metadata.phoneE164 || ''}
              expiresAt={new Date(Date.now() + 10 * 60 * 1000).toISOString()}
              onVerify={verifyOtp}
              onResend={async () => {
                // Resend OTP logic here
                alert('OTP resent!');
              }}
              loading={loading}
            />

            <div className="text-center">
              <Button
                variant="link"
                onClick={() => goToStep('details')}
                disabled={loading}
              >
                Chanje nimewo telefòn
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {state.step === 'success' && state.voteId && selectedCandidate && (
          <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
            {/* Confetti effect */}
            <div className="text-center space-y-4">
              <div className="text-6xl animate-bounce">🎉</div>
              <h2 className="text-3xl font-bold">Felisitasyon!</h2>
            </div>

            <VoteSuccess
              candidateName={selectedCandidate.name}
              voteId={state.voteId}
              country={state.metadata?.country || null}
            />

            <Separator />

            <VoteCard
              voteId={state.voteId}
              candidateName={selectedCandidate.name}
              candidatePhoto={selectedCandidate.photo_url}
              country={state.metadata?.country || 'Unknown'}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* About */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="text-2xl">🇭🇹</div>
                <h3 className="font-bold text-xl bg-gradient-to-r from-[#006CFF] to-[#7F00FF] bg-clip-text text-transparent">HaitiVote</h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Platfòm sondaj transparan pou eleksyon Ayiti 2025-2026. 
                Bati ak teknoloji modèn pou sekirite ak presizyon maksimòm.
              </p>
              <p className="text-sm text-gray-500 italic">"Yon Pèp. Yon Vwa. Yon Sondaj."</p>
            </div>

            {/* Links */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Lyen Rapid</h3>
              <div className="flex flex-col gap-3 text-sm">
                <Link href="/about" className="text-gray-400 hover:text-[#006CFF] transition-colors flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Sou Nou
                </Link>
                <Link href="/live" className="text-gray-400 hover:text-[#006CFF] transition-colors flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Rezilta an Tan Reyèl
                </Link>
                <Link href="/vote" className="text-gray-400 hover:text-[#006CFF] transition-colors flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Vote Kounye a
                </Link>
                <Link href="/press" className="text-gray-400 hover:text-[#7F00FF] transition-colors flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Kit Medya
                </Link>
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Kontak</h3>
              <p className="text-gray-400 text-sm">
                Pou kesyon oswa sipò teknolojik:
              </p>
              <p className="text-sm">
                <a 
                  href="mailto:info@techklein.com" 
                  className="text-[#006CFF] hover:text-[#7F00FF] hover:underline transition-colors"
                >
                  info@techklein.com
                </a>
              </p>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
              <p>
                © {new Date().getFullYear()} HaitiVote. Tout dwa rezève.
              </p>
              <div className="flex items-center gap-2">
                <span>Bati ak</span>
                <span className="text-red-500">❤️</span>
                <span>pou Ayiti</span>
                <span className="text-2xl">🇭🇹</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating action button (mobile) */}
      {state.candidateId && state.step === 'candidate' && (
        <div className="fixed bottom-6 right-6 z-50 md:hidden">
          <Button
            size="lg"
            className="rounded-full shadow-2xl bg-gradient-to-r from-[#006CFF] to-[#7F00FF] text-white"
            onClick={() => goToStep('details')}
          >
            <CheckCircle2 className="h-5 w-5 mr-2" />
            Kontinye
          </Button>
        </div>
      )}
    </div>
  );
}
