import { notFound } from 'next/navigation';
import { getProgram } from '@/lib/db';
import { VideoPlayer } from '@/components/program/VideoPlayer';
import { Gallery } from '@/components/program/Gallery';
import { VideoTestimonials, ImageTestimonials } from '@/components/program/Testimonials';
import { CountdownCTA } from '@/components/program/CountdownCTA';
import { Badge } from '@/components/ui/badge';
import { Magnet } from 'lucide-react';

export default async function ProgramPage({ params }: { params: { id: string } }) {
  const program = await getProgram(params.id);

  if (!program) {
    notFound();
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Navigation */}
      <nav className="p-6 max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md border border-border overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-[#00008B]/10"></div>
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-[#FF0000]/10"></div>
            <Magnet className="w-6 h-6 text-primary relative z-10" />
          </div>
          <span className="font-headline font-bold text-xl tracking-tight text-primary uppercase">Freedom Magnet Hub</span>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="py-20 px-6 max-w-5xl mx-auto text-center">
        <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent border border-accent/20">
          Professional Certification
        </Badge>
        <h1 className="text-4xl md:text-6xl font-headline font-bold text-primary mb-6 leading-tight">
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
      <footer className="py-12 px-6 border-t border-border bg-white text-center">
        <p className="text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} Freedom Magnet Hub. All rights reserved.
        </p>
        <div className="flex justify-center gap-8 mt-4 text-xs font-medium text-primary/60">
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">Contact Support</a>
        </div>
      </footer>
    </div>
  );
}
