'use client';
import IconImage from '@/app/assests/gym-manager.webp';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { signOut } from '@/node_modules/next-auth/react';
import {
  CalendarCheck,
  ChevronDown,
  ChevronRight,
  Dumbbell,
  LogOut,
  Users, // Add Users icon import
  UtensilsCrossedIcon,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Swal from 'sweetalert2';

interface MenuItem {
  name: string;
  icon: React.ElementType;
  label: string;
  link: string;
  subItems?: { name: string; label: string; link: string }[];
}

export const menuItems: MenuItem[] = [
  {
    name: 'Assigned Users',
    label: 'assignedusers',
    icon: Users,
    link: '/trainerdashboard/assignedusers',
  },
  {
    name: 'Workouts',
    label: 'workouts',
    icon: Dumbbell,
    link: '/trainerdashboard/workouts',
    subItems: [
      {
        name: 'Create Workouts',
        label: 'createworkout',
        link: '/trainerdashboard/workouts/createworkout',
      },
      {
        name: 'Assign Workout',
        label: 'assignworkout',
        link: '/trainerdashboard/workouts/assignworkout',
      },
    ],
  },
  {
    name: 'Diet',
    label: 'diet',
    icon: UtensilsCrossedIcon,
    link: '/trainerdashboard/diet',
    subItems: [
      {
        name: 'Create Diet plan',
        label: 'createdietplan',
        link: '/trainerdashboard/diet/createdietplan',
      },
      {
        name: 'Assign Diet plan',
        label: 'assigndietplan',
        link: '/trainerdashboard/diet/assigndietplan',
      },
    ],
  },
  {
    name: 'Attendance',
    icon: CalendarCheck,
    label: 'attendance',
    link: '/trainerdashboard/attendance',
    subItems: [
      {
        name: "Today's Attendance",
        label: 'todaysattendance',
        link: '/trainerdashboard/attendance/todaysattendance',
      },
      {
        name: 'Show QR',
        label: 'showqr',
        link: '/trainerdashboard/attendance/showqr',
      },
    ],
  },
];

export default function SideBar() {
  const [activePage, setActivePage] = useState<string>('Gym Details');
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const router = useRouter();

  const handleItemClick = (item: MenuItem) => {
    if (item.subItems) {
      // Only toggle the menu if it has subitems
      setOpenMenus((prev) => ({ ...prev, [item.label]: !prev[item.label] }));
    } else {
      // If no subitems, navigate directly
      setActivePage(item.label);
      router.push(item.link);
    }
  };

  const handleSubItemClick = (
    event: React.MouseEvent,
    item: MenuItem,
    subItem: { name: string; label: string; link: string }
  ) => {
    event.stopPropagation(); // Prevent event bubbling
    setActivePage(subItem.label);
    router.push(subItem.link); // Use the full link from subItem
  };

  const isActiveParent = (item: MenuItem) => {
    if (item.subItems) {
      return (
        item.subItems.some((subItem) => subItem.label === activePage) ||
        activePage === item.label
      );
    }
    return activePage === item.label;
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
        await signOut({ redirect: false });
        await Swal.fire({
          title: 'See you soon!',
          text: 'You have been successfully logged out',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          backdrop: `
            rgba(0,0,0,0.4)
            url("/images/waving-hand.gif")
            right top
            no-repeat
          `,
        });
        router.push('/signin');
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
    <div className="flex flex-col bg-slate-900 text-white w-64 h-screen">
      <div className="px-4 w-full flex items-center justify-center ">
        <Image
          src={IconImage}
          alt="Gym Manager Icon"
          className="rounded-full "
        />
      </div>

      <ScrollArea className="flex-grow">
        <nav className="px-4 py-2">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start transition-colors duration-200 ${
                    isActiveParent(item)
                      ? '!bg-blue-700 hover:text-white hover:bg-blue-700'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                  onClick={() => handleItemClick(item)}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span>{item.name}</span>
                  {item.subItems &&
                    (openMenus[item.label] ? (
                      <ChevronDown className="w-5 h-5 ml-auto" />
                    ) : (
                      <ChevronRight className="w-5 h-5 ml-auto" />
                    ))}
                </Button>
                {item.subItems && openMenus[item.label] && (
                  <ul className="ml-6 mt-2 space-y-2">
                    {item.subItems.map((subItem) => (
                      <li key={subItem.name}>
                        <Button
                          variant="ghost"
                          className={`w-full justify-start transition-colors duration-200 ${
                            activePage === subItem.label
                              ? '!bg-blue-700 text-white hover:text-white hover:bg-blue-700'
                              : 'hover:bg-gray-800 hover:text-white'
                          }`}
                          onClick={(e) => handleSubItemClick(e, item, subItem)}
                        >
                          {subItem.name}
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </ScrollArea>

      <div className="p-4">
        <button
          className="flex items-center w-full px-4 py-2 text-red-400 hover:bg-gray-800 rounded-lg transition-colors duration-200"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
