import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { BookOpen, MapPin, Briefcase, Lightbulb, Users, Home, Menu, X, Info, Calendar } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'motion/react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import Logo from './Logo';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/courses', icon: BookOpen, label: 'Courses' },
    { to: '/tips-and-tricks', icon: Lightbulb, label: 'Tips & Tricks' },
    { to: '/opportunities', icon: Briefcase, label: 'Opportunities' },
    { to: '/mentorship', icon: Users, label: 'Mentorship' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-emerald-950 border-b border-emerald-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Logo className="h-20 w-auto md:h-24" />
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors",
                    isActive ? "text-emerald-400" : "text-white hover:text-emerald-400"
                  )
                }
              >
                <Icon size={18} />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-white hover:text-emerald-400 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden bg-emerald-900 border-t border-emerald-800 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {navItems.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-4 px-4 py-3 rounded-xl text-base font-medium transition-colors",
                      isActive ? "bg-emerald-800 text-emerald-400" : "text-white hover:bg-emerald-800/50"
                    )
                  }
                >
                  <Icon size={20} />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

