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
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 px-6 md:px-10 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-emerald-500/10"></div>
          <div className="absolute top-20 right-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-emerald-500/5 rounded-full blur-2xl animate-pulse"></div>
          
          <div className="container max-w-6xl mx-auto text-center relative z-10">
            <Badge className="mb-8 bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30 text-sm font-semibold px-6 py-3 rounded-full shadow-lg shadow-green-500/20">
              ✨ Premium Website Cloning Tool
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-tight mb-8">
              <span className="block md:inline text-white">Clone Any </span>
              <span className="block md:inline bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text text-transparent animate-pulse">Website </span>
              <span className="block md:inline text-white">Instantly</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed font-medium">
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
        <section className="py-20 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-t border-green-500/20">
          <div className="container max-w-6xl mx-auto px-6 md:px-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-green-400">
                How <span className="gradient-text">PipCode</span> Works
              </h2>
              <p className="text-gray-300 max-w-3xl mx-auto text-lg leading-relaxed">
                Our advanced web cloning technology makes it effortless to replicate any website 
                for learning, testing, or development purposes.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-green-500/20 glow-border rounded-xl p-8 hover:bg-gradient-to-br from-green-500/30 transition-all duration-300 group">
                <div className="w-16 h-16 bg-green-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-green-500/30 transition-colors">
                  <Globe className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-green-400">Enter URL</h3>
                <p className="text-gray-300 leading-relaxed">
                  Simply paste the URL of any website you want to clone and let our advanced system handle the rest automatically.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-green-500/20 glow-border rounded-xl p-8 hover:bg-gradient-to-br from-green-500/30 transition-all duration-300 group">
                <div className="w-16 h-16 bg-green-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-green-500/30 transition-colors">
                  <Zap className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-green-400">Extract & Process</h3>
                <p className="text-gray-300 leading-relaxed">
                  Our intelligent system extracts HTML, resolves assets, removes watermarks, and optimizes the code for immediate use.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-green-500/20 glow-border rounded-xl p-8 hover:bg-gradient-to-br from-green-500/30 transition-all duration-300 group">
                <div className="w-16 h-16 bg-green-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-green-500/30 transition-colors">
                  <Download className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-green-400">Download & Deploy</h3>
                <p className="text-gray-300 leading-relaxed">
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
                <h2 className="text-4xl md:text-5xl font-bold mb-8 text-green-400">
                  Why Choose <span className="gradient-text">PipCode</span>?
                </h2>
                <ul className="space-y-6">
                  <li className="flex items-start">
                    <span className="mr-4 mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20 border border-green-500/30">
                      <Check className="h-4 w-4 text-green-400" />
                    </span>
                    <div>
                      <h3 className="text-xl font-bold text-green-400 mb-2">Learning & Inspiration</h3>
                      <p className="text-gray-300 leading-relaxed">Study how popular websites are structured and designed to accelerate your development skills</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-4 mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20 border border-green-500/30">
                      <Zap className="h-4 w-4 text-green-400" />
                    </span>
                    <div>
                      <h3 className="text-xl font-bold text-green-400 mb-2">Quick Templates</h3>
                      <p className="text-gray-300 leading-relaxed">Start projects faster by using professionally cloned sites as foundation templates</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-4 mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20 border border-green-500/30">
                      <Shield className="h-4 w-4 text-green-400" />
                    </span>
                    <div>
                      <h3 className="text-xl font-bold text-green-400 mb-2">Testing & Development</h3>
                      <p className="text-gray-300 leading-relaxed">Create secure offline copies of websites for testing, development and experimentation</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-green-500/20 glow-border rounded-xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl"></div>
                <div className="relative">
                  <h3 className="text-2xl font-bold mb-6 text-green-400">Getting Started</h3>
                  <ol className="space-y-4 text-gray-300">
                    <li className="flex items-start">
                      <span className="mr-3 mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-green-400 text-sm font-bold">1</span>
                      <span>Enter the full URL of the website you want to clone</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-green-400 text-sm font-bold">2</span>
                      <span>Choose whether to remove watermarks and branding</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-green-400 text-sm font-bold">3</span>
                      <span>Click "Clone Website" and wait for processing</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-green-400 text-sm font-bold">4</span>
                      <span>Preview and download as HTML or Next.js project</span>
                    </li>
                  </ol>
                  
                  <div className="mt-8 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <p className="text-sm text-green-500 font-medium">
                      ⚡ Pro Tip: Use responsibly and respect intellectual property rights when using cloned content.
                    </p>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <a href="#" className="text-sm flex items-center text-green-400 hover:text-green-400-light transition-colors">
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
