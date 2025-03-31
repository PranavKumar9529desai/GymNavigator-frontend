'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import { type FC, useState } from 'react';

interface Notification {
	id: string;
	message: string;
	time: string;
	read: boolean;
}

// Mock notifications for testing UI
const mockNotifications: Notification[] = [
	{
		id: '1',
		message: 'New booking request from Alex',
		time: '2 min ago',
		read: false,
	},
	{
		id: '2',
		message: 'Your schedule has been updated for tomorrow',
		time: '1 hour ago',
		read: false,
	},
	{
		id: '3',
		message: 'Payment received from client #1204',
		time: 'Yesterday',
		read: true,
	},
];

const NotificationButton: FC = () => {
	const [showNotifications, setShowNotifications] = useState(false);
	const [notifications, setNotifications] =
		useState<Notification[]>(mockNotifications);

	const unreadCount = notifications.filter((n) => !n.read).length;

	const toggleNotifications = () => {
		setShowNotifications(!showNotifications);
	};

	const markAsRead = (id: string) => {
		setNotifications(
			notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
		);
	};

	const markAllAsRead = () => {
		setNotifications(notifications.map((n) => ({ ...n, read: true })));
	};

	return (
		<div className="relative">
			<button
				type="button"
				onClick={toggleNotifications}
				className="relative p-2 rounded-full hover:bg-gray-100 transition flex items-center justify-center"
				aria-label="Notifications"
			>
				<Bell className="h-5 w-5" />
				<AnimatePresence>
					{unreadCount > 0 && (
						<motion.span
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							exit={{ scale: 0 }}
							className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs font-medium"
						>
							{unreadCount}
						</motion.span>
					)}
				</AnimatePresence>
			</button>

			<AnimatePresence>
				{showNotifications && (
					<>
						{/* Backdrop for mobile */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="fixed inset-0 bg-black/20 z-10 md:hidden"
							onClick={() => setShowNotifications(false)}
						/>

						{/* Notification panel */}
						<motion.div
							initial={{ opacity: 0, y: 10, scale: 0.95 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: 10, scale: 0.95 }}
							transition={{ type: 'spring', duration: 0.3 }}
							className="absolute right-0 mt-2 w-80 md:max-w-sm bg-white rounded-lg shadow-lg z-20 border overflow-hidden"
							style={{ maxHeight: 'calc(100vh - 180px)' }}
						>
							<div className="p-3 border-b flex justify-between items-center">
								<h3 className="font-medium">Notifications</h3>
								{unreadCount > 0 && (
									<button
										type="button"
										onClick={markAllAsRead}
										className="text-xs text-blue-600 hover:text-blue-800"
									>
										Mark all as read
									</button>
								)}
							</div>
							<div className="max-h-[70vh] md:max-h-80 overflow-y-auto">
								{notifications.length === 0 ? (
									<div className="p-8 text-center">
										<div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
											<Bell className="h-6 w-6 text-gray-400" />
										</div>
										<p className="text-gray-500">No notifications</p>
									</div>
								) : (
									notifications.map((notification) => (
										<motion.div
											key={notification.id}
											initial={{
												backgroundColor: notification.read
													? 'white'
													: '#eff6ff',
											}}
											animate={{
												backgroundColor: notification.read
													? 'white'
													: '#eff6ff',
											}}
											whileTap={{ scale: 0.98 }}
											className={
												'p-3 border-b hover:bg-gray-50 cursor-pointer transition-all'
											}
											onClick={() => markAsRead(notification.id)}
										>
											<div className="flex items-start">
												<div className="flex-1">
													<div className="text-sm">{notification.message}</div>
													<div className="text-xs text-gray-500 mt-1">
														{notification.time}
													</div>
												</div>
												{!notification.read && (
													<div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5" />
												)}
											</div>
										</motion.div>
									))
								)}
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</div>
	);
};

export default NotificationButton;
