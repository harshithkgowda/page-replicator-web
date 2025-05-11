
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Globe, ArrowRight, Loader2 } from 'lucide-react';
import { WebCloneService } from '@/services/WebCloneService';

interface UrlFormProps {
  onCloneComplete: (html: string, url: string) => void;
  setLoading: (loading: boolean) => void;
}

const UrlForm = ({ onCloneComplete, setLoading }: UrlFormProps) => {
  const [url, setUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a website URL",
        variant: "destructive",
      });
      return;
    }
    
    // Add protocol if missing
    let formattedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      formattedUrl = 'https://' + url;
    }
    
    if (!isValidUrl(formattedUrl)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid website URL",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    setLoading(true);
    
    try {
      const html = await WebCloneService.cloneWebsite(formattedUrl);
      onCloneComplete(html, formattedUrl);
      toast({
        title: "Success!",
        description: "Website cloned successfully",
      });
    } catch (error) {
      console.error("Error cloning website:", error);
      toast({
        title: "Error",
        description: "Failed to clone website. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-3xl flex-col sm:flex-row gap-2">
      <div className="relative flex-grow">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Globe className="h-5 w-5 text-muted-foreground" />
        </div>
        <Input
          type="text"
          placeholder="Enter website URL (e.g., example.com)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="pl-10 h-12 bg-secondary/50"
        />
      </div>
      <Button 
        type="submit" 
        disabled={isSubmitting || !url.trim()} 
        className="h-12 px-6 bg-clone-primary hover:bg-clone-secondary transition-colors"
      >
        {isSubmitting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <ArrowRight className="mr-2 h-4 w-4" />
        )}
        Clone Website
      </Button>
    </form>
  );
};

export default UrlForm;
