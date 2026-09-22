import { useEffect, useRef } from "react";

export function useImagePreloader(urls: string[]) {
  const loadedUrls = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Debounce preloading by 300ms. 
    // If the user clicks "next" rapidly, we cancel the preload for the intermediate images they skipped past.
    // This prevents filling up the browser's 6-connection limit with images they didn't stop to look at!
    const timer = setTimeout(() => {
      urls.forEach((url) => {
        if (!url || loadedUrls.current.has(url)) return;
        
        loadedUrls.current.add(url);
        
        const img = new Image();
        img.src = url;
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [urls]); // Re-runs when the urls array changes
}
