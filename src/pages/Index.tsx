
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Globe, Code, Sparkles, ExternalLink, Check, Zap, Download, Shield } from 'lucide-react';
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
    <div className="flex min-h-screen flex-col bg-psk-dark">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 px-6 md:px-10 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-psk-green/5 via-transparent to-psk-green/10"></div>
          <div className="absolute top-20 right-20 w-64 h-64 bg-psk-green/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-psk-green/5 rounded-full blur-2xl animate-pulse-slow"></div>
          
          <div className="container max-w-6xl mx-auto text-center relative z-10">
            <Badge className="mb-6 bg-psk-green/20 text-psk-green border-psk-green/30 hover:bg-psk-green/30 text-sm font-semibold px-4 py-2">
              ✨ Premium Website Cloning Tool
            </Badge>
            
            <h1 className="hero-text mb-8">
              <span className="text-psk-white">Clone Any</span>
              <br />
              <span className="gradient-text animate-glow">Website</span>
              <br />
              <span className="text-psk-white">Instantly</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-psk-gray-light max-w-4xl mx-auto mb-12 leading-relaxed font-medium">
              Professional website cloning solutions that bring your ideas to life. 
              From inspiration to implementation, we deliver exceptional development experiences.
            </p>

            <div className="flex justify-center mb-16">
              <UrlForm onCloneComplete={handleCloneComplete} setLoading={setLoading} />
            </div>

            <WebsitePreview html={clonedHtml} url={sourceUrl} loading={loading} />
            
            {clonedHtml && sourceUrl && (
              <ResultDisplay html={clonedHtml} url={sourceUrl} />
            )}
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 bg-psk-dark-secondary border-t border-psk-green/20">
          <div className="container max-w-6xl mx-auto px-6 md:px-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-psk-white">
                How <span className="gradient-text">PipCode</span> Works
              </h2>
              <p className="text-psk-gray-light max-w-3xl mx-auto text-lg leading-relaxed">
                Our advanced web cloning technology makes it effortless to replicate any website 
                for learning, testing, or development purposes.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-psk-dark glow-border rounded-xl p-8 hover:bg-psk-dark-secondary/50 transition-all duration-300 group">
                <div className="w-16 h-16 bg-psk-green/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-psk-green/30 transition-colors">
                  <Globe className="h-8 w-8 text-psk-green" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-psk-white">Enter URL</h3>
                <p className="text-psk-gray-light leading-relaxed">
                  Simply paste the URL of any website you want to clone and let our advanced system handle the rest automatically.
                </p>
              </div>
              
              <div className="bg-psk-dark glow-border rounded-xl p-8 hover:bg-psk-dark-secondary/50 transition-all duration-300 group">
                <div className="w-16 h-16 bg-psk-green/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-psk-green/30 transition-colors">
                  <Zap className="h-8 w-8 text-psk-green" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-psk-white">Extract & Process</h3>
                <p className="text-psk-gray-light leading-relaxed">
                  Our intelligent system extracts HTML, resolves assets, removes watermarks, and optimizes the code for immediate use.
                </p>
              </div>
              
              <div className="bg-psk-dark glow-border rounded-xl p-8 hover:bg-psk-dark-secondary/50 transition-all duration-300 group">
                <div className="w-16 h-16 bg-psk-green/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-psk-green/30 transition-colors">
                  <Download className="h-8 w-8 text-psk-green" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-psk-white">Download & Deploy</h3>
                <p className="text-psk-gray-light leading-relaxed">
                  Instantly preview and download as HTML or complete Next.js project ready for deployment and customization.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Benefits Section */}
        <section className="py-20 px-6 md:px-10">
          <div className="container max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-8 text-psk-white">
                  Why Choose <span className="gradient-text">PipCode</span>?
                </h2>
                <ul className="space-y-6">
                  <li className="flex items-start">
                    <span className="mr-4 mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-psk-green/20 border border-psk-green/30">
                      <Check className="h-4 w-4 text-psk-green" />
                    </span>
                    <div>
                      <h3 className="text-xl font-bold text-psk-white mb-2">Learning & Inspiration</h3>
                      <p className="text-psk-gray-light leading-relaxed">Study how popular websites are structured and designed to accelerate your development skills</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-4 mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-psk-green/20 border border-psk-green/30">
                      <Zap className="h-4 w-4 text-psk-green" />
                    </span>
                    <div>
                      <h3 className="text-xl font-bold text-psk-white mb-2">Quick Templates</h3>
                      <p className="text-psk-gray-light leading-relaxed">Start projects faster by using professionally cloned sites as foundation templates</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-4 mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-psk-green/20 border border-psk-green/30">
                      <Shield className="h-4 w-4 text-psk-green" />
                    </span>
                    <div>
                      <h3 className="text-xl font-bold text-psk-white mb-2">Testing & Development</h3>
                      <p className="text-psk-gray-light leading-relaxed">Create secure offline copies of websites for testing, development and experimentation</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="bg-psk-dark-secondary glow-border rounded-xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-psk-green/10 rounded-full blur-2xl"></div>
                <div className="relative">
                  <h3 className="text-2xl font-bold mb-6 text-psk-white">Getting Started</h3>
                  <ol className="space-y-4 text-psk-gray-light">
                    <li className="flex items-start">
                      <span className="mr-3 mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-psk-green text-psk-dark text-sm font-bold">1</span>
                      <span>Enter the full URL of the website you want to clone</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-psk-green text-psk-dark text-sm font-bold">2</span>
                      <span>Choose whether to remove watermarks and branding</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-psk-green text-psk-dark text-sm font-bold">3</span>
                      <span>Click "Clone Website" and wait for processing</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-psk-green text-psk-dark text-sm font-bold">4</span>
                      <span>Preview and download as HTML or Next.js project</span>
                    </li>
                  </ol>
                  
                  <div className="mt-8 p-4 bg-psk-green/10 border border-psk-green/30 rounded-lg">
                    <p className="text-sm text-psk-green font-medium">
                      ⚡ Pro Tip: Use responsibly and respect intellectual property rights when using cloned content.
                    </p>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <a href="#" className="text-sm flex items-center text-psk-green hover:text-psk-green-light transition-colors">
                      View Documentation
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
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
