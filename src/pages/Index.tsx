
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
        <section className="py-20 px-6 md:px-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-50/50 to-electric-50/50"></div>
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-brand-100/20 to-transparent"></div>
          
          <div className="container max-w-5xl mx-auto text-center relative">
            <Badge className="mb-4 bg-gradient-to-r from-brand-500/10 to-electric-500/10 text-brand-700 hover:from-brand-500/20 hover:to-electric-500/20 border-brand-200">
              Website Cloning Tool
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-brand-600 via-electric-600 to-brand-700 bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_200%]">
                Clone any website
              </span> with a single click
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
              Enter a URL and instantly clone the entire website layout and design. Preview the result and download the HTML code or Next.js project.
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
        <section className="py-20 bg-gradient-to-b from-secondary/10 to-brand-50/30">
          <div className="container max-w-5xl mx-auto px-6 md:px-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-brand-700 to-electric-700 bg-clip-text text-transparent">How It Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our advanced web cloning technology makes it easy to replicate any website for learning, testing, or development purposes.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-white to-brand-50/50 rounded-lg p-6 border border-brand-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-brand-500 to-electric-500 flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-brand-800">Enter URL</h3>
                <p className="text-muted-foreground">
                  Simply paste the URL of any website you want to clone and let our system handle the rest.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-white to-electric-50/50 rounded-lg p-6 border border-electric-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-electric-500 to-brand-500 flex items-center justify-center mb-4">
                  <Code className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-electric-800">Extract Code</h3>
                <p className="text-muted-foreground">
                  Our system extracts the HTML, resolves relative links, and formats the code for immediate use.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-white to-brand-50/50 rounded-lg p-6 border border-brand-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-brand-500 to-electric-500 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-brand-800">Preview & Download</h3>
                <p className="text-muted-foreground">
                  Instantly preview the cloned website and download the complete HTML or Next.js project for your use.
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
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-brand-700 to-electric-700 bg-clip-text text-transparent">Why Use PipCode?</h2>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="mr-2 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-brand-500/20 to-electric-500/20">
                      <Check className="h-3 w-3 text-brand-600" />
                    </span>
                    <div>
                      <h3 className="font-semibold text-brand-800">Learning & Inspiration</h3>
                      <p className="text-muted-foreground">Study how popular websites are structured and designed</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-brand-500/20 to-electric-500/20">
                      <Check className="h-3 w-3 text-brand-600" />
                    </span>
                    <div>
                      <h3 className="font-semibold text-brand-800">Quick Templates</h3>
                      <p className="text-muted-foreground">Start projects faster by using cloned sites as templates</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-brand-500/20 to-electric-500/20">
                      <Check className="h-3 w-3 text-brand-600" />
                    </span>
                    <div>
                      <h3 className="font-semibold text-brand-800">Testing & Development</h3>
                      <p className="text-muted-foreground">Create offline copies of websites for testing or development</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-brand-50/50 to-electric-50/50 border border-brand-200/50 rounded-lg p-8 shadow-xl">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-brand-500 to-electric-500 opacity-20 blur"></div>
                  <div className="relative bg-background rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4 text-brand-800">Getting Started</h3>
                    <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-4">
                      <li>Enter the full URL of the website you want to clone</li>
                      <li>Choose whether to remove watermarks and branding</li>
                      <li>Click "Clone Website" and wait for the process to complete</li>
                      <li>Preview the cloned website in the interactive viewer</li>
                      <li>Download as HTML or Next.js project for your development needs</li>
                    </ol>
                    
                    <p className="mt-4 text-sm text-muted-foreground">
                      Note: Use responsibly. Respect intellectual property rights when using cloned content.
                    </p>
                    
                    <div className="mt-6 flex justify-end">
                      <a href="#" className="text-sm flex items-center text-brand-600 hover:text-brand-700 hover:underline transition-colors">
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
