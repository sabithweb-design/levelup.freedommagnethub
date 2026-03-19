import { Card, CardContent } from '@/components/ui/card';
import { VideoPlayer } from './VideoPlayer';
import { Testimonial } from '@/lib/db';

export function VideoTestimonials({ videoIds }: { videoIds: string[] }) {
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
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((t, idx) => (
          <Card key={idx} className="h-full bg-white border-none shadow-md hover:shadow-lg transition-all border-l-4 border-l-accent">
            <CardContent className="pt-6 flex flex-col h-full">
              <p className="text-foreground italic mb-6 flex-grow leading-relaxed">"{t.content}"</p>
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-accent/20 bg-muted">
                  {/* Using standard img for resilience with external profile photos */}
                  <img 
                    src={t.imageUrl} 
                    alt={t.name} 
                    className="object-cover w-full h-full" 
                    loading="lazy"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-primary">{t.name}</h4>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
