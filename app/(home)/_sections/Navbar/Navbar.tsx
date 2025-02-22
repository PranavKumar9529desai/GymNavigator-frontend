'use client';
import { useSession } from '@/node_modules/next-auth/react';
import { AnimatePresence, m } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BiChevronDown } from 'react-icons/bi';
import { HiMenu, HiX } from 'react-icons/hi';
import CustomButton from '../../_component/CustomButton';

// Add type definition
type MenuItem = {
  label: string;
  href: string;
  dropdownItems?: Array<{
    label: string;
    href: string;
  }>;
};

const Navbar = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems: MenuItem[] = [
    {
      label: 'Contact Us',
      href: '/contact',
    },
    {
      label: 'About',
      href: '/about',
    },
    {
      label: 'Pricing',
      href: '/pricing',
    },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-gradient-to-r from-gray-900 to-blue-900/95 shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-8 sm:px-12 lg:px-16">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 hover:scale-105 transition-transform">
              <Image
                src="/favicon.ico"
                alt="Logo"
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="font-bold text-xl bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                GymNavigator
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-4">
              {menuItems.map((item) => (
                <div
                  key={item.label}
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className="flex items-center text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    {item.label}
                    {item.dropdownItems && <BiChevronDown className="ml-1 h-4 w-4" />}
                  </Link>

                  {item.dropdownItems && activeDropdown === item.label && (
                    <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
                      <div className="py-1">
                        {item.dropdownItems.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.label}
                            href={dropdownItem.href}
                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                          >
                            {dropdownItem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <CustomButton text={session ? 'Dashboard' : 'Login'} />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white focus:outline-none"
            >
              {isOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-md md:hidden"
              onClick={() => setIsOpen(false)}
            />
            <m.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{
                type: 'spring',
                damping: 30,
                stiffness: 300,
                duration: 0.3,
              }}
              className="fixed right-0 top-0 bottom-0 w-[80%] max-w-sm bg-gradient-to-b from-gray-900 to-gray-800 md:hidden shadow-2xl border-l border-gray-700/50"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-5 border-b border-gray-700/50">
                  <span className="text-lg font-semibold text-white bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                    Menu
                  </span>
                  <m.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-800/80 transition-colors"
                  >
                    <HiX className="h-6 w-6 text-gray-400" />
                  </m.button>
                </div>

                <div className="flex-1 overflow-y-auto py-4 space-y-1">
                  {menuItems.map((item, index) => (
                    <m.div
                      key={item.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        className="flex items-center space-x-2 text-gray-300 hover:bg-blue-500/10 hover:text-blue-400 px-5 py-3 transition-all rounded-lg mx-2"
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="text-base font-medium">{item.label}</span>
                        {item.dropdownItems && <BiChevronDown className="h-5 w-5" />}
                      </Link>
                      {item.dropdownItems && (
                        <div className="pl-4 bg-gray-800/30 rounded-lg mx-2 my-1">
                          {item.dropdownItems.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.label}
                              href={dropdownItem.href}
                              className="block text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 px-4 py-2.5 text-sm rounded-lg transition-colors"
                              onClick={() => setIsOpen(false)}
                            >
                              {dropdownItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </m.div>
                  ))}
                </div>

                <m.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-5 border-t border-gray-700/50"
                >
                  <CustomButton
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    text={session ? 'Dashboard' : 'Login'}
                  />
                </m.div>
              </div>
            </m.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
