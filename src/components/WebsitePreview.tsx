
import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Maximize2, ZoomIn, ZoomOut, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WebsitePreviewProps {
  html: string | null;
  url: string | null;
  loading: boolean;
}

const WebsitePreview = ({ html, url, loading }: WebsitePreviewProps) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [scale, setScale] = useState(1);
  const [activeTab, setActiveTab] = useState("preview");
  
  // Function to refresh the iframe with the current HTML
  const refreshIframe = () => {
    if (html && iframeRef.current) {
      const iframe = iframeRef.current;
      const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (iframeDocument) {
        iframeDocument.open();
        iframeDocument.write(html);
        iframeDocument.close();
      }
    }
  };

  // Update iframe when HTML changes
  useEffect(() => {
    refreshIframe();
  }, [html]);

  // Zoom in function
  const zoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.1, 2));
  };

  // Zoom out function
  const zoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.1, 0.5));
  };

  // Reset zoom function
  const resetZoom = () => {
    setScale(1);
  };

  if (loading) {
    return (
      <Card className="w-full min-h-[500px] flex items-center justify-center bg-secondary/30 animate-pulse">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-clone-accent mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">Cloning website...</p>
          <p className="text-sm text-muted-foreground mt-2">This may take a moment for larger websites</p>
        </div>
      </Card>
    );
  }

  if (!html && !loading) {
    return (
      <Card className="w-full min-h-[500px] flex items-center justify-center bg-secondary/30">
        <div className="text-center">
          <p className="text-2xl font-semibold text-muted-foreground mb-2">Enter a URL above</p>
          <p className="text-muted-foreground">The cloned website will appear here</p>
        </div>
      </Card>
    );
  }

  return (
    <Tabs 
      defaultValue="preview" 
      className="w-full"
      value={activeTab}
      onValueChange={setActiveTab}
    >
      <div className="flex items-center justify-between mb-4">
        <TabsList className="bg-secondary/50">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">HTML Code</TabsTrigger>
        </TabsList>
        
        {url && (
          <div className="text-sm text-muted-foreground">
            Source: <a href={url} target="_blank" rel="noopener noreferrer" className="text-clone-accent hover:underline">{url}</a>
          </div>
        )}
      </div>
      
      <TabsContent value="preview" className="mt-0">
        <Card className="border border-border/50 iframe-shadow">
          <div className="bg-secondary/50 p-2 border-b border-border/50 flex justify-between items-center">
            <div className="text-sm font-medium">Website Preview</div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={zoomOut} title="Zoom Out">
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={resetZoom} title="Reset Zoom">
                <RefreshCcw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={zoomIn} title="Zoom In">
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={refreshIframe} title="Refresh Preview">
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardContent className="p-0 min-h-[500px] iframe-container relative overflow-auto">
            <div style={{
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              width: `${100 / scale}%`,
              height: scale < 1 ? '100%' : 'auto',
            }}>
              <iframe
                ref={iframeRef}
                title="Website Preview"
                sandbox="allow-same-origin allow-scripts"
                className="w-full h-[600px] rounded-b-md"
                style={{ display: 'block' }}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="code" className="mt-0">
        <Card className="border border-border/50">
          <div className="bg-secondary/50 p-2 border-b border-border/50 flex justify-between items-center">
            <div className="text-sm font-medium">HTML Source Code</div>
            <div className="text-xs text-muted-foreground">
              {html && `${(html.length / 1024).toFixed(2)} KB`}
            </div>
          </div>
          <CardContent className="p-0">
            <pre className="code-block h-[600px] overflow-auto text-sm p-4 bg-gray-800 text-gray-200 rounded-b-md">
              <code>{html}</code>
            </pre>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default WebsitePreview;
