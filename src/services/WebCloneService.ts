
/**
 * Web Cloning Service
 * 
 * This service handles the cloning of websites by using serverless proxies
 * to fetch the HTML content of the target website.
 */
export class WebCloneService {
  /**
   * CORS Proxy URLs - Used to bypass CORS restrictions when fetching websites
   * We use multiple proxies for fallback purposes
   */
  private static CORS_PROXIES = [
    'https://corsproxy.io/?',
    'https://api.allorigins.win/raw?url=',
    'https://cors-anywhere.herokuapp.com/',
    'https://api.codetabs.com/v1/proxy?quest=',
    'https://thingproxy.freeboard.io/fetch/',
  ];

  /**
   * Clones a website by fetching its HTML content
   * @param url - The URL of the website to clone
   * @returns A promise that resolves to the HTML content of the website
   */
  static async cloneWebsite(url: string): Promise<string> {
    let lastError = null;

    // Try each proxy in sequence until one works
    for (const proxyUrl of this.CORS_PROXIES) {
      try {
        console.log(`Attempting to clone website using proxy: ${proxyUrl}`);
        
        // Use current CORS proxy to fetch the website
        const response = await fetch(proxyUrl + encodeURIComponent(url), {
          method: 'GET',
          headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          },
          // Increase timeout for larger pages
          signal: AbortSignal.timeout(25000) // 25 seconds timeout
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch website: ${response.status} ${response.statusText}`);
        }

        const html = await response.text();
        
        // Process the HTML to handle relative URLs and other issues
        const processedHtml = this.processHtml(html, url);
        
        console.log('Website cloned successfully');
        return processedHtml;
      } catch (error) {
        console.error(`Error with proxy ${proxyUrl}:`, error);
        lastError = error;
        // Continue to the next proxy
      }
    }

    // If all proxies failed, throw the last error
    console.error('All proxies failed to clone the website');
    throw new Error('Failed to clone website. Check the URL and try again.');
  }

  /**
   * Processes the HTML to fix relative URLs and improve rendering
   * @param html - The raw HTML content
   * @param baseUrl - The base URL of the website
   * @returns The processed HTML content
   */
  private static processHtml(html: string, baseUrl: string): string {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const baseUrlObj = new URL(baseUrl);
      
      // Add base tag to head if it doesn't exist
      if (!doc.querySelector('base')) {
        const baseTag = doc.createElement('base');
        baseTag.href = baseUrl;
        doc.head.insertBefore(baseTag, doc.head.firstChild);
      }

      // Add meta viewport to ensure proper mobile display if not present
      if (!doc.querySelector('meta[name="viewport"]')) {
        const metaViewport = doc.createElement('meta');
        metaViewport.setAttribute('name', 'viewport');
        metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
        doc.head.appendChild(metaViewport);
      }
      
      // Convert relative URLs to absolute URLs
      this.fixRelativeUrls(doc, 'a', 'href', baseUrlObj);
      this.fixRelativeUrls(doc, 'img', 'src', baseUrlObj);
      this.fixRelativeUrls(doc, 'link', 'href', baseUrlObj);
      this.fixRelativeUrls(doc, 'script', 'src', baseUrlObj);
      this.fixRelativeUrls(doc, 'iframe', 'src', baseUrlObj);
      this.fixRelativeUrls(doc, 'source', 'src', baseUrlObj);
      this.fixRelativeUrls(doc, 'video', 'src', baseUrlObj);
      this.fixRelativeUrls(doc, 'audio', 'src', baseUrlObj);
      this.fixRelativeUrls(doc, 'embed', 'src', baseUrlObj);
      this.fixRelativeUrls(doc, 'object', 'data', baseUrlObj);
      this.fixRelativeUrls(doc, 'form', 'action', baseUrlObj);
      
      // Fix CSS background URLs in inline styles
      this.fixInlineStyles(doc, baseUrlObj);

      // Add our custom styles to improve preview display
      this.addCustomStyles(doc);
      
      // Serialize the document back to HTML
      return new XMLSerializer().serializeToString(doc);
    } catch (error) {
      console.error('Error processing HTML:', error);
      return html; // Return original HTML if processing fails
    }
  }
  
  /**
   * Fixes relative URLs in HTML elements
   * @param doc - The document object
   * @param selector - The CSS selector for the elements
   * @param attribute - The attribute to fix (e.g., 'href', 'src')
   * @param baseUrl - The base URL object
   */
  private static fixRelativeUrls(doc: Document, selector: string, attribute: string, baseUrl: URL): void {
    const elements = doc.querySelectorAll(selector);
    elements.forEach(element => {
      const url = element.getAttribute(attribute);
      if (url && !url.startsWith('http') && !url.startsWith('data:') && !url.startsWith('#')) {
        // Handle different relative URL formats
        if (url.startsWith('//')) {
          element.setAttribute(attribute, `${baseUrl.protocol}${url}`);
        } else if (url.startsWith('/')) {
          element.setAttribute(attribute, `${baseUrl.origin}${url}`);
        } else {
          try {
            element.setAttribute(attribute, new URL(url, baseUrl.href).href);
          } catch (e) {
            console.error(`Error converting URL: ${url}`, e);
          }
        }
      }
    });
  }

  /**
   * Fixes CSS background URLs in inline styles
   * @param doc - The document object
   * @param baseUrl - The base URL object
   */
  private static fixInlineStyles(doc: Document, baseUrl: URL): void {
    const elementsWithStyle = doc.querySelectorAll('[style*="background"]');
    const urlRegex = /url\(['"]?([^'")]+)['"]?\)/g;
    
    elementsWithStyle.forEach(element => {
      const style = element.getAttribute('style');
      if (style) {
        let newStyle = style.replace(urlRegex, (match, url) => {
          if (!url.startsWith('http') && !url.startsWith('data:')) {
            try {
              const absoluteUrl = new URL(url, baseUrl.href).href;
              return `url('${absoluteUrl}')`;
            } catch (e) {
              return match;
            }
          }
          return match;
        });
        element.setAttribute('style', newStyle);
      }
    });
  }

  /**
   * Adds custom styles to improve the preview display
   * @param doc - The document object
   */
  private static addCustomStyles(doc: Document): void {
    // Add a style tag to fix common display issues in the iframe
    const styleTag = doc.createElement('style');
    styleTag.textContent = `
      html, body {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        overflow-x: hidden;
      }
      img, svg, video, canvas, iframe {
        max-width: 100%;
        height: auto;
      }
    `;
    doc.head.appendChild(styleTag);
  }
}
