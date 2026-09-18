"use client";
import React, { useState, useRef, useLayoutEffect, useEffect } from "react";

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function ExplorerCardScaler({ children, innerClassName }: { children: React.ReactNode; innerClassName?: string }) {
  const [scale, setScale] = useState(1);
  const [isReady, setIsReady] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const updateScale = () => {
      if (!cardRef.current) return;
      const cardHeight = cardRef.current.offsetHeight;
      if (cardHeight === 0) return;
      
      const targetHeight = window.innerHeight * 0.8; // 80vh
      let newScale = targetHeight / cardHeight;
      if (newScale > 1) newScale = 1; // Don't scale up, only down
      
      setScale(newScale);
      if (!isReady) setIsReady(true);
    };

    updateScale();

    const observer = new ResizeObserver(() => {
      updateScale();
    });
    
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    
    window.addEventListener("resize", updateScale);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, [isReady]);

  return (
    <div className="relative flex items-center justify-center w-full h-[80vh]">
      <div 
        ref={cardRef} 
        style={{ 
          transform: `scale(${scale})`, 
          opacity: isReady ? 1 : 0 
        }} 
        className={`origin-center transition-opacity duration-200 ${innerClassName || ""}`}
      >
        {children}
      </div>
    </div>
  );
}
