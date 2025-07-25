'use client';
import IconImage from '@/assests/gym-manager.webp';
import { signOut } from '@/node_modules/next-auth/react';
import { ChevronDown, ChevronRight, LogOut } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Swal from 'sweetalert2';
import type { MenuItem as BaseMenuItem, SubItem } from './menuItems';
import { useLucideIcons } from './use-lucide-icons';

// Extend the MenuItem type to use iconName instead of icon
interface MenuItem extends Omit<BaseMenuItem, 'icon'> {
	iconName: string;
}

interface SidebarProps {
	menuItems: MenuItem[];
}

export default function Sidebar({ menuItems }: SidebarProps) {
	const [activePage, setActivePage] = useState<string>('viewGymDetails');
	const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
	const router = useRouter();
	// Use our optimized hook for icon loading
	const { getIconByName } = useLucideIcons();

	const handleItemClick = (item: MenuItem) => {
		if (item.subItems) {
			setOpenMenus((prev) => ({ ...prev, [item.label]: !prev[item.label] }));
			if (!openMenus[item.label]) {
				setActivePage(item.label);
			}
		} else if (item.link) {
			setActivePage(item.label);
			router.push(item.link);
		}
	};

	const handleSubItemClick = (subItem: SubItem, parentLabel: string) => {
		setActivePage(subItem.label);
		setOpenMenus((prev) => ({ ...prev, [parentLabel]: true }));
		router.push(`${subItem.link}`);
	};

	const isActiveParent = (item: MenuItem) => {
		return item.subItems
			? item.subItems.some((subItem) => subItem.label === activePage) ||
					(!openMenus[item.label] && activePage === item.label)
			: activePage === item.label;
	};

	const handleLogout = async () => {
		const result = await Swal.fire({
			title: 'Ready to leave?',
			html: `
        <div class="bg-white/90 p-6 rounded-xl border border-gray-700">
          <div class="text-center">
            <div class="text-red-400 mb-4">
              <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <p class="text-red-400 text-lg">
              You will be logged out of your account and redirected to the login page.
            </p>
          </div>
        </div>
      `,
			showCancelButton: true,
			confirmButtonText: 'Yes, Logout',
			cancelButtonText: 'Cancel',
			customClass: {
				confirmButton:
					'bg-gradient-to-r from-red-500 to-red-600 px-6 py-2 rounded-lg text-white font-medium',
				cancelButton: 'bg-gray-600 px-6 py-2 rounded-lg text-white font-medium',
				title: 'text-white text-xl font-semibold',
			},
		});

		if (result.isConfirmed) {
			try {
				await signOut({
					callbackUrl: '/signin',
					redirect: false,
				});
				localStorage.clear();
				sessionStorage.clear();
				window.location.href = '/signin';
			} catch (error) {
				Swal.fire({
					title: 'Error!',
					text: 'Logout failed',
					icon: 'error',
					color: '#fff',
				});
				console.error('Logout failed:', error);
			}
		}
	};

	return (
		<div className="flex flex-col bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white w-64 h-screen shadow-2xl border-r border-slate-700/50">
			{/* Header */}
			<div className="px-6 py-8 border-b border-slate-700/50">
				<div className="flex items-center justify-center">
					<div className="relative group">
						<div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
						<Image
							src={IconImage}
							alt="Gym Manager Icon"
							className="relative rounded-full ring-2 ring-slate-600 ring-offset-2 ring-offset-slate-900 transition-transform duration-300 group-hover:scale-105"
						/>
					</div>
				</div>
				<div className="mt-4 text-center">
					<h2 className="text-sm font-medium text-slate-300">Gym Navigator</h2>
					<div className="mt-1 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
				</div>
			</div>

			{/* Navigation */}
			<nav className="flex-grow px-4 py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
				<ul className="space-y-2">
					{menuItems.map((item) => {
						const Icon = getIconByName(item.iconName);
						return (
							<li key={item.name} className="whitespace-nowrap">
								<button
									type="button"
									onClick={() => handleItemClick(item)}
									className={`group flex items-center w-full px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden
                    ${
											isActiveParent(item)
												? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25 scale-[1.02]'
												: 'text-slate-300 hover:text-white hover:bg-slate-800/50 hover:scale-[1.01]'
										}`}
								>
									{/* Active indicator */}
									{isActiveParent(item) && (
										<div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-white to-blue-200 rounded-r-full"></div>
									)}
									
									{/* Icon with background effect */}
									<div className={`flex items-center justify-center w-8 h-8 rounded-lg mr-3 transition-all duration-300
										${isActiveParent(item) 
											? 'bg-white/20' 
											: 'bg-slate-700/50 group-hover:bg-slate-600/50'
										}`}>
										<Icon className="w-5 h-5" />
									</div>
									
									<span className="font-medium text-sm">{item.name}</span>
									
									{item.subItems && (
										<div className={`ml-auto transition-transform duration-300 ${openMenus[item.label] ? 'rotate-180' : ''}`}>
											<ChevronDown className="w-4 h-4" />
										</div>
									)}
								</button>
								
								{/* Submenu */}
								{item.subItems && openMenus[item.label] && (
									<div className="mt-2 ml-4 pl-4 border-l-2 border-slate-700/50 animate-slide-down">
										<ul className="space-y-1">
											{item.subItems.map((subItem, index) => (
												<li key={subItem.name} 
													className="opacity-0 animate-fade-in"
													style={{ 
														animation: `fadeIn 0.3s ease-out ${index * 0.05}s forwards` 
													}}>
													<button
														type="button"
														onClick={() =>
															handleSubItemClick(subItem, item.label)
														}
														className={`group flex items-center w-full px-3 py-2.5 rounded-lg transition-all duration-300 text-sm transform hover:translate-x-1
                              ${
																activePage === subItem.label
																	? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30'
																	: 'text-slate-400 hover:text-white hover:bg-slate-800/30'
															}`}
													>
														<div className={`w-2 h-2 rounded-full mr-3 transition-all duration-300
															${activePage === subItem.label 
																? 'bg-blue-400 shadow-lg shadow-blue-400/50 animate-pulse-glow' 
																: 'bg-slate-600 group-hover:bg-slate-400'
															}`}></div>
														<span className="font-medium">{subItem.name}</span>
													</button>
												</li>
											))}
										</ul>
									</div>
								)}
							</li>
						);
					})}
				</ul>
			</nav>
			
			{/* Footer */}
			<div className="p-4 border-t border-slate-700/50">
				<button
					type="button"
					className="group flex items-center w-full px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-300 border border-transparent hover:border-red-500/30"
					onClick={handleLogout}
				>
					<div className="flex items-center justify-center w-8 h-8 rounded-lg mr-3 bg-red-500/10 group-hover:bg-red-500/20 transition-all duration-300">
						<LogOut className="w-5 h-5" />
					</div>
					<span className="font-medium text-sm">Logout</span>
				</button>
			</div>
		</div>
	);
}
