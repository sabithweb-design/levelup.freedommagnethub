
'use client';

import { useDoc, useMemoFirebase, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { VideoPlayer } from '@/components/program/VideoPlayer';
import { Gallery } from '@/components/program/Gallery';
import { VideoTestimonials, ImageTestimonials } from '@/components/program/Testimonials';
import { CountdownCTA } from '@/components/program/CountdownCTA';
import { Features } from '@/components/program/Features';
import { FAQ } from '@/components/program/FAQ';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Logo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="25" y="10" width="22" height="35" rx="6" fill="#2B3990" />
    <rect x="53" y="10" width="22" height="35" rx="6" fill="#FF0000" />
    <circle cx="50" cy="55" r="9" fill="#333333" />
    <path 
      d="M25 45C25 45 25 85 50 105C75 85 75 45 75 45C75 45 75 95 50 115C25 95 25 45 25 45Z" 
      fill="#333333" 
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
        <h1 className="text-2xl font-bold mb-4 text-primary">Program Not Found</h1>
        <p className="text-muted-foreground mb-8 max-w-md">This program hasn't been configured in the Admin Panel yet.</p>
        <Button asChild variant="outline">
          <a href="/admin">Go to Admin Panel</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen selection:bg-primary selection:text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border/50">
        <div className="py-4 px-6 max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="font-headline font-black text-lg tracking-tighter text-primary leading-none uppercase">
                Freedom
              </span>
              <span className="font-headline font-black text-lg tracking-tighter text-[#333333] leading-none uppercase">
                Magnet Hub
              </span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
            <a href="#features" className="hover:text-primary transition-colors">Why Us</a>
            <a href="#curriculum" className="hover:text-primary transition-colors">Curriculum</a>
            <a href="#testimonials" className="hover:text-primary transition-colors">Success Stories</a>
            <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
            <Button size="sm" className="bg-accent hover:bg-accent/90 text-white rounded-full font-bold px-6" asChild>
              <a href="#join">Get Access</a>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-24 pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] bg-accent/5 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-5xl mx-auto text-center">
          <Badge variant="outline" className="mb-8 px-5 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-accent border-accent/20 bg-accent/5 rounded-full">
            Industry Leading Certification
          </Badge>
          <h1 className="text-5xl md:text-8xl font-headline font-black text-primary mb-8 leading-[0.95] tracking-tighter">
            {program.title}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
            {program.subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button size="lg" className="h-16 px-10 text-lg font-bold bg-primary hover:bg-primary/90 text-white rounded-full shadow-2xl shadow-primary/20 group" asChild>
              <a href="#join">
                Start Your Journey <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>Full Lifetime Access</span>
            </div>
          </div>

          <div className="max-w-4xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-[2.5rem] blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <VideoPlayer videoId={program.demoVideoId} />
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features">
        <Features features={program.features} />
      </section>

      {/* Main Content Sections */}
      <main>
        {program.gallery && program.gallery.length > 0 && (
          <div id="curriculum">
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

        <section id="faq">
          <FAQ faqs={program.faqs} />
        </section>

        <div id="join">
          <CountdownCTA expiryDate={program.expiryDate} joinLink={program.joinButtonLink} />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-24 px-6 border-t border-border bg-muted/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <Logo className="w-12 h-12" />
              <div className="flex flex-col">
                <span className="font-headline font-black text-2xl tracking-tighter text-primary leading-none uppercase">
                  Freedom
                </span>
                <span className="font-headline font-black text-2xl tracking-tighter text-[#333333] leading-none uppercase">
                  Magnet Hub
                </span>
              </div>
            </div>
            <p className="text-muted-foreground text-lg max-w-sm mb-8 leading-relaxed">
              Empowering the next generation of digital leaders through world-class education and professional mentorship.
            </p>
          </div>
          
          <div>
            <h4 className="font-headline font-black text-sm uppercase tracking-widest mb-6 text-primary">Resources</h4>
            <ul className="space-y-4 text-sm font-bold text-muted-foreground uppercase tracking-wider">
              <li><a href="#curriculum" className="hover:text-primary transition-colors">Program Specs</a></li>
              <li><a href="#features" className="hover:text-primary transition-colors">Learning Path</a></li>
              <li><a href="#faq" className="hover:text-primary transition-colors">Support Center</a></li>
              <li><a href="/admin" className="text-accent hover:opacity-80">Admin Panel</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline font-black text-sm uppercase tracking-widest mb-6 text-primary">Company</h4>
            <ul className="space-y-4 text-sm font-bold text-muted-foreground uppercase tracking-wider">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-16 mt-16 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-muted-foreground text-xs font-medium">
            &copy; {new Date().getFullYear()} Freedom Magnet Hub.
          </p>
        </div>
      </footer>
    </div>
  );
}
