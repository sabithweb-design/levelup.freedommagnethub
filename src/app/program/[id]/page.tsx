import { notFound } from 'next/navigation';
import { getProgram } from '@/lib/db';
import { VideoPlayer } from '@/components/program/VideoPlayer';
import { Gallery } from '@/components/program/Gallery';
import { VideoTestimonials, ImageTestimonials } from '@/components/program/Testimonials';
import { CountdownCTA } from '@/components/program/CountdownCTA';
import { Badge } from '@/components/ui/badge';

const Logo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Magnet Terminals */}
    <rect x="25" y="5" width="22" height="28" fill="#2B3990" /> {/* Blue */}
    <rect x="53" y="5" width="22" height="28" fill="#FF0000" /> {/* Red */}
    
    {/* Central Figure - Head */}
    <circle cx="50" cy="48" r="7" fill="#333333" />
    
    {/* Wing / U-Shape Base */}
    <path 
      d="M25 33C25 33 25 75 50 95C75 75 75 33 75 33C75 33 75 85 50 105C25 85 25 33 25 33Z" 
      fill="#333333" 
    />
    
    {/* Internal Swooshes */}
    <path d="M28 45Q40 85 72 45Q50 75 28 45Z" fill="white" fillOpacity="0.2" />
    <path d="M32 55Q50 90 68 55Q50 80 32 55Z" fill="white" fillOpacity="0.3" />
  </svg>
);

export default async function ProgramPage({ params }: { params: { id: string } }) {
  const program = await getProgram(params.id);

  if (!program) {
    notFound();
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Navigation */}
      <nav className="p-6 max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex flex-col items-center gap-2 group cursor-pointer">
          <Logo className="w-16 h-16 transition-transform duration-300 group-hover:scale-105" />
          <div className="text-center">
            <h2 className="font-headline font-black text-2xl tracking-tighter text-[#333333] leading-none uppercase">
              Freedom
            </h2>
            <h2 className="font-headline font-black text-2xl tracking-tighter text-[#333333] leading-none uppercase">
              Magnet Hub
            </h2>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="py-12 px-6 max-w-5xl mx-auto text-center">
        <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-accent border border-accent/20">
          Professional Certification
        </Badge>
        <h1 className="text-4xl md:text-7xl font-headline font-black text-primary mb-6 leading-[1.1] tracking-tight">
          {program.title}
        </h1>
        <p className="text-lg md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto font-light leading-relaxed">
          {program.subtitle}
        </p>
        
        <div className="max-w-4xl mx-auto">
          <VideoPlayer videoId={program.demoVideoId} />
        </div>
      </header>

      {/* Main Content Sections */}
      <main>
        <Gallery images={program.gallery} />
        <VideoTestimonials videoIds={program.videoTestimonials} />
        <ImageTestimonials testimonials={program.imageTestimonials} />
        <CountdownCTA expiryDate={program.expiryDate} />
      </main>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-border bg-white flex flex-col items-center">
        <Logo className="w-12 h-12 mb-4 opacity-50 grayscale hover:grayscale-0 transition-all" />
        <p className="font-headline font-bold text-lg text-primary/80 uppercase tracking-widest mb-4">Freedom Magnet Hub</p>
        <p className="text-muted-foreground text-xs">
          &copy; {new Date().getFullYear()} Freedom Magnet Hub. All rights reserved.
        </p>
        <div className="flex justify-center gap-8 mt-6 text-[10px] font-bold uppercase tracking-widest text-primary/40">
          <a href="#" className="hover:text-primary transition-colors">Terms</a>
          <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          <a href="#" className="hover:text-primary transition-colors">Support</a>
        </div>
      </footer>
    </div>
  );
}
