import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, User, Listing, Contract, Equipment, Notification, Bid, UserType, ForwardContract, PickupTracking, EscrowPayment } from '../types';
import { MOCK_LISTINGS, MOCK_EQUIPMENT, MOCK_FORWARD_CONTRACTS } from '../constants';

// Action types
type Action =
    | { type: 'SET_USER'; payload: User | null }
    | { type: 'LOGOUT' }
    | { type: 'ADD_LISTING'; payload: Listing }
    | { type: 'UPDATE_LISTING'; payload: Listing }
    | { type: 'DELETE_LISTING'; payload: string }
    | { type: 'ADD_BID'; payload: { listingId: string; bid: Bid } }
    | { type: 'UPDATE_BID'; payload: { listingId: string; bid: Bid } }
    | { type: 'ACCEPT_BID'; payload: { listingId: string; bidId: string } }
    | { type: 'ADD_CONTRACT'; payload: Contract }
    | { type: 'UPDATE_CONTRACT'; payload: Contract }
    | { type: 'ADD_NOTIFICATION'; payload: Notification }
    | { type: 'MARK_NOTIFICATION_READ'; payload: string }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'LOAD_STATE'; payload: Partial<AppState> }
    | { type: 'ADD_FORWARD_CONTRACT'; payload: ForwardContract }
    | { type: 'UPDATE_FORWARD_CONTRACT'; payload: ForwardContract }
    | { type: 'ACCEPT_FORWARD_CONTRACT'; payload: { contractId: string; farmerId: string; farmerName: string; quantity: number } }
    | { type: 'ADD_PICKUP_TRACKING'; payload: PickupTracking }
    | { type: 'UPDATE_PICKUP_TRACKING'; payload: PickupTracking }
    | { type: 'ADD_ESCROW_PAYMENT'; payload: EscrowPayment }
    | { type: 'UPDATE_ESCROW_PAYMENT'; payload: EscrowPayment };

const initialState: AppState = {
    user: null,
    listings: [],
    contracts: [],
    equipment: [],
    notifications: [],
    forwardContracts: [],
    pickupTracking: [],
    escrowPayments: [],
    isLoading: false,
};

// Reducer
function appReducer(state: AppState, action: Action): AppState {
    switch (action.type) {
        case 'SET_USER':
            return { ...state, user: action.payload };

        case 'LOGOUT':
            return { ...state, user: null };

        case 'ADD_LISTING':
            return { ...state, listings: [...state.listings, action.payload] };

        case 'UPDATE_LISTING':
            return {
                ...state,
                listings: state.listings.map(l => l.id === action.payload.id ? action.payload : l),
            };

        case 'DELETE_LISTING':
            return {
                ...state,
                listings: state.listings.filter(l => l.id !== action.payload),
            };

        case 'ADD_BID':
            return {
                ...state,
                listings: state.listings.map(l => {
                    if (l.id === action.payload.listingId) {
                        return {
                            ...l,
                            bids: [...l.bids, action.payload.bid],
                            status: 'bidding' as const,
                        };
                    }
                    return l;
                }),
            };

        case 'UPDATE_BID':
            return {
                ...state,
                listings: state.listings.map(l => {
                    if (l.id === action.payload.listingId) {
                        return {
                            ...l,
                            bids: l.bids.map(b => b.id === action.payload.bid.id ? action.payload.bid : b),
                        };
                    }
                    return l;
                }),
            };

        case 'ACCEPT_BID':
            return {
                ...state,
                listings: state.listings.map(l => {
                    if (l.id === action.payload.listingId) {
                        return {
                            ...l,
                            status: 'contracted' as const,
                            bids: l.bids.map(b => ({
                                ...b,
                                status: b.id === action.payload.bidId ? 'accepted' as const : 'rejected' as const,
                            })),
                        };
                    }
                    return l;
                }),
            };

        case 'ADD_CONTRACT':
            return { ...state, contracts: [...state.contracts, action.payload] };

        case 'UPDATE_CONTRACT':
            return {
                ...state,
                contracts: state.contracts.map(c => c.id === action.payload.id ? action.payload : c),
            };

        case 'ADD_NOTIFICATION':
            return { ...state, notifications: [action.payload, ...state.notifications] };

        case 'MARK_NOTIFICATION_READ':
            return {
                ...state,
                notifications: state.notifications.map(n =>
                    n.id === action.payload ? { ...n, read: true } : n
                ),
            };

        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };

        case 'LOAD_STATE':
            return { ...state, ...action.payload };

        case 'ADD_FORWARD_CONTRACT':
            return { ...state, forwardContracts: [...state.forwardContracts, action.payload] };

        case 'UPDATE_FORWARD_CONTRACT':
            return {
                ...state,
                forwardContracts: state.forwardContracts.map(fc =>
                    fc.id === action.payload.id ? action.payload : fc
                ),
            };

        case 'ACCEPT_FORWARD_CONTRACT':
            return {
                ...state,
                forwardContracts: state.forwardContracts.map(fc => {
                    if (fc.id === action.payload.contractId) {
                        const newAccepted = [...fc.acceptedFarmers, {
                            farmerId: action.payload.farmerId,
                            farmerName: action.payload.farmerName,
                            quantity: action.payload.quantity,
                        }];
                        const totalAccepted = newAccepted.reduce((sum, f) => sum + f.quantity, 0);
                        return {
                            ...fc,
                            acceptedFarmers: newAccepted,
                            status: totalAccepted >= fc.quantityRequired ? 'filled' as const : 'partially_filled' as const,
                        };
                    }
                    return fc;
                }),
            };

        case 'ADD_PICKUP_TRACKING':
            return { ...state, pickupTracking: [...state.pickupTracking, action.payload] };

        case 'UPDATE_PICKUP_TRACKING':
            return {
                ...state,
                pickupTracking: state.pickupTracking.map(pt =>
                    pt.id === action.payload.id ? action.payload : pt
                ),
            };

        case 'ADD_ESCROW_PAYMENT':
            return { ...state, escrowPayments: [...state.escrowPayments, action.payload] };

        case 'UPDATE_ESCROW_PAYMENT':
            return {
                ...state,
                escrowPayments: state.escrowPayments.map(ep =>
                    ep.id === action.payload.id ? action.payload : ep
                ),
            };

        default:
            return state;
    }
}

