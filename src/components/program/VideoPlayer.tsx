export function VideoPlayer({ videoId }: { videoId: string }) {
  return (
    <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl bg-black border-4 border-white/10 group">
      <iframe
        className="absolute inset-0 w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
      <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-2xl"></div>
    </div>
  );
}
