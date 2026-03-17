'use client';

import { useDoc, useMemoFirebase, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { VideoPlayer } from '@/components/program/VideoPlayer';
import { Gallery } from '@/components/program/Gallery';
import { VideoTestimonials, ImageTestimonials } from '@/components/program/Testimonials';
import { CountdownCTA } from '@/components/program/CountdownCTA';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

const Logo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="25" y="10" width="22" height="35" rx="4" fill="#2B3990" />
    <rect x="53" y="10" width="22" height="35" rx="4" fill="#FF0000" />
    <circle cx="50" cy="55" r="9" fill="#333333" />
    <path 
      d="M25 45C25 45 25 85 50 105C75 85 75 45 75 45C75 45 75 95 50 115C25 95 25 45 25 45Z" 
      fill="#333333" 
    />
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

export default function ProgramPage() {
  const params = useParams();
  const id = params.id as string;
  const db = useFirestore();
  
  const programRef = useMemoFirebase(() => doc(db, 'programs', id), [db, id]);
  const { data: program, isLoading } = useDoc(programRef);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Program Not Found</h1>
        <p className="text-muted-foreground mb-8">This program hasn't been set up in the Admin Panel yet.</p>
        <a href="/admin" className="text-primary font-bold hover:underline uppercase tracking-widest text-xs">
          Go to Admin Panel
        </a>
      </div>
    );
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
          <a href="#gallery" className="hover:text-primary transition-colors">Curriculum</a>
          <a href="#testimonials" className="hover:text-primary transition-colors">Testimonials</a>
          <a href="/admin" className="text-accent hover:opacity-80 transition-opacity">Admin</a>
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
        {program.gallery && program.gallery.length > 0 && (
          <div id="gallery">
            <Gallery images={program.gallery} />
          </div>
        )}
        <div id="testimonials">
          {program.videoTestimonials && program.videoTestimonials.length > 0 && (
            <VideoTestimonials videoIds={program.videoTestimonials} />
          )}
          {program.imageTestimonials && program.imageTestimonials.length > 0 && (
            <ImageTestimonials testimonials={program.imageTestimonials} />
          )}
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
          <a href="/admin" className="hover:text-primary transition-colors">Manage Site</a>
          <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          <a href="#" className="hover:text-primary transition-colors">Support</a>
        </div>
      </footer>
    </div>
  );
}
