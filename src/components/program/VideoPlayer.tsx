'use client';

/**
 * @fileOverview A professional YouTube video player component.
 * Uses optimized embed parameters to minimize external branding and maximize focus.
 */

export function VideoPlayer({ videoId }: { videoId: string }) {
  if (!videoId) return null;

  // Parameters used to minimize branding:
  // modestbranding=1: Removes the YouTube logo from the control bar (standard requirement).
  // rel=0: Ensures related videos at the end are only from the same channel.
  // iv_load_policy=3: Hides video annotations (pop-ups).
  // Note: YouTube deprecated 'showinfo=0' in 2018, so uploader info is enforced by the platform.
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1&iv_load_policy=3&controls=1&showinfo=0`;

  return (
    <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl bg-black border-4 border-white/10 group">
      <iframe
        className="absolute inset-0 w-full h-full"
        src={embedUrl}
        title="Program Video Player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
      {/* Decorative inner border to add a premium feel */}
      <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-2xl"></div>
    </div>
  );
}
