class WebCloneServiceClass {
  async cloneWebsite(url: string): Promise<string> {
    try {
      // For demo purposes, we'll simulate the cloning process
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      
      if (!data.contents) {
        throw new Error('Failed to fetch website content');
      }
      
      // Process the HTML to make relative URLs absolute
      let html = data.contents;
      html = this.processHtml(html, url);
      
      return html;
    } catch (error) {
      console.error('Error cloning website:', error);
      throw new Error('Failed to clone website. The website might be blocking our request.');
    }
  }

  private processHtml(html: string, baseUrl: string): string {
    try {
      const baseUrlObj = new URL(baseUrl);
      const baseOrigin = baseUrlObj.origin;
      
      // Convert relative URLs to absolute URLs
      html = html.replace(/src="\/([^"]*?)"/g, `src="${baseOrigin}/$1"`);
      html = html.replace(/href="\/([^"]*?)"/g, `href="${baseOrigin}/$1"`);
      html = html.replace(/url\(\/([^)]*?)\)/g, `url(${baseOrigin}/$1)`);
      
      return html;
    } catch (error) {
      console.error('Error processing HTML:', error);
      return html;
    }
  }

  removeWatermarks(html: string): string {
    try {
      // Remove common watermark patterns
      const watermarkPatterns = [
        // Common watermark selectors
        /class="[^"]*watermark[^"]*"/gi,
        /id="[^"]*watermark[^"]*"/gi,
        /<div[^>]*watermark[^>]*>.*?<\/div>/gi,
        
        // Common branding patterns
        /class="[^"]*brand[^"]*"/gi,
        /class="[^"]*logo[^"]*"/gi,
        /<div[^>]*brand[^>]*>.*?<\/div>/gi,
        
        // "Powered by" text
        /powered by.*?<\/[^>]*>/gi,
        /created with.*?<\/[^>]*>/gi,
        /built with.*?<\/[^>]*>/gi,
        
        // Footer credits
        /<footer[^>]*>.*?powered by.*?<\/footer>/gi,
        /<div[^>]*footer[^>]*>.*?powered by.*?<\/div>/gi,
        
        // Common website builder watermarks
        /wix\.com/gi,
        /squarespace\.com/gi,
        /wordpress\.com/gi,
        /webflow\.com/gi,
        /weebly\.com/gi,
        /godaddy\.com/gi,
      ];
      
      let cleanedHtml = html;
      
      watermarkPatterns.forEach(pattern => {
        cleanedHtml = cleanedHtml.replace(pattern, '');
      });
      
      // Remove empty elements that might have been left behind
      cleanedHtml = cleanedHtml.replace(/<(\w+)[^>]*>\s*<\/\1>/g, '');
      
      return cleanedHtml;
    } catch (error) {
      console.error('Error removing watermarks:', error);
      return html;
    }
  }

  convertToNextJS(html: string, sourceUrl: string): { files: Record<string, string> } {
    try {
      const domain = new URL(sourceUrl).hostname.replace('www.', '');
      
      // Extract CSS from HTML
      const cssMatches = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [];
      const extractedCSS = cssMatches.map(match => 
        match.replace(/<\/?style[^>]*>/gi, '')
      ).join('\n\n');

      // Extract body content
      const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      const bodyContent = bodyMatch ? bodyMatch[1] : html;

      // Clean up the body content for React
      let cleanBodyContent = bodyContent
        .replace(/class=/g, 'className=')
        .replace(/for=/g, 'htmlFor=')
        .replace(/<!--[\s\S]*?-->/g, '');

      const files = {
        'package.json': JSON.stringify({
          "name": `${domain}-clone`,
          "version": "0.1.0",
          "private": true,
          "scripts": {
            "dev": "next dev",
            "build": "next build",
            "start": "next start",
            "lint": "next lint"
          },
          "dependencies": {
            "next": "14.0.3",
            "react": "^18",
            "react-dom": "^18"
          },
          "devDependencies": {
            "typescript": "^5",
            "@types/node": "^20",
            "@types/react": "^18",
            "@types/react-dom": "^18",
            "eslint": "^8",
            "eslint-config-next": "14.0.3"
          }
        }, null, 2),

        'next.config.js': `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig`,

        'tsconfig.json': JSON.stringify({
          "compilerOptions": {
            "target": "es5",
            "lib": ["dom", "dom.iterable", "es6"],
            "allowJs": true,
            "skipLibCheck": true,
            "strict": true,
            "noEmit": true,
            "esModuleInterop": true,
            "module": "esnext",
            "moduleResolution": "bundler",
            "resolveJsonModule": true,
            "isolatedModules": true,
            "jsx": "preserve",
            "incremental": true,
            "plugins": [
              {
                "name": "next"
              }
            ],
            "paths": {
              "@/*": ["./*"]
            }
          },
          "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
          "exclude": ["node_modules"]
        }, null, 2),

        'app/layout.tsx': `import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}`,

        'app/page.tsx': `export default function Home() {
  return (
    <div>
      ${cleanBodyContent}
    </div>
  )
}`,

        'app/globals.css': extractedCSS || `/* Global styles */
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}`,

        'README.md': `# ${domain} Clone

This is a Next.js project cloned from ${sourceUrl}.

## Getting Started

First, install the dependencies:

\`\`\`bash
npm install
\`\`\`

Then, run the development server:

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Original Source

This project was cloned from: ${sourceUrl}

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
`
      };

      return { files };
    } catch (error) {
      console.error('Error converting to Next.js:', error);
      throw new Error('Failed to convert to Next.js project');
    }
  }

  publishWebsite(html: string, sourceUrl: string): string {
    try {
      const publishId = Math.random().toString(36).substr(2, 9);
      
      // Store in localStorage for demo purposes
      const publishData = {
        id: publishId,
        html,
        sourceUrl,
        createdAt: new Date().toISOString(),
      };
      
      localStorage.setItem(`published_${publishId}`, JSON.stringify(publishData));
      
      return publishId;
    } catch (error) {
      console.error('Error publishing website:', error);
      throw new Error('Failed to publish website');
    }
  }

  getPublishedSite(publishId: string) {
    const key = `published_${publishId}`;
    const data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    }
    return null;
  }

  updatePublishedSite(publishId: string, html: string) {
    const key = `published_${publishId}`;
    const existingData = this.getPublishedSite(publishId);
    if (existingData) {
      const updatedData = {
        ...existingData,
        html: html,
        lastModified: new Date().toISOString()
      };
      localStorage.setItem(key, JSON.stringify(updatedData));
      return true;
    }
    return false;
  }
}

export const WebCloneService = new WebCloneServiceClass();
