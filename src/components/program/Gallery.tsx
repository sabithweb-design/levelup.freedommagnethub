import { Card } from '@/components/ui/card';

export function Gallery({ images }: { images: string[] }) {
  if (!images || images.length === 0) return null;

  return (
    <section className="py-40 px-6 bg-muted/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-headline font-black text-primary mb-4 uppercase tracking-tight">
            Program Previews
          </h2>
          <div className="h-1.5 w-24 bg-accent mx-auto mb-8 rounded-full"></div>
          <p className="text-muted-foreground text-xl md:text-2xl max-w-2xl mx-auto font-medium">
            Explore the curriculum, projects, and exclusive resources waiting inside.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {images.map((src, idx) => (
            <Card key={idx} className="overflow-hidden border-none shadow-elevation hover:shadow-2xl transition-all duration-500 group aspect-[4/3] rounded-[2.5rem]">
              <div className="relative h-full w-full">
                <img
                  src={src}
                  alt={`Program preview ${idx + 1}`}
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
