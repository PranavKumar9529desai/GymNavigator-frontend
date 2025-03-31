import { Button } from '@/components/ui/button';
import { MessageSquare, Save, UserCheck } from 'lucide-react';

interface ActionButtonsProps {
	onSave: () => void;
	onDiscard: () => void;
	onAssign?: () => void;
	isLoading: boolean;
	isAssigning?: boolean;
	showFeedbackChat?: boolean;
	toggleFeedback?: () => void;
}

export default function ActionButtons({
	onSave,
	onDiscard,
	onAssign,
	isLoading,
	isAssigning = false,
	showFeedbackChat = false,
	toggleFeedback,
}: ActionButtonsProps) {
	return (
		<div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8 pt-5 border-t">
			<Button
				variant="outline"
				onClick={onDiscard}
				className="h-12 sm:h-11 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
			>
				Discard Plan
			</Button>

			{toggleFeedback && (
				<Button
					variant="outline"
					onClick={toggleFeedback}
					className={`h-12 sm:h-11 ${
						showFeedbackChat
							? 'bg-indigo-50 text-indigo-700 border-indigo-200'
							: 'hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200'
					} transition-colors`}
				>
					<MessageSquare className="h-4 w-4 mr-2" />
					{showFeedbackChat ? 'Hide Feedback' : 'Provide Feedback'}
				</Button>
			)}

			{onAssign && (
				<Button
					onClick={onAssign}
					disabled={isAssigning}
					className="h-12 sm:h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm"
				>
					{isAssigning ? (
						<>
							<div className="animate-spin h-4 w-4 border-2 border-background border-t-transparent rounded-full mr-2" />
							Assigning...
						</>
					) : (
						<>
							<UserCheck className="h-4 w-4 mr-2" /> Assign Workout
						</>
					)}
				</Button>
			)}

			<Button
				onClick={onSave}
				disabled={isLoading}
				className="h-12 sm:h-11 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-sm"
			>
				{isLoading ? (
					<>
						<div className="animate-spin h-4 w-4 border-2 border-background border-t-transparent rounded-full mr-2" />
						Saving...
					</>
				) : (
					<>
						<Save className="h-4 w-4 mr-2" /> Save Workout Plan
					</>
				)}
			</Button>
		</div>
	);
}
