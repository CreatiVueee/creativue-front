// ─── Contest ──────────────────────────────────────────────────────────────────

export interface TargetConsumer {
  ageRange: string;
  gender: string;
  occupation: string;
  interests: string[];
  region: string;
}

export interface Product {
  priceRange: string;
  differentiation: string;
  additionalInfo: string;
}

export interface Contest {
  id: number;
  brand: string;
  industry: string;
  contentTypes: string[];
  /** ISO date string (e.g. "2026-06-10"). D-day는 calcDday(deadline)로 런타임 계산 */
  deadline: string;
  prize: number;
  applicants: number;
  hot: boolean;
  aiAllowed: boolean;
  image: string;
  brandImages: string[];
  categoryId: string;
  brandIdentity: string;
  brandStory: string;
  brandKeywords: string[];
  brandColors: string[];
  targetConsumer: TargetConsumer;
  product: Product;
  additionalRequests: string;
}

// ─── Expert ───────────────────────────────────────────────────────────────────

export interface Expert {
  id: number;
  photo: string;
  nickname: string;
  title: string;
  services: string[];
  industries: string[];
  availableSlots: string[];
  career: string;
  rating: number;
  reviews: number;
  price: number;
  online: boolean;
  badge: string;
  intro: string;
}

// ─── Carousel (Landing Problem Slides) ───────────────────────────────────────

export interface CarouselSlide {
  id: number;
  tag: string;
  title: string;
  subtitle: string;
  desc: string;
  /** CSS background 값 (linear-gradient) */
  bg: string;
}
