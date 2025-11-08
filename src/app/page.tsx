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
  Activity,
  Zap,
  GitCompare,
  Trophy,
  MapPin,
  Clock,
  FileText,
  Share2,
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
              <Link href="/" className="flex items-center gap-2">
                <div className="text-2xl">🇭🇹</div>
                <span className="text-xl font-bold bg-gradient-to-r from-[#006CFF] to-[#7F00FF] bg-clip-text text-transparent">
                  HaitiVote
                </span>
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
              
              <Link href="/">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight cursor-pointer hover:opacity-80 transition-opacity">
                  HaitiVote
                </h1>
              </Link>
              
              <p className="text-2xl md:text-3xl font-semibold text-blue-100">
                "Yon Pèp. Yon Vwa. Yon Sondaj."
              </p>
              
              <p className="text-lg md:text-xl text-blue-50 leading-relaxed">
                Patisipe nan pi gwo sondaj dijital pou eleksyon prezidansyèl Ayiti. 
                Kèlkeswa kote w ye nan mond lan, vwa w konte!
              </p>

              <div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-4">
                <Link href="/live">
                  <Button size="lg" className="bg-white text-[#006CFF] hover:bg-blue-50">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Rezilta Live
                  </Button>
                </Link>
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
                      Apre sa, w ap ranpli enfòmasyon w epi konfime vòt ou ak yon kòd email.
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
                    Yon vòt pa email. Sistèm anti-doub avanse. Verifikasyon email obligatwa.
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

            {/* Analytics & Tools Section */}
            <div className="space-y-6 pt-12">
              <div className="text-center space-y-3">
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#006CFF] to-[#7F00FF] bg-clip-text text-transparent">
                  Eksplorè Rezilta yo
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Analize done yo, swiv tendans, konpare kandida yo, ak eksperyans plis fonksyon
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Activity Feed */}
                <Link href="/activity">
                  <Card className="h-full border-2 border-transparent hover:border-blue-500/50 transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer group">
                    <CardContent className="p-6 space-y-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <Activity className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-gray-900 mb-2">Aktivite Live</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          Gade vòt k ap rantre an tan reyèl. Swiv mouvman nan tout peyi yo.
                        </p>
                      </div>
                      <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all">
                        <span>Gade Aktivite</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                {/* Trends & Predictions */}
                <Link href="/trends">
                  <Card className="h-full border-2 border-transparent hover:border-purple-500/50 transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer group">
                    <CardContent className="p-6 space-y-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <TrendingUp className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-gray-900 mb-2">Tendans</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          Analize tendans semèn lan, prediksyon, ak estatistik avanse.
                        </p>
                      </div>
                      <div className="flex items-center text-purple-600 font-semibold text-sm group-hover:gap-2 transition-all">
                        <span>Eksplorè Tendans</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                {/* Leaderboard */}
                <Link href="/leaderboard">
                  <Card className="h-full border-2 border-transparent hover:border-yellow-500/50 transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer group">
                    <CardContent className="p-6 space-y-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <Trophy className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-gray-900 mb-2">Klasman</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          Wè klasman konplè ak estatistik detaye pou chak kandida.
                        </p>
                      </div>
                      <div className="flex items-center text-yellow-600 font-semibold text-sm group-hover:gap-2 transition-all">
                        <span>Gade Klasman</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                {/* Compare Candidates */}
                <Link href="/compare">
                  <Card className="h-full border-2 border-transparent hover:border-green-500/50 transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer group">
                    <CardContent className="p-6 space-y-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <GitCompare className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-gray-900 mb-2">Konpare</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          Konpare 2 kandida kote kote ak grafik detaye.
                        </p>
                      </div>
                      <div className="flex items-center text-green-600 font-semibold text-sm group-hover:gap-2 transition-all">
                        <span>Konpare Kandida</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                {/* Challenge Feature */}
                <Link href="/challenge">
                  <Card className="h-full border-2 border-transparent hover:border-red-500/50 transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer group">
                    <CardContent className="p-6 space-y-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <Zap className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-gray-900 mb-2">Batay Kandida</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          Chwazi kandida ou nan yon konpetisyon rapid. Ki moun ki pral genyen?
                        </p>
                      </div>
                      <div className="flex items-center text-red-600 font-semibold text-sm group-hover:gap-2 transition-all">
                        <span>Jwe Batay</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                {/* Media Kit */}
                <Link href="/press">
                  <Card className="h-full border-2 border-transparent hover:border-indigo-500/50 transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer group">
                    <CardContent className="p-6 space-y-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <Users className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-gray-900 mb-2">Kit Medya</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          Telechaje logo, banner, ak tout resous pou pibliye.
                        </p>
                      </div>
                      <div className="flex items-center text-indigo-600 font-semibold text-sm group-hover:gap-2 transition-all">
                        <span>Kit Medya</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                {/* Departments */}
                <Link href="/departments">
                  <Card className="h-full border-2 border-transparent hover:border-teal-500/50 transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer group">
                    <CardContent className="p-6 space-y-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <MapPin className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-gray-900 mb-2">Depatman Ayiti</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          Wè statistik vòt pa depatman ak rejyon nan Ayiti.
                        </p>
                      </div>
                      <div className="flex items-center text-teal-600 font-semibold text-sm group-hover:gap-2 transition-all">
                        <span>Depatman</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                {/* World Map */}
                <Link href="/map">
                  <Card className="h-full border-2 border-transparent hover:border-emerald-500/50 transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer group">
                    <CardContent className="p-6 space-y-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <Globe className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-gray-900 mb-2">Kat Mondyal</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          Kat entèaktif avèk vòt pa peyi nan mond antye.
                        </p>
                      </div>
                      <div className="flex items-center text-emerald-600 font-semibold text-sm group-hover:gap-2 transition-all">
                        <span>Wè Kat</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                {/* Timeline */}
                <Link href="/timeline">
                  <Card className="h-full border-2 border-transparent hover:border-orange-500/50 transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer group">
                    <CardContent className="p-6 space-y-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <Clock className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-gray-900 mb-2">Kwonik Istorik</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          Wè evolisyon vòt yo jou pa jou avèk moman kle.
                        </p>
                      </div>
                      <div className="flex items-center text-orange-600 font-semibold text-sm group-hover:gap-2 transition-all">
                        <span>Wè Kwonik</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>

            {/* Resources & Documentation Section */}
            <div className="space-y-6 pt-12">
              <div className="text-center space-y-3">
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Resous & Dokumentasyon
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Gid konplè, enfòmasyon medya, ak zouti pou itilizatè ak patnè yo
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* How to Vote Guide */}
                <Link href="/how-to-vote">
                  <Card className="h-full border-2 border-transparent hover:border-blue-500/50 transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer group">
                    <CardContent className="p-6 space-y-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <Info className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-gray-900 mb-2">Kijan pou Vote</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          Gid konplè etap pa etap pou vote. Tout sa ou bezwen konnen.
                        </p>
                      </div>
                      <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all">
                        <span>Li Gid</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                {/* Admin Guide */}
                <Link href="/admin-guide">
                  <Card className="h-full border-2 border-transparent hover:border-purple-500/50 transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer group">
                    <CardContent className="p-6 space-y-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <Shield className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-gray-900 mb-2">Gid Admin</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          Manyèl fòmasyon pou administratè ak ekip jesyon platfòm nan.
                        </p>
                      </div>
                      <div className="flex items-center text-purple-600 font-semibold text-sm group-hover:gap-2 transition-all">
                        <span>Aksè Gid</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                {/* Launch Ready Status */}
                <Link href="/launch-ready">
                  <Card className="h-full border-2 border-transparent hover:border-green-500/50 transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer group">
                    <CardContent className="p-6 space-y-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <CheckCircle2 className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-gray-900 mb-2">Estatistik Platfòm</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          Tout fonksyon ak estati platfòm nan. 100% konplè!
                        </p>
                      </div>
                      <div className="flex items-center text-green-600 font-semibold text-sm group-hover:gap-2 transition-all">
                        <span>Wè Estatistik</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                {/* Press Release */}
                <Link href="/press-release">
                  <Card className="h-full border-2 border-transparent hover:border-red-500/50 transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer group">
                    <CardContent className="p-6 space-y-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <FileText className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-gray-900 mb-2">Kominike Lapres</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          Kominike ofisyèl pou medya ak enfòmasyon pou jounalis.
                        </p>
                      </div>
                      <div className="flex items-center text-red-600 font-semibold text-sm group-hover:gap-2 transition-all">
                        <span>Li Kominike</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                {/* Social Media Hub */}
                <Link href="/social-media">
                  <Card className="h-full border-2 border-transparent hover:border-pink-500/50 transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer group">
                    <CardContent className="p-6 space-y-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <Share2 className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-gray-900 mb-2">Rezo Sosyal</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          Modèl kontni, estrateji marketing, ak resous medya sosyal.
                        </p>
                      </div>
                      <div className="flex items-center text-pink-600 font-semibold text-sm group-hover:gap-2 transition-all">
                        <span>Wè Resous</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                {/* QR Code Generator */}
                <Link href="/qr">
                  <Card className="h-full border-2 border-transparent hover:border-cyan-500/50 transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer group">
                    <CardContent className="p-6 space-y-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <Sparkles className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-gray-900 mb-2">Kòd QR</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          Kreye kòd QR pou pataje platfòm nan ak swiv medya yo.
                        </p>
                      </div>
                      <div className="flex items-center text-cyan-600 font-semibold text-sm group-hover:gap-2 transition-all">
                        <span>Kreye Kòd</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
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
                {(state.metadata as any).verificationMethod === 'email' 
                  ? `Nou voye yon kòd 6 chif sou email ${state.metadata.phoneE164}`
                  : `Nou voye yon kòd 6 chif nan ${state.metadata.phoneE164}`}
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
                Chanje email
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
      <footer className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white mt-20">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            {/* About */}
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="text-3xl">🇭🇹</div>
                <h3 className="font-bold text-2xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">HaitiVote</h3>
              </div>
              <p className="text-gray-300 leading-relaxed text-base">
                Platfòm sondaj transparan pou eleksyon Ayiti 2025-2026. 
                Bati ak teknoloji modèn pou sekirite ak presizyon maksimòm.
              </p>
              <p className="text-base text-blue-300 font-semibold italic">"Yon Pèp. Yon Vwa. Yon Sondaj."</p>
            </div>

            {/* Navigation Links */}
            <div className="space-y-5">
              <h3 className="font-bold text-xl text-blue-300">Navigasyon</h3>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/about" className="text-gray-300 hover:text-blue-400 transition-colors text-base font-medium">
                  Sou Nou
                </Link>
                <Link href="/live" className="text-gray-300 hover:text-blue-400 transition-colors text-base font-medium">
                  Rezilta Live
                </Link>
                <Link href="/leaderboard" className="text-gray-300 hover:text-yellow-400 transition-colors text-base font-medium">
                  Klasman
                </Link>
                <Link href="/activity" className="text-gray-300 hover:text-blue-400 transition-colors text-base font-medium">
                  Aktivite
                </Link>
                <Link href="/trends" className="text-gray-300 hover:text-purple-400 transition-colors text-base font-medium">
                  Tendans
                </Link>
                <Link href="/compare" className="text-gray-300 hover:text-green-400 transition-colors text-base font-medium">
                  Konpare
                </Link>
                <Link href="/challenge" className="text-gray-300 hover:text-red-400 transition-colors text-base font-medium">
                  Batay
                </Link>
                <Link href="/press" className="text-gray-300 hover:text-purple-400 transition-colors text-base font-medium">
                  Kit Medya
                </Link>
              </div>
            </div>

            {/* Resources */}
            <div className="space-y-5">
              <h3 className="font-bold text-xl text-blue-300">Resous</h3>
              <div className="flex flex-col gap-3.5">
                <Link href="/how-to-vote" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-2 text-base font-medium group">
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  Kijan pou Vote
                </Link>
                <Link href="/admin-guide" className="text-gray-300 hover:text-purple-400 transition-colors flex items-center gap-2 text-base font-medium group">
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  Gid Admin
                </Link>
                <Link href="/launch-ready" className="text-gray-300 hover:text-green-400 transition-colors flex items-center gap-2 text-base font-medium group">
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  Estatistik Platfòm
                </Link>
                <Link href="/press-release" className="text-gray-300 hover:text-red-400 transition-colors flex items-center gap-2 text-base font-medium group">
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  Kominike Lapres
                </Link>
                <Link href="/social-media" className="text-gray-300 hover:text-pink-400 transition-colors flex items-center gap-2 text-base font-medium group">
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  Rezo Sosyal
                </Link>
              </div>
            </div>

            {/* Media & Tools */}
            <div className="space-y-5">
              <h3 className="font-bold text-xl text-blue-300">Zouti</h3>
              <div className="flex flex-col gap-3.5">
                <Link href="/embed" className="text-gray-300 hover:text-purple-400 transition-colors flex items-center gap-2 text-base font-medium group">
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  Widget Embed
                </Link>
                <Link href="/qr" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-2 text-base font-medium group">
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  Kòd QR
                </Link>
                <Link href="/tv" className="text-gray-300 hover:text-green-400 transition-colors flex items-center gap-2 text-base font-medium group">
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  Mode Televizyon
                </Link>
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-5">
              <h3 className="font-bold text-xl text-blue-300">Kontak</h3>
              <p className="text-gray-300 text-base font-medium">
                Pou kesyon oswa sipò teknolojik:
              </p>
              <div className="space-y-3">
                <p className="text-base">
                  <a 
                    href="mailto:info@techklein.com" 
                    className="text-blue-400 hover:text-purple-400 hover:underline transition-colors font-semibold"
                  >
                    info@techklein.com
                  </a>
                </p>
                <div className="flex gap-3 pt-2">
                  <a href="https://twitter.com/TechKleinHT" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center transition-colors">
                    <span className="text-xl">𝕏</span>
                  </a>
                  <a href="https://facebook.com/TechKlein" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-colors">
                    <span className="text-xl">f</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700/50 mt-12 pt-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-base">
              <p className="text-gray-300 font-medium">
                © {new Date().getFullYear()} HaitiVote. Tout dwa rezève.
              </p>
              <div className="flex items-center gap-2 text-gray-300 font-medium">
                <span>Bati ak</span>
                <span className="text-red-400 text-xl">❤️</span>
                <span>pou Ayiti</span>
                <span className="text-3xl">🇭🇹</span>
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
