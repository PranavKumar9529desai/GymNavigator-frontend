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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CalendarClock, MoreHorizontal, MoreVertical, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UserType } from './OnboardedUsers';
import { Separator } from '@/components/ui/separator';

interface UserActionsProps {
  user: UserType;
  isPending: boolean;
  type?: 'vertical' | 'horizontal';
  onActivate: (userId: number) => void;
  triggerVariant?: 'ghost' | 'outline' | 'secondary';
  align?: 'start' | 'end';
}

export function UserActions({
  user,
  type,
  isPending,
  onActivate,
  triggerVariant = 'ghost',
  align = 'end'
}: UserActionsProps) {
  const router = useRouter();

  const handleEditActivePeriod = () => {
    const params = new URLSearchParams({
      userid: user.id.toString(),
      username: user.name,
      startdate: user.startDate ? user.startDate.toISOString() : '',
      enddate: user.endDate ? user.endDate.toISOString() : '',
    });
    router.push(`/dashboard/owner/onboarding/editactiveperiod?${params.toString()}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={triggerVariant}
          className={cn(
            "h-8 w-8 p-0 hover:bg-gray-100 hover:text-gray-900 transition-colors",
            isPending && "opacity-50 cursor-not-allowed"
          )}
          disabled={isPending}
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
        className="w-56 bg-white text-gray-800 shadow-md rounded-md border border-gray-100 z-20 animate-in fade-in-50 zoom-in-95 duration-100"
      >
        <DropdownMenuLabel className="text-xs font-medium">
          <div className="flex flex-col">
            <span className="text-gray-700">User Actions</span>
            <span className={cn(
              "text-[10px] mt-1 font-semibold uppercase tracking-wider",
              user.status === 'active' ? "text-green-600" :
                user.status === 'pending' ? "text-amber-600" : "text-red-600"
            )}>
              {user.status.toUpperCase()}
            </span>
          </div>
        </DropdownMenuLabel>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <DropdownMenuItem
                  className="flex items-center gap-2 hover:bg-gray-50 py-2.5 my-1 focus:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    router.push(`/dashboard/owner/gym/gymusers/${user.id}`);
                  }}
                >
                  <User className="h-4 w-4 text-gray-500" />
                  <span>View Profile</span>
                </DropdownMenuItem>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-gray-900 text-white text-xs">
              View user's complete profile
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Separator className="my-1 bg-gray-100" />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <DropdownMenuItem
                  className={cn(
                    "flex items-center gap-2 hover:bg-gray-50 py-2.5 my-1 focus:bg-gray-50",
                    (isPending || user.status === 'active') ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                  )}
                  onClick={handleEditActivePeriod}
                  disabled={isPending || user.status === 'active'}
                >
                  <CalendarClock className="h-4 w-4 text-gray-500" />
                  <span>Edit Active Period</span>
                </DropdownMenuItem>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-gray-900 text-white text-xs">
              {user.status === 'active'
                ? "Cannot edit active period for active users"
                : isPending
                  ? "Action in progress"
                  : "Edit user's membership period"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
