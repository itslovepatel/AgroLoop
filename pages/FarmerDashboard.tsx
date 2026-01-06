import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Plus, IndianRupee, Package, Truck, Clock, CheckCircle,
    TrendingUp, Bell, ChevronRight, Leaf, AlertTriangle,
    MapPin, Calendar, Building2, Eye, FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserType, ForwardContract } from '../types';
import Badge from '../components/ui/Badge';
import CreateListing from '../components/CreateListing';
import AuthModal from '../components/AuthModal';
import PriceCalculator from '../components/PriceCalculator';
import PickupTracker from '../components/PickupTracker';
import Modal from '../components/ui/Modal';

const FarmerDashboard: React.FC = () => {
    const { state, dispatch, getUserListings, getUserContracts, getUnreadNotifications, acceptBid } = useApp();
    const [showCreateListing, setShowCreateListing] = useState(false);
    const [showAuth, setShowAuth] = useState(false);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'contracts' | 'calculator' | 'pickup'>('dashboard');
    const [selectedContract, setSelectedContract] = useState<ForwardContract | null>(null);
    const [acceptQuantity, setAcceptQuantity] = useState(0);

    const isLoggedIn = state.user && state.user.type === UserType.FARMER;
    const listings = getUserListings();
    const contracts = getUserContracts();
    const notifications = getUnreadNotifications();

    // Get available forward contracts
    const availableForwardContracts = state.forwardContracts.filter(
        fc => fc.status === 'open' || fc.status === 'partially_filled'
    );

    // Get active pickup tracking
    const activePickups = state.pickupTracking.filter(
        pt => state.user && pt.farmerId === state.user.id &&
            !['completed', 'delivered'].includes(pt.status)
    );

    // Calculate stats
    const totalListings = listings.length;
    const activeBids = listings.reduce((acc, l) => acc + l.bids.filter(b => b.status === 'pending').length, 0);
    const completedContracts = contracts.filter(c => c.status === 'completed').length;
    const totalEarnings = contracts.reduce((acc, c) => acc + c.farmerPayout, 0);

    // Get listings with active bids
    const listingsWithBids = listings.filter(l => l.bids.some(b => b.status === 'pending'));

    // Accept forward contract
    const handleAcceptForwardContract = (contract: ForwardContract, quantity: number) => {
        if (!state.user) return;

        dispatch({
            type: 'ACCEPT_FORWARD_CONTRACT',
            payload: {
                contractId: contract.id,
                farmerId: state.user.id,
                farmerName: state.user.name,
                quantity,
            }
        });

        setSelectedContract(null);
        setAcceptQuantity(0);
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-earth-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-nature-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Package className="text-nature-600" size={40} />
                    </div>
                    <h1 className="text-2xl font-bold text-earth-900 mb-2">Farmer Dashboard</h1>
                    <p className="text-earth-500 mb-6">
                        Sign in to manage your listings, view bids, and track earnings.
                    </p>
                    <button
                        onClick={() => setShowAuth(true)}
                        className="w-full bg-nature-600 hover:bg-nature-700 text-white py-3 rounded-lg font-bold transition-colors"
                    >
                        Sign In as Farmer
                    </button>
                </div>
                <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-earth-50 pb-20">
            {/* Header */}
            <div className="bg-gradient-to-r from-nature-700 to-nature-600 text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold">
                                Welcome, {state.user?.name?.split(' ')[0]} 👋
                            </h1>
                            <p className="text-nature-100 mt-1">Manage your crop waste listings</p>
                        </div>
                        <button
                            onClick={() => setShowCreateListing(true)}
                            className="flex items-center gap-2 bg-white text-nature-700 px-6 py-3 rounded-lg font-bold hover:bg-nature-50 transition-colors shadow-lg"
                        >
                            <Plus size={20} /> List New Waste
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-earth-100">
                        <div className="flex items-center justify-between mb-2">
                            <Package className="text-nature-600" size={24} />
                            <span className="text-2xl font-bold text-earth-900">{totalListings}</span>
                        </div>
                        <p className="text-sm text-earth-500">Active Listings</p>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-earth-100">
                        <div className="flex items-center justify-between mb-2">
                            <TrendingUp className="text-amber-500" size={24} />
                            <span className="text-2xl font-bold text-earth-900">{activeBids}</span>
                        </div>
                        <p className="text-sm text-earth-500">Active Bids</p>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-earth-100">
                        <div className="flex items-center justify-between mb-2">
                            <CheckCircle className="text-blue-500" size={24} />
                            <span className="text-2xl font-bold text-earth-900">{completedContracts}</span>
                        </div>
                        <p className="text-sm text-earth-500">Contracts</p>
                    </div>
                    <div className="bg-gradient-to-br from-nature-600 to-nature-700 rounded-xl p-5 shadow-sm text-white">
                        <div className="flex items-center justify-between mb-2">
                            <IndianRupee className="text-nature-200" size={24} />
                            <span className="text-2xl font-bold">₹{(totalEarnings / 1000).toFixed(1)}K</span>
                        </div>
                        <p className="text-sm text-nature-100">Total Earnings</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl border border-earth-200 mb-6">
                    <div className="flex border-b border-earth-200 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={`flex-1 py-4 px-4 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === 'dashboard'
                                    ? 'text-nature-600 border-b-2 border-nature-600 bg-nature-50'
                                    : 'text-earth-500 hover:text-earth-700'
                                }`}
                        >
                            <Package size={16} className="inline mr-2" />
                            My Listings
                        </button>
                        <button
                            onClick={() => setActiveTab('contracts')}
                            className={`flex-1 py-4 px-4 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === 'contracts'
                                    ? 'text-nature-600 border-b-2 border-nature-600 bg-nature-50'
                                    : 'text-earth-500 hover:text-earth-700'
                                }`}
                        >
                            <Calendar size={16} className="inline mr-2" />
                            Forward Contracts
                            {availableForwardContracts.length > 0 && (
                                <span className="ml-1 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                    {availableForwardContracts.length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('pickup')}
                            className={`flex-1 py-4 px-4 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === 'pickup'
                                    ? 'text-nature-600 border-b-2 border-nature-600 bg-nature-50'
                                    : 'text-earth-500 hover:text-earth-700'
                                }`}
                        >
                            <Truck size={16} className="inline mr-2" />
                            Pickup Tracking
                        </button>
                        <button
                            onClick={() => setActiveTab('calculator')}
                            className={`flex-1 py-4 px-4 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === 'calculator'
                                    ? 'text-nature-600 border-b-2 border-nature-600 bg-nature-50'
                                    : 'text-earth-500 hover:text-earth-700'
                                }`}
                        >
                            <IndianRupee size={16} className="inline mr-2" />
                            Price Calculator
                        </button>
                    </div>
                </div>

                {/* Notifications */}
                {notifications.length > 0 && activeTab === 'dashboard' && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                        <div className="flex items-center gap-2 text-amber-800 font-bold mb-2">
                            <Bell size={20} />
                            <span>You have {notifications.length} new notification(s)</span>
                        </div>
                        {notifications.slice(0, 2).map(n => (
                            <p key={n.id} className="text-sm text-amber-700 ml-7">• {n.message}</p>
                        ))}
                    </div>
                )}

                {/* Tab Content */}
                {activeTab === 'dashboard' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Listings with Bids */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow-sm border border-earth-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-earth-100 flex justify-between items-center">
                                    <h2 className="font-bold text-lg text-earth-900">Bids on Your Listings</h2>
                                    <Link to="/marketplace" className="text-nature-600 text-sm font-medium hover:underline">
                                        View All
                                    </Link>
                                </div>

                                {listingsWithBids.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <Package className="mx-auto text-earth-300 mb-4" size={48} />
                                        <p className="text-earth-500">No active bids yet</p>
                                        <p className="text-sm text-earth-400">Create a listing to start receiving bids</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-earth-100">
                                        {listingsWithBids.map(listing => (
                                            <div key={listing.id} className="p-6">
                                                <div className="flex items-start gap-4">
                                                    <img
                                                        src={listing.imageUrl}
                                                        alt={listing.cropType}
                                                        className="w-16 h-16 rounded-lg object-cover"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="font-bold text-earth-900">{listing.residueType}</h3>
                                                            <Badge variant="warning" size="sm">
                                                                {listing.bids.filter(b => b.status === 'pending').length} bid(s)
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-earth-500">
                                                            {listing.quantityTons} tons • {listing.location}
                                                        </p>
                                                        <p className="text-sm text-earth-500">
                                                            Listed at ₹{listing.pricePerTon}/ton
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Bids */}
                                                <div className="mt-4 space-y-3">
                                                    {listing.bids.filter(b => b.status === 'pending').map(bid => (
                                                        <div key={bid.id} className="bg-earth-50 rounded-lg p-4 flex items-center justify-between">
                                                            <div>
                                                                <p className="font-medium text-earth-900">{bid.companyName}</p>
                                                                <p className="text-sm text-earth-500">
                                                                    ₹{bid.pricePerTon}/ton for {bid.quantity} tons
                                                                </p>
                                                                <p className="text-lg font-bold text-nature-700">
                                                                    Total: ₹{bid.totalAmount.toLocaleString()}
                                                                </p>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => acceptBid(listing.id, bid.id)}
                                                                    className="bg-nature-600 hover:bg-nature-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                                                                >
                                                                    Accept
                                                                </button>
                                                                <button className="bg-earth-200 hover:bg-earth-300 text-earth-700 px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                                                                    Decline
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* All Listings */}
                            <div className="bg-white rounded-xl shadow-sm border border-earth-100 overflow-hidden mt-6">
                                <div className="px-6 py-4 border-b border-earth-100">
                                    <h2 className="font-bold text-lg text-earth-900">Your Listings</h2>
                                </div>

                                {listings.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <Leaf className="mx-auto text-earth-300 mb-4" size={48} />
                                        <p className="text-earth-500 mb-4">You haven't listed any waste yet</p>
                                        <button
                                            onClick={() => setShowCreateListing(true)}
                                            className="bg-nature-600 hover:bg-nature-700 text-white px-6 py-2 rounded-lg font-medium"
                                        >
                                            Create Your First Listing
                                        </button>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-earth-100">
                                        {listings.map(listing => (
                                            <div key={listing.id} className="p-4 flex items-center gap-4 hover:bg-earth-50 transition-colors">
                                                <img
                                                    src={listing.imageUrl}
                                                    alt={listing.cropType}
                                                    className="w-12 h-12 rounded-lg object-cover"
                                                />
                                                <div className="flex-1">
                                                    <p className="font-medium text-earth-900">{listing.residueType}</p>
                                                    <p className="text-xs text-earth-500">{listing.quantityTons} tons • ₹{listing.pricePerTon}/ton</p>
                                                </div>
                                                <Badge
                                                    variant={
                                                        listing.status === 'available' ? 'success' :
                                                            listing.status === 'bidding' ? 'warning' :
                                                                listing.status === 'contracted' ? 'info' : 'neutral'
                                                    }
                                                    size="sm"
                                                >
                                                    {listing.status}
                                                </Badge>
                                                <ChevronRight className="text-earth-400" size={20} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Carbon Impact */}
                            <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl p-6 text-white">
                                <div className="flex items-center gap-2 mb-4">
                                    <Leaf size={24} />
                                    <h3 className="font-bold">Your Impact</h3>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-3xl font-bold">
                                            {listings.reduce((acc, l) => acc + l.carbonPotential, 0).toFixed(1)}
                                        </p>
                                        <p className="text-sm text-teal-100">Tons of CO₂ saved</p>
                                    </div>
                                    <div className="pt-3 border-t border-teal-500/30">
                                        <p className="text-lg font-bold">
                                            ₹{(listings.reduce((acc, l) => acc + l.carbonPotential, 0) * 15 * 0.8).toLocaleString()}
                                        </p>
                                        <p className="text-sm text-teal-100">Carbon credit potential</p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-white rounded-xl shadow-sm border border-earth-100 p-6">
                                <h3 className="font-bold text-lg text-earth-900 mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => setShowCreateListing(true)}
                                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-nature-50 transition-colors text-left"
                                    >
                                        <div className="bg-nature-100 p-2 rounded-lg">
                                            <Plus className="text-nature-600" size={20} />
                                        </div>
                                        <span className="font-medium text-earth-800">List New Waste</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('calculator')}
                                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-earth-50 transition-colors text-left"
                                    >
                                        <div className="bg-blue-100 p-2 rounded-lg">
                                            <IndianRupee className="text-blue-600" size={20} />
                                        </div>
                                        <span className="font-medium text-earth-800">Price Calculator</span>
                                    </button>
                                    <Link
                                        to="/equipment"
                                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-earth-50 transition-colors text-left"
                                    >
                                        <div className="bg-amber-100 p-2 rounded-lg">
                                            <Truck className="text-amber-600" size={20} />
                                        </div>
                                        <span className="font-medium text-earth-800">Rent Equipment</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Burning Alert */}
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                <div className="flex items-center gap-2 text-red-700 font-bold mb-2">
                                    <AlertTriangle size={20} />
                                    <span>Don't Burn!</span>
                                </div>
                                <p className="text-sm text-red-600">
                                    Burning stubble causes pollution and wastes money. Sell it on AgriLoop and earn instead!
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'contracts' && (
                    <div className="space-y-6">
                        <div className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-4 mb-6">
                            <div className="flex items-start gap-3">
                                <div className="bg-amber-500 text-white p-2 rounded-lg">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-amber-900">What are Forward Contracts?</h3>
                                    <p className="text-sm text-amber-700">
                                        Buyers post their future demand with guaranteed prices. Accept a contract to lock in your earnings before harvest!
                                    </p>
                                </div>
                            </div>
                        </div>

                        {availableForwardContracts.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-sm border border-earth-100 p-12 text-center">
                                <Calendar className="mx-auto text-earth-300 mb-4" size={48} />
                                <h3 className="text-lg font-semibold text-earth-800 mb-2">No Forward Contracts Available</h3>
                                <p className="text-earth-500">
                                    Check back soon! Buyers regularly post new demand for crop residue.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {availableForwardContracts.map(fc => (
                                    <div key={fc.id} className="bg-white rounded-xl shadow-sm border border-earth-100 p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                                                    <Building2 className="text-indigo-600" size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-earth-900">{fc.companyName}</h3>
                                                    <p className="text-sm text-earth-500">{fc.buyerName}</p>
                                                </div>
                                            </div>
                                            <Badge
                                                variant={fc.status === 'open' ? 'success' : 'warning'}
                                            >
                                                {fc.status === 'open' ? 'Open' : 'Partial'}
                                            </Badge>
                                        </div>

                                        <div className="bg-earth-50 rounded-lg p-4 mb-4">
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div>
                                                    <span className="text-earth-500">Crop</span>
                                                    <p className="font-medium text-earth-800">{fc.cropType}</p>
                                                </div>
                                                <div>
                                                    <span className="text-earth-500">Residue</span>
                                                    <p className="font-medium text-earth-800">{fc.residueType}</p>
                                                </div>
                                                <div>
                                                    <span className="text-earth-500">Quantity Needed</span>
                                                    <p className="font-medium text-earth-800">{fc.quantityRequired} tons</p>
                                                </div>
                                                <div>
                                                    <span className="text-earth-500">Location</span>
                                                    <p className="font-medium text-earth-800 flex items-center gap-1">
                                                        <MapPin size={12} /> {fc.location}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <span className="text-earth-500 text-sm">Price Offered</span>
                                                <p className="text-2xl font-bold text-nature-600">₹{fc.pricePerTon}/ton</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-earth-500 text-sm">Advance</span>
                                                <p className="font-bold text-indigo-600">{fc.advancePaymentPercent}%</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-earth-500 mb-4">
                                            <Clock size={14} />
                                            <span>
                                                Delivery: {new Date(fc.deliveryWindow.start).toLocaleDateString()} - {new Date(fc.deliveryWindow.end).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <button
                                            onClick={() => {
                                                setSelectedContract(fc);
                                                setAcceptQuantity(Math.min(50, fc.quantityRequired));
                                            }}
                                            className="w-full bg-nature-600 hover:bg-nature-700 text-white py-3 rounded-lg font-bold transition-colors"
                                        >
                                            Accept Contract
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'pickup' && (
                    <div className="space-y-6">
                        {activePickups.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-sm border border-earth-100 p-12 text-center">
                                <Truck className="mx-auto text-earth-300 mb-4" size={48} />
                                <h3 className="text-lg font-semibold text-earth-800 mb-2">No Active Pickups</h3>
                                <p className="text-earth-500">
                                    When a buyer schedules a pickup, you'll be able to track it here in real-time.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {activePickups.map(pickup => (
                                    <PickupTracker key={pickup.id} tracking={pickup} />
                                ))}
                            </div>
                        )}

                        {/* Sample Pickup for Demo */}
                        {activePickups.length === 0 && (
                            <div className="mt-6">
                                <h3 className="font-semibold text-earth-700 mb-4">Demo: Sample Pickup Timeline</h3>
                                <PickupTracker
                                    tracking={{
                                        id: 'demo_1',
                                        contractId: 'c_1',
                                        farmerId: 'f_1',
                                        buyerId: 'b_1',
                                        listingId: 'l_1',
                                        status: 'en_route',
                                        scheduledDate: new Date().toISOString(),
                                        estimatedArrival: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
                                        transporterName: 'Rajan Singh',
                                        transporterPhone: '+91 98765 43210',
                                        vehicleNumber: 'PB 08 AB 1234',
                                        timeline: [
                                            { status: 'pending', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
                                            { status: 'scheduled', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), note: 'Pickup confirmed for tomorrow' },
                                            { status: 'assigned', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), note: 'Transporter Rajan Singh assigned' },
                                            { status: 'en_route', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), note: 'Vehicle departed from Ludhiana' },
                                        ],
                                    }}
                                />
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'calculator' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <PriceCalculator
                            location={state.user?.location || 'Punjab'}
                        />
                        <div className="space-y-6">
                            <div className="bg-gradient-to-br from-nature-50 to-nature-100 rounded-xl p-6 border border-nature-200">
                                <h3 className="font-bold text-nature-800 mb-4">💡 Tips to Maximize Earnings</h3>
                                <ul className="space-y-3 text-sm text-nature-700">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle size={16} className="text-nature-600 mt-0.5 flex-shrink-0" />
                                        <span>Store residue properly to maintain <strong>Premium quality</strong> - worth 20% more!</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle size={16} className="text-nature-600 mt-0.5 flex-shrink-0" />
                                        <span>List early before harvest peak to get <strong>better prices</strong></span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle size={16} className="text-nature-600 mt-0.5 flex-shrink-0" />
                                        <span>Accept <strong>Forward Contracts</strong> for guaranteed income + advance payment</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle size={16} className="text-nature-600 mt-0.5 flex-shrink-0" />
                                        <span>Earn <strong>Carbon Credits</strong> on every sale - extra ₹1000+ per ton!</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-earth-100 p-6">
                                <h3 className="font-bold text-earth-900 mb-4">Current Market Rates</h3>
                                <div className="space-y-3">
                                    {[
                                        { crop: 'Paddy Straw', price: 1500, trend: '+5%' },
                                        { crop: 'Wheat Straw', price: 1200, trend: '+2%' },
                                        { crop: 'Sugarcane Bagasse', price: 2000, trend: '+8%' },
                                        { crop: 'Cotton Stalks', price: 1100, trend: '-1%' },
                                    ].map(item => (
                                        <div key={item.crop} className="flex items-center justify-between p-3 bg-earth-50 rounded-lg">
                                            <span className="font-medium text-earth-800">{item.crop}</span>
                                            <div className="text-right">
                                                <span className="font-bold text-earth-900">₹{item.price}/ton</span>
                                                <span className={`text-xs ml-2 ${item.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                                                    }`}>{item.trend}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <CreateListing
                isOpen={showCreateListing}
                onClose={() => setShowCreateListing(false)}
            />

            {/* Accept Contract Modal */}
            <Modal
                isOpen={!!selectedContract}
                onClose={() => setSelectedContract(null)}
                title="Accept Forward Contract"
            >
                {selectedContract && (
                    <div className="p-6">
                        <div className="bg-earth-50 rounded-lg p-4 mb-6">
                            <div className="flex items-center gap-3 mb-3">
                                <Building2 className="text-indigo-600" size={24} />
                                <div>
                                    <p className="font-semibold text-earth-900">{selectedContract.companyName}</p>
                                    <p className="text-sm text-earth-500">wants {selectedContract.residueType}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <span className="text-earth-500">Price</span>
                                    <p className="font-bold text-nature-600">₹{selectedContract.pricePerTon}/ton</p>
                                </div>
                                <div>
                                    <span className="text-earth-500">Needed</span>
                                    <p className="font-bold text-earth-800">{selectedContract.quantityRequired} tons</p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-earth-700 mb-2">
                                How much can you supply? (tons)
                            </label>
                            <input
                                type="number"
                                min="10"
                                max={selectedContract.quantityRequired}
                                step="10"
                                value={acceptQuantity}
                                onChange={(e) => setAcceptQuantity(Number(e.target.value))}
                                className="w-full px-4 py-3 border border-earth-300 rounded-lg focus:ring-2 focus:ring-nature-500"
                            />
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 mb-6">
                            <h4 className="font-semibold text-green-800 mb-3">Your Earnings Preview</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-green-700">Total Value</span>
                                    <span className="font-bold text-green-800">
                                        ₹{(acceptQuantity * selectedContract.pricePerTon).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-green-700">Advance ({selectedContract.advancePaymentPercent}%)</span>
                                    <span className="font-bold text-indigo-600">
                                        ₹{((acceptQuantity * selectedContract.pricePerTon * selectedContract.advancePaymentPercent) / 100).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setSelectedContract(null)}
                                className="flex-1 px-6 py-3 border border-earth-300 text-earth-700 rounded-lg font-medium hover:bg-earth-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleAcceptForwardContract(selectedContract, acceptQuantity)}
                                disabled={acceptQuantity < 10}
                                className="flex-1 px-6 py-3 bg-nature-600 text-white rounded-lg font-bold hover:bg-nature-700 disabled:opacity-50"
                            >
                                Accept Contract
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default FarmerDashboard;
