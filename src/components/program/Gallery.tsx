import Image from 'next/image';
import { Card } from '@/components/ui/card';

export function Gallery({ images }: { images: string[] }) {
  if (!images || images.length === 0) return null;

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-headline font-black text-primary mb-4 uppercase tracking-tight">
          Inside the Program
        </h2>
        <div className="h-1.5 w-24 bg-accent mx-auto mb-6 rounded-full"></div>
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-light">
          A visual journey through the curriculum, projects, and learning experiences waiting for you.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images.map((src, idx) => (
          <Card key={idx} className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-300 group aspect-[4/3]">
            <div className="relative h-full w-full">
              <Image
                src={src}
                alt={`Program preview ${idx + 1}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
