
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, MailIcon } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-psk-green/20 bg-psk-dark-secondary">
      <div className="container flex flex-col md:flex-row items-center justify-between py-10 md:h-24 md:py-0">
        <div className="flex flex-col items-center md:items-start">
          <p className="text-sm text-psk-gray-light">
            &copy; {new Date().getFullYear()} <span className="text-psk-green font-semibold">PipCode</span>. All rights reserved.
          </p>
        </div>
        
        <div className="flex items-center gap-6 mt-4 md:mt-0">
          <Link to="/" className="text-sm text-psk-gray-light hover:text-psk-green transition-colors">
            Terms
          </Link>
          <Link to="/" className="text-sm text-psk-gray-light hover:text-psk-green transition-colors">
            Privacy
          </Link>
          <div className="flex items-center gap-4">
            <a href="#" className="text-psk-gray-light hover:text-psk-green transition-colors">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-psk-gray-light hover:text-psk-green transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-psk-gray-light hover:text-psk-green transition-colors">
              <MailIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
