import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-gray-800 text-white">
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {/* About Section */}
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-4">About Us</h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Chennai Flood Watch provides real-time flood monitoring and prediction
            services to help keep our community safe.
          </p>
        </div>        {/* Quick Links */}
        <div className="flex flex-col items-center">          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <div className="flex flex-col space-y-2">
              <Link to="/map" className="text-gray-400 hover:text-white text-sm">Live Map</Link>
              <Link to="/report" className="text-gray-400 hover:text-white text-sm">Report Incident</Link>
              <Link to="/resources" className="text-gray-400 hover:text-white text-sm">Resources</Link>
          </div>
        </div>        {/* Emergency Contacts */}
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-4">Emergency Contacts</h3>
          <div className="flex flex-col space-y-2">
            <span className="text-gray-400 text-sm">Emergency: 112</span>
            <span className="text-gray-400 text-sm">Flood Control: 1800-123-456</span>
            <span className="text-gray-400 text-sm">City Municipality: 044-1234567</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-8 pt-8 border-t border-gray-700">
        <p className="text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} Chennai Flood Watch. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
