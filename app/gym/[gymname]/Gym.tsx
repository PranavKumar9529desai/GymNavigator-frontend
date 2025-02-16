'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
// change
interface GymProps {
  gymData: {
    name: string;
    id: string;
    img: string;
    address: string;
  };
}

export default function Gym({ gymData }: GymProps) {
  return (
    <div className="container mx-auto p-6">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-6">
            <div className="relative h-24 w-24 rounded-full overflow-hidden">
              <Image src={gymData.img} alt={gymData.name} fill className="object-cover" />
            </div>
            <div>
              <CardTitle className="text-3xl">{gymData.name}</CardTitle>
              <CardDescription className="text-lg mt-2">ID: {gymData.id}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mt-4">
            <h3 className="text-xl font-semibold mb-2">Location</h3>
            <p className="text-gray-600">{gymData.address}</p>
          </div>
          {/* Add more sections for additional gym information */}
        </CardContent>
      </Card>
    </div>
  );
}
