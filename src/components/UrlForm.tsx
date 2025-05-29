
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
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
  const [removeWatermarks, setRemoveWatermarks] = useState(true);
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
      toast({
        title: "Cloning in progress",
        description: removeWatermarks ? 
          "Cloning website and removing watermarks..." : 
          "Cloning website...",
      });
      
      let html = await WebCloneService.cloneWebsite(formattedUrl);
      
      // Remove watermarks if requested
      if (removeWatermarks && html) {
        html = WebCloneService.removeWatermarks(html);
        console.log("Watermarks removed from cloned content");
      }
      
      if (!html || html.length < 1000) {
        throw new Error("The cloned content seems incomplete. Try another website.");
      }
      
      onCloneComplete(html, formattedUrl);
      toast({
        title: "Success!",
        description: removeWatermarks ? 
          "Website cloned successfully with watermarks removed" :
          "Website cloned successfully",
      });
    } catch (error) {
      console.error("Error cloning website:", error);
      toast({
        title: "Error",
        description: "Failed to clone website. The website might be blocking our request or it's too large to clone.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl">
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
        <div className="flex w-full flex-col sm:flex-row gap-2">
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
            className="h-12 px-6 bg-supabase-600 hover:bg-supabase-700 transition-colors text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cloning...
              </>
            ) : (
              <>
                <ArrowRight className="mr-2 h-4 w-4" />
                Clone Website
              </>
            )}
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="remove-watermarks" 
            checked={removeWatermarks}
            onCheckedChange={(checked) => setRemoveWatermarks(checked as boolean)}
          />
          <label 
            htmlFor="remove-watermarks" 
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Remove watermarks and branding from cloned website
          </label>
        </div>
      </form>
    </div>
  );
};

export default UrlForm;
