'use client';

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
		message: 'welcome to gymNavigator',
		time: '2 min ago',
		read: false,
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
				{unreadCount > 0 && (
					<span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs font-medium">
						{unreadCount}
					</span>
				)}
			</button>

			{showNotifications && (
				<>
					{/* Backdrop */}
					<div
						className="fixed inset-0 bg-black/20 z-10"
						onClick={() => setShowNotifications(false)}
						onKeyUp={() => setShowNotifications(false)}
					/>

					{/* Notification panel */}
					<div className="fixed md:absolute left-4 right-4 md:left-auto md:right-0 md:w-80 top-16 md:mt-2 bg-white rounded-lg shadow-lg z-20 border overflow-hidden">
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
						<div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
							{notifications.length === 0 ? (
								<div className="p-8 text-center">
									<div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
										<Bell className="h-6 w-6 text-gray-400" />
									</div>
									<p className="text-gray-500">No notifications</p>
								</div>
							) : (
								notifications.map((notification) => (
									<div
										key={notification.id}
										className={`p-3 border-b hover:bg-gray-50 cursor-pointer transition-all ${
											!notification.read ? 'bg-blue-50' : 'bg-white'
										}`}
										onKeyUp={() => markAsRead(notification.id)}
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
									</div>
								))
							)}
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default NotificationButton;
