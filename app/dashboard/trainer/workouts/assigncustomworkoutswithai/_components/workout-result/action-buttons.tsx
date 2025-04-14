import { Button } from '@/components/ui/button';
import { Loader2, MessageSquareDiff, Save, Send, Trash2 } from 'lucide-react';

interface ActionButtonsProps {
	onSave: () => void;
	onDiscard: () => void;
	onAssign: () => void;
	isSaving: boolean;
	isAssigning: boolean;
	savedWorkoutPlanId: number | null; // Changed from isSaved: boolean
	showFeedbackChat: boolean;
	toggleFeedback: () => void;
}

export default function ActionButtons({
	onSave,
	onDiscard,
	onAssign,
	isSaving,
	isAssigning,
	savedWorkoutPlanId, // Use the ID
	showFeedbackChat,
	toggleFeedback,
}: ActionButtonsProps) {
	const isLoading = isSaving || isAssigning; // Combined loading state
	const needsSaving = savedWorkoutPlanId === null; // True if the plan needs to be saved

	return (
		<div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-3 pt-6 border-t">
			<div className="flex gap-2 w-full sm:w-auto">
				<Button
					variant="outline"
					size="sm"
					onClick={onDiscard}
					disabled={isLoading}
					className="flex-1 sm:flex-none h-10 px-4 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
				>
					<Trash2 className="h-4 w-4 mr-1.5" /> Discard
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={toggleFeedback}
					disabled={isLoading}
					className={`flex-1 sm:flex-none h-10 px-4 ${
						showFeedbackChat
							? 'bg-purple-50 text-purple-600 border-purple-200'
							: 'hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200'
					} transition-colors`}
				>
					<MessageSquareDiff className="h-4 w-4 mr-1.5" />
					{showFeedbackChat ? 'Hide Feedback' : 'Refine'}
				</Button>
			</div>
			<div className="flex gap-2 w-full sm:w-auto">
				<Button
					variant="secondary"
					size="sm"
					onClick={onSave}
					 // Only disable if currently saving - removed the !needsSaving condition
					disabled={isSaving}
					className="flex-1 sm:flex-none h-10 px-5"
				>
					{isSaving ? (
						<Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
					) : (
						<Save className="h-4 w-4 mr-1.5" />
					)}
					{/* Text reflects saving state and whether it needs saving */}
					{isSaving ? 'Saving...' : needsSaving ? 'Save Plan' : 'Saved'}
				</Button>
				<Button
					variant="default"
					size="sm"
					onClick={onAssign}
					 // Only disable during loading operations
					disabled={isLoading}
					className="flex-1 sm:flex-none h-10 px-5 bg-gradient-to-br from-indigo-600/90 via-blue-600/80 to-indigo-700/90 text-white hover:opacity-90 shadow-md disabled:opacity-50"
				>
					{isAssigning ? (
						<Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
					) : (
						<Send className="h-4 w-4 mr-1.5" />
					)}
					{isAssigning ? 'Assigning...' : 'Assign Workout'}
				</Button>
			</div>
		</div>
	);
}
