'use client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, m } from 'framer-motion';
import { X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';
import { RemoveScroll } from 'react-remove-scroll';

interface SubItem {
  name: string;
  link: string;
  label: string;
  icon?: React.ElementType;
}

interface MenuItem {
  name: string;
  icon: React.ElementType;
  label: string;
  link?: string;
  subItems?: SubItem[];
}

interface BottomNavigationProps {
  menuItems: MenuItem[];
  basePath?: string;
}

export default function BottomNavigation({ menuItems, basePath = '' }: BottomNavigationProps) {
  const [activeRoute, setActiveRoute] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const isActiveRoute = (item: MenuItem) => {
    if (item.link && pathname.includes(item.link)) {
      return true;
    }
    return item.subItems?.some((sub) => pathname.includes(sub.link));
  };

  const handleNavClick = (item: MenuItem) => {
    if (item.subItems) {
      setActiveRoute(activeRoute === item.label ? null : item.label);
    } else if (item.link) {
      router.push(item.link.startsWith('/') ? item.link : `${basePath}${item.link}`);
      setActiveRoute(item.label);
    }
  };

  const renderSubRoutes = (subItems: SubItem[], title: string) => (
    <Dialog.Root open={!!activeRoute} onOpenChange={() => setActiveRoute(null)}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40">
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          />
        </Dialog.Overlay>
        <Dialog.Content asChild>
          <m.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-16 left-0 right-0 bg-white rounded-t-xl z-50"
          >
            <RemoveScroll>
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <m.h2
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 0, opacity: 0 }}
                    className="text-xl font-bold"
                  >
                    {title}
                  </m.h2>
                  <Dialog.Close asChild>
                    <Button variant="ghost" size="icon">
                      <X className="h-5 w-5" />
                    </Button>
                  </Dialog.Close>
                </div>
                <m.div
                  className="grid gap-2 max-h-[60vh] overflow-y-auto"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.05,
                      },
                    },
                    exit: {
                      opacity: 0,
                      transition: {
                        staggerChildren: 0.03,
                        staggerDirection: -1,
                      },
                    },
                  }}
                >
                  {subItems.map((subItem) => (
                    <m.div
                      key={subItem.label}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                        exit: { opacity: 0, y: -10 },
                      }}
                    >
                      <Button
                        variant="ghost"
                        className="w-full flex items-center justify-start p-4 hover:bg-gray-100 rounded-lg transition-colors"
                        onClick={() => {
                          router.push(
                            subItem.link.startsWith('/')
                              ? subItem.link
                              : `${basePath}${subItem.link}`
                          );
                          setActiveRoute(null);
                        }}
                      >
                        {subItem.icon && <subItem.icon className="h-5 w-5 mr-3 text-blue-600" />}
                        <span>{subItem.name}</span>
                      </Button>
                    </m.div>
                  ))}
                </m.div>
              </div>
            </RemoveScroll>
          </m.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );

  return (
    <>
      <AnimatePresence>
        {activeRoute &&
          menuItems.find((item) => item.label === activeRoute)?.subItems &&
          renderSubRoutes(
            menuItems.find((item) => item.label === activeRoute)?.subItems || [],
            menuItems.find((item) => item.label === activeRoute)?.name || ''
          )}
      </AnimatePresence>

      <m.nav
        initial={false}
        className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 shadow-lg"
      >
        <div className="flex justify-around items-center h-16 px-2 max-w-md mx-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item);

            return (
              <m.button
                key={item.label}
                whileTap={{ scale: 0.9 }}
                className={cn(
                  'relative flex flex-col items-center justify-center w-16 h-16',
                  'transition-colors duration-200'
                )}
                onClick={() => handleNavClick(item)}
              >
                {isActive && (
                  <m.span
                    layoutId="bubble"
                    className="absolute inset-0 bg-blue-50 rounded-full z-0"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon
                  className={cn(
                    'h-6 w-6 relative z-10 transition-colors duration-200',
                    isActive ? 'text-blue-600' : 'text-gray-600'
                  )}
                />
                <span
                  className={cn(
                    'text-xs mt-1 relative z-10 transition-colors duration-200',
                    isActive ? 'text-blue-600 font-medium' : 'text-gray-600'
                  )}
                >
                  {item.name}
                </span>
              </m.button>
            );
          })}
        </div>
      </m.nav>
    </>
  );
}
