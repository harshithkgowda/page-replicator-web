
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WebCloneService } from '@/services/WebCloneService';
import { ArrowLeft, ExternalLink, Calendar, Save, Edit, Trash2, Type } from 'lucide-react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { toast } from '@/hooks/use-toast';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';

const ViewPublished = () => {
  const { id } = useParams<{ id: string }>();
  const [site, setSite] = useState<ReturnType<typeof WebCloneService.getPublishedSite>>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editedHtml, setEditedHtml] = useState('');
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const [isTextEditOpen, setIsTextEditOpen] = useState(false);
  const [newText, setNewText] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  useEffect(() => {
    if (id) {
      const publishedSite = WebCloneService.getPublishedSite(id);
      setSite(publishedSite);
      setEditedHtml(publishedSite?.html || '');
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

  // Handle saving edited website
  const handleSaveEdits = () => {
    if (id && editedHtml) {
      WebCloneService.updatePublishedSite(id, editedHtml);
      setSite(WebCloneService.getPublishedSite(id));
      setEditMode(false);
      toast({
        title: "Changes saved",
        description: "Your changes to the website have been saved.",
      });
    }
  };

  // Toggle edit mode
  const handleToggleEditMode = () => {
    const newEditMode = !editMode;
    setEditMode(newEditMode);
    
    if (newEditMode) {
      setIsDrawerOpen(true);
    } else {
      setSelectedElement(null);
    }
  };

  // Handle edit message for iframe
  const sendMessageToIframe = (action: string, data?: any) => {
    const iframe = document.getElementById('published-site-iframe') as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({ action, data }, '*');
    }
  };

  // Listen for messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'ELEMENT_SELECTED') {
        setSelectedElement(event.data.element);
        setNewText(event.data.text || '');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Inject editor script when edit mode changes
  useEffect(() => {
    if (editMode) {
      const editorScript = `
      (function() {
        // Add editor styles
        const style = document.createElement('style');
        style.textContent = \`
          .lovable-editor-highlight {
            outline: 2px dashed #4f46e5 !important;
            cursor: pointer !important;
            position: relative !important;
          }
          .lovable-editor-highlight:hover {
            outline: 2px solid #4f46e5 !important;
            background-color: rgba(79, 70, 229, 0.1) !important;
          }
        \`;
        document.head.appendChild(style);

        // Make elements selectable
        const makeElementsSelectable = () => {
          const allElements = document.querySelectorAll('button, a, p, h1, h2, h3, h4, h5, h6, span, div');
          
          allElements.forEach(el => {
            el.classList.add('lovable-editor-highlight');
            
            el.addEventListener('click', (event) => {
              event.preventDefault();
              event.stopPropagation();
              
              // Send selected element data to parent
              window.parent.postMessage({
                type: 'ELEMENT_SELECTED',
                element: {
                  tagName: el.tagName,
                  innerHTML: el.innerHTML,
                  outerHTML: el.outerHTML,
                  id: el.id,
                  className: el.className,
                },
                text: el.textContent
              }, '*');
            });
          });
        };

        // Handle messages from parent
        window.addEventListener('message', (event) => {
          const { action, data } = event.data;
          
          if (action === 'REMOVE_ELEMENT') {
            const elements = document.querySelectorAll('button, a, p, h1, h2, h3, h4, h5, h6, span, div');
            elements.forEach(el => {
              if (
                el.innerHTML === data.innerHTML || 
                el.outerHTML === data.outerHTML ||
                (el.id && el.id === data.id)
              ) {
                el.remove();
              }
            });
          }
          
          if (action === 'UPDATE_TEXT') {
            const elements = document.querySelectorAll('button, a, p, h1, h2, h3, h4, h5, h6, span, div');
            elements.forEach(el => {
              if (
                el.innerHTML === data.element.innerHTML || 
                el.outerHTML === data.element.outerHTML ||
                (el.id && el.id === data.element.id)
              ) {
                el.textContent = data.newText;
              }
            });
          }
          
          if (action === 'GET_HTML') {
            // Clean up before getting HTML
            const highlights = document.querySelectorAll('.lovable-editor-highlight');
            highlights.forEach(el => el.classList.remove('lovable-editor-highlight'));
            
            // Send HTML back to parent
            window.parent.postMessage({
              type: 'HTML_CONTENT',
              html: document.documentElement.outerHTML
            }, '*');
          }
        });

        makeElementsSelectable();
      })();
      `;
      
      setTimeout(() => {
        sendMessageToIframe('INJECT_SCRIPT', { script: editorScript });
      }, 1000);
    }
  }, [editMode]);

  // Remove selected element
  const handleRemoveElement = () => {
    if (selectedElement) {
      sendMessageToIframe('REMOVE_ELEMENT', selectedElement);
      setSelectedElement(null);
      setTimeout(() => {
        sendMessageToIframe('GET_HTML');
      }, 300);
    }
  };

  // Update text of selected element
  const handleUpdateText = () => {
    if (selectedElement && newText !== '') {
      sendMessageToIframe('UPDATE_TEXT', { element: selectedElement, newText });
      setIsTextEditOpen(false);
      setTimeout(() => {
        sendMessageToIframe('GET_HTML');
      }, 300);
    }
  };

  // Get final HTML from iframe before saving
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'HTML_CONTENT') {
        setEditedHtml(event.data.html);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Save final HTML before exiting edit mode
  const handleFinishEditing = () => {
    sendMessageToIframe('GET_HTML');
    
    // Give time for the HTML to be received
    setTimeout(() => {
      handleSaveEdits();
      setIsDrawerOpen(false);
    }, 500);
  };

  // Create custom iframe to inject editor script
  const InjectedIframe = () => {
    const iframeRef = React.useRef<HTMLIFrameElement>(null);

    const injectScript = (frameElement: HTMLIFrameElement) => {
      try {
        const frameDoc = frameElement.contentDocument || frameElement.contentWindow?.document;
        if (frameDoc) {
          frameDoc.open();
          frameDoc.write(site?.html || '');
          frameDoc.close();
          
          // Add message listener to iframe
          const script = frameDoc.createElement('script');
          script.textContent = `
            window.addEventListener('message', (event) => {
              if (event.data && event.data.action === 'INJECT_SCRIPT') {
                const scriptEl = document.createElement('script');
                scriptEl.textContent = event.data.data.script;
                document.body.appendChild(scriptEl);
              }
            });
          `;
          frameDoc.body.appendChild(script);
        }
      } catch (error) {
        console.error('Error injecting script into iframe:', error);
      }
    };
    
    useEffect(() => {
      if (iframeRef.current) {
        injectScript(iframeRef.current);
      }
    }, [iframeRef]);

    return (
      <iframe
        id="published-site-iframe"
        ref={iframeRef}
        title={site?.title || "Published Website"}
        className="w-full h-screen border-0"
        sandbox="allow-same-origin allow-scripts"
      />
    );
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
              
              <Button 
                onClick={handleToggleEditMode}
                size="sm" 
                variant={editMode ? "secondary" : "outline"}
              >
                <Edit className="mr-1 h-4 w-4" />
                {editMode ? "Editing Mode" : "Edit Website"}
              </Button>
              
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
          <>
            {/* Custom iframe with script injection capability */}
            <InjectedIframe />
            
            {/* Text edit dialog */}
            <Dialog open={isTextEditOpen} onOpenChange={setIsTextEditOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Text</DialogTitle>
                  <DialogDescription>
                    Update the text content of the selected element.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="text">New Text</Label>
                    <Input
                      id="text"
                      value={newText}
                      onChange={(e) => setNewText(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsTextEditOpen(false)}>Cancel</Button>
                    <Button onClick={handleUpdateText}>Update</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            {/* Editor drawer for mobile */}
            <Drawer open={isDrawerOpen && editMode} onOpenChange={setIsDrawerOpen}>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Website Editor</DrawerTitle>
                </DrawerHeader>
                <div className="p-4">
                  <div className="text-sm text-muted-foreground mb-4">
                    {selectedElement ? (
                      <span>Selected: <span className="font-medium text-foreground">{`<${selectedElement.tagName?.toLowerCase()}>`}</span></span>
                    ) : (
                      <span>Click on any element to edit or remove it</span>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-3 mb-6">
                    {selectedElement && (
                      <>
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <Button 
                              variant="outline" 
                              onClick={() => setIsTextEditOpen(true)}
                              disabled={!selectedElement}
                              className="w-full justify-start"
                            >
                              <Type className="mr-2 h-4 w-4" />
                              Edit Text
                            </Button>
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80">
                            <p>Change the text content of the selected element.</p>
                          </HoverCardContent>
                        </HoverCard>
                        
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <Button 
                              variant="outline" 
                              onClick={handleRemoveElement}
                              disabled={!selectedElement}
                              className="w-full justify-start text-destructive hover:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remove Element
                            </Button>
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80">
                            <p>Remove the selected element from the page.</p>
                          </HoverCardContent>
                        </HoverCard>
                      </>
                    )}
                  </div>
                  
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => {
                      setEditMode(false);
                      setIsDrawerOpen(false);
                      setSelectedElement(null);
                    }}>
                      Cancel
                    </Button>
                    <Button onClick={handleFinishEditing}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </>
        )}
      </div>
    </div>
  );
};

export default ViewPublished;

