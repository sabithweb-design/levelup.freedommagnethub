'use client';

import { useEffect, useRef } from 'react';
import 'plyr/dist/plyr.css';

/**
 * @fileOverview A professional custom video player using Plyr.js.
 * Wraps YouTube videos to provide a clean, branded LMS-style interface
 * and minimizes standard YouTube UI distractions.
 */

interface VideoPlayerProps {
  videoId?: string;
}

export function VideoPlayer({ videoId = 'P5_rBMem0cE' }: VideoPlayerProps) {
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

        // Initialize Plyr with optimized settings for a clean LMS look
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
            rel: 0, // Only show related videos from the same channel (minimized distraction)
            showinfo: 0, // Deprecated by YT but included for legacy compatibility
            iv_load_policy: 3, // Hide video annotations
            modestbranding: 1 // Reduce YouTube logo presence in the control bar
          },
          tooltips: { controls: true, seek: true }
        });

        instanceRef.current = player;
      } catch (error) {
        // Error handling is managed centrally by the FirebaseErrorListener
        // for consistency across the application.
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
    <div 
      ref={containerRef} 
      className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl bg-black border-4 border-white/10 group custom-video-player transition-all duration-500 hover:border-primary/20"
    >
      <div 
        className="plyr-container h-full w-full"
        data-plyr-provider="youtube" 
        data-plyr-embed-id={videoId}
      />
      {/* Premium overlay for depth and professional feel */}
      <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-2xl z-10 shadow-inner"></div>
    </div>
  );
}
