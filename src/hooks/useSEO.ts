import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
}

export function useSEO({ title, description, keywords, image }: SEOProps) {
  useEffect(() => {
    // 1. Update Title
    const fullTitle = `${title} | Zitta Real Estate Rwanda`;
    document.title = fullTitle;

    // Helper to update or create meta tags
    const setMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Update Standard Meta
    setMetaTag('title', fullTitle);
    setMetaTag('description', description);
    
    // Intense Keywords
    const baseKeywords = "Rwanda real estate, property for sale Kigali, houses for rent Rwanda, luxury villas Kigali, Zitta";
    setMetaTag('keywords', keywords ? `${keywords}, ${baseKeywords}` : baseKeywords);

    // 3. Update Open Graph (Facebook/Instagram/LinkedIn)
    setMetaTag('og:title', fullTitle, true);
    setMetaTag('og:description', description, true);
    if (image) setMetaTag('og:image', image, true);

    // 4. Update Twitter
    setMetaTag('twitter:title', fullTitle, true);
    setMetaTag('twitter:description', description, true);
    if (image) setMetaTag('twitter:image', image, true);

  }, [title, description, keywords, image]);
}
