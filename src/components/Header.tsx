
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Code2, Globe, Home } from 'lucide-react';

const Header = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex gap-6 md:gap-10">
          <Link to="/" className="flex items-center space-x-2">
            <div className="relative">
              <Globe className="h-6 w-6 text-transparent bg-gradient-to-r from-brand-500 to-electric-500 bg-clip-text" />
              <div className="absolute inset-0 h-6 w-6 bg-gradient-to-r from-brand-500 to-electric-500 rounded-full opacity-20 blur-sm"></div>
            </div>
            <span className="font-bold text-lg hidden md:inline-block bg-gradient-to-r from-brand-600 to-electric-600 bg-clip-text text-transparent">
              PipCode
            </span>
          </Link>
          
          <nav className="hidden md:flex gap-6">
            <Link to="/" className="flex items-center text-sm font-medium text-foreground/60 transition-colors hover:text-foreground">
              <Home className="mr-1 h-4 w-4" />
              Home
            </Link>
            <Link to="/" className="flex items-center text-sm font-medium text-foreground/60 transition-colors hover:text-foreground">
              <Code2 className="mr-1 h-4 w-4" />
              How It Works
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="border-brand-200 hover:bg-brand-50">
            Documentation
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-brand-500 to-electric-500 hover:from-brand-600 hover:to-electric-600 text-white shadow-lg">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
