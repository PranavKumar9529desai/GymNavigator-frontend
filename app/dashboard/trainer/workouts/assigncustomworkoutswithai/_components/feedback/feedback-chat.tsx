'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, MessageSquare, SendIcon } from 'lucide-react';
import { useState } from 'react';
import type { WorkoutPlan } from '../../_actions/generate-ai-workout';

interface FeedbackChatProps {
	workoutPlan: WorkoutPlan;
	onSendFeedback: (feedback: string) => Promise<void>;
	isSubmitting: boolean;
	conversationHistory: Array<{
		type: 'ai' | 'user';
		message: string;
		workout?: WorkoutPlan;
		timestamp: Date;
	}>;
}

export function FeedbackChat({
	// workoutPlan,
	onSendFeedback,
	isSubmitting,
	conversationHistory,
}: FeedbackChatProps) {
	const [feedback, setFeedback] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!feedback.trim() || isSubmitting) return;

		await onSendFeedback(feedback);
		setFeedback('');
	};

	return (
		<div className="flex flex-col space-y-4 mt-6">
			<div className="rounded-lg bg-muted/30 p-4 max-h-[400px] overflow-y-auto">
				<div className="space-y-4">
					{conversationHistory.map((entry, index) => (
						<div
							key={`chat-${index}-${entry.timestamp.getTime()}`}
							className={`flex ${entry.type === 'user' ? 'justify-end' : 'justify-start'}`}
						>
							<div
								className={`max-w-[85%] p-4 rounded-lg ${
									entry.type === 'user'
										? 'bg-primary text-primary-foreground'
										: 'bg-muted text-muted-foreground'
								}`}
							>
								{entry.type === 'user' ? (
									<div className="flex gap-2 items-start">
										<div className="whitespace-pre-wrap text-sm">
											{entry.message}
										</div>
									</div>
								) : (
									<div className="space-y-2">
										<div className="flex gap-2 items-center text-sm font-medium">
											<MessageSquare className="h-4 w-4" />
											AI Response
										</div>
										<div className="whitespace-pre-wrap text-sm">
											{entry.message}
										</div>
									</div>
								)}
								<p className="text-xs opacity-70 text-right mt-2">
									{entry.timestamp.toLocaleTimeString([], {
										hour: '2-digit',
										minute: '2-digit',
									})}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>

			<form onSubmit={handleSubmit} className="flex gap-2 items-end">
				<Textarea
					value={feedback}
					onChange={(e) => setFeedback(e.target.value)}
					placeholder="Provide feedback to refine this workout plan..."
					className="resize-none min-h-[100px]"
					disabled={isSubmitting}
				/>
				<Button
					type="submit"
					size="icon"
					className="h-10 w-10 shrink-0"
					disabled={isSubmitting || !feedback.trim()}
				>
					{isSubmitting ? (
						<Loader2 className="h-4 w-4 animate-spin" />
					) : (
						<SendIcon className="h-4 w-4" />
					)}
				</Button>
			</form>
		</div>
	);
}
