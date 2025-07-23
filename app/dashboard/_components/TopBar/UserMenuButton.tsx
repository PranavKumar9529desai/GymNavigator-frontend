'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, LogOut, Settings, User, UserCircle } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { type FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Rolestype, GymInfo } from '@/types/next-auth';
import UserAvatarImage from '../../_assests/user-avtar.jpg';
interface MenuItem {
	label: string;
	icon: React.ReactNode;
	onClick: () => void;
	description?: string;
}

interface UserSession {
	user: {
		name: string;
		email: string;
		id: string;
	};
	role: Rolestype;
	gym?: GymInfo;
}

interface UserMenuButtonProps {
	userRole?: Rolestype;
	sessionData?: UserSession;
}

const UserMenuButton = ({
	userRole: _userRole,
	sessionData,
}: UserMenuButtonProps) => {
	const [showMenu, setShowMenu] = useState(false);
	const Router = useRouter();

	const toggleMenu = () => {
		setShowMenu(!showMenu);
	};

	const handleSignOut = () => {
		signOut({ callbackUrl: '/signin' });
	};

	const menuItems: MenuItem[] = [
		{
			label: 'Profile',
			description: 'View and edit your details',
			icon: <User className="h-4 w-4" />,
			onClick: () => Router.push(`/profile/${_userRole}`),
		},
		{
			label: 'Settings',
			description: 'App preferences and configuration',
			icon: <Settings className="h-4 w-4" />,
			onClick: () => Router.push('/settings'),
		},
		{
			label: 'Sign Out',
			icon: <LogOut className="h-4 w-4" />,
			onClick: handleSignOut,
		},
	];

	return (
		<div className="relative">
			<button
				type="button" // Add explicit type
				onClick={toggleMenu}
				className="flex items-center justify-center rounded-full overflow-hidden hover:ring-2 hover:ring-gray-200 transition h-8 w-8"
				aria-label="User menu"
			>
				<div className="relative h-full w-full">
					<Image
						src={UserAvatarImage} // Use the imported user avatar image
						alt="User avatar"
						fill
						sizes="32px"
						className="object-cover rounded-full"
					/>
				</div>
			</button>

			<AnimatePresence>
				{showMenu && (
					<>
						{/* Backdrop for mobile */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="fixed inset-0 bg-black/20 z-10 md:hidden"
							onClick={() => setShowMenu(false)}
						/>

						{/* Menu panel */}
						<motion.div
							initial={{ opacity: 0, y: 10, scale: 0.95 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: 10, scale: 0.95 }}
							transition={{ type: 'spring', duration: 0.3 }}
							className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-lg z-20 border overflow-hidden"
						>
							<div className="p-4 border-b bg-gray-50">
								<div className="flex items-center space-x-3">
									<div className="h-10 w-10 rounded-full overflow-hidden relative">
										<Image
											src="/apple-touch-icon.png"
											alt="User avatar"
											fill
											sizes="40px"
											className="object-cover"
										/>
									</div>
									<div className="flex-1">
										<h3 className="font-medium text-sm">
											{sessionData?.user?.name || 'Guest User'}
										</h3>
										{/* <p className="text-xs text-gray-500">
											{sessionData?.user?.email || 'No email available'}
										</p> */}
										{/* {sessionData?.gym && (
											<p className="text-xs text-blue-600 font-medium mt-0.5">
												{sessionData.gym.gym_name}
											</p>
										)} */}
										{sessionData?.role && (
											<div className="flex items-center ">
												<span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1" />
												<span className="text-xs text-gray-600 capitalize">
													{sessionData.role}
												</span>
											</div>
										)}
									</div>
								</div>
							</div>

							<div className="py-1">
								{menuItems.map((item) => (
									<motion.button
										key={`user-menu-${item.label}`} // Use a more unique key instead of index
										whileHover={{ backgroundColor: 'rgba(0,0,0,0.03)' }}
										whileTap={{ scale: 0.98 }}
										className="w-full text-left px-4 py-2.5 flex items-start gap-3"
										onClick={() => {
											item.onClick();
											setShowMenu(false);
										}}
									>
										<div
											className={`mt-0.5 p-1.5 rounded-full ${
												item.label === 'Sign Out' ? 'bg-red-100' : 'bg-blue-50'
											}`}
										>
											{item.icon}
										</div>
										<div className="flex-1">
											<div
												className={`text-sm ${
													item.label === 'Sign Out'
														? 'text-red-600'
														: 'text-gray-700'
												}`}
											>
												{item.label}
											</div>
											{item.description && (
												<p className="text-xs text-gray-500 mt-0.5">
													{item.description}
												</p>
											)}
										</div>
										<ChevronRight className="h-4 w-4 text-gray-400 mt-1" />
									</motion.button>
								))}
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</div>
	);
};

export default UserMenuButton;
