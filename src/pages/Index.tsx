
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Globe, Code, Sparkles, ExternalLink, Check } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UrlForm from '@/components/UrlForm';
import WebsitePreview from '@/components/WebsitePreview';
import ResultDisplay from '@/components/ResultDisplay';

const Index = () => {
  const [clonedHtml, setClonedHtml] = useState<string | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCloneComplete = (html: string, url: string) => {
    setClonedHtml(html);
    setSourceUrl(url);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-6 md:px-10">
          <div className="container max-w-5xl mx-auto text-center">
            <Badge className="mb-4 bg-clone-primary/10 text-clone-accent hover:bg-clone-primary/20">
              Website Cloning Tool
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="gradient-text">Clone any website</span> with a single click
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
              Enter a URL and instantly clone the entire website layout and design. Preview the result and download the HTML code.
            </p>

            <div className="flex justify-center mb-12">
              <UrlForm onCloneComplete={handleCloneComplete} setLoading={setLoading} />
            </div>

            <WebsitePreview html={clonedHtml} url={sourceUrl} loading={loading} />
            
            {clonedHtml && sourceUrl && (
              <ResultDisplay html={clonedHtml} url={sourceUrl} />
            )}
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 bg-secondary/10">
          <div className="container max-w-5xl mx-auto px-6 md:px-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our advanced web cloning technology makes it easy to replicate any website for learning, testing, or development purposes.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-secondary/20 rounded-lg p-6 border border-border/50">
                <Globe className="h-10 w-10 text-clone-accent mb-4" />
                <h3 className="text-xl font-semibold mb-2">Enter URL</h3>
                <p className="text-muted-foreground">
                  Simply paste the URL of any website you want to clone and let our system handle the rest.
                </p>
              </div>
              
              <div className="bg-secondary/20 rounded-lg p-6 border border-border/50">
                <Code className="h-10 w-10 text-clone-accent mb-4" />
                <h3 className="text-xl font-semibold mb-2">Extract Code</h3>
                <p className="text-muted-foreground">
                  Our system extracts the HTML, resolves relative links, and formats the code for immediate use.
                </p>
              </div>
              
              <div className="bg-secondary/20 rounded-lg p-6 border border-border/50">
                <Sparkles className="h-10 w-10 text-clone-accent mb-4" />
                <h3 className="text-xl font-semibold mb-2">Preview & Download</h3>
                <p className="text-muted-foreground">
                  Instantly preview the cloned website and download the complete HTML for your projects.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Benefits Section */}
        <section className="py-20 px-6 md:px-10">
          <div className="container max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Why Use Our Website Cloner?</h2>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="mr-2 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-clone-primary/20">
                      <Check className="h-3 w-3 text-clone-accent" />
                    </span>
                    <div>
                      <h3 className="font-semibold">Learning & Inspiration</h3>
                      <p className="text-muted-foreground">Study how popular websites are structured and designed</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-clone-primary/20">
                      <Check className="h-3 w-3 text-clone-accent" />
                    </span>
                    <div>
                      <h3 className="font-semibold">Quick Templates</h3>
                      <p className="text-muted-foreground">Start projects faster by using cloned sites as templates</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-clone-primary/20">
                      <Check className="h-3 w-3 text-clone-accent" />
                    </span>
                    <div>
                      <h3 className="font-semibold">Testing & Development</h3>
                      <p className="text-muted-foreground">Create offline copies of websites for testing or development</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="bg-secondary/20 border border-border/50 rounded-lg p-8">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-clone-primary to-clone-accent opacity-30 blur"></div>
                  <div className="relative bg-background rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">Getting Started</h3>
                    <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-4">
                      <li>Enter the full URL of the website you want to clone</li>
                      <li>Click "Clone Website" and wait for the process to complete</li>
                      <li>Preview the cloned website in the interactive viewer</li>
                      <li>View the HTML code or download it for your projects</li>
                    </ol>
                    
                    <p className="mt-4 text-sm text-muted-foreground">
                      Note: Use responsibly. Respect intellectual property rights when using cloned content.
                    </p>
                    
                    <div className="mt-6 flex justify-end">
                      <a href="#" className="text-sm flex items-center text-clone-accent hover:underline">
                        View Documentation
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
