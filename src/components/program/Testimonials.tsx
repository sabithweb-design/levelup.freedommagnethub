import { Card, CardContent } from '@/components/ui/card';
import { VideoPlayer } from './VideoPlayer';
import { Testimonial } from '@/lib/db';
import { Quote, CheckCircle2 } from 'lucide-react';

export function VideoTestimonials({ videoIds }: { videoIds: string[] }) {
  if (!videoIds || videoIds.length === 0) return null;
  
  return (
    <section className="py-40 bg-muted/30 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-4 block">Watch the Journey</span>
          <h2 className="text-4xl md:text-6xl font-headline font-black text-primary mb-6 uppercase tracking-tight">Student Success Stories</h2>
          <div className="h-1.5 w-20 bg-accent mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {videoIds.map((id, idx) => (
            <div key={idx} className="group relative">
              <div className="absolute -inset-4 bg-primary/5 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-elevation border-4 border-white">
                <VideoPlayer videoId={id} />
              </div>
              <div className="mt-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-border"></div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
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
    <section className="py-40 px-6 max-w-7xl mx-auto bg-background">
      <div className="text-center mb-24">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-4 block">Industry Recognition</span>
        <h2 className="text-4xl md:text-7xl font-headline font-black text-primary uppercase tracking-tighter mb-6">Real Student Voices</h2>
        <p className="text-muted-foreground text-xl font-medium max-w-2xl mx-auto">
          Hear from the professionals who have successfully navigated the Freedom Framework.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {testimonials.map((t, idx) => (
          <Card key={idx} className="h-full bg-white border-none shadow-elevation hover:shadow-2xl transition-all duration-500 rounded-[3rem] overflow-hidden group flex flex-col">
            <div className="h-2 w-full bg-accent"></div>
            <CardContent className="p-12 flex flex-col flex-grow relative">
              <Quote className="absolute top-10 right-10 w-20 h-20 text-primary/5 -rotate-12 group-hover:text-accent/10 group-hover:scale-110 transition-all duration-500" />
              
              <div className="flex-grow relative z-10">
                <p className="text-primary text-2xl font-medium leading-relaxed italic mb-12">
                  "{t.content}"
                </p>
              </div>

              <div className="mt-auto pt-10 border-t border-border/50 flex items-center justify-between">
                <div>
                  {t.name ? (
                    <h4 className="font-headline font-bold text-primary text-xl tracking-tight uppercase">{t.name}</h4>
                  ) : (
                    <h4 className="font-headline font-bold text-primary text-xl tracking-tight uppercase">Verified Student</h4>
                  )}
                  {t.role && (
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-1">{t.role}</p>
                  )}
                </div>
                <div className="bg-emerald-50 p-3 rounded-full">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
