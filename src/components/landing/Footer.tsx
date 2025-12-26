import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 pt-20 pb-10 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                P
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                ProCoach
              </span>
            </Link>
            <p className="text-slate-600 dark:text-slate-400 max-w-sm mb-6">
              The only platform that bridges the gap between clinical sports science and practical coaching application.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Features</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Pricing</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Methodology</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Case Studies</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">About</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Blog</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Careers</a></li>
              <li><Link to="/login" className="hover:text-blue-600 dark:hover:text-blue-400">Login</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} ProCoach. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-900 dark:hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
