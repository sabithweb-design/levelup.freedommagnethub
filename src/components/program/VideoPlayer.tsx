'use client';

import { useEffect, useRef } from 'react';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

/**
 * @fileOverview A professional custom video player using Plyr.js.
 * Wraps YouTube videos to provide a clean, branded LMS-style interface
 * and minimizes standard YouTube UI distractions.
 */

export function VideoPlayer({ videoId }: { videoId: string }) {
  const playerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<Plyr | null>(null);

  useEffect(() => {
    if (!playerRef.current || !videoId) return;

    // Initialize Plyr instance
    instanceRef.current = new Plyr(playerRef.current, {
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
      // Hiding related videos and maximizing focus
      tooltips: { controls: true, seek: true }
    });

    return () => {
      if (instanceRef.current) {
        instanceRef.current.destroy();
      }
    };
  }, [videoId]);

  if (!videoId) return null;

  return (
    <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl bg-black border-4 border-white/10 group custom-video-player">
      <div 
        ref={playerRef} 
        data-plyr-provider="youtube" 
        data-plyr-embed-id={videoId}
      />
      {/* Decorative premium border overlay */}
      <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-2xl z-10"></div>
    </div>
  );
}