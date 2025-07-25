import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function Loading({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
          <p className="text-gray-600">{message}</p>
        </div>
      </div>
    </div>
  );
}

export function FeedbackError({ message, onRetry, onGoBack }: { message: string; onRetry?: () => void; onGoBack?: () => void }) {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">{message}</p>
            <div className="flex gap-2 justify-center">
              {onRetry && (
                <Button onClick={onRetry} variant="outline">
                  Retry
                </Button>
              )}
              {onGoBack && <Button onClick={onGoBack}>Go Back</Button>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 