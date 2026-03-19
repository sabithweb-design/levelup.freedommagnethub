
import { Card, CardContent } from '@/components/ui/card';
import { VideoPlayer } from './VideoPlayer';
import { Testimonial } from '@/lib/db';
import { Quote, CheckCircle2 } from 'lucide-react';

export function VideoTestimonials({ videoIds }: { videoIds: string[] }) {
  if (!videoIds || videoIds.length === 0) return null;
  
  return (
    <section className="py-24 bg-primary/5 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-4 block">Watch the Journey</span>
          <h2 className="text-4xl md:text-5xl font-headline font-black text-primary mb-6 uppercase tracking-tight">Student Video Reviews</h2>
          <div className="h-1.5 w-20 bg-accent mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {videoIds.map((id, idx) => (
            <div key={idx} className="group relative">
              <div className="absolute -inset-2 bg-primary/5 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <VideoPlayer videoId={id} />
              <div className="mt-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-border"></div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  Verified Case Study {idx + 1}
                </div>
                <div className="h-px flex-1 bg-border"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ImageTestimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-32 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-24">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-4 block">Industry Recognition</span>
        <h2 className="text-4xl md:text-6xl font-headline font-black text-primary uppercase tracking-tighter mb-6">Real Student Voices</h2>
        <p className="text-muted-foreground text-lg font-medium max-w-2xl mx-auto">
          Hear from the professionals who have successfully navigated the Freedom Framework.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {testimonials.map((t, idx) => (
          <Card key={idx} className="h-full bg-white border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] transition-all duration-500 rounded-[2.5rem] overflow-hidden group flex flex-col">
            <div className="h-2 w-full bg-accent opacity-80"></div>
            <CardContent className="p-10 flex flex-col flex-grow relative">
              <Quote className="absolute top-8 right-8 w-16 h-16 text-primary/5 -rotate-12 group-hover:text-accent/10 group-hover:scale-110 transition-all duration-500" />
              
              <div className="flex-grow relative z-10">
                <p className="text-primary text-xl font-medium leading-relaxed italic mb-10">
                  "{t.content}"
                </p>
              </div>

              <div className="mt-auto pt-8 border-t border-border/50 flex items-center justify-between">
                <div>
                  {t.name ? (
                    <h4 className="font-headline font-bold text-primary text-lg tracking-tight uppercase">{t.name}</h4>
                  ) : (
                    <h4 className="font-headline font-bold text-primary text-lg tracking-tight uppercase">Verified Student</h4>
                  )}
                  {t.role && (
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-1">{t.role}</p>
                  )}
                </div>
                <div className="bg-emerald-50 p-2 rounded-full">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
