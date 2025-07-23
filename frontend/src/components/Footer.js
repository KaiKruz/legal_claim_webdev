import React from 'react';
import { APP_CONFIG } from '../utils/constants';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <span className="mr-2">⚖️</span>
              {APP_CONFIG.name}
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Dedicated to helping mesothelioma victims and their families 
              get the compensation they deserve. Our experienced legal team 
              provides free consultations and works on a contingency fee basis.
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <span className="bg-green-600 px-3 py-1 rounded-full font-semibold">
                🆓 100% Free Consultation
              </span>
              <span className="bg-primary-600 px-3 py-1 rounded-full font-semibold">
                🏆 No Win, No Fee
              </span>
            </div>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">Contact Info</h4>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-center">
                <span className="mr-3 text-lg">📞</span>
                <div>
                  <div className="font-semibold text-white">{APP_CONFIG.phone}</div>
                  <div className="text-xs">Toll-free, 24/7</div>
                </div>
              </div>
              <div className="flex items-center">
                <span className="mr-3 text-lg">📧</span>
                <div>
                  <div className="font-semibold text-white">{APP_CONFIG.email}</div>
                  <div className="text-xs">Quick response guaranteed</div>
                </div>
              </div>
              <div className="flex items-center">
                <span className="mr-3 text-lg">🕒</span>
                <div>
                  <div className="font-semibold text-white">Available 24/7</div>
                  <div className="text-xs">Emergency consultations</div>
                </div>
              </div>
              <div className="flex items-center">
                <span className="mr-3 text-lg">🌍</span>
                <div>
                  <div className="font-semibold text-white">Nationwide Service</div>
                  <div className="text-xs">All 50 states covered</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Legal Notice */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">Legal Notice</h4>
            <div className="space-y-3 text-xs text-gray-400 leading-relaxed">
              <p>
                This is a legal advertisement. The information on this website 
                is for general information purposes only.
              </p>
              <p>
                Past results do not guarantee future outcomes. Attorney advertising. 
                Prior results do not guarantee a similar outcome.
              </p>
              <p>
                No attorney-client relationship is formed by submitting this form. 
                Consultation is free and confidential.
              </p>
              <div className="mt-4 pt-3 border-t border-gray-700">
                <p className="font-semibold text-gray-300">Licensed Attorneys</p>
                <p>Bar certified in multiple states</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm text-center md:text-left">
              <p>
                © {currentYear} {APP_CONFIG.name}. All rights reserved. | 
                <span className="mx-2 hover:text-white cursor-pointer transition-colors">Privacy Policy</span> | 
                <span className="mx-2 hover:text-white cursor-pointer transition-colors">Terms of Service</span> |
                <span className="mx-2 hover:text-white cursor-pointer transition-colors">Disclaimer</span>
              </p>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center">
                <span className="mr-1">🔒</span>
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center">
                <span className="mr-1">🛡️</span>
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center">
                <span className="mr-1">⚡</span>
                <span>v{APP_CONFIG.version}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
