export enum UserType {
  FARMER = 'FARMER',
  BUYER = 'BUYER',
  GUEST = 'GUEST'
}

export interface User {
  id: string;
  type: UserType;
  name: string;
  phone: string;
  createdAt: string;
}

export interface Farmer extends User {
  type: UserType.FARMER;
  location: string;
  district: string;
  state: string;
  totalEarnings: number;
  totalListings: number;
  greenCertified: boolean;
}

export interface Buyer extends User {
  type: UserType.BUYER;
  companyName: string;
  companyType: 'bioenergy' | 'packaging' | 'biogas' | 'compost' | 'ethanol' | 'other';
  totalPurchases: number;
  activeContracts: number;
}

export type ListingStatus = 'available' | 'bidding' | 'contracted' | 'collected' | 'completed';

export interface Listing {
  id: string;
  farmerId: string;
  cropType: string;
  residueType: string;
  quantityTons: number;
  pricePerTon: number;
  location: string;
  district: string;
  state: string;
  coordinates?: { lat: number; lng: number };
  farmerName: string;
  availableDate: string;
  harvestWindow: { start: string; end: string };
  quality: 'Premium' | 'Standard' | 'Mixed';
  moistureContent?: number;
  imageUrl: string;
  status: ListingStatus;
  bids: Bid[];
  createdAt: string;
  carbonPotential: number; // tons of CO2 avoided
}

export interface Bid {
  id: string;
  listingId: string;
  buyerId: string;
  buyerName: string;
  companyName: string;
  pricePerTon: number;
  quantity: number;
  totalAmount: number;
  deliveryTerms: 'pickup' | 'delivery';
  isForwardContract: boolean;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  createdAt: string;
  expiresAt: string;
  message?: string;
}

export interface Contract {
  id: string;
  listingId: string;
  bidId: string;
  farmerId: string;
  buyerId: string;
  farmerName: string;
  buyerName: string;
  companyName: string;
  cropType: string;
  residueType: string;
  quantity: number;
  pricePerTon: number;
  totalAmount: number;
  platformFee: number;
  farmerPayout: number;
  carbonCredits: number;
  carbonRevenue: number;
  status: 'active' | 'pickup_scheduled' | 'in_transit' | 'delivered' | 'completed' | 'cancelled';
  pickupDate?: string;
  deliveryDate?: string;
  createdAt: string;
}

export interface Equipment {
  id: string;
  name: string;
  type: 'baler' | 'rake' | 'collector' | 'transport';
  description: string;
  pricePerDay: number;
  pricePerTon: number;
  location: string;
  operatorName: string;
  operatorPhone: string;
  available: boolean;
  imageUrl: string;
  rating: number;
}

export interface CarbonCredit {
  id: string;
  contractId: string;
  farmerId: string;
  buyerId: string;
  tonsAvoided: number;
  creditsGenerated: number;
  pricePerCredit: number;
  totalValue: number;
  farmerShare: number;
  buyerShare: number;
  platformShare: number;
  status: 'pending' | 'verified' | 'issued' | 'sold';
  registry: string;
  certificateUrl?: string;
  createdAt: string;
}

export interface NavItem {
  label: string;
  path: string;
  requiresAuth?: boolean;
  userType?: UserType;
}

export interface Stat {
  label: string;
  value: string;
  description: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'bid_received' | 'bid_accepted' | 'bid_rejected' | 'contract_created' | 'pickup_scheduled' | 'payment_received' | 'forward_contract_available';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

// Forward Contract - Buyer-initiated future demand
export interface ForwardContract {
  id: string;
  buyerId: string;
  buyerName: string;
  companyName: string;
  cropType: string;
  residueType: string;
  quantityRequired: number;
  pricePerTon: number;
  deliveryWindow: { start: string; end: string };
  location: string;
  state: string;
  advancePaymentPercent: number;
  status: 'open' | 'partially_filled' | 'filled' | 'expired' | 'cancelled';
  acceptedFarmers: { farmerId: string; farmerName: string; quantity: number }[];
  createdAt: string;
  expiresAt: string;
}

// Pickup Tracking Status
export type PickupStatus = 'pending' | 'scheduled' | 'assigned' | 'en_route' | 'collected' | 'in_transit' | 'delivered' | 'completed';

export interface PickupTracking {
  id: string;
  contractId: string;
  status: PickupStatus;
  transporterId?: string;
  transporterName?: string;
  transporterPhone?: string;
  vehicleNumber?: string;
  scheduledDate?: string;
  estimatedArrival?: string;
  collectedAt?: string;
  deliveredAt?: string;
  proofOfCollection?: string;
  timeline: { status: PickupStatus; timestamp: string; note?: string }[];
}

// Escrow Payment
export type EscrowStatus = 'pending' | 'funded' | 'released' | 'disputed' | 'refunded';

export interface EscrowPayment {
  id: string;
  contractId: string;
  farmerId: string;
  buyerId: string;
  totalAmount: number;
  advanceAmount: number;
  platformFee: number;
  farmerPayout: number;
  escrowStatus: EscrowStatus;
  advancePaidAt?: string;
  releasedAt?: string;
  transactionHistory: { action: string; amount: number; timestamp: string; status: string }[];
}

// Admin Stats
export interface AdminStats {
  totalListings: number;
  activeContracts: number;
  totalFarmers: number;
  totalBuyers: number;
  residueSavedTons: number;
  co2AvoidedTons: number;
  farmerEarnings: number;
  pickupSuccessRate: number;
  regionStats: { state: string; listings: number; contracts: number; co2Avoided: number }[];
}

export interface AppState {
  user: User | null;
  listings: Listing[];
  contracts: Contract[];
  equipment: Equipment[];
  notifications: Notification[];
  forwardContracts: ForwardContract[];
  pickupTracking: PickupTracking[];
  escrowPayments: EscrowPayment[];
  isLoading: boolean;
}