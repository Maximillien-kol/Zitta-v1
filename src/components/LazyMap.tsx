import React, { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface LazyMapProps {
  src: string;
  title?: string;
  height?: string;
  width?: string;
}

export function LazyMap({ src, title = "Map", height = "400px", width = "100%" }: LazyMapProps) {
  const { t } = useTranslation();
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If map is already loaded, don't set up observer
    if (isLoaded) return;

    // Create intersection observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Load map when it comes into view
          if (entry.isIntersecting) {
            setIsLoaded(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before coming into view
        threshold: 0.01,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [isLoaded]);

  return (
    <div
      ref={containerRef}
      className="bg-[#FFFFFF] border border-[#E0E6ED] rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
      style={{ height, width }}
    >
      {!isLoaded ? (
        // Loading skeleton
        <div className="w-full h-full bg-gradient-to-r from-[#f0f0f0] via-[#e8e8e8] to-[#f0f0f0] bg-[length:200%_100%] animate-pulse flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 bg-[#E0E6ED] rounded-full mx-auto mb-3 animate-pulse"></div>
            <p className="text-[#567C8D] text-sm">{t('Loading map...')}</p>
          </div>
        </div>
      ) : (
        <iframe
          title={title}
          src={src}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      )}
    </div>
  );
}
