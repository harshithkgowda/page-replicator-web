
/**
 * Web Cloning Service
 * 
 * This service handles the cloning of websites by using a serverless proxy
 * to fetch the HTML content of the target website.
 */
export class WebCloneService {
  /**
   * CORS Proxy URL - Used to bypass CORS restrictions when fetching websites
   */
  private static CORS_PROXY = 'https://corsproxy.io/?';

  /**
   * Clones a website by fetching its HTML content
   * @param url - The URL of the website to clone
   * @returns A promise that resolves to the HTML content of the website
   */
  static async cloneWebsite(url: string): Promise<string> {
    try {
      console.log(`Attempting to clone website: ${url}`);
      
      // Use CORS proxy to fetch the website
      const response = await fetch(this.CORS_PROXY + encodeURIComponent(url), {
        method: 'GET',
        headers: {
          'Accept': 'text/html',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch website: ${response.status} ${response.statusText}`);
      }

      const html = await response.text();
      
      // Process the HTML to handle relative URLs
      const processedHtml = this.processHtml(html, url);
      
      console.log('Website cloned successfully');
      return processedHtml;
    } catch (error) {
      console.error('Error cloning website:', error);
      throw new Error('Failed to clone website. Check the URL and try again.');
    }
  }

  /**
   * Processes the HTML to fix relative URLs
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
      
      // Convert relative URLs to absolute URLs
      this.fixRelativeUrls(doc, 'a', 'href', baseUrlObj);
      this.fixRelativeUrls(doc, 'img', 'src', baseUrlObj);
      this.fixRelativeUrls(doc, 'link', 'href', baseUrlObj);
      this.fixRelativeUrls(doc, 'script', 'src', baseUrlObj);
      
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
          element.setAttribute(attribute, new URL(url, baseUrl.href).href);
        }
      }
    });
  }
}
