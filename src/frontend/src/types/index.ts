export type ReservationStatus =
  | "confirmed"
  | "pending"
  | "cancelled"
  | "waitlist"
  | "seated"
  | "completed"
  | "no_show"
  | "not_arrived"
  | "late"
  | "departed";

export interface TimeSlot {
  time: string; // "HH:MM"
  available: boolean;
  capacity: number;
  booked: number;
}

export interface Experience {
  id: string;
  name: string;
  description: string;
  price: number; // in euro cents
  imageUrl?: string;
  available: boolean;
  tag?: "menu" | "event" | "special";
}

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  notes?: string;
  tags: string[];
  visitCount: number;
  lastVisit?: string;
  totalSpend?: number; // cents
  preferences?: string[];
  vip?: boolean;
}

export interface Reservation {
  id: string;
  guestId: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  date: string; // ISO date string
  time: string; // "HH:MM"
  partySize: number;
  status: ReservationStatus;
  tableNumber?: number;
  experienceId?: string;
  experienceName?: string;
  depositAmount?: number; // cents
  depositPaid?: boolean;
  notes?: string;
  specialRequests?: string;
  stripePaymentIntentId?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface WaitlistEntry {
  id: string;
  guestId: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  date: string;
  preferredTime: string;
  partySize: number;
  status: "waiting" | "notified" | "confirmed" | "expired";
  position: number;
  addedAt: string;
  notes?: string;
}

export interface KPIs {
  todayReservations: number;
  todayCovers: number;
  weekReservations: number;
  weekCovers: number;
  monthReservations: number;
  monthRevenue: number; // cents
  avgPartySize: number;
  cancellationRate: number; // 0-100
  topExperience?: string;
  waitlistCount: number;
  newGuests: number;
  returningGuests: number;
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  logoUrl?: string;
  coverUrl?: string;
  description?: string;
  cuisine?: string;
  priceRange?: "$" | "$$" | "$$$" | "$$$$";
  openingHours?: Record<string, { open: string; close: string }>;
  timezone: string;
  maxPartySize: number;
  stripeEnabled: boolean;
}

export interface UserRole {
  role: "owner" | "manager" | "marketing" | "staff";
  name: string;
  email: string;
}

export interface ReservationFormData {
  date: string;
  time: string;
  partySize: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  experienceId?: string;
  notes?: string;
  acceptTerms: boolean;
}

export interface WizardStep {
  id: number;
  label: string;
  key: string;
}
