'use client';

import { useDoc, useMemoFirebase, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { VideoPlayer } from '@/components/program/VideoPlayer';
import { Gallery } from '@/components/program/Gallery';
import { VideoTestimonials, ImageTestimonials } from '@/components/program/Testimonials';
import { CountdownCTA } from '@/components/program/CountdownCTA';
import { StickyOfferBar } from '@/components/program/StickyOfferBar';
import { Features } from '@/components/program/Features';
import { FAQ } from '@/components/program/FAQ';
import { Loader2, ArrowRight, CheckCircle2, Globe, ShieldCheck, Trophy, Layout, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function ProgramPage() {
  const params = useParams();
  const id = params.id as string;
  const db = useFirestore();
  
  const programRef = useMemoFirebase(() => doc(db, 'programs', id), [db, id]);
  const { data: program, isLoading } = useDoc(programRef);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-sm font-headline font-bold uppercase tracking-widest text-muted-foreground">Initializing Environment...</p>
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
        <h1 className="text-4xl font-headline font-black mb-4 text-white uppercase tracking-tighter">Program Not Found</h1>
        <p className="text-muted-foreground mb-8 max-w-md text-lg font-medium leading-relaxed">
          The requested learning pathway hasn't been configured in the Freedom Magnet Hub yet.
        </p>
        <div className="flex gap-4">
          <Button asChild variant="default" className="fiery-gradient rounded-full px-8 font-bold text-white">
            <Link href="/admin">Configure in Admin</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full px-8 font-bold border-white/20 text-white">
            <Link href="/dashboard">View Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  const alignmentClasses = {
    left: 'text-left mx-0 items-start',
    center: 'text-center mx-auto items-center',
    right: 'text-right ml-auto items-end',
  };

  const selectedAlignment = program.textAlign || 'center';

  return (
    <div className="bg-background min-h-screen selection:bg-primary selection:text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/5">
        <div className="py-4 px-6 max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1 group cursor-pointer">
            <div className="flex flex-col">
              <span className="font-headline font-black text-xl tracking-tighter text-white leading-none uppercase">
                Freedom
              </span>
              <span className="font-headline font-black text-xl tracking-tighter text-accent leading-none uppercase">
                Magnet Hub
              </span>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            <a href="#features" className="hover:text-white transition-colors">Framework</a>
            <a href="#curriculum" className="hover:text-white transition-colors">Previews</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Results</a>
            <a href="#faq" className="hover:text-white transition-colors">Questions</a>
            <Button size="sm" className="fiery-gradient fiery-glow hover:brightness-110 text-white rounded-full font-black px-8 py-5 transition-all" asChild>
              <a href="#join">GRAB YOUR SEAT</a>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-24 pb-48 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[160px]"></div>
          <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[140px]"></div>
        </div>

        <div className={cn("max-w-5xl mx-auto flex flex-col", alignmentClasses[selectedAlignment])}>
          <div className="inline-flex items-center gap-2 mb-10 px-6 py-2 rounded-full border border-white/10 bg-white/5 w-fit backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Elite Certification Path</span>
          </div>
          
          <h1 
            className="font-headline font-black text-white mb-10 leading-[0.9] tracking-tighter"
            style={{ 
              fontSize: program.titleFontSize ? `${program.titleFontSize}px` : undefined,
              lineHeight: program.lineHeight,
              letterSpacing: program.letterSpacing ? `${program.letterSpacing}px` : undefined,
              textAlign: selectedAlignment
            }}
          >
            {program.title}
          </h1>
          
          <p 
            className="text-foreground mb-16 max-w-3xl font-medium leading-relaxed"
            style={{ 
              fontSize: program.subtitleFontSize ? `${program.subtitleFontSize}px` : undefined,
              textAlign: selectedAlignment
            }}
          >
            {program.subtitle}
          </p>
          
          <div className={cn("flex flex-col sm:flex-row items-center gap-6 mb-24", selectedAlignment === 'center' ? 'justify-center' : selectedAlignment === 'right' ? 'justify-end' : 'justify-start')}>
            <Button size="lg" className="h-20 px-12 text-xl font-black fiery-gradient fiery-glow hover:brightness-110 text-white rounded-full transition-all group uppercase tracking-tight" asChild>
              <a href="#join">
                GRAB YOUR SEAT <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </a>
            </Button>
            <div className={cn("flex flex-col gap-1", selectedAlignment === 'center' ? 'items-center sm:items-start' : selectedAlignment === 'right' ? 'items-end' : 'items-start')}>
              <div className="flex items-center gap-2 text-sm font-bold text-accent">
                <CheckCircle2 className="w-5 h-5" />
                <span>Next Intake Open Now</span>
              </div>
              <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">Global Access Enabled</p>
            </div>
          </div>

          <div className="max-w-4xl w-full mx-auto relative group">
            <div className="absolute -inset-4 bg-primary/20 rounded-[3rem] blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 bg-card/40 backdrop-blur-md p-1">
              <VideoPlayer videoId={program.demoVideoId} />
            </div>
          </div>
        </div>
      </header>

      {/* Trust Bar */}
      <div className="bg-card/30 border-y border-white/5 py-14 px-6 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center md:justify-between items-center gap-8 text-white/60">
          <div className="flex items-center gap-3"><Globe className="w-6 h-6 text-accent" /><span className="font-black uppercase tracking-tighter text-xl">Global Network</span></div>
          <div className="flex items-center gap-3"><Trophy className="w-6 h-6 text-accent" /><span className="font-black uppercase tracking-tighter text-xl text-white">Industry Certified</span></div>
          <div className="flex items-center gap-3"><Layout className="w-6 h-6 text-accent" /><span className="font-black uppercase tracking-tighter text-xl">Mastery Curriculum</span></div>
        </div>
      </div>

      <section id="features" className="scroll-mt-20">
        <Features features={program.features} />
      </section>

      {program.gallery && program.gallery.length > 0 && (
        <section id="curriculum" className="scroll-mt-20">
          <Gallery images={program.gallery} />
        </section>
      )}
      
      <div id="testimonials" className="scroll-mt-20">
        {program.videoTestimonials && program.videoTestimonials.length > 0 && (
          <VideoTestimonials videoIds={program.videoTestimonials} />
        )}
        {program.imageTestimonials && program.imageTestimonials.length > 0 && (
          <ImageTestimonials testimonials={program.imageTestimonials} />
        )}
      </div>

      <section id="faq" className="scroll-mt-20">
        <FAQ faqs={program.faqs} />
      </section>

      <div id="join" className="scroll-mt-20">
        <CountdownCTA expiryDate={program.expiryDate} joinLink={program.joinButtonLink} />
      </div>

      <StickyOfferBar expiryDate={program.expiryDate} joinLink={program.joinButtonLink} />

      <footer className="py-40 px-6 border-t border-white/5 bg-background text-white overflow-hidden relative">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] translate-x-1/4 translate-y-1/4"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20 relative z-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-1 mb-10">
              <div className="flex flex-col">
                <span className="font-headline font-black text-3xl tracking-tighter text-white leading-none uppercase">
                  Freedom
                </span>
                <span className="font-headline font-black text-3xl tracking-tighter text-accent leading-none uppercase">
                  Magnet Hub
                </span>
              </div>
            </div>
            <p className="text-foreground text-xl max-w-md mb-10 font-medium leading-relaxed">
              We engineer pathways to professional autonomy through strategic education and world-class mentorship.
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-accent cursor-pointer hover:bg-accent hover:text-white transition-all"><Globe className="w-5 h-5" /></div>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-accent cursor-pointer hover:bg-accent hover:text-white transition-all"><Trophy className="w-5 h-5" /></div>
            </div>
          </div>
          
          <div>
            <h4 className="font-headline font-black text-xs uppercase tracking-[0.3em] mb-8 text-white/30">Curriculum</h4>
            <ul className="space-y-6 text-sm font-bold text-white/40 uppercase tracking-wider">
              <li><a href="#curriculum" className="hover:text-accent transition-colors">Program Specs</a></li>
              <li><a href="#features" className="hover:text-accent transition-colors">Learning Path</a></li>
              <li><a href="#testimonials" className="hover:text-accent transition-colors">Student Results</a></li>
              <li><Link href="/login" className="hover:text-accent transition-colors">Admin Console</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline font-black text-xs uppercase tracking-[0.3em] mb-8 text-white/30">Company</h4>
            <ul className="space-y-6 text-sm font-bold text-white/40 uppercase tracking-wider">
              <li><a href="#" className="hover:text-accent transition-colors">Our Mission</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Support</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-20 mt-20 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Freedom Magnet Hub Global. All Rights Reserved.
          </p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-white/10">
            <span className="cursor-pointer hover:text-white">English (US)</span>
            <span className="cursor-pointer hover:text-white">Terms</span>
            <span className="cursor-pointer hover:text-white">Privacy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
