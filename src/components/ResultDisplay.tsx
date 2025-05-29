
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Download, Copy, CheckCheck, ExternalLink, Globe, Package } from 'lucide-react';
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
  const [downloading, setDownloading] = React.useState(false);
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
  
  const handleDownloadHTML = () => {
    const blob = new Blob([html], { type: 'text/html' });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    let domain = "";
    try {
      domain = new URL(url).hostname.replace('www.', '');
    } catch {
      domain = "website";
    }
    
    a.href = downloadUrl;
    a.download = `${domain}-clone.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(downloadUrl);
    
    toast({
      title: "Downloaded!",
      description: "HTML file has been downloaded",
    });
  };

  const handleDownloadNextJS = async () => {
    setDownloading(true);
    try {
      // Convert HTML to Next.js project structure
      const nextjsProject = WebCloneService.convertToNextJS(html, url);
      
      // Create a zip file with the project structure
      const { default: JSZip } = await import('jszip');
      const zip = new JSZip();
      
      // Add all the Next.js project files
      Object.entries(nextjsProject.files).forEach(([path, content]) => {
        zip.file(path, content as string);
      });
      
      const blob = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      
      let domain = "";
      try {
        domain = new URL(url).hostname.replace('www.', '');
      } catch {
        domain = "website";
      }
      
      a.href = downloadUrl;
      a.download = `${domain}-nextjs-project.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
      
      toast({
        title: "Downloaded!",
        description: "Next.js project has been downloaded. Extract and run 'npm install' then 'npm run dev'",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create Next.js project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDownloading(false);
    }
  };

  const handlePublish = () => {
    setPublishing(true);
    try {
      const publishId = WebCloneService.publishWebsite(html, url);
      
      toast({
        title: "Website Published!",
        description: "Your cloned website is now published and ready to view",
      });
      
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
                className="ml-2 text-supabase-600 hover:text-supabase-700"
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
            className="flex-1 bg-supabase-600 hover:bg-supabase-700 text-white" 
            onClick={handleDownloadHTML}
          >
            <Download className="mr-2 h-4 w-4" />
            Download HTML
          </Button>
        </div>
        
        <div className="flex justify-between gap-4 w-full">
          <Button 
            className="flex-1 bg-gradient-to-r from-supabase-600 to-supabase-700 hover:opacity-90 transition-opacity text-white" 
            onClick={handleDownloadNextJS}
            disabled={downloading}
          >
            {downloading ? (
              <>Processing...</>
            ) : (
              <>
                <Package className="mr-2 h-4 w-4" />
                Download Next.js Project
              </>
            )}
          </Button>
          <Button 
            className="flex-1 bg-gradient-to-r from-supabase-500 to-supabase-600 hover:opacity-90 transition-opacity text-white" 
            onClick={handlePublish}
            disabled={publishing}
          >
            {publishing ? (
              <>Publishing...</>
            ) : (
              <>
                <Globe className="mr-2 h-4 w-4" />
                Publish Website
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ResultDisplay;
