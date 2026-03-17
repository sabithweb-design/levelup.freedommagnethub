import { PlaceHolderImages } from './placeholder-images';

export interface Testimonial {
  name: string;
  role: string;
  content: string;
  imageUrl: string;
}

export interface Program {
  id: string;
  title: string;
  subtitle: string;
  demoVideoId: string;
  gallery: string[];
  videoTestimonials: string[];
  imageTestimonials: Testimonial[];
  expiryDate: string;
}

const MOCK_PROGRAMS: Record<string, Program> = {
  "nextjs-mastery": {
    id: "nextjs-mastery",
    title: "Master Next.js & React Server Components",
    subtitle: "Build world-class, high-performance applications with the latest web standards.",
    demoVideoId: "dQw4w9WgXcQ", // Example YouTube ID
    gallery: [
      PlaceHolderImages.find(img => img.id === 'gallery-1')?.imageUrl || '',
      PlaceHolderImages.find(img => img.id === 'gallery-2')?.imageUrl || '',
      PlaceHolderImages.find(img => img.id === 'gallery-3')?.imageUrl || '',
    ],
    videoTestimonials: ["ScMzIvxBSi4", "tgbNymZ7vqY", "L_jWHffIx5E", "7e90gBu4pas"],
    imageTestimonials: [
      {
        name: "Sarah Jenkins",
        role: "Frontend Engineer @ TechFlow",
        content: "This program transformed my workflow. RSCs are no longer a mystery to me!",
        imageUrl: PlaceHolderImages.find(img => img.id === 'testimonial-1')?.imageUrl || ''
      },
      {
        name: "Marcus Thorne",
        role: "Senior Developer @ Cloudify",
        content: "Best investment I've made for my career this year. Highly recommended!",
        imageUrl: PlaceHolderImages.find(img => img.id === 'testimonial-2')?.imageUrl || ''
      },
      {
        name: "Elena Rodriguez",
        role: "Software Architect @ Innovate",
        content: "Clean, concise, and incredibly practical. The projects are top-notch.",
        imageUrl: PlaceHolderImages.find(img => img.id === 'testimonial-3')?.imageUrl || ''
      },
      {
        name: "David Kim",
        role: "Product Lead @ Momentum",
        content: "A game-changer for our team's performance metrics. Performance skyrocketed.",
        imageUrl: PlaceHolderImages.find(img => img.id === 'testimonial-4')?.imageUrl || ''
      },
      {
        name: "Aria Smith",
        role: "UX Designer @ PixelPerfect",
        content: "Even for a designer, understanding the tech stack helped me bridge the gap.",
        imageUrl: PlaceHolderImages.find(img => img.id === 'testimonial-5')?.imageUrl || ''
      }
    ],
    expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days from now
  }
};

export async function getProgram(id: string): Promise<Program | null> {
  // In a real app, you would use Firestore:
  // const docRef = doc(db, "programs", id);
  // const docSnap = await getDoc(docRef);
  // return docSnap.exists() ? docSnap.data() as Program : null;
  
  // Simulated delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCK_PROGRAMS[id] || MOCK_PROGRAMS["nextjs-mastery"];
}
