'use client';
import type React from 'react';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
const VISIT_KEY = 'pwa_install_visits';
const FIRST_VISIT_KEY = 'pwa_install_first_visit';
const DISMISS_KEY = 'pwa_install_dismissed_at';
const PROMPT_DELAY_SECONDS = 30;
const MIN_VISITS = 2;
const DISMISS_DAYS = 7;

const PWAInstallPrompt: React.FC = () => {
	const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
	const [showPrompt, setShowPrompt] = useState(false);
	const [isInstalled, setIsInstalled] = useState(false);
	const timerRef = useRef<NodeJS.Timeout | null>(null);

	// Track visits and first visit timestamp
	useEffect(() => {
		if (typeof window === 'undefined') return;
		const visits =
			Number.parseInt(localStorage.getItem(VISIT_KEY) || '0', 10) + 1;
		localStorage.setItem(VISIT_KEY, visits.toString());
		if (!localStorage.getItem(FIRST_VISIT_KEY)) {
			localStorage.setItem(FIRST_VISIT_KEY, Date.now().toString());
		}
	}, []);

	// Listen for appinstalled event
	useEffect(() => {
		const onInstalled = () => {
			setIsInstalled(true);
			setShowPrompt(false);
			setDeferredPrompt(null);
		};
		window.addEventListener('appinstalled', onInstalled);
		return () => window.removeEventListener('appinstalled', onInstalled);
	}, []);

	// Logic to decide if prompt should be shown
	useEffect(() => {
		const handler = (e: Event) => {
			e.preventDefault();
			setDeferredPrompt(e);
			// Check install conditions
			if (typeof window === 'undefined') return;
			const visits = Number.parseInt(
				localStorage.getItem(VISIT_KEY) || '0',
				10,
			);
			const firstVisit = Number.parseInt(
				localStorage.getItem(FIRST_VISIT_KEY) || '0',
				10,
			);
			const dismissedAt = Number.parseInt(
				localStorage.getItem(DISMISS_KEY) || '0',
				10,
			);
			const now = Date.now();
			const dismissedRecently =
				dismissedAt && now - dismissedAt < DISMISS_DAYS * 24 * 60 * 60 * 1000;
			if (isInstalled || dismissedRecently) return;
			if (visits >= MIN_VISITS) {
				setShowPrompt(true);
			} else if (
				firstVisit &&
				now - firstVisit >= PROMPT_DELAY_SECONDS * 1000
			) {
				setShowPrompt(true);
			} else {
				// Set timer for time-based prompt
				if (timerRef.current) clearTimeout(timerRef.current);
				const delay = firstVisit
					? Math.max(0, PROMPT_DELAY_SECONDS * 1000 - (now - firstVisit))
					: PROMPT_DELAY_SECONDS * 1000;
				timerRef.current = setTimeout(() => {
					// Re-check conditions before showing
					const visitsNow = Number.parseInt(
						localStorage.getItem(VISIT_KEY) || '0',
						10,
					);
					const dismissedAtNow = Number.parseInt(
						localStorage.getItem(DISMISS_KEY) || '0',
						10,
					);
					const now2 = Date.now();
					const dismissedRecentlyNow =
						dismissedAtNow &&
						now2 - dismissedAtNow < DISMISS_DAYS * 24 * 60 * 60 * 1000;
					if (!isInstalled && !dismissedRecentlyNow && visitsNow < MIN_VISITS) {
						setShowPrompt(true);
					}
				}, delay);
			}
		};
		window.addEventListener('beforeinstallprompt', handler);
		return () => {
			window.removeEventListener('beforeinstallprompt', handler);
			if (timerRef.current) clearTimeout(timerRef.current);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isInstalled]);

	const handleInstallClick = async () => {
		if (!deferredPrompt) return;
		// @ts-ignore
		deferredPrompt.prompt();
		// @ts-ignore
		const { outcome } = await deferredPrompt.userChoice;
		if (outcome === 'accepted') {
			setShowPrompt(false);
			setDeferredPrompt(null);
		}
	};

	const handleDismiss = () => {
		setShowPrompt(false);
		setDeferredPrompt(null);
		localStorage.setItem(DISMISS_KEY, Date.now().toString());
	};

	if (!showPrompt) return null;

	return (
		<div className="fixed top-6 left-0 right-0 flex justify-center z-[1000]">
			<div className="bg-gradient-to-r from-[#2ec4f1] to-[#a259c6] rounded-2xl px-5 py-2 flex items-center gap-3 min-w-0 border-none shadow-lg animate-fade-in">
				<div className="bg-white rounded-full w-10 h-10 flex items-center justify-center">
					<Image
						src="/apple-touch-icon.png"
						alt="GymNavigator Icon"
						width={32}
						height={32}
						className="rounded-full"
					/>
				</div>
				<span className="text-white font-semibold text-base whitespace-nowrap">
					Install GymNavigator
				</span>
				<Button
					onClick={handleInstallClick}
					className="bg-white text-[#2563eb] rounded-lg px-4 py-1 font-semibold text-sm cursor-pointer ml-2 shadow"
				>
					Install
				</Button>
				<Button
					onClick={handleDismiss}
					className="bg-white text-gray-500 rounded-lg px-2 py-1 font-semibold text-sm cursor-pointer ml-1 shadow"
					aria-label="Dismiss install prompt"
				>
					✕
				</Button>
			</div>
		</div>
	);
};

export default PWAInstallPrompt;
