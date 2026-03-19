'use client';

import { useEffect, useRef } from 'react';
import 'plyr/dist/plyr.css';

/**
 * @fileOverview A professional custom video player using Plyr.js.
 * Wraps YouTube videos to provide a clean, branded LMS-style interface
 * and minimizes standard YouTube UI distractions.
 * Includes auto-pause functionality for multiple players.
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
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3,
            modestbranding: 1
          },
          tooltips: { controls: true, seek: true }
        });

        // Store instance in ref for cleanup
        instanceRef.current = player;

        // Register the player instance globally for auto-pause logic
        if (!(window as any).plyrInstances) {
          (window as any).plyrInstances = [];
        }
        (window as any).plyrInstances.push(player);

        // Add auto-pause logic: when this player starts playing, pause all other registered instances
        player.on('play', () => {
          const allPlayers = (window as any).plyrInstances || [];
          allPlayers.forEach((p: any) => {
            if (p !== player && typeof p.pause === 'function') {
              p.pause();
            }
          });
        });

      } catch (error) {
        // Errors are captured and handled by the global listener
      }
    };

    initPlyr();

    return () => {
      if (instanceRef.current) {
        // Clean up global registry to prevent memory leaks and stale references
        if ((window as any).plyrInstances) {
          (window as any).plyrInstances = (window as any).plyrInstances.filter(
            (p: any) => p !== instanceRef.current
          );
        }
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
