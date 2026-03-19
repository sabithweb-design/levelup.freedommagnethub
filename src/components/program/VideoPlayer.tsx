'use client';

import { useEffect, useRef } from 'react';
import 'plyr/dist/plyr.css';

/**
 * @fileOverview A professional custom video player using Plyr.js.
 * Wraps YouTube videos to provide a clean, branded LMS-style interface
 * and minimizes standard YouTube UI distractions.
 */

export function VideoPlayer({ videoId }: { videoId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current || !videoId) return;

    let player: any;

    const initPlyr = async () => {
      try {
        // Dynamically import Plyr to avoid SSR "document is not defined" errors
        const Plyr = (await import('plyr')).default;
        
        // The element Plyr attaches to
        const playerElement = containerRef.current?.querySelector('.plyr-container');
        
        if (!playerElement) return;

        player = new Plyr(playerElement as HTMLElement, {
          controls: [
            'play-large', 
            'play', 
            'progress', 
            'current-time', 
            'mute', 
            'volume', 
            'settings', 
            'fullscreen'
          ],
          settings: ['quality', 'speed'],
          youtube: {
            noCookie: true,
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3,
            modestbranding: 1
          },
          tooltips: { controls: true, seek: true }
        });

        instanceRef.current = player;
      } catch (error) {
        console.error("Failed to initialize Plyr:", error);
      }
    };

    initPlyr();

    return () => {
      if (instanceRef.current) {
        instanceRef.current.destroy();
      }
    };
  }, [videoId]);

  if (!videoId) return null;

  return (
    <div ref={containerRef} className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl bg-black border-4 border-white/10 group custom-video-player">
      <div 
        className="plyr-container"
        data-plyr-provider="youtube" 
        data-plyr-embed-id={videoId}
      />
      {/* Decorative premium border overlay */}
      <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-2xl z-10"></div>
    </div>
  );
}
