export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    created_at: string
                    updated_at: string
                    name: string
                    email: string
                    role: 'farmer' | 'buyer' | 'admin'
                    phone: string | null
                    location: string | null
                    district: string | null
                    state: string | null
                    company_name: string | null
                    company_type: string | null
                    total_earnings: number
                    total_purchases: number
                    total_listings: number
                    is_active: boolean
                    is_verified: boolean
                    avatar_url: string | null
                }
                Insert: {
                    id: string
                    created_at?: string
                    updated_at?: string
                    name: string
                    email: string
                    role: 'farmer' | 'buyer' | 'admin'
                    phone?: string | null
                    location?: string | null
                    district?: string | null
                    state?: string | null
                    company_name?: string | null
                    company_type?: string | null
                    total_earnings?: number
                    total_purchases?: number
                    total_listings?: number
                    is_active?: boolean
                    is_verified?: boolean
                    avatar_url?: string | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    name?: string
                    email?: string
                    role?: 'farmer' | 'buyer' | 'admin'
                    phone?: string | null
                    location?: string | null
                    district?: string | null
                    state?: string | null
                    company_name?: string | null
                    company_type?: string | null
                    total_earnings?: number
                    total_purchases?: number
                    total_listings?: number
                    is_active?: boolean
                    is_verified?: boolean
                    avatar_url?: string | null
                }
            }
            listings: {
                Row: {
                    id: string
                    created_at: string
                    updated_at: string
                    farmer_id: string
                    farmer_name: string
                    crop_type: string
                    residue_type: string
                    quantity_tons: number
                    price_per_ton: number
                    location: string
                    district: string
                    state: string
                    latitude: number | null
                    longitude: number | null
                    harvest_window_start: string
                    harvest_window_end: string
                    quality_grade: string
                    moisture_content: number | null
                    status: 'available' | 'bidding' | 'contracted' | 'collected' | 'completed'
                    image_url: string | null
                    description: string | null
                }
                Insert: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    farmer_id: string
                    farmer_name: string
                    crop_type: string
                    residue_type: string
                    quantity_tons: number
                    price_per_ton: number
                    location: string
                    district: string
                    state: string
                    latitude?: number | null
                    longitude?: number | null
                    harvest_window_start: string
                    harvest_window_end: string
                    quality_grade?: string
                    moisture_content?: number | null
                    status?: 'available' | 'bidding' | 'contracted' | 'collected' | 'completed'
                    image_url?: string | null
                    description?: string | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    farmer_id?: string
                    farmer_name?: string
                    crop_type?: string
                    residue_type?: string
                    quantity_tons?: number
                    price_per_ton?: number
                    location?: string
                    district?: string
                    state?: string
                    latitude?: number | null
                    longitude?: number | null
                    harvest_window_start?: string
                    harvest_window_end?: string
                    quality_grade?: string
                    moisture_content?: number | null
                    status?: 'available' | 'bidding' | 'contracted' | 'collected' | 'completed'
                    image_url?: string | null
                    description?: string | null
                }
            }
            bids: {
                Row: {
                    id: string
                    created_at: string
                    listing_id: string
                    buyer_id: string
                    buyer_name: string
                    company_name: string | null
                    price_per_ton: number
                    quantity_tons: number
                    message: string | null
                    status: 'pending' | 'accepted' | 'rejected'
                    logistics_included: boolean
                }
                Insert: {
                    id?: string
                    created_at?: string
                    listing_id: string
                    buyer_id: string
                    buyer_name: string
                    company_name?: string | null
                    price_per_ton: number
                    quantity_tons: number
                    message?: string | null
                    status?: 'pending' | 'accepted' | 'rejected'
                    logistics_included?: boolean
                }
                Update: {
                    id?: string
                    created_at?: string
                    listing_id?: string
                    buyer_id?: string
                    buyer_name?: string
                    company_name?: string | null
                    price_per_ton?: number
                    quantity_tons?: number
                    message?: string | null
                    status?: 'pending' | 'accepted' | 'rejected'
                    logistics_included?: boolean
                }
            }
            contracts: {
                Row: {
                    id: string
                    created_at: string
                    updated_at: string
                    listing_id: string
                    farmer_id: string
                    farmer_name: string
                    buyer_id: string
                    buyer_name: string
                    quantity: number
                    price_per_ton: number
                    total_amount: number
                    logistics_cost: number
                    platform_fee: number
                    farmer_payout: number
                    carbon_credits: number
                    carbon_revenue: number
                    status: 'pending' | 'active' | 'pickup_scheduled' | 'in_transit' | 'delivered' | 'completed' | 'cancelled'
                    payment_status: 'pending' | 'escrow' | 'released' | 'refunded'
                    scheduled_pickup: string | null
                    actual_pickup: string | null
                    delivery_date: string | null
                }
                Insert: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    listing_id: string
                    farmer_id: string
                    farmer_name: string
                    buyer_id: string
                    buyer_name: string
                    quantity: number
                    price_per_ton: number
                    total_amount: number
                    logistics_cost?: number
                    platform_fee?: number
                    farmer_payout: number
                    carbon_credits?: number
                    carbon_revenue?: number
                    status?: 'pending' | 'active' | 'pickup_scheduled' | 'in_transit' | 'delivered' | 'completed' | 'cancelled'
                    payment_status?: 'pending' | 'escrow' | 'released' | 'refunded'
                    scheduled_pickup?: string | null
                    actual_pickup?: string | null
                    delivery_date?: string | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    listing_id?: string
                    farmer_id?: string
                    farmer_name?: string
                    buyer_id?: string
                    buyer_name?: string
                    quantity?: number
                    price_per_ton?: number
                    total_amount?: number
                    logistics_cost?: number
                    platform_fee?: number
                    farmer_payout?: number
                    carbon_credits?: number
                    carbon_revenue?: number
                    status?: 'pending' | 'active' | 'pickup_scheduled' | 'in_transit' | 'delivered' | 'completed' | 'cancelled'
                    payment_status?: 'pending' | 'escrow' | 'released' | 'refunded'
                    scheduled_pickup?: string | null
                    actual_pickup?: string | null
                    delivery_date?: string | null
                }
            }
            forward_contracts: {
                Row: {
                    id: string
                    created_at: string
                    buyer_id: string
                    buyer_name: string
                    company_name: string
                    crop_type: string
                    residue_type: string
                    quantity_required: number
                    price_per_ton: number
                    delivery_start: string
                    delivery_end: string
                    location: string
                    advance_payment_percent: number
                    status: 'open' | 'partially_filled' | 'filled' | 'cancelled' | 'expired'
                    expires_at: string
                }
                Insert: {
                    id?: string
                    created_at?: string
                    buyer_id: string
                    buyer_name: string
                    company_name: string
                    crop_type: string
                    residue_type: string
                    quantity_required: number
                    price_per_ton: number
                    delivery_start: string
                    delivery_end: string
                    location: string
                    advance_payment_percent?: number
                    status?: 'open' | 'partially_filled' | 'filled' | 'cancelled' | 'expired'
                    expires_at: string
                }
                Update: {
                    id?: string
                    created_at?: string
                    buyer_id?: string
                    buyer_name?: string
                    company_name?: string
                    crop_type?: string
                    residue_type?: string
                    quantity_required?: number
                    price_per_ton?: number
                    delivery_start?: string
                    delivery_end?: string
                    location?: string
                    advance_payment_percent?: number
                    status?: 'open' | 'partially_filled' | 'filled' | 'cancelled' | 'expired'
                    expires_at?: string
                }
            }
            pickup_tracking: {
                Row: {
                    id: string
                    created_at: string
                    contract_id: string
                    farmer_id: string
                    buyer_id: string
                    status: 'pending' | 'scheduled' | 'assigned' | 'en_route' | 'collected' | 'in_transit' | 'delivered' | 'completed'
                    scheduled_date: string | null
                    estimated_arrival: string | null
                    transporter_name: string | null
                    transporter_phone: string | null
                    vehicle_number: string | null
                    proof_of_collection: string | null
                }
                Insert: {
                    id?: string
                    created_at?: string
                    contract_id: string
                    farmer_id: string
                    buyer_id: string
                    status?: 'pending' | 'scheduled' | 'assigned' | 'en_route' | 'collected' | 'in_transit' | 'delivered' | 'completed'
                    scheduled_date?: string | null
                    estimated_arrival?: string | null
                    transporter_name?: string | null
                    transporter_phone?: string | null
                    vehicle_number?: string | null
                    proof_of_collection?: string | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    contract_id?: string
                    farmer_id?: string
                    buyer_id?: string
                    status?: 'pending' | 'scheduled' | 'assigned' | 'en_route' | 'collected' | 'in_transit' | 'delivered' | 'completed'
                    scheduled_date?: string | null
                    estimated_arrival?: string | null
                    transporter_name?: string | null
                    transporter_phone?: string | null
                    vehicle_number?: string | null
                    proof_of_collection?: string | null
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}