// Context
interface AppContextType {
    state: AppState;
    dispatch: React.Dispatch<Action>;
    // Helper functions
    login: (user: User) => void;
    logout: () => void;
    createListing: (listing: Omit<Listing, 'id' | 'createdAt' | 'bids' | 'status'>) => Listing;
    placeBid: (listingId: string, bid: Omit<Bid, 'id' | 'createdAt'>) => void;
    acceptBid: (listingId: string, bidId: string) => void;
    getUserListings: () => Listing[];
    getUserContracts: () => Contract[];
    getUnreadNotifications: () => Notification[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Storage keys
const STORAGE_KEYS = {
    USER: 'agriloop_user',
    LISTINGS: 'agriloop_listings',
    CONTRACTS: 'agriloop_contracts',
    NOTIFICATIONS: 'agriloop_notifications',
};

// Provider
export function AppProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(appReducer, initialState);

    // Load from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
        const savedListings = localStorage.getItem(STORAGE_KEYS.LISTINGS);
        const savedContracts = localStorage.getItem(STORAGE_KEYS.CONTRACTS);
        const savedNotifications = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);

        // Convert mock listings to full listings format
        const defaultListings: Listing[] = MOCK_LISTINGS.map(ml => ({
            ...ml,
            farmerId: 'system',
            district: ml.location.split(', ')[0],
            state: ml.location.split(', ')[1] || 'Punjab',
            harvestWindow: { start: ml.availableDate, end: ml.availableDate },
            status: 'available' as const,
            bids: [],
            createdAt: new Date().toISOString(),
            carbonPotential: ml.quantityTons * 1.5,
        }));

