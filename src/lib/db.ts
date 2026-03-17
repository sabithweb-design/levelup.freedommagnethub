
export interface Testimonial {
  name: string;
  role: string;
  content: string;
  imageUrl: string;
}

export interface Feature {
  title: string;
  description: string;
  iconName: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Program {
  id: string;
  title: string;
  subtitle: string;
  demoVideoId: string;
  gallery: string[];
  videoTestimonials: string[];
  imageTestimonials: Testimonial[];
  features?: Feature[];
  faqs?: FAQItem[];
  expiryDate: string;
  joinButtonLink: string;
}
