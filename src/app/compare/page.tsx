/**
 * Compare Page - Side-by-Side Candidate Comparison
 * Select up to 4 candidates to compare metrics
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCandidates } from '@/hooks/use-candidates';
import { formatNumber } from '@/lib/utils';
import {
  Users,
  Globe,
  BarChart3,
  TrendingUp,
  X,
  Plus,
  ArrowLeft,
  Target,
  MapPin,
} from 'lucide-react';

interface CandidateStats {
  id: number;
  name: string;
  slug: string;
  photo_url: string;
  total_votes: number;
  percentage: number;
  country_count: number;
  top_countries: Array<{
    country: string;
    votes: number;
    percentage: number;
  }>;
}

export default function ComparePage() {
  const { candidates, loading: candidatesLoading } = useCandidates();
  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
  const [candidateStats, setCandidateStats] = React.useState<Map<number, CandidateStats>>(new Map());
  const [loading, setLoading] = React.useState(false);

  // Fetch stats for a specific candidate
  const fetchCandidateStats = React.useCallback(async (candidateId: number) => {
    try {
      const response = await fetch(`/api/compare/${candidateId}`);
      if (!response.ok) throw new Error('Failed to fetch candidate stats');
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching candidate stats:', error);
      return null;
    }
  }, []);

  // Load stats when candidates are selected
  React.useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      const newStats = new Map(candidateStats);

      for (const id of selectedIds) {
        if (!newStats.has(id)) {
          const stats = await fetchCandidateStats(id);
          if (stats) {
            newStats.set(id, stats);
          }
        }
      }

      setCandidateStats(newStats);
      setLoading(false);
    };

    if (selectedIds.length > 0) {
      loadStats();
    }
  }, [selectedIds]);

  const addCandidate = (candidateId: string) => {
    const id = parseInt(candidateId);
    if (!selectedIds.includes(id) && selectedIds.length < 4) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const removeCandidate = (candidateId: number) => {
    setSelectedIds(selectedIds.filter((id) => id !== candidateId));
    const newStats = new Map(candidateStats);
    newStats.delete(candidateId);
    setCandidateStats(newStats);
  };

  const availableCandidates = candidates.filter(
    (c) => !selectedIds.includes(c.id)
  );

  const selectedCandidates = selectedIds
    .map((id) => candidateStats.get(id))
    .filter((c): c is CandidateStats => c !== undefined);

  const maxVotes = selectedCandidates.length > 0
    ? Math.max(...selectedCandidates.map((c) => c.total_votes))
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="text-2xl">🇭🇹</div>
              <span className="text-2xl font-bold bg-gradient-to-r from-[#006CFF] to-[#7F00FF] bg-clip-text text-transparent">
                HaitiVote
              </span>
            </Link>
            <Link href="/leaderboard">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Retounen
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Title Section */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-[#006CFF]/10 to-[#7F00FF]/10 border-2 border-[#006CFF]/20">
            <Target className="h-6 w-6 text-[#006CFF]" />
            <span className="font-bold text-lg bg-gradient-to-r from-[#006CFF] to-[#7F00FF] bg-clip-text text-transparent">
              KONPARE KANDIDA
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-[#006CFF] to-[#7F00FF] bg-clip-text text-transparent">
            Konpare Kandida
          </h1>
          
          <p className="text-xl text-gray-600">
            Chwazi jiska 4 kandida pou konpare estatistik yo
          </p>
        </div>

        {/* Candidate Selector */}
        <Card className="mb-8 border-2 border-[#006CFF]/30 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Ajoute Kandida ({selectedIds.length}/4)
                </label>
                <Select onValueChange={addCandidate} disabled={selectedIds.length >= 4}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chwazi yon kandida..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCandidates.map((candidate) => (
                      <SelectItem key={candidate.id} value={candidate.id.toString()}>
                        {candidate.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedIds.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedIds([]);
                    setCandidateStats(new Map());
                  }}
                  className="md:mt-7"
                >
                  <X className="h-4 w-4 mr-2" />
                  Efase Tout
                </Button>
              )}
            </div>

            {/* Selected Candidates Pills */}
            {selectedIds.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedIds.map((id) => {
                  const candidate = candidates.find((c) => c.id === id);
                  return candidate ? (
                    <Badge
                      key={id}
                      variant="secondary"
                      className="pl-3 pr-2 py-2 text-sm flex items-center gap-2"
                    >
                      {candidate.name}
                      <button
                        onClick={() => removeCandidate(id)}
                        className="hover:bg-gray-300 rounded-full p-0.5 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ) : null;
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Empty State */}
        {selectedIds.length === 0 && (
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="p-12 text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <Plus className="h-10 w-10 text-gray-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700">Chwazi Kandida</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Sèvi ak meni ki anwo a pou chwazi jiska 4 kandida pou konpare estatistik yo kòt a kòt.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-3 text-[#006CFF]">
              <div className="w-6 h-6 border-4 border-[#006CFF] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-lg font-semibold">Chajman estatistik...</span>
            </div>
          </div>
        )}

        {/* Comparison Grid */}
        {selectedCandidates.length > 0 && !loading && (
          <div className="space-y-8">
            {/* Overview Cards */}
            <div className={`grid grid-cols-1 ${selectedCandidates.length === 2 ? 'md:grid-cols-2' : selectedCandidates.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4'} gap-6`}>
              {selectedCandidates.map((candidate) => (
                <Card key={candidate.id} className="border-2 border-gray-200 hover:border-[#006CFF] transition-all shadow-lg">
                  <CardContent className="p-6 text-center space-y-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCandidate(candidate.id)}
                      className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full hover:bg-red-100"
                    >
                      <X className="h-4 w-4 text-red-600" />
                    </Button>

                    {candidate.photo_url ? (
                      <Image
                        src={candidate.photo_url}
                        alt={candidate.name || 'Candidate'}
                        width={120}
                        height={120}
                        className="w-28 h-28 rounded-full object-cover mx-auto border-4 border-[#006CFF]"
                      />
                    ) : (
                      <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#006CFF] to-[#7F00FF] flex items-center justify-center mx-auto border-4 border-[#006CFF]">
                        <span className="text-4xl font-bold text-white">
                          {candidate.name?.charAt(0) || '?'}
                        </span>
                      </div>
                    )}

                    <div>
                      <h3 className="font-bold text-xl text-gray-900 mb-2">
                        {candidate.name}
                      </h3>
                      <Badge className="bg-gradient-to-r from-[#006CFF] to-[#7F00FF] text-white">
                        {candidate.percentage.toFixed(1)}%
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2 text-gray-600">
                        <Users className="h-5 w-5" />
                        <span className="text-2xl font-bold">
                          {formatNumber(candidate.total_votes)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">Total Vòt</p>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-center gap-2 text-gray-600">
                        <Globe className="h-4 w-4" />
                        <span className="font-semibold">
                          {candidate.country_count} peyi
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Detailed Metrics Comparison */}
            <Card className="border-2 border-gray-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-[#006CFF]/5 to-[#7F00FF]/5">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-6 w-6 text-[#006CFF]" />
                  Konparezon Detaye
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Total Votes Comparison */}
                <div>
                  <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-[#006CFF]" />
                    Total Vòt
                  </h4>
                  <div className="space-y-3">
                    {selectedCandidates.map((candidate) => (
                      <div key={candidate.id}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-700">
                            {candidate.name}
                          </span>
                          <span className="text-lg font-bold text-gray-900">
                            {formatNumber(candidate.total_votes)}
                          </span>
                        </div>
                        <Progress
                          value={(candidate.total_votes / maxVotes) * 100}
                          className="h-3"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Percentage Comparison */}
                <div>
                  <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-[#006CFF]" />
                    Pousantaj Total
                  </h4>
                  <div className="space-y-3">
                    {selectedCandidates.map((candidate) => (
                      <div key={candidate.id}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-700">
                            {candidate.name}
                          </span>
                          <span className="text-lg font-bold text-[#006CFF]">
                            {candidate.percentage.toFixed(2)}%
                          </span>
                        </div>
                        <Progress
                          value={candidate.percentage}
                          className="h-3"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Country Reach Comparison */}
                <div>
                  <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-[#006CFF]" />
                    Kouvèti Jewografik
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedCandidates.map((candidate) => (
                      <div
                        key={candidate.id}
                        className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200"
                      >
                        <p className="text-3xl font-bold text-[#006CFF]">
                          {candidate.country_count}
                        </p>
                        <p className="text-sm text-gray-600 mt-1 truncate">
                          {candidate.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Countries for Each Candidate */}
            <div className={`grid grid-cols-1 ${selectedCandidates.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-6`}>
              {selectedCandidates.map((candidate) => (
                <Card key={candidate.id} className="border-2 border-gray-200 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MapPin className="h-5 w-5 text-[#006CFF]" />
                      Top 3 Peyi - {candidate.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {candidate.top_countries.length > 0 ? (
                      <div className="space-y-3">
                        {candidate.top_countries.slice(0, 3).map((country, index) => (
                          <div key={country.country} className="flex items-center gap-3">
                            <Badge className="bg-gradient-to-br from-[#006CFF] to-[#7F00FF] text-white w-8 h-8 flex items-center justify-center rounded-full">
                              {index + 1}
                            </Badge>
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-semibold text-gray-700">
                                  {country.country}
                                </span>
                                <span className="text-sm font-bold text-gray-900">
                                  {formatNumber(country.votes)} ({country.percentage.toFixed(1)}%)
                                </span>
                              </div>
                              <Progress value={country.percentage} className="h-2" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-4">
                        Pa gen done disponib
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
