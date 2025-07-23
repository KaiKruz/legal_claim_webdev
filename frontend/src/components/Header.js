import React from 'react';
import Clock from './Clock';
import { APP_CONFIG } from '../utils/constants';

const Header = () => {
  return (
    <header className="bg-white shadow-lg border-b-2 border-primary-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo and Site Name */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">⚖️</span>
            </div>
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                {APP_CONFIG.name}
              </div>
              <div className="text-xs text-gray-500 font-medium">
                {APP_CONFIG.description}
              </div>
            </div>
          </div>

          {/* Contact Info & Clock */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-700">
                📞 {APP_CONFIG.phone}
              </div>
              <div className="text-xs text-gray-500">
                Available 24/7
              </div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <Clock showDate={true} />
          </div>

          {/* Mobile Contact */}
          <div className="md:hidden">
            <Clock />
          </div>
        </div>

        {/* Mobile Contact Info */}
        <div className="md:hidden mt-3 pt-3 border-t border-gray-200 text-center">
          <div className="text-sm font-semibold text-gray-700">
            📞 {APP_CONFIG.phone} • Available 24/7
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;