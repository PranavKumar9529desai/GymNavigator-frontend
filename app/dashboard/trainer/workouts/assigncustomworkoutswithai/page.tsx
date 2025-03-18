import { Suspense } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClientWorkoutGenerator from './_components/client-workout-generator';
import { getUserById } from './_actions/get-user-by-id';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import type { UserData } from './_actions/get-user-by-id';

export default async function AssignCustomWorkoutsWithAI({
  searchParams
}: {
  searchParams: { userId?: string }
}) {
  const userId = searchParams.userId || 'defaultUserId';  
  const response = await getUserById(userId);
  // Fix type error by ensuring user is strictly UserData | null (not undefined)
  const user: UserData | null = response.success && response.data ? response.data : null;
  
  return (
    <div className="container px-4 sm:px-6 pb-16">
      {/* Navigation */}
      <Link 
        href="/dashboard/trainer/workouts"
        className="text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ChevronLeft className="h-4 w-4 inline mr-1" />
        Back to workouts
      </Link>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Assign AI-Generated Workouts</h1>
          <p className="text-muted-foreground">
            Create personalized workout plans with AI assistance
          </p>
        </div>

        <Tabs defaultValue="generate" className="space-y-4">
          <TabsList>
            <TabsTrigger value="generate">Generate</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="generate" className="space-y-4">
            <Suspense fallback={<div>Loading client selection...</div>}>
              <ClientWorkoutGenerator user={user} />
            </Suspense>
          </TabsContent>
          
          <TabsContent value="history">
            <Card className="p-6">
              <h3 className="text-xl font-medium">Previously Generated Workouts</h3>
              {/* Workout history UI will be implemented later */}
              <p className="text-muted-foreground">You haven't generated any workouts yet.</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
