
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Download, Copy, CheckCheck, ExternalLink, Globe } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { WebCloneService } from '@/services/WebCloneService';
import { useNavigate } from 'react-router-dom';

interface ResultDisplayProps {
  html: string | null;
  url: string | null;
}

const ResultDisplay = ({ html, url }: ResultDisplayProps) => {
  const [copied, setCopied] = React.useState(false);
  const [publishing, setPublishing] = React.useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  if (!html || !url) return null;
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(html);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "HTML code copied to clipboard",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleDownload = () => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    // Extract domain for filename
    let domain = "";
    try {
      domain = new URL(url).hostname.replace('www.', '');
    } catch {
      domain = "website";
    }
    
    a.href = url;
    a.download = `${domain}-clone.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "HTML file has been downloaded",
    });
  };

  const handlePublish = () => {
    setPublishing(true);
    try {
      // Publish the website and get the unique ID
      const publishId = WebCloneService.publishWebsite(html, url);
      
      toast({
        title: "Website Published!",
        description: "Your cloned website is now published and ready to view",
      });
      
      // Navigate to the published site
      navigate(`/view/${publishId}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish website. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPublishing(false);
    }
  };

  return (
    <Card className="w-full mt-8 bg-secondary/20">
      <CardContent className="pt-6">
        <h3 className="text-xl font-semibold mb-4">Clone Results</h3>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Source URL:</p>
            <p className="text-sm flex items-center">
              <span className="truncate">{url}</span>
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="ml-2 text-clone-accent hover:text-clone-primary"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">HTML Size:</p>
            <p className="text-sm">
              {(html.length / 1024).toFixed(2)} KB ({html.length.toLocaleString()} characters)
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 pt-2 pb-6">
        <div className="flex justify-between gap-4 w-full">
          <Button 
            variant="outline" 
            className="flex-1" 
            onClick={handleCopyCode}
          >
            {copied ? (
              <>
                <CheckCheck className="mr-2 h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy Code
              </>
            )}
          </Button>
          <Button 
            className="flex-1 bg-clone-primary hover:bg-clone-secondary" 
            onClick={handleDownload}
          >
            <Download className="mr-2 h-4 w-4" />
            Download HTML
          </Button>
        </div>
        <Button 
          className="w-full bg-gradient-to-r from-clone-primary to-clone-accent hover:opacity-90 transition-opacity" 
          onClick={handlePublish}
          disabled={publishing}
        >
          {publishing ? (
            <>Processing...</>
          ) : (
            <>
              <Globe className="mr-2 h-4 w-4" />
              Publish Cloned Website
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResultDisplay;
