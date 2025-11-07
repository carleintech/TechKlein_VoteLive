/**
 * Interactive Vote Heatmap
 * World map showing vote distribution
 */

'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  Map as MapIcon,
  Globe,
  Users,
  TrendingUp,
  Info,
} from 'lucide-react';
import { formatNumber } from '@/lib/utils';

// Dynamically import map component (client-side only)
const MapComponent = dynamic(() => import('@/components/VoteMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] bg-muted rounded-lg flex items-center justify-center">
      <div className="text-center space-y-2">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto" />
        <p className="text-muted-foreground">Ap chaje kat la...</p>
      </div>
    </div>
  ),
});

interface MapData {
  countries: Array<{
    country: string;
    code: string;
    lat: number;
    lng: number;
    totalVotes: number;
    topCandidate: string;
    percentage: number;
  }>;
  global: {
    totalVotes: number;
    totalCountries: number;
    topCountry: string;
  };
}

export default function MapPage() {
  const [mapData, setMapData] = React.useState<MapData | null>(null);
  const [selectedCandidate, setSelectedCandidate] = React.useState<string>('all');
  const [viewMode, setViewMode] = React.useState<'heatmap' | 'markers'>('heatmap');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchMapData();
  }, [selectedCandidate]);

  const fetchMapData = async () => {
    try {
      setLoading(true);
      const url = selectedCandidate === 'all' 
        ? '/api/map/data'
        : `/api/map/data?candidate=${selectedCandidate}`;
      
      const response = await fetch(url);
      const data = await response.json();
      setMapData(data);
    } catch (error) {
      console.error('Failed to fetch map data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-green-950/10">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/leaderboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retounen
                </Button>
              </Link>

              <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  <Globe className="h-8 w-8 text-green-500" />
                  Kat Mondyal Vòt
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Vizwalizasyon jeografik vòt yo
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Select value={selectedCandidate} onValueChange={setSelectedCandidate}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Tout kandida" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tout Kandida</SelectItem>
                  {/* Dynamically load candidates */}
                </SelectContent>
              </Select>

              <Button
                variant={viewMode === 'heatmap' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('heatmap')}
              >
                Heatmap
              </Button>
              <Button
                variant={viewMode === 'markers' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('markers')}
              >
                Makè
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Global Stats */}
        {mapData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-10 w-10 mx-auto mb-2 text-primary" />
                <p className="text-sm text-muted-foreground">Total Vòt</p>
                <p className="text-3xl font-bold">
                  {formatNumber(mapData.global.totalVotes)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Globe className="h-10 w-10 mx-auto mb-2 text-green-500" />
                <p className="text-sm text-muted-foreground">Peyi Reprezante</p>
                <p className="text-3xl font-bold text-green-500">
                  {mapData.global.totalCountries}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-10 w-10 mx-auto mb-2 text-blue-500" />
                <p className="text-sm text-muted-foreground">Peyi #1</p>
                <p className="text-xl font-bold text-blue-500">
                  {mapData.global.topCountry}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Map */}
        <Card className="border-2 border-primary/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapIcon className="h-6 w-6" />
              Kat Entèaktif
            </CardTitle>
            <CardDescription>
              Klike sou yon peyi pou wè detay · Zoum ak navige
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[600px] bg-muted rounded-lg flex items-center justify-center">
                <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : (
              <MapComponent 
                data={mapData?.countries || []} 
                viewMode={viewMode}
              />
            )}
          </CardContent>
        </Card>

        {/* Country Breakdown Table */}
        {mapData && (
          <Card>
            <CardHeader>
              <CardTitle>Repartisyon pa Peyi</CardTitle>
              <CardDescription>
                Detay konplè pou chak peyi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mapData.countries
                  .sort((a, b) => b.totalVotes - a.totalVotes)
                  .map((country, index) => (
                    <div
                      key={country.code}
                      className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 text-center">
                          <span className="text-lg font-bold text-muted-foreground">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold">{country.country}</p>
                          <p className="text-sm text-muted-foreground">
                            Top: {country.topCandidate}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">
                          {formatNumber(country.totalVotes)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {country.percentage.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card className="bg-blue-500/5 border-blue-500/50">
          <CardContent className="p-6 flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold mb-1">Kijan pou itilize kat la:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Klike ak trennen pou deplase kat la</li>
                <li>Itilize wou rat oswa boutòn +/- pou zoume</li>
                <li>Klike sou yon peyi pou wè enfòmasyon detaye</li>
                <li>Koulè pi entans = plis vòt nan peyi sa</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
