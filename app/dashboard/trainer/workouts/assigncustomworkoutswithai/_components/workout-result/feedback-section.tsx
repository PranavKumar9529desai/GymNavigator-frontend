import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageSquarePlus } from 'lucide-react';
import type { WorkoutPlan } from '../../_actions/generate-ai-workout';
import { FeedbackChat } from '../feedback/feedback-chat';

interface FeedbackSectionProps {
	plan: WorkoutPlan;
	feedbackError: string | null;
	isSubmittingFeedback: boolean;
	conversationHistory: Array<{
		type: 'ai' | 'user';
		message: string;
		workout?: WorkoutPlan;
		timestamp: Date;
	}>;
	onSendFeedback: (feedback: string) => Promise<void>;
}

export default function FeedbackSection({
	plan,
	feedbackError,
	isSubmittingFeedback,
	conversationHistory,
	onSendFeedback,
}: FeedbackSectionProps) {
	return (
		<div className="rounded-xl border bg-white dark:bg-gray-950 overflow-hidden shadow-sm">
			<div className="p-5 border-b">
				<h3 className="text-lg font-semibold flex items-center gap-2">
					<MessageSquarePlus className="h-5 w-5 text-purple-500" />
					Refine Your Workout Plan
				</h3>
				<p className="text-sm text-muted-foreground mt-1">
					Not satisfied with this workout plan? Provide feedback to get a
					refined version that better suits your needs.
				</p>
			</div>

			{feedbackError && (
				<Alert variant="destructive" className="mx-5 mt-4 mb-0">
					<AlertDescription>{feedbackError}</AlertDescription>
				</Alert>
			)}

			<div className="p-5">
				<FeedbackChat
					workoutPlan={plan}
					onSendFeedback={onSendFeedback}
					isSubmitting={isSubmittingFeedback}
					conversationHistory={conversationHistory}
				/>
			</div>
		</div>
	);
}
