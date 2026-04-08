
import { Card } from '@/components/ui/card';

interface GalleryProps {
  images: string[];
  title?: string;
  subtitle?: string;
}

export function Gallery({ images, title = 'Curriculum Previews', subtitle }: GalleryProps) {
  if (!images || images.length === 0) return null;

  return (
    <section className="py-40 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-headline font-black text-white mb-4 uppercase tracking-tight">
            {title}
          </h2>
          <div className="h-1.5 w-24 fiery-gradient mx-auto mb-8 rounded-full"></div>
          {subtitle && (
            <p className="text-foreground/80 text-xl md:text-2xl max-w-2xl mx-auto font-medium">
              {subtitle}
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {images.map((src, idx) => (
            <Card key={idx} className="overflow-hidden border border-white/10 glass-card hover:shadow-primary/20 transition-all duration-500 group aspect-[4/3] rounded-[2.5rem]">
              <div className="relative h-full w-full">
                <img
                  src={src}
                  alt={`Module preview ${idx + 1}`}
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
