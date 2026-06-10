/**
 * All shared TypeScript interfaces and types for Le Café Bonne Humeur app.
 */

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: 'entrée' | 'plat_local' | 'plat_inter' | 'grillade' | 'dessert' | 'cocktail' | 'boisson';
  price: number; // in FCFA
  image: string;
  images?: string[]; // Multiple photos for Section 1
  popular?: boolean;
  bestSeller?: boolean;
  isNew?: boolean; // For "Nouveau" badge
  isActive?: boolean; // For activating/deactivating a product
  preparationTime: string; // e.g., "15-20 min"
  ingredients?: string[];
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export type ZoneType = 'salle' | 'terrasse' | 'vip';

export interface Reservation {
  id: string;
  date: string;
  time: string;
  guests: number;
  zone: ZoneType;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  tableNumber?: string;
  requestedAt: string;
}

export interface Order {
  id: string;
  items: {
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  total: number;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  deliveryType: 'livraison' | 'retrait';
  address?: string;
  status: 'recue' | 'cuisine' | 'livraison' | 'livree' | 'annulee';
  requestedAt: string;
  pointsEarned: number;
  discountApplied: number;
  paymentMethod?: string;
}

export interface LoyaltyAccount {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  birthday: string;
  points: number;
  level: 'bronze' | 'silver' | 'gold';
  joinDate: string;
  couponsUnlocked: string[];
}

export interface VIPEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  image: string;
  price?: string; // e.g. "Entrée Libre" or "10 000 FCFA"
  slotsLeft: number;
  category: string; // "Soirée VIP" | "Anniversaire" | "Match" | "Concert"
}

export interface EventBooking {
  id: string;
  eventId: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  guestsCount: number;
  requestedAt: string;
}

export interface Review {
  id: string;
  author: string;
  initials: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  videoUrl?: string; // If it's a simulated video testimonial
}

export interface Promotion {
  code: string;
  discountPercentage: number;
  description: string;
  minOrderValue?: number;
  isActive: boolean;
}

export interface GalleryImg {
  id: string;
  url: string;
  title: string;
  category: 'Façade du restaurant' | 'Salle principale' | 'Terrasse' | 'Lounge VIP' | 'Plats' | 'Desserts' | 'Cocktails' | 'Événements' | 'Équipe' | 'Galerie générale';
  homepageAssignment?: 'hero' | 'about_1' | 'about_2' | 'about_3' | 'vip' | 'events' | 'cocktails_feature' | 'reviews' | 'none';
}

export interface SiteSettings {
  logoText: string;
  logoImg: string;
  brandColor: string; // Hex color
  brandHoverColor: string; // Hex color
  colorPresetName: string; // Human name
  
  // Text contents
  heroSlogan: string;
  heroSubSlogan: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutStory1: string;
  aboutStory2: string;
  aboutBadge: string;
  vipTitle: string;
  vipDescription: string;
  
  // Delivery & alerts
  deliveryBannerText: string;
  
  // Schedule
  openingHoursWeekday: string;
  openingHoursWeekend: string;
  
  // Contacts
  contactPhone: string;
  contactAddress: string;
  contactEmail: string;
  
  // Social networks
  socialFacebook: string;
  socialInstagram: string;
  socialTwitter: string;
  socialTiktok: string;
  
  // Homepage core images
  heroImage: string;
  aboutImage1: string;
  aboutImage2: string;
  aboutImage3: string;
  vipImage: string;
  eventsImage: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super' | 'gestionnaire' | 'employe';
}

export interface AdminSession {
  user: AdminUser;
  loginTime: number;
  lastActive: number;
}
