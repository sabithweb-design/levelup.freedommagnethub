
'use client';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface GalleryProps {
  images: string[];
  title?: string;
  subtitle?: string;
  columns?: number;
  aspect?: '1/1' | '16/9' | '4/3' | '3/4';
  fit?: 'cover' | 'contain';
}

export function Gallery({ 
  images, 
  title = 'Curriculum Previews', 
  subtitle,
  columns = 4,
  aspect = '4/3',
  fit = 'cover'
}: GalleryProps) {
  if (!images || images.length === 0) return null;

  const columnClasses: Record<number, string> = {
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
    5: 'lg:grid-cols-5',
  };

  const aspectClasses: Record<string, string> = {
    '1/1': 'aspect-square',
    '16/9': 'aspect-video',
    '4/3': 'aspect-[4/3]',
    '3/4': 'aspect-[3/4]',
  };

  return (
    <section id="curriculum" className="py-16 md:py-24 px-6 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
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
        
        <div className={cn(
          "grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8",
          columnClasses[columns] || 'lg:grid-cols-4'
        )}>
          {images.map((src, idx) => (
            <Card 
              key={idx} 
              className={cn(
                "overflow-hidden border border-white/10 glass-card hover:shadow-primary/20 transition-all duration-500 group rounded-[2.5rem] bg-black/20",
                aspectClasses[aspect] || 'aspect-[4/3]'
              )}
            >
              <div 
                className={cn(
                  "relative h-full w-full flex items-center justify-center transition-colors duration-500",
                  fit === 'contain' ? "bg-[#FDF5E6] p-6 md:p-8" : "bg-transparent"
                )}
              >
                <img
                  src={src}
                  alt={`Module preview ${idx + 1}`}
                  className={cn(
                    "transition-transform duration-700",
                    fit === 'contain' ? "w-full h-full object-contain" : "w-full h-full object-cover group-hover:scale-110"
                  )}
                  loading="lazy"
                />
                {fit === 'cover' && (
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
