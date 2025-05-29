
export class WebCloneService {
  static async cloneWebsite(url: string): Promise<string> {
    try {
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      return data.contents || '';
    } catch (error) {
      console.error('Error cloning website:', error);
      throw new Error('Failed to clone website');
    }
  }

  static removeWatermarks(html: string): string {
    // Remove common watermarks and branding
    let cleaned = html;
    
    // Remove common watermark patterns
    const watermarkPatterns = [
      /powered by.*?<\/[^>]*>/gi,
      /created by.*?<\/[^>]*>/gi,
      /made with.*?<\/[^>]*>/gi,
      /built with.*?<\/[^>]*>/gi,
      /<[^>]*watermark[^>]*>.*?<\/[^>]*>/gi,
      /<[^>]*footer[^>]*>.*?powered by.*?<\/footer>/gi,
    ];
    
    watermarkPatterns.forEach(pattern => {
      cleaned = cleaned.replace(pattern, '');
    });
    
    return cleaned;
  }

  static convertToNextJS(html: string, url: string): { [key: string]: string } {
    // Convert HTML to Next.js project structure
    const files: { [key: string]: string } = {};
    
    // Extract head content
    const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    
    // Create pages/index.js
    files['pages/index.js'] = `import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>Cloned Website</title>
        <meta name="description" content="Cloned from ${url}" />
        ${headMatch ? headMatch[1].replace(/<title[^>]*>.*?<\/title>/gi, '') : ''}
      </Head>
      <div>
        ${bodyMatch ? bodyMatch[1] : html}
      </div>
    </>
  )
}`;

    // Create package.json
    files['package.json'] = JSON.stringify({
      name: 'cloned-website',
      version: '1.0.0',
      private: true,
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start'
      },
      dependencies: {
        next: '^13.0.0',
        react: '^18.0.0',
        'react-dom': '^18.0.0'
      }
    }, null, 2);

    // Create next.config.js
    files['next.config.js'] = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig`;

    return files;
  }
}
