import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
    },
});

// Auth helper functions
export const signUp = async (email: string, password: string, userData: {
    name: string;
    role: 'farmer' | 'buyer' | 'admin';
    location?: string;
    company_name?: string;
}) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: userData,
        },
    });
    return { data, error };
};

export const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    return { data, error };
};

export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
};

export const getCurrentUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
};

export const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
    });
    return { data, error };
};

// Database helper functions
export const getProfile = async (userId: string) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
    return { data, error };
};

export const updateProfile = async (userId: string, updates: Partial<Database['public']['Tables']['profiles']['Update']>) => {
    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);
    return { data, error };
};

// Listings
export const getListings = async () => {
    const { data, error } = await supabase
        .from('listings')
        .select('*, profiles(name, location)')
        .order('created_at', { ascending: false });
    return { data, error };
};

export const createListing = async (listing: Database['public']['Tables']['listings']['Insert']) => {
    const { data, error } = await supabase
        .from('listings')
        .insert(listing)
        .select()
        .single();
    return { data, error };
};

export const updateListing = async (id: string, updates: Database['public']['Tables']['listings']['Update']) => {
    const { data, error } = await supabase
        .from('listings')
        .update(updates)
        .eq('id', id);
    return { data, error };
};

// Contracts
export const getContracts = async (userId: string, role: 'farmer' | 'buyer') => {
    const column = role === 'farmer' ? 'farmer_id' : 'buyer_id';
    const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .eq(column, userId)
        .order('created_at', { ascending: false });
    return { data, error };
};

export const createContract = async (contract: Database['public']['Tables']['contracts']['Insert']) => {
    const { data, error } = await supabase
        .from('contracts')
        .insert(contract)
        .select()
        .single();
    return { data, error };
};

// Bids
export const getBidsForListing = async (listingId: string) => {
    const { data, error } = await supabase
        .from('bids')
        .select('*, profiles(name, company_name)')
        .eq('listing_id', listingId)
        .order('created_at', { ascending: false });
    return { data, error };
};

export const createBid = async (bid: Database['public']['Tables']['bids']['Insert']) => {
    const { data, error } = await supabase
        .from('bids')
        .insert(bid)
        .select()
        .single();
    return { data, error };
};

// Forward Contracts
export const getForwardContracts = async () => {
    const { data, error } = await supabase
        .from('forward_contracts')
        .select('*, profiles(name, company_name)')
        .eq('status', 'open')
        .order('created_at', { ascending: false });
    return { data, error };
};

// Admin queries
export const getAllUsers = async () => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
    return { data, error };
};

export const getAllListings = async () => {
    const { data, error } = await supabase
        .from('listings')
        .select('*, profiles(name, location)')
        .order('created_at', { ascending: false });
    return { data, error };
};

export const getAllContracts = async () => {
    const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .order('created_at', { ascending: false });
    return { data, error };
};