        dispatch({
            type: 'LOAD_STATE',
            payload: {
                user: savedUser ? JSON.parse(savedUser) : null,
                listings: savedListings ? JSON.parse(savedListings) : defaultListings,
                contracts: savedContracts ? JSON.parse(savedContracts) : [],
                equipment: MOCK_EQUIPMENT,
                notifications: savedNotifications ? JSON.parse(savedNotifications) : [],
                forwardContracts: MOCK_FORWARD_CONTRACTS,
                pickupTracking: [],
                escrowPayments: [],
            },
        });
    }, []);

    // Save to localStorage on state changes
    useEffect(() => {
        if (state.user) {
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(state.user));
        } else {
            localStorage.removeItem(STORAGE_KEYS.USER);
        }
    }, [state.user]);

    useEffect(() => {
        if (state.listings.length > 0) {
            localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(state.listings));
        }
    }, [state.listings]);

    useEffect(() => {
        if (state.contracts.length > 0) {
            localStorage.setItem(STORAGE_KEYS.CONTRACTS, JSON.stringify(state.contracts));
        }
    }, [state.contracts]);

    useEffect(() => {
        if (state.notifications.length > 0) {
            localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(state.notifications));
        }
    }, [state.notifications]);

    // Helper functions
    const login = (user: User) => {
        dispatch({ type: 'SET_USER', payload: user });
    };

    const logout = () => {
        dispatch({ type: 'LOGOUT' });
    };

    const createListing = (listingData: Omit<Listing, 'id' | 'createdAt' | 'bids' | 'status'>): Listing => {
        const listing: Listing = {
            ...listingData,
            id: `listing_${Date.now()}`,
            createdAt: new Date().toISOString(),
            bids: [],
            status: 'available',
        };
        dispatch({ type: 'ADD_LISTING', payload: listing });
        return listing;
    };

    const placeBid = (listingId: string, bidData: Omit<Bid, 'id' | 'createdAt'>) => {
        const bid: Bid = {
            ...bidData,
            id: `bid_${Date.now()}`,
            createdAt: new Date().toISOString(),
        };
        dispatch({ type: 'ADD_BID', payload: { listingId, bid } });

        // Create notification for farmer
        const listing = state.listings.find(l => l.id === listingId);
        if (listing) {
            const notification: Notification = {
                id: `notif_${Date.now()}`,
                userId: listing.farmerId,
                type: 'bid_received',
                title: 'New Bid Received!',
                message: `${bidData.companyName} has placed a bid of ₹${bidData.pricePerTon}/ton for your ${listing.residueType}`,
                read: false,
                createdAt: new Date().toISOString(),
                link: `/farmer-dashboard`,
            };
            dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
        }
    };

    const acceptBid = (listingId: string, bidId: string) => {
        dispatch({ type: 'ACCEPT_BID', payload: { listingId, bidId } });

        const listing = state.listings.find(l => l.id === listingId);
        const bid = listing?.bids.find(b => b.id === bidId);

        if (listing && bid) {
            // Create contract
            const platformFee = bid.totalAmount * 0.05;
            const carbonRevenue = listing.carbonPotential * 15; // ₹15 per credit
            const contract: Contract = {
                id: `contract_${Date.now()}`,
                listingId,
                bidId,
                farmerId: listing.farmerId,
                buyerId: bid.buyerId,
                farmerName: listing.farmerName,
                buyerName: bid.buyerName,
                companyName: bid.companyName,
                cropType: listing.cropType,
                residueType: listing.residueType,
                quantity: bid.quantity,
                pricePerTon: bid.pricePerTon,
                totalAmount: bid.totalAmount,
                platformFee,
                farmerPayout: bid.totalAmount - platformFee + (carbonRevenue * 0.8),
                carbonCredits: listing.carbonPotential,
                carbonRevenue,
                status: 'active',
                createdAt: new Date().toISOString(),
            };
            dispatch({ type: 'ADD_CONTRACT', payload: contract });

            // Notify buyer
            const notification: Notification = {
                id: `notif_${Date.now()}`,
                userId: bid.buyerId,
                type: 'bid_accepted',
                title: 'Bid Accepted!',
                message: `Your bid for ${listing.quantityTons} tons of ${listing.residueType} has been accepted`,
                read: false,
                createdAt: new Date().toISOString(),
                link: `/buyer-dashboard`,
            };
            dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
        }
    };

    const getUserListings = (): Listing[] => {
        if (!state.user) return [];
        return state.listings.filter(l => l.farmerId === state.user!.id);
    };

    const getUserContracts = (): Contract[] => {
        if (!state.user) return [];
        if (state.user.type === UserType.FARMER) {
            return state.contracts.filter(c => c.farmerId === state.user!.id);
        }
        return state.contracts.filter(c => c.buyerId === state.user!.id);
    };

    const getUnreadNotifications = (): Notification[] => {
        if (!state.user) return [];
        return state.notifications.filter(n => n.userId === state.user!.id && !n.read);
    };

    const value: AppContextType = {
        state,
        dispatch,
        login,
        logout,
        createListing,
        placeBid,
        acceptBid,
        getUserListings,
        getUserContracts,
        getUnreadNotifications,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Hook
export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}
