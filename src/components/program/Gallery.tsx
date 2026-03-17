import Image from 'next/image';
import { Card } from '@/components/ui/card';

export function Gallery({ images }: { images: string[] }) {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary mb-4">Inside the Program</h2>
        <p className="text-muted-foreground text-lg">A sneak peek at what you'll be building and learning.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {images.map((src, idx) => (
          <Card key={idx} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow group">
            <div className="relative h-64 w-full">
              <Image
                src={src}
                alt={`Gallery image ${idx + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
