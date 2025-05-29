
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Code2, Globe, Home } from 'lucide-react';

const Header = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-psk-green/20 bg-psk-dark/95 backdrop-blur supports-[backdrop-filter]:bg-psk-dark/80">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex gap-6 md:gap-10">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-psk-green rounded-lg flex items-center justify-center">
              <Globe className="h-5 w-5 text-psk-dark" />
            </div>
            <span className="font-bold text-xl text-psk-white hidden md:inline-block">
              Pip<span className="text-psk-green">Code</span>
            </span>
          </Link>
          
          <nav className="hidden md:flex gap-6">
            <Link to="/" className="flex items-center text-sm font-medium text-psk-gray-light transition-colors hover:text-psk-green">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
            <Link to="/" className="flex items-center text-sm font-medium text-psk-gray-light transition-colors hover:text-psk-green">
              <Code2 className="mr-2 h-4 w-4" />
              How It Works
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            className="border-psk-green/30 text-psk-green hover:bg-psk-green/10 hover:border-psk-green"
          >
            Documentation
          </Button>
          <Button 
            size="sm" 
            className="bg-psk-green text-psk-dark hover:bg-psk-green-dark font-semibold"
          >
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
