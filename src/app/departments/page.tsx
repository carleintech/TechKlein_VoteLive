/**
 * Departments Page - Haiti Regional Breakdown
 * Shows votes by Haiti's 10 departments
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft,
  MapPin,
  Users,
  TrendingUp,
  Award,
  Info,
} from 'lucide-react';
import { formatNumber } from '@/lib/utils';

interface DepartmentData {
  department: string;
  totalVotes: number;
  percentage: number;
  topCandidate: string;
  topCandidatePhoto: string;
  topCandidateVotes: number;
  candidates: Array<{
    id: number;
    name: string;
    photo_url: string;
    votes: number;
  }>;
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = React.useState<DepartmentData[]>([]);
  const [totalVotes, setTotalVotes] = React.useState(0);
  const [coverage, setCoverage] = React.useState({ specified: 0, unspecified: 0 });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/departments');
      
      if (!response.ok) throw new Error('Failed to fetch departments');
      
      const result = await response.json();
      
      if (result.success) {
        setDepartments(result.data.departments || []);
        setTotalVotes(result.data.totalVotes || 0);
        setCoverage(result.data.coverage || { specified: 0, unspecified: 0 });
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Erè nan chajman done yo');
    } finally {
      setLoading(false);
    }
  };

  const maxVotes = departments.length > 0 
    ? Math.max(...departments.map(d => d.totalVotes))
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retounen
                </Button>
              </Link>

              <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  <MapPin className="h-8 w-8 text-blue-500" />
                  Vòt pa Depatman Ayiti
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Repartisyon nan 10 depatman Ayiti
                </p>
              </div>
            </div>

            <Button onClick={fetchDepartments} disabled={loading}>
              Aktyalize
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-blue-500/30">
            <CardContent className="p-6 text-center">
              <Users className="h-10 w-10 mx-auto mb-2 text-blue-500" />
              <p className="text-sm text-gray-600">Total Vòt Ayiti</p>
              <p className="text-3xl font-bold text-blue-600">
                {formatNumber(totalVotes)}
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-500/30">
            <CardContent className="p-6 text-center">
              <MapPin className="h-10 w-10 mx-auto mb-2 text-green-500" />
              <p className="text-sm text-gray-600">Depatman Aktif</p>
              <p className="text-3xl font-bold text-green-600">
                {departments.length}
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-500/30">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-10 w-10 mx-auto mb-2 text-purple-500" />
              <p className="text-sm text-gray-600">Kouvèti</p>
              <p className="text-3xl font-bold text-purple-600">
                {coverage.specified.toFixed(1)}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Info Alert */}
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardContent className="p-6 flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold mb-1">Enfòmasyon sou done yo:</p>
              <p className="text-gray-700">
                {coverage.specified.toFixed(1)}% vòt gen enfòmasyon depatman espesifye. 
                {coverage.unspecified > 0 && (
                  <> {coverage.unspecified.toFixed(1)}% pa gen enfòmasyon rejyon.</>
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-2 border-red-500/30 bg-red-50">
            <CardContent className="p-8 text-center">
              <p className="text-red-600 font-semibold">{error}</p>
              <Button onClick={fetchDepartments} className="mt-4">
                Eseye Ankò
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Departments List */}
        {!loading && !error && departments.length > 0 && (
          <div className="space-y-6">
            {departments.map((dept, index) => (
              <Card 
                key={dept.department} 
                className="border-2 border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all"
              >
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                        {index + 1}
                      </div>
                      <div>
                        <CardTitle className="text-2xl flex items-center gap-2">
                          {dept.department}
                          {index === 0 && (
                            <Award className="h-6 w-6 text-yellow-500" />
                          )}
                        </CardTitle>
                        <CardDescription className="text-base mt-1">
                          {formatNumber(dept.totalVotes)} vòt total · {dept.percentage.toFixed(1)}% vòt Ayiti
                        </CardDescription>
                      </div>
                    </div>

                    <Badge variant="secondary" className="text-lg px-4 py-2">
                      {dept.percentage.toFixed(1)}%
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  {/* Progress Bar */}
                  <div className="mb-6">
                    <Progress 
                      value={(dept.totalVotes / maxVotes) * 100} 
                      className="h-3"
                    />
                  </div>

                  {/* Top Candidate */}
                  <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg p-4 mb-4 border-2 border-yellow-200">
                    <div className="flex items-center gap-4">
                      <Award className="h-8 w-8 text-yellow-600 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 font-medium mb-1">
                          Kandida #1 nan depatman sa
                        </p>
                        <div className="flex items-center gap-3">
                          {dept.topCandidatePhoto && (
                            <div className="relative w-10 h-10">
                              <Image
                                src={dept.topCandidatePhoto}
                                alt={dept.topCandidate}
                                fill
                                className="rounded-full object-cover border-2 border-yellow-400"
                              />
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-lg">{dept.topCandidate}</p>
                            <p className="text-sm text-gray-600">
                              {formatNumber(dept.topCandidateVotes)} vòt · 
                              {' '}{((dept.topCandidateVotes / dept.totalVotes) * 100).toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Top 5 Candidates */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Users className="h-5 w-5 text-gray-600" />
                      Top 5 Kandida nan {dept.department}
                    </h4>
                    <div className="space-y-2">
                      {dept.candidates.slice(0, 5).map((candidate, idx) => (
                        <div 
                          key={candidate.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="w-8 h-8 flex items-center justify-center rounded-full">
                              {idx + 1}
                            </Badge>
                            {candidate.photo_url && (
                              <div className="relative w-10 h-10">
                                <Image
                                  src={candidate.photo_url}
                                  alt={candidate.name}
                                  fill
                                  className="rounded-full object-cover"
                                />
                              </div>
                            )}
                            <p className="font-medium">{candidate.name}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">
                              {formatNumber(candidate.votes)}
                            </p>
                            <p className="text-sm text-gray-600">
                              {((candidate.votes / dept.totalVotes) * 100).toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && departments.length === 0 && (
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="p-12 text-center">
              <MapPin className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                Pa gen vòt Ayiti ankò
              </h3>
              <p className="text-gray-600">
                Vòt yo ap parèt isit lè yo rantre nan sistèm nan
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
