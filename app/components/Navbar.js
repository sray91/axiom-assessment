'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Assessment', href: '/assessment' }
  ];
  
  // Function to determine if a nav item is active
  const isActive = (path) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };
  
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and desktop navigation */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/">
                <Image 
                  src="/axiom-logo.png" 
                  alt="Axiom Logo" 
                  width={140} 
                  height={40} 
                  className="h-10 w-auto" 
                  priority
                />
              </Link>
            </div>
            
            {/* Desktop navigation */}
            <div className="hidden md:block ml-10">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      isActive(item.href)
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-blue-600 hover:border-b-2 hover:border-blue-300'
                    } px-3 py-5 text-sm font-medium transition-colors`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden -mr-2 flex items-center">
            <button
              type="button"
              className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {/* Menu icon */}
              {!mobileMenuOpen ? (
                <svg 
                  className="block h-6 w-6" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M4 6h16M4 12h16M4 18h16" 
                  />
                </svg>
              ) : (
                <svg 
                  className="block h-6 w-6" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, toggle based on menu state */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden border-t border-gray-200`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`${
                isActive(item.href)
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
              } block px-3 py-2 rounded-md text-base font-medium`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
} 