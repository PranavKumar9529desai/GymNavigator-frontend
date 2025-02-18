'use client';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

// biome-ignore lint/correctness/noEmptyPattern: <explanation>
export default function CreateTokenButton({}: {
  existingToken: string | null;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    try {
      setIsLoading(true);
      window.location.reload();
    } catch (error) {
      console.error('Failed to create token:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleClick} disabled={isLoading}>
      {isLoading ? 'Creating...' : 'Generate Token'}
    </Button>
  );
}
