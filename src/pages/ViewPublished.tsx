import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WebCloneService } from '@/services/WebCloneService';
import { ArrowLeft, ExternalLink, Calendar, Save, Edit, Trash2, Type, Layout, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { toast } from '@/hooks/use-toast';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  const [selectedFont, setSelectedFont] = useState('default');
  const [isRebuilding, setIsRebuilding] = useState(false);
  const [rebuildProgress, setRebuildProgress] = useState(0);
  
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
    // Make sure to preserve the doctype and full HTML structure
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
      toast({
        title: "Edit mode activated",
        description: "Click on any element to edit or remove it.",
        duration: 5000,
      });
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
        console.log("Element selected:", event.data.element);
        setSelectedElement(event.data.element);
        setNewText(event.data.text || '');
      } else if (event.data && event.data.type === 'HTML_CONTENT') {
        console.log("Received HTML content from iframe");
        setEditedHtml(event.data.html);
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
          const allElements = document.querySelectorAll('body *');
          
          allElements.forEach(el => {
            // Skip script tags and style tags
            if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE') return;
            
            // Add highlight class
            el.classList.add('lovable-editor-highlight');
            
            // Remove any existing click events
            const clone = el.cloneNode(true);
            el.parentNode.replaceChild(clone, el);
            
            // Add new click event
            clone.addEventListener('click', (event) => {
              event.preventDefault();
              event.stopPropagation();
              
              // Send selected element data to parent
              window.parent.postMessage({
                type: 'ELEMENT_SELECTED',
                element: {
                  tagName: event.target.tagName,
                  innerHTML: event.target.innerHTML,
                  outerHTML: event.target.outerHTML,
                  id: event.target.id,
                  className: event.target.className,
                },
                text: event.target.textContent
              }, '*');
            });
          });
        };

        // Handle messages from parent
        window.addEventListener('message', (event) => {
          const { action, data } = event.data;
          
          if (action === 'REMOVE_ELEMENT') {
            const elements = document.querySelectorAll('body *');
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
            const elements = document.querySelectorAll('body *');
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
          
          if (action === 'CHANGE_FONT') {
            const style = document.createElement('style');
            style.textContent = \`
              body, body * {
                font-family: \${data.font}, sans-serif !important;
              }
            \`;
            document.head.appendChild(style);
          }
          
          if (action === 'CLEAN_LAYOUT') {
            // Remove common copyright sections
            const footers = document.querySelectorAll('footer, [class*="footer"], [id*="footer"]');
            footers.forEach(el => el.remove());
            
            // Remove copyright texts
            const elements = document.querySelectorAll('body *');
            elements.forEach(el => {
              if (el.textContent && 
                  (el.textContent.toLowerCase().includes('copyright') || 
                   el.textContent.toLowerCase().includes('©') ||
                   el.textContent.toLowerCase().includes('all rights reserved'))) {
                el.textContent = '';
              }
            });
            
            // Center main content
            const mainContent = document.querySelector('main') || document.querySelector('body');
            if (mainContent) {
              mainContent.style.margin = '0 auto';
              mainContent.style.maxWidth = '1200px';
              mainContent.style.padding = '20px';
            }
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

        // Initialize editor
        makeElementsSelectable();
        console.log('Editor initialized');
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
  
  // Change font
  const handleChangeFont = (font: string) => {
    setSelectedFont(font);
    sendMessageToIframe('CHANGE_FONT', { font });
    setTimeout(() => {
      sendMessageToIframe('GET_HTML');
    }, 300);
  };
  
  // Clean layout and remove copyright - FIXED to properly open in new tab
  const handleCleanLayout = () => {
    // First, show a loading toast
    toast({
      title: "Processing",
      description: "Removing copyright content and cleaning layout...",
    });
    
    // Apply the cleaning script to the iframe content
    sendMessageToIframe('CLEAN_LAYOUT');
    
    // Wait for the cleanup to finish before getting the HTML
    setTimeout(() => {
      // Get the updated HTML
      sendMessageToIframe('GET_HTML');
      
      // Wait a bit longer to ensure we've received the updated HTML
      setTimeout(() => {
        if (id && editedHtml) {
          try {
            // Save the changes to persist them
            WebCloneService.updatePublishedSite(id, editedHtml);
            
            // Get the updated site to ensure we have the latest HTML
            const updatedSite = WebCloneService.getPublishedSite(id);
            
            if (updatedSite && updatedSite.html) {
              // Create a data URL for the cleaned HTML with proper HTML structure
              const cleanedDataUrl = createDataUrl(updatedSite.html);
              
              // Open in a new tab
              window.open(cleanedDataUrl, '_blank');
              
              toast({
                title: "Layout cleaned",
                description: "Copyright content removed and website opened in new tab.",
              });
            } else {
              toast({
                title: "Error",
                description: "Could not retrieve the updated site content.",
                variant: "destructive"
              });
            }
          } catch (error) {
            console.error("Error in clean layout process:", error);
            toast({
              title: "Error",
              description: "Failed to process the website. Please try again.",
              variant: "destructive"
            });
          }
        }
      }, 800); // Increased delay to ensure HTML is fully processed
    }, 500);
  };

  // Get final HTML from iframe before saving - with better error handling
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'HTML_CONTENT') {
        console.log("Received HTML from iframe for saving, length:", event.data.html.length);
        if (event.data.html && event.data.html.length > 0) {
          setEditedHtml(event.data.html);
        } else {
          console.error("Received empty HTML content from iframe");
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Save final HTML before exiting edit mode
  const handleFinishEditing = () => {
    sendMessageToIframe('GET_HTML');
    
    // Give more time for the HTML to be received
    setTimeout(() => {
      handleSaveEdits();
      setIsDrawerOpen(false);
    }, 600);
  };

  // New function to rebuild the website using AI
  const handleRebuildWebsite = async () => {
    if (!site?.html || !id) return;
    
    setIsRebuilding(true);
    setRebuildProgress(10);
    
    try {
      // First toast to indicate the process has started
      toast({
        title: "Starting Rebuild",
        description: "Analyzing original website structure...",
      });
      
      setRebuildProgress(30);
      
      // Simulated AI transformation (in a real implementation, we'd call an API)
      // but for demo purposes, we'll create a simplified transformation
      const transformedHtml = await simulateAiRebuild(site.html);
      
      setRebuildProgress(70);
      
      // Update progress
      toast({
        title: "Rebuilding",
        description: "Applying new design elements...",
      });
      
      // Save the rebuilt site
      if (transformedHtml) {
        WebCloneService.updatePublishedSite(id, transformedHtml);
        setSite(WebCloneService.getPublishedSite(id));
        setEditedHtml(transformedHtml);
        
        // Final success toast
        toast({
          title: "Rebuild Complete",
          description: "Your website has been redesigned with AI.",
        });
        
        // Open the rebuilt site in a new tab
        window.open(createDataUrl(transformedHtml), '_blank');
      }
    } catch (error) {
      console.error("Error rebuilding website:", error);
      toast({
        title: "Rebuild Failed",
        description: "There was an error rebuilding your website. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRebuilding(false);
      setRebuildProgress(0);
    }
  };
  
  // Simulated AI rebuild function
  const simulateAiRebuild = async (originalHtml: string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Parse the original HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(originalHtml, 'text/html');
        
        // Apply modern UI transformations
        
        // 1. Add a new modern font
        const style = doc.createElement('style');
        style.textContent = `
          body, h1, h2, h3, h4, h5, h6, p, div, span {
            font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
          }
          
          body {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
          }
          
          h1, h2, h3 {
            font-weight: 700;
            margin-bottom: 1rem;
          }
          
          p {
            margin-bottom: 1rem;
          }
          
          .ai-rebuilt-shadow {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
          
          .ai-rebuilt-button {
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            border: none;
            font-weight: 500;
            transition: transform 0.2s, box-shadow 0.2s;
          }
          
          .ai-rebuilt-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
          }
          
          .ai-rebuilt-card {
            border-radius: 12px;
            overflow: hidden;
            background: white;
            padding: 20px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s;
          }
          
          .ai-rebuilt-card:hover {
            transform: scale(1.02);
          }
          
          .ai-rebuilt-header {
            background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
            padding: 20px;
            border-bottom: 1px solid #e5e7eb;
          }
          
          .ai-rebuilt-animate {
            animation: fadeIn 0.5s ease-out;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `;
        doc.head.appendChild(style);
        
        // 2. Transform buttons
        const buttons = doc.querySelectorAll('button, a[href]');
        buttons.forEach((button) => {
          if (button instanceof HTMLElement) {
            button.classList.add('ai-rebuilt-button');
            
            // Add hover animation
            button.style.transition = "transform 0.2s, box-shadow 0.2s";
          }
        });
        
        // 3. Transform sections/divs into cards
        const sections = doc.querySelectorAll('section, div[class*="container"], div[class*="wrapper"]');
        sections.forEach((section, index) => {
          if (section instanceof HTMLElement && index < 10) { // Limit to avoid transforming everything
            section.classList.add('ai-rebuilt-card', 'ai-rebuilt-animate');
            section.style.animationDelay = `${index * 0.1}s`;
          }
        });
        
        // 4. Modernize headers
        const headers = doc.querySelectorAll('header, nav, div[class*="header"], div[class*="nav"]');
        headers.forEach((header) => {
          if (header instanceof HTMLElement) {
            header.classList.add('ai-rebuilt-header');
          }
        });
        
        // 5. Add subtle animations to images
        const images = doc.querySelectorAll('img');
        images.forEach((img) => {
          if (img instanceof HTMLElement) {
            img.style.transition = "transform 0.3s ease";
            img.style.borderRadius = "8px";
            img.classList.add('ai-rebuilt-shadow');
            
            // Add hover effect
            const wrapper = doc.createElement('div');
            wrapper.style.overflow = 'hidden';
            wrapper.style.borderRadius = '8px';
            wrapper.style.display = 'inline-block';
            
            // Replace the image with the wrapped version
            if (img.parentNode) {
              img.parentNode.insertBefore(wrapper, img);
              wrapper.appendChild(img);
            }
          }
        });
        
        // Add a watermark to indicate AI rebuilt
        const watermark = doc.createElement('div');
        watermark.innerHTML = 'Redesigned with AI';
        watermark.style.position = 'fixed';
        watermark.style.bottom = '20px';
        watermark.style.right = '20px';
        watermark.style.padding = '8px 12px';
        watermark.style.background = 'rgba(0, 0, 0, 0.7)';
        watermark.style.color = 'white';
        watermark.style.borderRadius = '4px';
        watermark.style.fontSize = '12px';
        watermark.style.zIndex = '9999';
        doc.body.appendChild(watermark);
        
        // Get the transformed HTML
        resolve('<!DOCTYPE html>' + doc.documentElement.outerHTML);
      }, 3000); // Simulate processing time
    });
  };

  // Create custom iframe to inject editor script - FIXED to handle content properly
  const InjectedIframe = () => {
    const iframeRef = React.useRef<HTMLIFrameElement>(null);

    const injectScript = (frameElement: HTMLIFrameElement) => {
      try {
        if (!site?.html) {
          console.error("No HTML content available for the iframe");
          return;
        }
        
        const frameDoc = frameElement.contentDocument || frameElement.contentWindow?.document;
        if (frameDoc) {
          // Properly open and write the full HTML content
          frameDoc.open();
          frameDoc.write(site.html);
          frameDoc.close();
          
          // Add message listener to iframe
          const script = frameDoc.createElement('script');
          script.textContent = `
            window.addEventListener('message', (event) => {
              if (event.data && event.data.action === 'INJECT_SCRIPT') {
                try {
                  const scriptEl = document.createElement('script');
                  scriptEl.textContent = event.data.data.script;
                  document.body.appendChild(scriptEl);
                  console.log('Script injected successfully');
                } catch (e) {
                  console.error('Error injecting script:', e);
                }
              }
              
              if (event.data && event.data.action === 'GET_HTML') {
                try {
                  // Make sure to capture the complete HTML including doctype
                  const fullHtml = '<!DOCTYPE html>' + document.documentElement.outerHTML;
                  window.parent.postMessage({
                    type: 'HTML_CONTENT',
                    html: fullHtml
                  }, '*');
                  console.log('HTML content sent to parent');
                } catch (e) {
                  console.error('Error sending HTML content:', e);
                }
              }
            });
            
            console.log('IFrame message listener initialized');
          `;
          frameDoc.body.appendChild(script);
        }
      } catch (error) {
        console.error('Error injecting script into iframe:', error);
      }
    };
    
    useEffect(() => {
      // Make sure the iframe is ready before injecting
      const timer = setTimeout(() => {
        if (iframeRef.current) {
          injectScript(iframeRef.current);
        }
      }, 300);
      
      return () => clearTimeout(timer);
    }, [iframeRef, site]);

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
            
            <div className="flex flex-wrap gap-2">
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

              {/* Clean Layout Button */}
              <Button 
                onClick={handleCleanLayout}
                size="sm"
                variant="outline"
              >
                <Layout className="mr-1 h-4 w-4" />
                Remove Copyright
              </Button>
              
              {/* New Rebuild Website Button */}
              <Button 
                onClick={handleRebuildWebsite}
                size="sm"
                variant="outline"
                disabled={isRebuilding}
                className="relative"
              >
                <RefreshCw className={`mr-1 h-4 w-4 ${isRebuilding ? 'animate-spin' : ''}`} />
                {isRebuilding ? 'Rebuilding...' : 'Rebuild with AI'}
                {isRebuilding && rebuildProgress > 0 && (
                  <div 
                    className="absolute bottom-0 left-0 h-[3px] bg-primary transition-all" 
                    style={{width: `${rebuildProgress}%`}}
                  />
                )}
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
                    
                    {/* Font selector */}
                    <div className="space-y-2 pt-4 border-t border-border">
                      <Label>Change Font</Label>
                      <Select value={selectedFont} onValueChange={handleChangeFont}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select font" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default Font</SelectItem>
                          <SelectItem value="Arial">Arial</SelectItem>
                          <SelectItem value="Georgia">Georgia</SelectItem>
                          <SelectItem value="Verdana">Verdana</SelectItem>
                          <SelectItem value="Tahoma">Tahoma</SelectItem>
                          <SelectItem value="'Trebuchet MS'">Trebuchet MS</SelectItem>
                          <SelectItem value="'Times New Roman'">Times New Roman</SelectItem>
                          <SelectItem value="'Courier New'">Courier New</SelectItem>
                          <SelectItem value="'Segoe UI'">Segoe UI</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Clean Layout Button */}
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Button 
                          variant="outline" 
                          onClick={handleCleanLayout}
                          className="w-full justify-start mt-2"
                        >
                          <Layout className="mr-2 h-4 w-4" />
                          Remove Copyright & Clean Layout
                        </Button>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80">
                        <p>Remove copyright content, footers, and improve the layout of the page.</p>
                      </HoverCardContent>
                    </HoverCard>
                    
                    {/* Rebuild with AI Button */}
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Button 
                          variant="outline" 
                          onClick={handleRebuildWebsite}
                          disabled={isRebuilding}
                          className="w-full justify-start mt-2"
                        >
                          <RefreshCw className={`mr-2 h-4 w-4 ${isRebuilding ? 'animate-spin' : ''}`} />
                          {isRebuilding ? 'Rebuilding...' : 'Rebuild with AI'}
                        </Button>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80">
                        <p>Use AI to redesign the website while maintaining similar functionality and content.</p>
                      </HoverCardContent>
                    </HoverCard>
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
