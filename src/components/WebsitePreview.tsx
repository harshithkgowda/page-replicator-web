
import React, { useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

interface WebsitePreviewProps {
  html: string | null;
  url: string | null;
  loading: boolean;
}

const WebsitePreview = ({ html, url, loading }: WebsitePreviewProps) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (html && iframeRef.current) {
      const iframe = iframeRef.current;
      const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (iframeDocument) {
        iframeDocument.open();
        iframeDocument.write(html);
        iframeDocument.close();
      }
    }
  }, [html]);

  if (loading) {
    return (
      <Card className="w-full min-h-[500px] flex items-center justify-center bg-secondary/30 animate-pulse">
        <Loader2 className="h-12 w-12 animate-spin text-clone-accent" />
        <p className="mt-4 text-muted-foreground">Cloning website...</p>
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
    <Tabs defaultValue="preview" className="w-full">
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
          <CardContent className="p-0 min-h-[500px] iframe-container">
            <iframe
              ref={iframeRef}
              title="Website Preview"
              sandbox="allow-same-origin"
              className="w-full h-[500px] rounded-md"
            />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="code" className="mt-0">
        <Card className="border border-border/50">
          <CardContent className="p-0">
            <pre className="code-block h-[500px] overflow-auto">
              <code>{html}</code>
            </pre>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default WebsitePreview;
