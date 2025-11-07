/**
 * Vote Map Component
 * Leaflet-based interactive map
 */

'use client';

import * as React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { formatNumber } from '@/lib/utils';

interface CountryData {
  country: string;
  code: string;
  lat: number;
  lng: number;
  totalVotes: number;
  topCandidate: string;
  percentage: number;
}

interface VoteMapProps {
  data: CountryData[];
  viewMode: 'heatmap' | 'markers';
}

function MapUpdater({ data }: { data: CountryData[] }) {
  const map = useMap();

  React.useEffect(() => {
    if (data.length > 0) {
      const bounds = data.map((d) => [d.lat, d.lng] as [number, number]);
      map.fitBounds(bounds as any, { padding: [50, 50] });
    }
  }, [data, map]);

  return null;
}

export default function VoteMap({ data, viewMode }: VoteMapProps) {
  const center: LatLngExpression = [18.5944, -72.3074]; // Haiti center
  const maxVotes = Math.max(...data.map((d) => d.totalVotes));

  const getMarkerRadius = (votes: number) => {
    const minRadius = 5;
    const maxRadius = 50;
    return minRadius + ((votes / maxVotes) * (maxRadius - minRadius));
  };

  const getMarkerColor = (votes: number) => {
    const intensity = votes / maxVotes;
    
    if (intensity > 0.7) return '#ef4444'; // red
    if (intensity > 0.5) return '#f97316'; // orange
    if (intensity > 0.3) return '#eab308'; // yellow
    if (intensity > 0.1) return '#22c55e'; // green
    return '#3b82f6'; // blue
  };

  return (
    <div className="h-[600px] rounded-lg overflow-hidden border-2 border-border">
      <MapContainer
        center={center}
        zoom={3}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapUpdater data={data} />

        {data.map((country) => (
          <CircleMarker
            key={country.code}
            center={[country.lat, country.lng]}
            radius={getMarkerRadius(country.totalVotes)}
            fillColor={getMarkerColor(country.totalVotes)}
            color="#fff"
            weight={2}
            opacity={0.8}
            fillOpacity={0.6}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-lg mb-2">{country.country}</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total vòt:</span>
                    <span className="font-bold">{formatNumber(country.totalVotes)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pousantaj:</span>
                    <span className="font-bold">{country.percentage.toFixed(2)}%</span>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">Top kandida:</p>
                    <p className="font-semibold">{country.topCandidate}</p>
                  </div>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
