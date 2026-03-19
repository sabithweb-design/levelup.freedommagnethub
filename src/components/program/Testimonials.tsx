
import { Card, CardContent } from '@/components/ui/card';
import { VideoPlayer } from './VideoPlayer';
import { Testimonial } from '@/lib/db';
import { Quote } from 'lucide-react';

export function VideoTestimonials({ videoIds }: { videoIds: string[] }) {
  if (!videoIds || videoIds.length === 0) return null;
  
  return (
    <section className="py-20 bg-primary/5 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary mb-4">Success Stories</h2>
          <p className="text-muted-foreground text-lg">Hear directly from our global community of graduates.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {videoIds.map((id, idx) => (
            <div key={idx} className="space-y-4">
              <VideoPlayer videoId={id} />
              <div className="h-2 w-12 bg-accent rounded-full mx-auto md:mx-0"></div>
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
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-4 block">Student Feedback</span>
        <h2 className="text-3xl md:text-5xl font-headline font-black text-primary uppercase tracking-tight">Verified Results</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((t, idx) => (
          <Card key={idx} className="h-full bg-white border-none shadow-md hover:shadow-lg transition-all border-l-4 border-l-accent overflow-hidden group">
            <CardContent className="pt-8 flex flex-col h-full relative">
              <Quote className="absolute top-4 right-4 w-12 h-12 text-muted/20 -rotate-12 group-hover:text-accent/10 transition-colors" />
              <p className="text-foreground italic mb-8 flex-grow leading-relaxed text-lg relative z-10">"{t.content}"</p>
              <div className="mt-auto pt-6 border-t border-border/50">
                {t.name && <h4 className="font-bold text-primary text-base">{t.name}</h4>}
                {t.role && <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mt-1">{t.role}</p>}
                {!t.name && !t.role && <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mt-1">Verified Graduate</p>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
