
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WebCloneService } from '@/services/WebCloneService';
import { ArrowLeft, ExternalLink, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const ViewPublished = () => {
  const { id } = useParams<{ id: string }>();
  const [site, setSite] = useState<ReturnType<typeof WebCloneService.getPublishedSite>>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (id) {
      const publishedSite = WebCloneService.getPublishedSite(id);
      setSite(publishedSite);
      setLoading(false);
    }
  }, [id]);
  
  // If site not found
  if (!loading && !site) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <Alert className="max-w-md mb-6 bg-destructive/10 border-destructive">
          <AlertDescription>
            The published website you're looking for could not be found. It may have been removed or the link is incorrect.
          </AlertDescription>
        </Alert>
        
        <Link to="/">
          <Button variant="default">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }
  
  // Create a data URL for the HTML content
  const createDataUrl = (html: string) => {
    return `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with info and back button */}
      <header className="bg-secondary/50 border-b border-border/40 p-4">
        <div className="container max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold">
                {site?.title || "Published Website"}
              </h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {site?.publishDate && format(new Date(site.publishDate), "PPP")}
                </div>
                <div>
                  <a
                    href={site?.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center hover:text-clone-accent hover:underline"
                  >
                    Source
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Link to="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Back to Cloner
                </Button>
              </Link>
              
              <a
                href={createDataUrl(site?.html || "")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="sm" className="bg-clone-primary hover:bg-clone-secondary">
                  <ExternalLink className="mr-1 h-4 w-4" />
                  Open in New Tab
                </Button>
              </a>
            </div>
          </div>
        </div>
      </header>
      
      {/* Published website content */}
      <div className="flex-grow">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p>Loading published website...</p>
          </div>
        ) : (
          <iframe
            srcDoc={site?.html || ""}
            title={site?.title || "Published Website"}
            className="w-full h-screen border-0"
            sandbox="allow-same-origin allow-scripts"
          />
        )}
      </div>
    </div>
  );
};

export default ViewPublished;
