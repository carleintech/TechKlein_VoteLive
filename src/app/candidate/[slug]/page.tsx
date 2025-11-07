/**
 * Candidate Profile Page
 * Detailed view of individual candidate
 */

import * as React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  Globe,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  TrendingUp,
  Users,
} from 'lucide-react';
import { formatNumber } from '@/lib/utils';

interface CandidatePageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getCandidateData(slug: string) {
  const supabase = await createClient();

  // Fetch candidate details
  const { data: candidate, error: candidateError } = await (supabase as any)
    .from('candidates')
    .select(`
      *,
      candidate_meta (*)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single<{
      id: number;
      name: string;
      slug: string;
      photo_url: string;
      party: string | null;
      motto: string | null;
      is_active: boolean;
      created_at: string;
      updated_at: string;
      candidate_meta: Array<any> | null;
    }>();

  if (candidateError || !candidate) {
    return null;
  }

  // Fetch vote stats for this candidate
  const { data: stats } = await (supabase as any)
    .from('vote_aggregates')
    .select('*')
    .eq('candidate_slug', slug)
    .single<{ candidate_id: number; candidate_name: string; candidate_slug: string; photo_url: string; total_votes: number; percentage: number }>();

  // Fetch votes by country for this candidate
  const { data: byCountry } = await (supabase as any)
    .from('vote_by_country')
    .select('*')
    .eq('candidate_slug', slug)
    .order('total_votes', { ascending: false })
    .limit(10) as { data: Array<{ country: string; candidate_slug: string; candidate_name: string; total_votes: number }> | null };

  return {
    candidate,
    stats,
    byCountry: byCountry || [],
  };
}

export default async function CandidatePage({ params }: CandidatePageProps) {
  const { slug } = await params;
  const data = await getCandidateData(slug);

  if (!data) {
    notFound();
  }

  const { candidate, stats, byCountry } = data;
  const meta = candidate.candidate_meta?.[0];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retounen
            </Button>
          </Link>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Photo */}
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-primary flex-shrink-0">
              <Image
                src={candidate.photo_url}
                alt={candidate.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Info */}
            <div className="flex-1 space-y-3">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">
                  {candidate.name}
                </h1>
                {candidate.party && (
                  <Badge variant="secondary" className="mt-2">
                    {candidate.party}
                  </Badge>
                )}
              </div>

              {candidate.motto && (
                <p className="text-lg italic text-muted-foreground">
                  "{candidate.motto}"
                </p>
              )}

              {/* Social Links */}
              {meta && (
                <div className="flex flex-wrap gap-2">
                  {meta.website && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={meta.website} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4 mr-2" />
                        Sit Wèb
                      </a>
                    </Button>
                  )}

                  {meta.twitter && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={meta.twitter} target="_blank" rel="noopener noreferrer">
                        <Twitter className="h-4 w-4" />
                      </a>
                    </Button>
                  )}

                  {meta.facebook && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={meta.facebook} target="_blank" rel="noopener noreferrer">
                        <Facebook className="h-4 w-4" />
                      </a>
                    </Button>
                  )}

                  {meta.instagram && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={meta.instagram} target="_blank" rel="noopener noreferrer">
                        <Instagram className="h-4 w-4" />
                      </a>
                    </Button>
                  )}

                  {meta.youtube && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={meta.youtube} target="_blank" rel="noopener noreferrer">
                        <Youtube className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Biography */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            {meta?.bio && (
              <Card>
                <CardHeader>
                  <CardTitle>Biyografi</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {meta.bio}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Vote Distribution by Country */}
            {byCountry.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Vòt Pa Peyi</CardTitle>
                  <CardDescription>
                    Kote sipòtè {candidate.name} yo ye
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {byCountry.map((item) => {
                      const percentage = stats?.total_votes
                        ? (item.total_votes / stats.total_votes) * 100
                        : 0;

                      return (
                        <div key={item.country} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{item.country}</span>
                            <span className="text-muted-foreground">
                              {formatNumber(item.total_votes)} ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Stats */}
          <div className="space-y-6">
            {/* Vote Stats */}
            {stats && (
              <Card className="border-2 border-primary/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Estatistik Vòt
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">Total Vòt</p>
                    <p className="text-4xl font-bold text-gradient-techklein">
                      {formatNumber(stats.total_votes)}
                    </p>
                  </div>

                  <Separator />

                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">Pousantaj</p>
                    <p className="text-3xl font-bold">
                      {stats.percentage.toFixed(2)}%
                    </p>
                  </div>

                  <Separator />

                  <div className="text-center">
                    <Link href="/live">
                      <Button variant="gradient" className="w-full">
                        Gade Tout Rezilta
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Facts */}
            <Card>
              <CardHeader>
                <CardTitle>Enfòmasyon Rapid</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {candidate.party && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pati:</span>
                    <span className="font-semibold">{candidate.party}</span>
                  </div>
                )}

                {candidate.motto && (
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Deviz:</span>
                    <p className="font-semibold italic">"{candidate.motto}"</p>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID:</span>
                  <span className="font-mono text-xs">{candidate.id}</span>
                </div>
              </CardContent>
            </Card>

            {/* Call to Action */}
            <Card className="bg-gradient-to-br from-primary/10 to-secondary/10">
              <CardContent className="p-6 text-center space-y-4">
                <Users className="h-12 w-12 mx-auto text-primary" />
                <div>
                  <h3 className="font-bold text-lg mb-2">
                    Pa vote ankò?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Patisipe nan sondaj la kounye a
                  </p>
                  <Link href="/">
                    <Button variant="gradient" size="lg" className="w-full">
                      Vote Kounye a
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: CandidatePageProps) {
  const { slug } = await params;
  const data = await getCandidateData(slug);

  if (!data) {
    return {
      title: 'Kandida Pa Jwenn',
    };
  }

  const { candidate } = data;

  return {
    title: `${candidate.name} - TechKlein VoteLive`,
    description: candidate.motto || `Profil ${candidate.name} nan TechKlein VoteLive`,
    openGraph: {
      title: candidate.name,
      description: candidate.motto || 'Profil Kandida',
      images: [candidate.photo_url],
    },
  };
}
