
export interface Testimonial {
  name?: string;
  role?: string; // Used for "Place" or "Role"
  content: string;
}

export interface Feature {
  title: string;
  description: string;
  iconName: string;
}

export interface TrustItem {
  text: string;
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
  titleFontSize?: number;
  subtitleFontSize?: number;
  lineHeight?: number;
  letterSpacing?: number;
  textAlign?: 'left' | 'center' | 'right';
  demoVideoId?: string;
  featuresTitle?: string;
  featuresSubtitle?: string;
  galleryTitle?: string;
  gallerySubtitle?: string;
  testimonialsTitle?: string;
  testimonialsSubtitle?: string;
  faqTitle?: string;
  faqSubtitle?: string;
  gallery: string[];
  videoTestimonials: string[];
  imageTestimonials: Testimonial[];
  features?: Feature[];
  trustItems?: TrustItem[];
  faqs?: FAQItem[];
  expiryDate: string;
  joinButtonLink: string;
  oldPriceLabel?: string;
  currentPriceLabel?: string;
  priceSubtext?: string;
  footerDescription?: string;
  footerCopyright?: string;
}
