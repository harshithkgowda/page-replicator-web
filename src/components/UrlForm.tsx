
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { Globe, ArrowRight, Loader2, Sparkles } from 'lucide-react';
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
        title: "🚀 Cloning in progress",
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
        title: "✨ Success!",
        description: removeWatermarks ? 
          "Website cloned successfully with watermarks removed" :
          "Website cloned successfully",
      });
    } catch (error) {
      console.error("Error cloning website:", error);
      toast({
        title: "❌ Error",
        description: "Failed to clone website. The website might be blocking our request or it's too large to clone.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl">
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-6">
        <div className="flex w-full flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Globe className="h-5 w-5 text-psk-green" />
            </div>
            <Input
              type="text"
              placeholder="Enter website URL (e.g., example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="pl-12 h-14 bg-psk-dark-secondary/50 border-psk-green/30 text-psk-white placeholder:text-psk-gray focus:border-psk-green text-lg glow-border"
            />
          </div>
          <Button 
            type="submit" 
            disabled={isSubmitting || !url.trim()} 
            className="h-14 px-8 bg-psk-green text-psk-dark hover:bg-psk-green-dark transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                Cloning...
              </>
            ) : (
              <>
                <ArrowRight className="mr-3 h-5 w-5" />
                Clone Website
              </>
            )}
          </Button>
        </div>
        
        <div className="flex items-center space-x-3 bg-psk-dark-secondary/30 p-4 rounded-lg border border-psk-green/20">
          <Checkbox 
            id="remove-watermarks" 
            checked={removeWatermarks}
            onCheckedChange={(checked) => setRemoveWatermarks(checked as boolean)}
            className="border-psk-green/50 data-[state=checked]:bg-psk-green data-[state=checked]:border-psk-green"
          />
          <label 
            htmlFor="remove-watermarks" 
            className="text-sm font-medium leading-none text-psk-white cursor-pointer flex items-center"
          >
            <Sparkles className="mr-2 h-4 w-4 text-psk-green" />
            Remove watermarks and branding from cloned website
          </label>
        </div>
      </form>
    </div>
  );
};

export default UrlForm;
