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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-techklein-purple/5">
      {/* Hero Header */}
      <header className="relative overflow-hidden border-b border-border">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-techklein-purple/10 via-techklein-blue/10 to-techklein-cyan/10 animate-gradient-shift" />
        
        <div className="relative container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Branding & Title */}
            <div className="text-center lg:text-left space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-techklein-purple/20 to-techklein-cyan/20 border border-primary/30">
                <Sparkles className="h-4 w-4 text-techklein-cyan animate-pulse" />
                <span className="text-sm font-semibold">Sondaj Ofisyèl 2025-2026</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold">
                <span className="text-gradient-techklein">TechKlein</span>{' '}
                <span className="text-foreground">VoteLive</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground font-medium">
                Sondaj Ayiti Global 🇭🇹
              </p>
              
              <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
                Patisipe nan pi gwo sondaj dijital pou eleksyon prezidansyèl Ayiti. 
                Vwa w konte, kèlkeswa kote w ye nan mond lan!
              </p>
            </div>

            {/* Stats & Actions */}
            <div className="flex flex-col items-center gap-4">
              {/* Live indicator */}
              {isLive && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/50">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-sm font-bold text-red-500">LIVE</span>
                </div>
              )}

              {/* Total votes */}
              <Card className="w-full lg:w-auto border-2 border-primary/50 bg-gradient-to-br from-primary/5 to-secondary/5">
                <CardContent className="p-6 text-center space-y-2">
                  <p className="text-sm text-muted-foreground font-medium">
                    Total Vòt Konte
                  </p>
                  <p className="text-5xl font-bold text-gradient-techklein">
                    {formatNumber(totalVotes)}
                  </p>
                  <div className="flex items-center justify-center gap-2 text-green-500 text-sm">
                    <TrendingUp className="h-4 w-4" />
                    <span className="font-semibold">Ap ogmante chak minit</span>
                  </div>
                </CardContent>
              </Card>

              {/* Language switcher */}
              <LanguageSwitcher />

              {/* View results button */}
              <Link href="/live" className="w-full lg:w-auto">
                <Button variant="outline" size="lg" className="w-full gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Gade Rezilta
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
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
            <Alert className="border-2 border-primary/50">
              <Info className="h-5 w-5" />
              <AlertDescription className="text-base">
                <strong>Etap 1 sou 3:</strong> Chwazi kandida ou pami {candidates.length} kandida ofisyèl. 
                Apre sa, w ap ranpli enfòmasyon w epi konfime vòt ou ak yon kòd SMS.
              </AlertDescription>
            </Alert>

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-green-500/10 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-green-500" />
                  </div>
                  <h3 className="font-semibold">100% Sekirite</h3>
                  <p className="text-sm text-muted-foreground">
                    Yon vòt pa telefòn. Sistèm anti-doub avanse.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Globe className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="font-semibold">Mondyal</h3>
                  <p className="text-sm text-muted-foreground">
                    Vote soti nenpòt kote nan mond lan. Dyaspora akeyi!
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-cyan-500/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-cyan-500" />
                  </div>
                  <h3 className="font-semibold">Tan Reyèl</h3>
                  <p className="text-sm text-muted-foreground">
                    Rezilta mizajou chak minit. Transparans total.
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
      <footer className="border-t border-border bg-card mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* About */}
            <div className="space-y-3">
              <h3 className="font-bold text-lg">TechKlein VoteLive</h3>
              <p className="text-sm text-muted-foreground">
                Platfòm sondaj transparan pou eleksyon Ayiti 2025-2026. 
                Bati ak teknoloji modèn pou sekirite ak presizyon maksimòm.
              </p>
            </div>

            {/* Links */}
            <div className="space-y-3">
              <h3 className="font-bold text-lg">Lyen Rapid</h3>
              <div className="flex flex-col gap-2 text-sm">
                <Link href="/live" className="hover:text-primary transition-colors">
                  Rezilta an Tan Reyèl
                </Link>
                <Link href="/press" className="hover:text-primary transition-colors">
                  Kit Medya
                </Link>
                <Link href="/embed" className="hover:text-primary transition-colors">
                  Widget Embed
                </Link>
                <Link href="/overlay" className="hover:text-primary transition-colors">
                  Overlay TV
                </Link>
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-3">
              <h3 className="font-bold text-lg">Kontak</h3>
              <p className="text-sm text-muted-foreground">
                Pou kesyon oswa sipò teknolojik:
              </p>
              <p className="text-sm">
                <a 
                  href="mailto:info@techklein.com" 
                  className="text-primary hover:underline"
                >
                  info@techklein.com
                </a>
              </p>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} TechKlein. Tout dwa rezève.
            </p>
            <div className="flex items-center gap-4">
              <span>Bati ak ❤️ pou Ayiti</span>
              <Badge variant="outline">v1.0.0</Badge>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating action button (mobile) */}
      {state.candidateId && state.step === 'candidate' && (
        <div className="fixed bottom-6 right-6 z-50 md:hidden">
          <Button
            size="lg"
            className="rounded-full shadow-2xl shadow-primary/50 animate-pulse-glow bg-gradient-to-r from-[#006CFF] to-[#7F00FF]"
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
