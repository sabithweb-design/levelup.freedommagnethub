import { notFound } from 'next/navigation';
import { getProgram } from '@/lib/db';
import { VideoPlayer } from '@/components/program/VideoPlayer';
import { Gallery } from '@/components/program/Gallery';
import { VideoTestimonials, ImageTestimonials } from '@/components/program/Testimonials';
import { CountdownCTA } from '@/components/program/CountdownCTA';
import { Badge } from '@/components/ui/badge';

const Logo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Magnet Terminals (Bars) with radius */}
    <rect x="25" y="10" width="22" height="35" rx="4" fill="#2B3990" /> {/* Blue */}
    <rect x="53" y="10" width="22" height="35" rx="4" fill="#FF0000" /> {/* Red */}
    
    {/* Central Circle */}
    <circle cx="50" cy="55" r="9" fill="#333333" />
    
    {/* U-Shape Body / Wings */}
    <path 
      d="M25 45C25 45 25 85 50 105C75 85 75 45 75 45C75 45 75 95 50 115C25 95 25 45 25 45Z" 
      fill="#333333" 
    />
    
    {/* Internal Swooshes */}
    <path 
      d="M28 55C35 85 65 85 72 55C60 90 40 90 28 55Z" 
      fill="white" 
      fillOpacity="0.2" 
    />
    <path 
      d="M32 65C40 85 60 85 68 65C55 90 45 90 32 65Z" 
      fill="white" 
      fillOpacity="0.3" 
    />
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
      <nav className="py-6 px-6 max-w-7xl mx-auto flex items-center justify-between border-b border-border/50">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="flex flex-col">
            <span className="font-headline font-black text-xl tracking-tighter text-primary leading-none uppercase">
              Freedom
            </span>
            <span className="font-headline font-black text-xl tracking-tighter text-[#333333] leading-none uppercase">
              Magnet Hub
            </span>
          </div>
        </div>
        <div className="hidden md:flex gap-8 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          <a href="#curriculum" className="hover:text-primary transition-colors">Curriculum</a>
          <a href="#testimonials" className="hover:text-primary transition-colors">Testimonials</a>
          <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="py-20 px-6 max-w-5xl mx-auto text-center">
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
        <div id="gallery">
          <Gallery images={program.gallery} />
        </div>
        <div id="testimonials">
          <VideoTestimonials videoIds={program.videoTestimonials} />
          <ImageTestimonials testimonials={program.imageTestimonials} />
        </div>
        <CountdownCTA expiryDate={program.expiryDate} />
      </main>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-border bg-white flex flex-col items-center">
        <Logo className="w-16 h-16 mb-4 opacity-50 grayscale hover:grayscale-0 transition-all" />
        <div className="text-center mb-6">
          <h2 className="font-headline font-black text-xl tracking-tighter text-[#333333] leading-none uppercase">
            Freedom
          </h2>
          <h2 className="font-headline font-black text-xl tracking-tighter text-[#333333] leading-none uppercase">
            Magnet Hub
          </h2>
        </div>
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
