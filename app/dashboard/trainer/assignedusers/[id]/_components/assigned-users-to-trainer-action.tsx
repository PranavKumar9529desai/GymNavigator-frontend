'use client';

import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, MoreVertical, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AssignedUser } from '../../_actiions/GetuserassignedTotrainers';

interface UserActionsProps {
  user: AssignedUser;
  type?: 'vertical' | 'horizontal';
  triggerVariant?: 'ghost' | 'outline' | 'secondary';
  align?: 'start' | 'end';
}

export function AssignedUserToTrainersAction({
  user,
  type,
  triggerVariant = 'ghost',
  align = 'end'
}: UserActionsProps) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={triggerVariant}
          className="h-8 w-8 p-0 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <span className="sr-only">Open menu</span>
          {
            type === "vertical" ?
              <MoreVertical className="h-4 w-4" />
              : <MoreHorizontal className="h-4 w-4" />
          }
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        className="w-48 bg-white text-gray-800 shadow-md rounded-md border border-gray-100 z-20"
      >
        <DropdownMenuLabel className="text-xs font-medium">
          <div className="flex flex-col">
            <span className="text-gray-700">User Actions</span>
            <span className={cn(
              "text-[10px] mt-1 font-semibold uppercase tracking-wider",
              user.membershipStatus === 'active' ? "text-green-600" : "text-red-600"
            )}>
              {user.membershipStatus.toUpperCase()}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuItem
          className="flex items-center gap-2 hover:bg-gray-50 py-2.5 focus:bg-gray-50 cursor-pointer"
          onClick={() => {
            router.push(`/dashboard/trainer/assignedusers/${user.id}`);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              router.push(`/dashboard/trainer/assignedusers/${user.id}`);
            }
          }}
        >
          <User className="h-4 w-4 text-gray-500" />
          <span>View Profile</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
