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
import { Loader2, ArrowRight, CheckCircle2, Globe, ShieldCheck, Trophy, Layout, Sparkles, LucideIcon, Star, Zap, Users, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const trustIconMap: Record<string, LucideIcon> = {
  Globe,
  Trophy,
  Layout,
  ShieldCheck,
  Zap,
  Users,
  BookOpen,
  Star
};

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
  const hasVideo = !!program.demoVideoId;
  const hasFeatures = program.features && program.features.length > 0;
  const hasGallery = program.gallery && program.gallery.length > 0;
  const hasVideoTestimonials = program.videoTestimonials && program.videoTestimonials.some(v => !!v);
  const hasImageTestimonials = program.imageTestimonials && program.imageTestimonials.length > 0;
  const hasFAQ = program.faqs && program.faqs.length > 0;
  const hasTrust = program.trustItems && program.trustItems.length > 0;

  return (
    <div className="bg-background min-h-screen selection:bg-primary selection:text-white relative">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/60 backdrop-blur-[12px] border-b border-white/5">
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
            {hasFeatures && <a href="#features" className="hover:text-white transition-colors">Framework</a>}
            {hasGallery && <a href="#curriculum" className="hover:text-white transition-colors">Previews</a>}
            {(hasVideoTestimonials || hasImageTestimonials) && <a href="#testimonials" className="hover:text-white transition-colors">Results</a>}
            {hasFAQ && <a href="#faq" className="hover:text-white transition-colors">Questions</a>}
            <Button size="sm" className="fiery-gradient fiery-glow hover:brightness-110 text-white rounded-full font-black px-8 py-5 transition-all" asChild>
              <a href="#join">GRAB YOUR SEAT</a>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className={cn(
        "relative pt-24 px-6 overflow-hidden",
        hasVideo ? "pb-48" : "pb-32"
      )}>
        <div className={cn("max-w-5xl mx-auto flex flex-col", alignmentClasses[selectedAlignment])}>
          <div className="inline-flex items-center gap-2 mb-10 px-6 py-2 rounded-full border border-white/10 bg-white/5 w-fit backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Elite Certification Path</span>
          </div>
          
          <h1 
            className="font-headline font-black text-gradient-accent mb-10 leading-[0.9] tracking-tighter"
            style={{ 
              fontSize: program.titleFontSize ? `${program.titleFontSize}px` : 'clamp(3rem, 10vw, 8rem)',
              lineHeight: program.lineHeight || 0.9,
              letterSpacing: program.letterSpacing ? `${program.letterSpacing}px` : '-0.04em',
              textAlign: selectedAlignment
            }}
          >
            {program.title}
          </h1>
          
          <p 
            className="text-foreground/90 mb-16 max-w-3xl font-medium leading-relaxed"
            style={{ 
              fontSize: program.subtitleFontSize ? `${program.subtitleFontSize}px` : 'clamp(1.1rem, 2vw, 1.5rem)',
              textAlign: selectedAlignment
            }}
          >
            {program.subtitle}
          </p>
          
          <div className={cn(
            "flex flex-col sm:flex-row items-center gap-6 mb-24", 
            selectedAlignment === 'center' ? 'justify-center' : selectedAlignment === 'right' ? 'justify-end' : 'justify-start',
            !hasVideo && "mb-0"
          )}>
            <Button size="lg" className="h-14 px-10 text-lg font-black fiery-gradient fiery-glow hover:brightness-110 text-white rounded-full transition-all group uppercase tracking-tight hover:scale-105 active:scale-95" asChild>
              <a href="#join">
                GRAB YOUR SEAT <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
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

          {hasVideo && (
            <div className="max-w-4xl w-full mx-auto relative group mt-24">
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 bg-white/[0.03] backdrop-blur-[12px] p-1">
                <VideoPlayer videoId={program.demoVideoId} />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Trust Bar */}
      {hasTrust && (
        <div className="bg-white/[0.02] border-y border-white/5 py-14 px-6 backdrop-blur-[8px]">
          <div className="max-w-7xl mx-auto flex flex-wrap justify-center md:justify-between items-center gap-8 text-white/60">
            {program.trustItems?.map((item, idx) => {
              const Icon = trustIconMap[item.iconName] || Globe;
              return (
                <div key={idx} className="flex items-center gap-3">
                  <Icon className="w-6 h-6 text-accent" />
                  <span className="font-black uppercase tracking-tighter text-xl text-white">
                    {item.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {hasFeatures && (
        <section id="features" className="scroll-mt-20">
          <Features 
            features={program.features} 
            title={program.featuresTitle} 
            subtitle={program.featuresSubtitle} 
          />
        </section>
      )}

      {hasGallery && (
        <section id="curriculum" className="scroll-mt-20">
          <Gallery 
            images={program.gallery} 
            title={program.galleryTitle} 
            subtitle={program.gallerySubtitle} 
          />
        </section>
      )}
      
      {(hasVideoTestimonials || hasImageTestimonials) && (
        <div id="testimonials" className="scroll-mt-20">
          {hasVideoTestimonials && (
            <VideoTestimonials 
              videoIds={program.videoTestimonials} 
              title={program.testimonialsTitle}
              subtitle={program.testimonialsSubtitle}
            />
          )}
          {hasImageTestimonials && (
            <ImageTestimonials 
              testimonials={program.imageTestimonials} 
              title={!hasVideoTestimonials ? program.testimonialsTitle : undefined}
              subtitle={!hasVideoTestimonials ? program.testimonialsSubtitle : undefined}
            />
          )}
        </div>
      )}

      {hasFAQ && (
        <section id="faq" className="scroll-mt-20">
          <FAQ 
            faqs={program.faqs} 
            title={program.faqTitle} 
            subtitle={program.faqSubtitle} 
          />
        </section>
      )}

      <div id="join" className="scroll-mt-20">
        <CountdownCTA expiryDate={program.expiryDate} joinLink={program.joinButtonLink} />
      </div>

      <StickyOfferBar 
        expiryDate={program.expiryDate} 
        joinLink={program.joinButtonLink}
        oldPriceLabel={program.oldPriceLabel}
        currentPriceLabel={program.currentPriceLabel}
        priceSubtext={program.priceSubtext}
      />

      <footer className="py-40 px-6 border-t border-white/5 bg-background/80 backdrop-blur-md text-white overflow-hidden relative">
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
            <p className="text-foreground/80 text-xl max-w-md mb-10 font-medium leading-relaxed">
              {program.footerDescription || 'We engineer pathways to professional autonomy through strategic education and world-class mentorship.'}
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-accent cursor-pointer hover:bg-accent hover:text-white transition-all"><Globe className="w-5 h-5" /></div>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-accent cursor-pointer hover:bg-accent hover:text-white transition-all"><Trophy className="w-5 h-5" /></div>
            </div>
          </div>
          
          <div>
            <h4 className="font-headline font-black text-xs uppercase tracking-[0.3em] mb-8 text-white/30">Curriculum</h4>
            <ul className="space-y-6 text-sm font-bold text-white/40 uppercase tracking-wider">
              {hasGallery && <li><a href="#curriculum" className="hover:text-accent transition-colors">Program Specs</a></li>}
              {hasFeatures && <li><a href="#features" className="hover:text-accent transition-colors">Learning Path</a></li>}
              {(hasVideoTestimonials || hasImageTestimonials) && <li><a href="#testimonials" className="hover:text-accent transition-colors">Student Results</a></li>}
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
            &copy; {new Date().getFullYear()} {program.footerCopyright || 'Freedom Magnet Hub Global. All Rights Reserved.'}
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
