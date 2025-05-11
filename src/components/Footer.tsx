
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, MailIcon } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container flex flex-col md:flex-row items-center justify-between py-10 md:h-24 md:py-0">
        <div className="flex flex-col items-center md:items-start">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} WebsiteCloner. All rights reserved.
          </p>
        </div>
        
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Terms
          </Link>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Privacy
          </Link>
          <div className="flex items-center gap-2">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <MailIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
