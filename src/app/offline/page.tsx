/**
 * Offline Page
 * Shown when user is offline
 */

'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WifiOff } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center">
            <WifiOff className="h-10 w-10 text-muted-foreground" />
          </div>

          <div>
            <h1 className="text-2xl font-bold mb-2">Pa gen Koneksyon</h1>
            <p className="text-muted-foreground">
              Ou pa konekte nan entènèt. Tanpri verifye koneksyon ou epi eseye ankò.
            </p>
          </div>

          <Button
            size="lg"
            onClick={() => window.location.reload()}
            className="w-full"
          >
            Eseye Ankò
          </Button>

          <p className="text-xs text-muted-foreground">
            Kèk fonksyon ka disponib hors-liy
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
