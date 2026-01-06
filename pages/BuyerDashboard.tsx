import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Search, MapPin, TrendingUp, Package, FileText,
    Leaf, Building2, ChevronRight, Plus, Calendar,
    IndianRupee, Users, Clock, AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserType } from '../types';
import Badge from '../components/ui/Badge';
import AuthModal from '../components/AuthModal';
import CreateForwardContract from '../components/CreateForwardContract';
import SupplyMap from '../components/SupplyMap';
import { CROP_TYPES, INDIAN_STATES } from '../constants';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BuyerDashboard: React.FC = () => {
    const { state, getUserContracts } = useApp();
    const [showAuth, setShowAuth] = useState(false);
    const [showCreateContract, setShowCreateContract] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedState, setSelectedState] = useState('All');
    const [selectedCrop, setSelectedCrop] = useState('All');
    const [activeTab, setActiveTab] = useState<'supply' | 'contracts' | 'map'>('supply');

    const isLoggedIn = state.user && state.user.type === UserType.BUYER;
    const contracts = getUserContracts();
    const forwardContracts = state.forwardContracts.filter(fc => fc.buyerId === state.user?.id);

    // Filter listings
    const filteredListings = state.listings.filter(l => {
        const matchesSearch = l.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            l.cropType.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesState = selectedState === 'All' || l.state === selectedState;
        const matchesCrop = selectedCrop === 'All' || l.cropType.includes(selectedCrop);
        return matchesSearch && matchesState && matchesCrop;
    });

    // Supply forecast data
    const supplyForecast = [
        { month: 'Oct', tons: 15000 },
        { month: 'Nov', tons: 45000 },
        { month: 'Dec', tons: 35000 },
        { month: 'Jan', tons: 20000 },
        { month: 'Feb', tons: 8000 },
    ];

    const totalAvailable = filteredListings.reduce((acc, l) => acc + l.quantityTons, 0);
    const activeContracts = contracts.filter(c => c.status === 'active' || c.status === 'pickup_scheduled').length;
    const totalPurchased = contracts.reduce((acc, c) => acc + c.quantity, 0);
    const totalCarbon = contracts.reduce((acc, c) => acc + c.carbonCredits, 0);

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-earth-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-nature-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Building2 className="text-nature-600" size={40} />
                    </div>
                    <h1 className="text-2xl font-bold text-earth-900 mb-2">Buyer Dashboard</h1>
                    <p className="text-earth-500 mb-6">
                        Sign in to search supply, place bids, and manage contracts.
                    </p>
                    <button
                        onClick={() => setShowAuth(true)}
                        className="w-full bg-nature-600 hover:bg-nature-700 text-white py-3 rounded-lg font-bold transition-colors"
                    >
                        Sign In as Buyer
                    </button>
                </div>
                <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Header */}
            <div className="bg-gradient-to-r from-earth-900 to-earth-800 text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold">
                                Supply Dashboard
                            </h1>
                            <p className="text-earth-300 mt-1">
                                Find and secure agricultural biomass for your operations
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowCreateContract(true)}
                                className="flex items-center gap-2 bg-amber-500 text-white px-5 py-3 rounded-lg font-bold hover:bg-amber-600 transition-colors"
                            >
                                <Plus size={20} /> Create Forward Contract
                            </button>
                            <Link
                                to="/marketplace"
                                className="flex items-center gap-2 bg-nature-600 text-white px-5 py-3 rounded-lg font-bold hover:bg-nature-700 transition-colors"
                            >
                                <Search size={20} /> Browse Marketplace
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl p-5 shadow-md border border-earth-100">
                        <div className="flex items-center justify-between mb-2">
                            <Package className="text-nature-600" size={24} />
                            <span className="text-2xl font-bold text-earth-900">{totalAvailable.toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-earth-500">Tons Available</p>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-md border border-earth-100">
                        <div className="flex items-center justify-between mb-2">
                            <FileText className="text-blue-500" size={24} />
                            <span className="text-2xl font-bold text-earth-900">{activeContracts}</span>
                        </div>
                        <p className="text-sm text-earth-500">Active Contracts</p>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-md border border-earth-100">
                        <div className="flex items-center justify-between mb-2">
                            <TrendingUp className="text-amber-500" size={24} />
                            <span className="text-2xl font-bold text-earth-900">{totalPurchased.toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-earth-500">Tons Purchased</p>
                    </div>
                    <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl p-5 shadow-md text-white">
                        <div className="flex items-center justify-between mb-2">
                            <Leaf className="text-teal-200" size={24} />
                            <span className="text-2xl font-bold">{totalCarbon.toFixed(0)}</span>
                        </div>
                        <p className="text-sm text-teal-100">CO₂ Credits Earned</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl border border-earth-200 mb-6">
                    <div className="flex border-b border-earth-200">
                        <button
                            onClick={() => setActiveTab('supply')}
                            className={`flex-1 py-4 px-6 font-medium text-sm transition-colors ${activeTab === 'supply'
                                    ? 'text-nature-600 border-b-2 border-nature-600 bg-nature-50'
                                    : 'text-earth-500 hover:text-earth-700'
                                }`}
                        >
                            <Package size={18} className="inline mr-2" />
                            Browse Supply
                        </button>
                        <button
                            onClick={() => setActiveTab('map')}
                            className={`flex-1 py-4 px-6 font-medium text-sm transition-colors ${activeTab === 'map'
                                    ? 'text-nature-600 border-b-2 border-nature-600 bg-nature-50'
                                    : 'text-earth-500 hover:text-earth-700'
                                }`}
                        >
                            <MapPin size={18} className="inline mr-2" />
                            Supply Map
                        </button>
                        <button
                            onClick={() => setActiveTab('contracts')}
                            className={`flex-1 py-4 px-6 font-medium text-sm transition-colors ${activeTab === 'contracts'
                                    ? 'text-nature-600 border-b-2 border-nature-600 bg-nature-50'
                                    : 'text-earth-500 hover:text-earth-700'
                                }`}
                        >
                            <Calendar size={18} className="inline mr-2" />
                            Forward Contracts ({forwardContracts.length})
                        </button>
                    </div>
                </div>

                {activeTab === 'supply' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Search & Filters */}
                            <div className="bg-white rounded-xl shadow-sm border border-earth-100 p-6">
                                <h2 className="font-bold text-lg text-earth-900 mb-4 flex items-center gap-2">
                                    <Search size={20} /> Search Supply
                                </h2>
                                <div className="flex flex-col md:flex-row gap-3">
                                    <div className="flex-1 relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" size={20} />
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            placeholder="Search by location or crop..."
                                            className="w-full pl-10 pr-4 py-3 border border-earth-300 rounded-lg focus:ring-2 focus:ring-nature-500"
                                        />
                                    </div>
                                    <select
                                        value={selectedState}
                                        onChange={(e) => setSelectedState(e.target.value)}
                                        className="px-4 py-3 border border-earth-300 rounded-lg focus:ring-2 focus:ring-nature-500"
                                    >
                                        <option value="All">All States</option>
                                        {INDIAN_STATES.map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={selectedCrop}
                                        onChange={(e) => setSelectedCrop(e.target.value)}
                                        className="px-4 py-3 border border-earth-300 rounded-lg focus:ring-2 focus:ring-nature-500"
                                    >
                                        <option value="All">All Crops</option>
                                        {CROP_TYPES.map(c => (
                                            <option key={c.id} value={c.name}>{c.icon} {c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Available Listings */}
                            <div className="bg-white rounded-xl shadow-sm border border-earth-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-earth-100 flex justify-between items-center">
                                    <h2 className="font-bold text-lg text-earth-900">
                                        Available Supply ({filteredListings.length} listings)
                                    </h2>
                                    <Link to="/marketplace" className="text-nature-600 text-sm font-medium hover:underline">
                                        View All
                                    </Link>
                                </div>

                                <div className="divide-y divide-earth-100 max-h-96 overflow-y-auto">
                                    {filteredListings.slice(0, 8).map(listing => (
                                        <Link
                                            key={listing.id}
                                            to={`/listing/${listing.id}`}
                                            className="p-4 flex items-center gap-4 hover:bg-earth-50 transition-colors"
                                        >
                                            <img
                                                src={listing.imageUrl}
                                                alt={listing.cropType}
                                                className="w-14 h-14 rounded-lg object-cover"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="font-medium text-earth-900 truncate">{listing.residueType}</p>
                                                    <Badge
                                                        variant={listing.status === 'available' ? 'success' : 'warning'}
                                                        size="sm"
                                                    >
                                                        {listing.status}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-earth-500">{listing.location}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-earth-900">{listing.quantityTons} tons</p>
                                                <p className="text-sm text-nature-600">₹{listing.pricePerTon}/ton</p>
                                            </div>
                                            <ChevronRight className="text-earth-400 flex-shrink-0" size={20} />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Supply Forecast */}
                            <div className="bg-white rounded-xl shadow-sm border border-earth-100 p-6">
                                <h3 className="font-bold text-lg text-earth-900 mb-4">Supply Forecast</h3>
                                <div className="h-48">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={supplyForecast}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                            <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} />
                                            <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                                            <Tooltip />
                                            <Area type="monotone" dataKey="tons" stroke="#16a34a" fill="#bbf7d0" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Your Contracts */}
                            <div className="bg-white rounded-xl shadow-sm border border-earth-100 p-6">
                                <h3 className="font-bold text-lg text-earth-900 mb-4">Your Contracts</h3>
                                {contracts.length === 0 ? (
                                    <div className="text-center py-4">
                                        <FileText className="mx-auto text-earth-300 mb-2" size={32} />
                                        <p className="text-sm text-earth-500">No active contracts</p>
                                        <Link to="/marketplace" className="text-nature-600 text-sm hover:underline">
                                            Browse listings
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {contracts.slice(0, 3).map(contract => (
                                            <div key={contract.id} className="bg-earth-50 rounded-lg p-3">
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="font-medium text-earth-900">{contract.residueType}</p>
                                                    <Badge
                                                        variant={contract.status === 'active' ? 'info' : 'success'}
                                                        size="sm"
                                                    >
                                                        {contract.status}
                                                    </Badge>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-earth-500">{contract.quantity} tons</span>
                                                    <span className="font-medium text-nature-700">
                                                        ₹{contract.totalAmount.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* ESG Summary */}
                            <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl p-6 text-white">
                                <div className="flex items-center gap-2 mb-4">
                                    <Leaf size={24} />
                                    <h3 className="font-bold">ESG Impact</h3>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-3xl font-bold">{totalCarbon.toFixed(1)}</p>
                                        <p className="text-sm text-teal-100">Tons of CO₂ avoided</p>
                                    </div>
                                    <div className="pt-3 border-t border-teal-500/30">
                                        <p className="text-lg font-bold">
                                            ₹{(totalCarbon * 15).toLocaleString()}
                                        </p>
                                        <p className="text-sm text-teal-100">Carbon credit value</p>
                                    </div>
                                    <Link
                                        to="/carbon-credits"
                                        className="block w-full text-center bg-white/20 hover:bg-white/30 py-2 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        View Details →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'map' && (
                    <div className="bg-white rounded-xl shadow-sm border border-earth-100 overflow-hidden">
                        <SupplyMap
                            listings={filteredListings}
                            height="600px"
                            selectedCropType={selectedCrop !== 'All' ? selectedCrop : undefined}
                            selectedState={selectedState !== 'All' ? selectedState : undefined}
                        />
                    </div>
                )}

                {activeTab === 'contracts' && (
                    <div className="space-y-6">
                        {/* Create Button */}
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-earth-900">Your Forward Contracts</h2>
                            <button
                                onClick={() => setShowCreateContract(true)}
                                className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-amber-600 transition-colors"
                            >
                                <Plus size={18} /> Create New
                            </button>
                        </div>

                        {forwardContracts.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-sm border border-earth-100 p-12 text-center">
                                <Calendar className="mx-auto text-earth-300 mb-4" size={48} />
                                <h3 className="text-lg font-semibold text-earth-800 mb-2">No Forward Contracts Yet</h3>
                                <p className="text-earth-500 mb-4 max-w-md mx-auto">
                                    Create a forward contract to secure future supply at locked prices. Farmers can accept your terms before harvest.
                                </p>
                                <button
                                    onClick={() => setShowCreateContract(true)}
                                    className="inline-flex items-center gap-2 bg-amber-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-amber-600 transition-colors"
                                >
                                    <Plus size={20} /> Create Forward Contract
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {forwardContracts.map(fc => (
                                    <div key={fc.id} className="bg-white rounded-xl shadow-sm border border-earth-100 p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="font-semibold text-earth-900">{fc.residueType}</h3>
                                                <p className="text-sm text-earth-500">{fc.cropType}</p>
                                            </div>
                                            <Badge
                                                variant={
                                                    fc.status === 'open' ? 'info' :
                                                        fc.status === 'partially_filled' ? 'warning' :
                                                            fc.status === 'filled' ? 'success' : 'default'
                                                }
                                            >
                                                {fc.status.replace('_', ' ')}
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                                            <div className="flex items-center gap-2">
                                                <Package size={16} className="text-earth-400" />
                                                <span className="text-earth-700">{fc.quantityRequired} tons</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <IndianRupee size={16} className="text-nature-600" />
                                                <span className="text-nature-700 font-semibold">₹{fc.pricePerTon}/ton</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin size={16} className="text-earth-400" />
                                                <span className="text-earth-600">{fc.location}, {fc.state}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} className="text-earth-400" />
                                                <span className="text-earth-600">
                                                    {new Date(fc.deliveryWindow.start).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>

                                        {fc.acceptedFarmers.length > 0 && (
                                            <div className="border-t border-earth-100 pt-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Users size={16} className="text-nature-600" />
                                                    <span className="text-sm font-medium text-earth-700">
                                                        {fc.acceptedFarmers.length} farmer(s) accepted
                                                    </span>
                                                </div>
                                                <div className="bg-nature-50 rounded-lg p-3">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-earth-600">
                                                            {fc.acceptedFarmers.reduce((sum, f) => sum + f.quantity, 0)} / {fc.quantityRequired} tons filled
                                                        </span>
                                                        <span className="text-nature-700 font-medium">
                                                            {Math.round((fc.acceptedFarmers.reduce((sum, f) => sum + f.quantity, 0) / fc.quantityRequired) * 100)}%
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-nature-200 rounded-full h-2 mt-2">
                                                        <div
                                                            className="bg-nature-600 h-2 rounded-full transition-all"
                                                            style={{
                                                                width: `${Math.min(100, (fc.acceptedFarmers.reduce((sum, f) => sum + f.quantity, 0) / fc.quantityRequired) * 100)}%`
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
            <CreateForwardContract isOpen={showCreateContract} onClose={() => setShowCreateContract(false)} />
        </div>
    );
};

export default BuyerDashboard;
