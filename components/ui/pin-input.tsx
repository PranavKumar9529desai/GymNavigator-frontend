'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface PinInputProps {
	length: number;
	value: string;
	onChange: (value: string) => void;
	onComplete?: (value: string) => void;
	disabled?: boolean;
	className?: string;
	inputClassName?: string;
	placeholder?: string;
	regexCriteria?: RegExp;
}

export const PinInput = React.forwardRef<HTMLDivElement, PinInputProps>(
	(
		{
			length,
			value,
			onChange,
			onComplete,
			disabled = false,
			className,
			inputClassName,
			placeholder = '○',
			regexCriteria,
		},
		ref,
	) => {
		const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);
		const [focusedIndex, setFocusedIndex] = React.useState<number>(-1);

		React.useEffect(() => {
			inputRefs.current = inputRefs.current.slice(0, length);
		}, [length]);

		const handleInputChange = (index: number, inputValue: string) => {
			if (disabled) return;

			// Handle single character input
			if (inputValue.length === 1) {
				const char = inputValue.toUpperCase();
				
				// Check regex criteria if provided
				if (regexCriteria && !regexCriteria.test(char)) {
					return;
				}

				const newValue = value.split('');
				newValue[index] = char;
				const newValueString = newValue.join('');
				
				onChange(newValueString);

				// Move to next input if available
				if (index < length - 1) {
					inputRefs.current[index + 1]?.focus();
				} else if (onComplete && newValueString.length === length) {
					onComplete(newValueString);
				}
			}
			// Handle paste or multiple characters
			else if (inputValue.length > 1) {
				const chars = inputValue.slice(0, length).toUpperCase().split('');
				
				// Filter by regex criteria if provided
				const filteredChars = regexCriteria 
					? chars.filter(char => regexCriteria.test(char))
					: chars;
				
				const newValue = filteredChars.join('').padEnd(length, '');
				onChange(newValue);

				// Focus the next empty input or the last input
				const nextIndex = Math.min(filteredChars.length, length - 1);
				inputRefs.current[nextIndex]?.focus();
			}
		};

		const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
			if (disabled) return;

			if (e.key === 'Backspace') {
				e.preventDefault();
				
				const newValue = value.split('');
				if (newValue[index]) {
					// Clear current input
					newValue[index] = '';
					onChange(newValue.join(''));
				} else if (index > 0) {
					// Move to previous input and clear it
					newValue[index - 1] = '';
					onChange(newValue.join(''));
					inputRefs.current[index - 1]?.focus();
				}
			} else if (e.key === 'ArrowLeft' && index > 0) {
				e.preventDefault();
				inputRefs.current[index - 1]?.focus();
			} else if (e.key === 'ArrowRight' && index < length - 1) {
				e.preventDefault();
				inputRefs.current[index + 1]?.focus();
			} else if (e.key === 'Home') {
				e.preventDefault();
				inputRefs.current[0]?.focus();
			} else if (e.key === 'End') {
				e.preventDefault();
				inputRefs.current[length - 1]?.focus();
			}
		};

		const handleFocus = (index: number) => {
			setFocusedIndex(index);
		};

		const handleBlur = () => {
			setFocusedIndex(-1);
		};

		const handleClick = (index: number) => {
			inputRefs.current[index]?.focus();
		};

		return (
			<div
				ref={ref}
				className={cn('flex items-center justify-center gap-1', className)}
			>
				{Array.from({ length }, (_, index) => {
					const inputRef = (el: HTMLInputElement | null) => {
						inputRefs.current[index] = el;
					};
					
					return (
						<input
							key={`pin-input-position-${index + 1}`}
							ref={inputRef}
							type="text"
							inputMode="text"
							maxLength={1}
							value={value[index] || ''}
							onChange={(e) => handleInputChange(index, e.target.value)}
							onKeyDown={(e) => handleKeyDown(index, e)}
							onFocus={() => handleFocus(index)}
							onBlur={handleBlur}
							onClick={() => handleClick(index)}
							placeholder={placeholder}
							disabled={disabled}
							className={cn(
								'w-10 h-12 text-center text-lg font-semibold border-2 rounded-lg transition-all duration-200',
								'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
								'disabled:opacity-50 disabled:cursor-not-allowed',
								value[index]
									? 'border-blue-500 bg-blue-50 text-blue-900'
									: focusedIndex === index
									? 'border-blue-500 bg-white text-gray-900'
									: 'border-gray-300 bg-white text-gray-900 hover:border-gray-400',
								inputClassName,
							)}
							style={{
								caretColor: 'transparent',
							}}
						/>
					);
				})}
			</div>
		);
	},
);

PinInput.displayName = 'PinInput'; 