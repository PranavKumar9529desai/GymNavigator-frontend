import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Award,
  CalendarDays,
  CheckCircle,
  Clock,
  Dumbbell,
  MessageSquarePlus,
  Pencil,
  X,
} from 'lucide-react';
import type { WorkoutPlan } from '../../_actions/generate-ai-workout';

interface WorkoutHeaderProps {
  plan: WorkoutPlan;
  setPlan: (plan: WorkoutPlan) => void;
  editMode: boolean;
  setEditMode: (edit: boolean) => void;
  showFeedbackChat: boolean;
  setShowFeedbackChat: (show: boolean) => void;
}

export default function WorkoutHeader({
  plan,
  setPlan,
  editMode,
  setEditMode,
  showFeedbackChat,
  setShowFeedbackChat,
}: WorkoutHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-white to-slate-50/80 dark:from-gray-900 dark:to-gray-950/80 p-6 shadow-sm">
      <div className="absolute top-0 right-0 h-32 w-32 opacity-5 pointer-events-none">
        <Dumbbell className="h-full w-full" strokeWidth={1} />
      </div>

      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div className="flex-1">
          {editMode ? (
            <Input
              value={plan.name}
              onChange={(e) => setPlan({ ...plan, name: e.target.value })}
              className="font-bold text-xl py-2 mb-3"
              aria-label="Workout name"
            />
          ) : (
            <h2 className="text-xl sm:text-2xl font-bold mb-1 flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80 flex-shrink-0 ">
              <Award className="size-10 text-primary -mt-6" />
              {plan.name}
            </h2>
          )}

          <div className="text-muted-foreground text-sm mt-2">
            {editMode ? (
              <Textarea
                value={plan.description || ''}
                onChange={(e) => setPlan({ ...plan, description: e.target.value })}
                className="mt-2 min-h-[80px]"
                placeholder="Add a description for this workout plan"
                aria-label="Workout description"
              />
            ) : (
              <p className="ml-8 text-base">{plan.description}</p>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {editMode ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditMode(false)}
                className="h-10 px-4 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
              >
                <X className="h-4 w-4 mr-1.5" /> Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => setEditMode(false)}
                className="h-10 px-4"
              >
                <CheckCircle className="h-4 w-4 mr-1.5" /> Done
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditMode(true)}
                className="h-10 px-4 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
              >
                <Pencil className="h-4 w-4 mr-1.5" /> Edit
              </Button>
              <Button
                variant={showFeedbackChat ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setShowFeedbackChat(!showFeedbackChat)}
                className={`h-10 px-4 ${
                  showFeedbackChat
                    ? 'bg-primary/10 text-primary border-primary/20'
                    : 'hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200'
                } transition-colors`}
              >
                <MessageSquarePlus className="h-4 w-4 mr-1.5" />
                {showFeedbackChat ? 'Hide Feedback' : 'Request Changes'}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Workout stats badges */}
      {plan.schedules.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-5">
          <Badge
            variant="secondary"
            className="flex items-center gap-1 px-3 py-1 text-sm bg-primary/10 text-primary border-primary/20"
          >
            <Dumbbell className="h-3.5 w-3.5" />
            {plan.schedules.length} workout days
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1 text-sm">
            <CalendarDays className="h-3.5 w-3.5" />
            Weekly plan
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1 text-sm">
            <Clock className="h-3.5 w-3.5" />
            {Math.round(
              plan.schedules.reduce((avg, s) => avg + s.duration, 0) / plan.schedules.length,
            )}{' '}
            min avg
          </Badge>
        </div>
      )}
    </div>
  );
}
