import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MoreActions } from '@/components/MoreAction';
import { User as UserIcon, Dumbbell } from 'lucide-react';
import type { GymUser, GymTrainer } from './GymUsersClient';
import { useRouter } from 'next/navigation';

interface GymUserMobileCardProps {
  user: GymUser | GymTrainer;
  type: 'user' | 'trainer';
}

export function GymUserMobileCard({ user, type }: GymUserMobileCardProps) {
  const router = useRouter();
  const handleViewProfile = () => {
    router.push(`/dashboard/owner/gym/gymusers/${user.id}`);
  };
  return (
    <Card className="bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20 p-3 flex flex-col gap-2 relative">
      {/* MoreActions at top right */}
      <div className="absolute top-2 right-2 z-10">
        <MoreActions
          actions={[
            {
              id: 'view-profile',
              label: 'View Profile',
              icon: UserIcon,
              onClick: handleViewProfile,
              tooltip: `View ${user.name}'s profile`,
            },
          ]}
          label={type === 'user' ? 'User Actions' : 'Trainer Actions'}
        />
      </div>
      <CardContent className="flex items-center gap-3 p-0 pt-6">
        <Avatar className="h-10 w-10">
          {type === 'trainer' && (user as GymTrainer).image ? (
            <AvatarImage src={(user as GymTrainer).image!} alt={user.name} />
          ) : (
            <AvatarFallback
              className="bg-indigo-100/50 text-indigo-500"
            >
              {user.name
                .split(' ')
                .slice(0, 2)
                .map(n => n[0])
                .join('')
                .toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-slate-800 truncate">{user.name}</div>
          {/* <div className="text-xs text-slate-600 truncate">{user.email}</div> */}
        </div>
        {type === 'user' ? (
          <Badge variant="outline" className="text-xs px-2 py-0.5 border-blue-100 text-blue-600">
            {(user as GymUser).userStatus || 'Client'}
          </Badge>
        ) : (
          <Badge variant="outline" className="text-xs px-2 py-0.5 border-indigo-100 text-indigo-600 flex items-center gap-1">
            <Dumbbell className="h-3 w-3" />
            {(user as GymTrainer).assignedClients} Clients
          </Badge>
        )}
      </CardContent>
      <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
        <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
      </div>
    </Card>
  );
}