import { Card, CardContent } from '@/components/ui/card';
import { VideoPlayer } from './VideoPlayer';
import { Testimonial } from '@/lib/db';
import { Quote, CheckCircle2 } from 'lucide-react';

interface TestimonialSectionProps {
  title?: string;
  subtitle?: string;
}

export function VideoTestimonials({ videoIds, title = 'Student Success Stories', subtitle = 'Impact Analysis' }: { videoIds: string[] } & TestimonialSectionProps) {
  const activeVideos = videoIds.filter(v => !!v);
  if (activeVideos.length === 0) return null;
  
  return (
    <section className="py-24 md:py-40 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-20">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-4 block">{subtitle}</span>
          <h2 className="text-4xl md:text-6xl font-headline font-black text-white mb-6 uppercase tracking-tight">{title}</h2>
          <div className="h-1.5 w-20 fiery-gradient mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {activeVideos.map((id, idx) => (
            <div key={idx} className="group relative">
              <div className="absolute -inset-4 bg-primary/20 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 glass-card p-1">
                <VideoPlayer videoId={id} />
              </div>
              <div className="mt-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-white/5"></div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-foreground/40">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Verified Outcome {idx + 1}
                </div>
                <div className="h-px flex-1 bg-white/5"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ImageTestimonials({ testimonials, title, subtitle }: { testimonials: Testimonial[] } & TestimonialSectionProps) {
  if (!testimonials || testimonials.length === 0) return null;

  // If title/subtitle are provided, this section is acting as the main testimonials block
  // If not, it's a sub-block (following video testimonials) and should have less top padding
  const isSubBlock = !title && !subtitle;

  return (
    <section className={isSubBlock ? "pb-24 md:pb-40 px-6 max-w-7xl mx-auto" : "py-24 md:py-40 px-6 max-w-7xl mx-auto"}>
      {!isSubBlock && (
        <div className="text-center mb-20 md:mb-24">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-4 block">{subtitle || 'Market Feedback'}</span>
          <h2 className="text-4xl md:text-7xl font-headline font-black text-white uppercase tracking-tighter mb-6">{title || 'Voice of the Network'}</h2>
          <div className="h-1.5 w-20 fiery-gradient mx-auto rounded-full mb-8"></div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
        {testimonials.map((t, idx) => (
          <Card key={idx} className="h-full glass-card hover:-translate-y-2 transition-all duration-500 rounded-[3rem] overflow-hidden group flex flex-col border-white/5">
            <div className="h-1.5 w-full fiery-gradient"></div>
            <CardContent className="p-8 md:p-12 flex flex-col flex-grow relative">
              <Quote className="absolute top-6 right-6 md:top-10 md:right-10 w-16 h-16 md:w-20 md:h-20 text-white/5 -rotate-12 group-hover:text-accent/10 transition-all duration-500" />
              
              <div className="flex-grow relative z-10">
                <p className="text-white/90 text-xl md:text-2xl font-medium leading-relaxed italic mb-8 md:mb-12">
                  "{t.content}"
                </p>
              </div>

              <div className="mt-auto pt-6 md:pt-10 border-t border-white/5 flex items-center justify-between">
                <div>
                  {t.name ? (
                    <h4 className="font-headline font-bold text-white text-lg md:text-xl tracking-tight uppercase">{t.name}</h4>
                  ) : (
                    <h4 className="font-headline font-bold text-white text-lg md:text-xl tracking-tight uppercase">Anonymous Alumni</h4>
                  )}
                  {t.role && (
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent mt-1">{t.role}</p>
                  )}
                </div>
                <div className="bg-white/5 p-3 rounded-full">
                  <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-emerald-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
