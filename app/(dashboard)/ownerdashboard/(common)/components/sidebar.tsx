'use client';
import IconImage from '@/app/assests/gym-manager.webp';
import { signOut } from '@/node_modules/next-auth/react';
import { ChevronDown, ChevronRight, LogOut } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Swal from 'sweetalert2';
import type { MenuItem, SubItem } from './menuItems';
import { menuItems } from './menuItems';

export default function Sidebar() {
  const [activePage, setActivePage] = useState<string>('viewGymDetails');
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  const router = useRouter();

  const handleItemClick = (item: MenuItem) => {
    if (item.subItems) {
      setOpenMenus((prev) => ({ ...prev, [item.label]: !prev[item.label] }));
      if (!openMenus[item.label]) {
        setActivePage(item.label);
      }
    } else if (item.link) {
      setActivePage(item.label);
      router.push(`/ownerdashboard${item.link}`);
    }
  };

  const handleSubItemClick = (subItem: SubItem, parentLabel: string) => {
    setActivePage(subItem.label);
    setOpenMenus((prev) => ({ ...prev, [parentLabel]: true }));
    router.push(`/ownerdashboard${subItem.link}`);
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
    <div className="flex flex-col bg-gray-900 text-white w-64 h-screen">
      <div className="px-4 w-full flex items-center justify-center">
        <Image src={IconImage} alt="Gym Manager Icon" className="rounded-full" />
      </div>

      <nav className="flex-grow px-4 py-2">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name} className="whitespace-nowrap">
              <button
                type="button"
                onClick={() => handleItemClick(item)}
                className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors duration-200 
                  ${
                    isActiveParent(item)
                      ? 'bg-blue-700 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
              >
                <item.icon className="w-6 h-6 mr-3" />
                <span>{item.name}</span>
                {item.subItems &&
                  (openMenus[item.label] ? (
                    <ChevronDown className="w-6 h-6 ml-auto" />
                  ) : (
                    <ChevronRight className="w-6 h-6 ml-auto" />
                  ))}
              </button>
              {item.subItems && openMenus[item.label] && (
                <ul className="ml-6 mt-2 space-y-2">
                  {item.subItems.map((subItem) => (
                    <li key={subItem.name}>
                      <button
                        type="button"
                        onClick={() => handleSubItemClick(subItem, item.label)}
                        className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors duration-200 
                          ${
                            activePage === subItem.label
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-300 hover:bg-gray-800'
                          }`}
                      >
                        <span>{subItem.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4">
        <button
          type="button"
          className="flex items-center w-full px-4 py-2 text-red-400 hover:bg-gray-800 rounded-lg transition-colors duration-200"
          onClick={handleLogout}
        >
          <LogOut className="w-6 h-6 mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
