import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import Navbar from './Navbar';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Layout = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className={cn("flex-grow pb-8", !isHome && "pt-20 md:pt-24")}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full"
        >
          <Outlet />
        </motion.div>
      </main>
      <footer className="py-12 border-t border-slate-100 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-center items-start gap-12 md:gap-24 lg:gap-32 mb-12">
            <div className="space-y-4">
              <h4 className="text-slate-900 font-semibold">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-slate-500 text-sm">
                  <Mail size={16} className="text-emerald-600" />
                  <a href="mailto:info@nexstip.com" className="hover:text-emerald-600 transition-colors">info@nexstip.com</a>
                </li>
                <li className="flex items-center gap-3 text-slate-500 text-sm">
                  <Phone size={16} className="text-emerald-600" />
                  <a href="tel:+233000000000" className="hover:text-emerald-600 transition-colors">+256 706250843</a>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-slate-900 font-semibold">Our Location</h4>
              <div className="flex items-start gap-3 text-slate-500 text-sm">
                <MapPin size={16} className="text-emerald-600 mt-1 shrink-0" />
                <p className="leading-relaxed">
                  Digital Innovation Hub,<br />
                  Kampala, Uganda
                </p>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-200 text-center text-slate-400 text-sm">
            <p>© 2026 NEXSTIP. Learn Every Digital Skill.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
