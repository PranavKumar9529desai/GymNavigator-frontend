'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Clipboard, User2 } from 'lucide-react';
import type { UserData } from '../../_actions/get-user-by-id';

interface UserProfileCardProps {
  user: UserData | null;
}

export default function UserProfileCard({ user }: UserProfileCardProps) {
  if (!user) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">User Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <User2 className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>User information not available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { name, email, healthProfile } = user;

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">User Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-1.5">
          <h3 className="text-xl font-semibold">{name}</h3>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            <span>Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</span>
          </div>
        </div>

        {healthProfile && (
          <>
            <div className="pt-3 border-t">
              <h4 className="text-sm font-medium mb-2">Health Profile</h4>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                {healthProfile.age && (
                  <ProfileDetail label="Age" value={`${healthProfile.age} years`} />
                )}
                {healthProfile.gender && (
                  <ProfileDetail label="Gender" value={healthProfile.gender} />
                )}
                {healthProfile.height && (
                  <ProfileDetail label="Height" value={`${healthProfile.height} cm`} />
                )}
                {healthProfile.weight && (
                  <ProfileDetail label="Weight" value={`${healthProfile.weight} kg`} />
                )}
                {healthProfile.fitnessLevel && (
                  <ProfileDetail
                    label="Fitness Level"
                    value={healthProfile.fitnessLevel}
                    span={2}
                  />
                )}
              </dl>
            </div>

            {healthProfile.goals && healthProfile.goals.length > 0 && (
              <div className="pt-3 border-t">
                <h4 className="text-sm font-medium mb-2">Fitness Goals</h4>
                <div className="flex flex-wrap gap-1.5">
                  {healthProfile.goals.map((goal) => (
                    <Badge key={goal} variant="outline" className="bg-blue-50">
                      {goal}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {healthProfile.dietPreferences && healthProfile.dietPreferences.length > 0 && (
              <div className="pt-3 border-t">
                <h4 className="text-sm font-medium mb-2">Diet Preferences</h4>
                <div className="flex flex-wrap gap-1.5">
                  {healthProfile.dietPreferences.map((pref) => (
                    <Badge
                      key={pref}
                      variant="outline"
                      className="bg-green-50 border-green-200 text-green-700"
                    >
                      {pref}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {healthProfile.allergies && healthProfile.allergies.length > 0 && (
              <div className="pt-3 border-t">
                <h4 className="text-sm font-medium mb-2">Allergies</h4>
                <div className="flex flex-wrap gap-1.5">
                  {healthProfile.allergies.map((allergy) => (
                    <Badge
                      key={allergy}
                      variant="outline"
                      className="bg-red-50 border-red-200 text-red-700"
                    >
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {healthProfile.medicalConditions && healthProfile.medicalConditions.length > 0 && (
              <div className="pt-3 border-t">
                <h4 className="text-sm font-medium mb-2">Medical Conditions</h4>
                <div className="flex flex-wrap gap-1.5">
                  {healthProfile.medicalConditions.map((condition) => (
                    <Badge
                      key={condition}
                      variant="outline"
                      className="bg-amber-50 border-amber-200 text-amber-700"
                    >
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

function ProfileDetail({
  label,
  value,
  span = 1,
}: {
  label: string;
  value: string;
  span?: number;
}) {
  return (
    <div className={`col-span-${span}`}>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium">{value}</dd>
    </div>
  );
}
