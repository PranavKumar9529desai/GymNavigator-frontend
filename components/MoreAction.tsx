'use client';

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
import { MoreHorizontal, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface ActionItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  disabled?: boolean;
  tooltip?: string;
  className?: string;
}

interface ActionGroup {
  label?: string;
  items: ActionItem[];
}

interface MoreActionsProps {
  actions: ActionItem[] | ActionGroup[];
  isPending?: boolean;
  type?: 'vertical' | 'horizontal';
  triggerVariant?: 'ghost' | 'outline' | 'secondary';
  align?: 'start' | 'end';
  label?: string;
  statusBadge?: {
    text: string;
    className?: string;
  };
}

export function MoreActions({
  actions,
  isPending = false,
  type = 'horizontal',
  triggerVariant = 'ghost',
  align = 'end',
  label = 'Actions',
  statusBadge
}: MoreActionsProps) {
  const renderActionItem = (item: ActionItem) => {
    const MenuItem = (
      <DropdownMenuItem
        className={cn(
          "flex items-center gap-2 hover:bg-blue-50/50 py-2.5 my-1 focus:bg-blue-50/50 transition-colors",
          item.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
          item.className
        )}
        onClick={item.disabled ? undefined : item.onClick}
        disabled={item.disabled}
      >
        {item.icon && <item.icon className="h-4 w-4 text-slate-500" />}
        <span>{item.label}</span>
      </DropdownMenuItem>
    );

    if (item.tooltip) {
      return (
        <TooltipProvider key={item.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>{MenuItem}</div>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-slate-900 text-white text-xs">
              {item.tooltip}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return <div key={item.id}>{MenuItem}</div>;
  };

  const renderActions = () => {
    // Check if actions is a flat array of ActionItems
    if (actions.length > 0 && 'id' in actions[0]) {
      return (actions as ActionItem[]).map(renderActionItem);
    }

    // Handle grouped actions
    return (actions as ActionGroup[]).map((group, groupIndex) => (
      <div key={groupIndex}>
        {group.label && (
          <DropdownMenuLabel className="text-xs font-medium text-slate-600">
            {group.label}
          </DropdownMenuLabel>
        )}
        {group.items.map(renderActionItem)}
        {groupIndex < actions.length - 1 && (
          <Separator className="my-1 bg-slate-100" />
        )}
      </div>
    ));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={triggerVariant}
          className={cn(
            "h-8 w-8 p-0 hover:bg-blue-50/50 hover:text-slate-900 transition-colors",
            isPending && "opacity-50 cursor-not-allowed"
          )}
          disabled={isPending}
        >
          <span className="sr-only">Open menu</span>
          {type === "vertical" ? (
            <MoreVertical className="h-4 w-4" />
          ) : (
            <MoreHorizontal className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        className="w-56 bg-white text-slate-800 shadow-md rounded-md border border-slate-100 z-20 animate-in fade-in-50 zoom-in-95 duration-100"
      >
        {(label || statusBadge) && (
          <DropdownMenuLabel className="text-xs font-medium">
            <div className="flex flex-col">
              <span className="text-slate-700">{label}</span>
              {statusBadge && (
                <span className={cn(
                  "text-[10px] mt-1 font-semibold uppercase tracking-wider",
                  statusBadge.className
                )}>
                  {statusBadge.text}
                </span>
              )}
            </div>
          </DropdownMenuLabel>
        )}
        {renderActions()}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
