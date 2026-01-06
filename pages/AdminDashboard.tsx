import React, { useState, useMemo } from 'react';
import {
    BarChart3, MapPin, Users, Package, TrendingUp,
    Leaf, AlertTriangle, CheckCircle, Clock, Building2,
    Settings, Edit2, Trash2, ToggleLeft, ToggleRight,
    Search, Filter, ChevronDown, Eye, IndianRupee, FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INDIAN_STATES } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import SupplyMap from '../components/SupplyMap';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { Listing, UserType } from '../types';

type AdminTab = 'overview' | 'users' | 'listings' | 'deals' | 'settings';

const AdminDashboard: React.FC = () => {
    const { state, dispatch } = useApp();
    const [activeTab, setActiveTab] = useState<AdminTab>('overview');
    const [searchQuery, setSearchQuery] = useState('');
    const [editingListing, setEditingListing] = useState<Listing | null>(null);
    const [editQuantity, setEditQuantity] = useState(0);
    const [editPrice, setEditPrice] = useState(0);

    // Calculate stats
    const stats = useMemo(() => {
        const totalListings = state.listings.length;
        const activeContracts = state.contracts.filter(c =>
            ['active', 'pickup_scheduled', 'in_transit'].includes(c.status)
        ).length;

        const residueSavedTons = state.contracts
            .filter(c => c.status === 'completed' || c.status === 'delivered')
            .reduce((sum, c) => sum + c.quantity, 0);

        const co2AvoidedTons = residueSavedTons * 1.5;
        const farmerEarnings = state.contracts.reduce((sum, c) => sum + c.farmerPayout, 0);

        const completedPickups = state.contracts.filter(c => c.status === 'completed').length;
        const totalPickups = state.contracts.length || 1;
        const pickupSuccessRate = (completedPickups / totalPickups) * 100;

        const regionStats = INDIAN_STATES.slice(0, 8).map(stateName => {
            const listings = state.listings.filter(l => l.state === stateName);
            return {
                state: stateName,
                tons: listings.reduce((sum, l) => sum + l.quantityTons, 0),
            };
        }).filter(r => r.tons > 0);

        return { totalListings, activeContracts, residueSavedTons, co2AvoidedTons, farmerEarnings, pickupSuccessRate, regionStats };
    }, [state.listings, state.contracts]);

    // Mock users list for admin
    const mockUsers = useMemo(() => [
        { id: 'u1', name: 'Harpreet Singh', email: 'harpreet@farm.in', type: 'farmer', status: 'active', listings: 3, joined: '2024-08-15' },
        { id: 'u2', name: 'Vikram Sharma', email: 'vikram@greenpower.in', type: 'buyer', status: 'active', contracts: 5, joined: '2024-07-20' },
        { id: 'u3', name: 'Sukhwinder Kaur', email: 'sukhwinder@mail.in', type: 'farmer', status: 'active', listings: 2, joined: '2024-09-01' },
        { id: 'u4', name: 'Rajesh Gupta', email: 'rajesh@biogas.in', type: 'buyer', status: 'inactive', contracts: 1, joined: '2024-06-10' },
    ], []);

    const filteredListings = useMemo(() => {
        return state.listings.filter(l =>
            l.residueType.toLowerCase().includes(searchQuery.toLowerCase()) ||
            l.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            l.farmerName.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [state.listings, searchQuery]);

    const filteredDeals = useMemo(() => {
        return state.contracts.filter(c =>
            c.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.buyerName.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [state.contracts, searchQuery]);

    const cropDistribution = useMemo(() => {
        const distribution: Record<string, number> = {};
        state.listings.forEach(l => {
            distribution[l.cropType] = (distribution[l.cropType] || 0) + l.quantityTons;
        });
        return Object.entries(distribution).map(([name, value]) => ({ name, value }));
    }, [state.listings]);

    const COLORS = ['#16a34a', '#ca8a04', '#059669', '#6366f1', '#f97316'];

    const handleUpdateListing = () => {
        if (editingListing) {
            dispatch({
                type: 'UPDATE_LISTING',
                payload: {
                    ...editingListing,
                    quantityTons: editQuantity,
                    pricePerTon: editPrice,
                }
            });
            setEditingListing(null);
        }
    };

    const handleUpdateDealStatus = (contractId: string, newStatus: string) => {
        dispatch({
            type: 'UPDATE_CONTRACT_STATUS',
            payload: { contractId, status: newStatus as any }
        });
    };

    const renderOverview = () => (
        <>
            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl p-5 shadow-md border border-earth-100">
                    <div className="flex items-center justify-between mb-2">
                        <Package className="text-nature-600" size={24} />
                        <span className="text-2xl font-bold text-earth-900">{stats.totalListings}</span>
                    </div>
                    <p className="text-sm text-earth-500">Total Listings</p>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-md border border-earth-100">
                    <div className="flex items-center justify-between mb-2">
                        <TrendingUp className="text-blue-500" size={24} />
                        <span className="text-2xl font-bold text-earth-900">{stats.activeContracts}</span>
                    </div>
                    <p className="text-sm text-earth-500">Active Contracts</p>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-md border border-earth-100">
                    <div className="flex items-center justify-between mb-2">
                        <Users className="text-amber-500" size={24} />
                        <span className="text-2xl font-bold text-earth-900">
                            {new Set(state.listings.map(l => l.farmerId)).size}
                        </span>
                    </div>
                    <p className="text-sm text-earth-500">Active Farmers</p>
                </div>
                <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-5 shadow-md text-white">
                    <div className="flex items-center justify-between mb-2">
                        <Leaf className="text-green-200" size={24} />
                        <span className="text-2xl font-bold">{stats.co2AvoidedTons.toFixed(0)}</span>
                    </div>
                    <p className="text-sm text-green-100">CO₂ Avoided (tons)</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Supply Map */}
                    <div className="bg-white rounded-xl shadow-sm border border-earth-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-earth-100">
                            <h2 className="font-bold text-lg text-earth-900 flex items-center gap-2">
                                <MapPin size={20} /> Supply Distribution Map
                            </h2>
                        </div>
                        <SupplyMap listings={state.listings} height="350px" />
                    </div>

                    {/* Region Stats */}
                    <div className="bg-white rounded-xl shadow-sm border border-earth-100 p-6">
                        <h2 className="font-bold text-lg text-earth-900 mb-4 flex items-center gap-2">
                            <BarChart3 size={20} /> Supply by Region
                        </h2>
                        <div className="h-56">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.regionStats}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="state" tick={{ fill: '#6b7280', fontSize: 11 }} angle={-45} textAnchor="end" height={60} />
                                    <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                                    <Tooltip />
                                    <Bar dataKey="tons" fill="#16a34a" name="Tons" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Burning Risk */}
                    <div className="bg-white rounded-xl shadow-sm border border-earth-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-earth-100 bg-red-50">
                            <h3 className="font-bold text-lg text-red-800 flex items-center gap-2">
                                <AlertTriangle size={20} /> Burning Risk Zones
                            </h3>
                        </div>
                        <div className="p-4 space-y-3">
                            {[
                                { region: 'Ludhiana, Punjab', risk: 'high' },
                                { region: 'Sangrur, Punjab', risk: 'high' },
                                { region: 'Bathinda, Punjab', risk: 'medium' },
                            ].map((r, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-earth-50 rounded-lg">
                                    <span className="text-sm font-medium text-earth-800">{r.region}</span>
                                    <Badge variant={r.risk === 'high' ? 'error' : 'warning'} size="sm">{r.risk}</Badge>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Crop Distribution */}
                    <div className="bg-white rounded-xl shadow-sm border border-earth-100 p-6">
                        <h3 className="font-bold text-lg text-earth-900 mb-4">Crop Distribution</h3>
                        <div className="h-40">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={cropDistribution} cx="50%" cy="50%" innerRadius={35} outerRadius={60} dataKey="value">
                                        {cropDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

    const renderUsers = () => (
        <div className="bg-white rounded-xl shadow-sm border border-earth-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-earth-100 flex items-center justify-between">
                <h2 className="font-bold text-lg text-earth-900">User Management</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-4 py-2 border border-earth-200 rounded-lg text-sm focus:ring-2 focus:ring-nature-500"
                    />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-earth-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-earth-600 uppercase">User</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-earth-600 uppercase">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-earth-600 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-earth-600 uppercase">Activity</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-earth-600 uppercase">Joined</th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-earth-600 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-earth-100">
                        {mockUsers.map(user => (
                            <tr key={user.id} className="hover:bg-earth-50">
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="font-medium text-earth-900">{user.name}</p>
                                        <p className="text-sm text-earth-500">{user.email}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <Badge variant={user.type === 'farmer' ? 'success' : 'info'}>
                                        {user.type}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`flex items-center gap-1.5 text-sm ${user.status === 'active' ? 'text-green-600' : 'text-earth-400'}`}>
                                        <span className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-green-500' : 'bg-earth-300'}`} />
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-earth-600">
                                    {user.type === 'farmer'
                                        ? `${user.listings || 0} listings`
                                        : `${user.contracts || 0} contracts`}
                                </td>
                                <td className="px-6 py-4 text-sm text-earth-500">
                                    {new Date(user.joined).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-2 text-earth-500 hover:text-nature-600 hover:bg-nature-50 rounded-lg">
                                            <Eye size={16} />
                                        </button>
                                        <button className="p-2 text-earth-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="p-2 text-earth-500 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                            {user.status === 'active' ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderListings = () => (
        <div className="bg-white rounded-xl shadow-sm border border-earth-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-earth-100 flex items-center justify-between">
                <h2 className="font-bold text-lg text-earth-900">Listings Management</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search listings..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-4 py-2 border border-earth-200 rounded-lg text-sm focus:ring-2 focus:ring-nature-500"
                    />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-earth-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-earth-600 uppercase">Listing</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-earth-600 uppercase">Farmer</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-earth-600 uppercase">Quantity</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-earth-600 uppercase">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-earth-600 uppercase">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-earth-600 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-earth-100">
                        {filteredListings.map(listing => (
                            <tr key={listing.id} className="hover:bg-earth-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img src={listing.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover" />
                                        <div>
                                            <p className="font-medium text-earth-900">{listing.residueType}</p>
                                            <p className="text-sm text-earth-500">{listing.location}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-earth-700">{listing.farmerName}</td>
                                <td className="px-6 py-4 text-sm font-medium text-earth-900">{listing.quantityTons} tons</td>
                                <td className="px-6 py-4 text-sm font-medium text-nature-600">₹{listing.pricePerTon}/ton</td>
                                <td className="px-6 py-4">
                                    <Badge
                                        variant={listing.status === 'available' ? 'success' : listing.status === 'bidding' ? 'warning' : 'info'}
                                        size="sm"
                                    >
                                        {listing.status}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => {
                                            setEditingListing(listing);
                                            setEditQuantity(listing.quantityTons);
                                            setEditPrice(listing.pricePerTon);
                                        }}
                                        className="p-2 text-earth-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderDeals = () => (
        <div className="bg-white rounded-xl shadow-sm border border-earth-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-earth-100 flex items-center justify-between">
                <h2 className="font-bold text-lg text-earth-900">Deals Management</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search deals..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-4 py-2 border border-earth-200 rounded-lg text-sm focus:ring-2 focus:ring-nature-500"
                    />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-earth-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-earth-600 uppercase">Deal ID</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-earth-600 uppercase">Farmer</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-earth-600 uppercase">Buyer</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-earth-600 uppercase">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-earth-600 uppercase">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-earth-600 uppercase">Override</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-earth-100">
                        {filteredDeals.map(deal => (
                            <tr key={deal.id} className="hover:bg-earth-50">
                                <td className="px-6 py-4 font-mono text-sm text-earth-600">{deal.id.slice(0, 8)}...</td>
                                <td className="px-6 py-4 text-sm text-earth-700">{deal.farmerName}</td>
                                <td className="px-6 py-4 text-sm text-earth-700">{deal.buyerName}</td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-earth-900">₹{deal.totalAmount.toLocaleString()}</div>
                                    <div className="text-xs text-earth-500">{deal.quantity} tons</div>
                                </td>
                                <td className="px-6 py-4">
                                    <Badge
                                        variant={
                                            deal.status === 'completed' ? 'success' :
                                                deal.status === 'active' ? 'info' :
                                                    deal.status === 'cancelled' ? 'error' : 'warning'
                                        }
                                        size="sm"
                                    >
                                        {deal.status}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <select
                                        value={deal.status}
                                        onChange={(e) => handleUpdateDealStatus(deal.id, e.target.value)}
                                        className="text-xs border border-earth-200 rounded-lg px-2 py-1 focus:ring-2 focus:ring-nature-500"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="active">Active</option>
                                        <option value="pickup_scheduled">Pickup Scheduled</option>
                                        <option value="in_transit">In Transit</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderSettings = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-earth-100 p-6">
                <h3 className="font-bold text-lg text-earth-900 mb-4 flex items-center gap-2">
                    <IndianRupee size={20} /> Pricing Configuration
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-earth-700 mb-2">Platform Commission (%)</label>
                        <input type="number" defaultValue="5" className="w-full px-4 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-nature-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-earth-700 mb-2">Farmer Payout Share (%)</label>
                        <input type="number" defaultValue="85" className="w-full px-4 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-nature-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-earth-700 mb-2">Logistics Fee (%)</label>
                        <input type="number" defaultValue="10" className="w-full px-4 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-nature-500" />
                    </div>
                    <button className="w-full bg-nature-600 hover:bg-nature-700 text-white py-2 rounded-lg font-medium">
                        Save Pricing
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-earth-100 p-6">
                <h3 className="font-bold text-lg text-earth-900 mb-4 flex items-center gap-2">
                    <Leaf size={20} /> Carbon Credit Settings
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-earth-700 mb-2">CO₂ Factor (kg/ton)</label>
                        <input type="number" defaultValue="1500" className="w-full px-4 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-nature-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-earth-700 mb-2">Credit Price (₹/ton CO₂)</label>
                        <input type="number" defaultValue="15" className="w-full px-4 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-nature-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-earth-700 mb-2">Farmer Carbon Share (%)</label>
                        <input type="number" defaultValue="80" className="w-full px-4 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-nature-500" />
                    </div>
                    <button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg font-medium">
                        Save Carbon Settings
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-earth-50 pb-20">
            {/* Header */}
            <div className="bg-gradient-to-r from-earth-900 to-earth-800 text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <BarChart3 size={32} />
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
                            <p className="text-earth-300 mt-1">Platform management & analytics</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
                {/* Tabs */}
                <div className="bg-white rounded-xl border border-earth-200 mb-6 overflow-x-auto">
                    <div className="flex border-b border-earth-200">
                        {[
                            { id: 'overview', label: 'Overview', icon: BarChart3 },
                            { id: 'users', label: 'Users', icon: Users },
                            { id: 'listings', label: 'Listings', icon: Package },
                            { id: 'deals', label: 'Deals', icon: FileText },
                            { id: 'settings', label: 'Settings', icon: Settings },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as AdminTab)}
                                className={`flex-1 py-4 px-4 font-medium text-sm transition-colors flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === tab.id
                                        ? 'text-nature-600 border-b-2 border-nature-600 bg-nature-50'
                                        : 'text-earth-500 hover:text-earth-700'
                                    }`}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {activeTab === 'overview' && renderOverview()}
                {activeTab === 'users' && renderUsers()}
                {activeTab === 'listings' && renderListings()}
                {activeTab === 'deals' && renderDeals()}
                {activeTab === 'settings' && renderSettings()}
            </div>

            {/* Edit Listing Modal */}
            <Modal isOpen={!!editingListing} onClose={() => setEditingListing(null)} title="Edit Listing">
                {editingListing && (
                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                            <img src={editingListing.imageUrl} alt="" className="w-16 h-16 rounded-lg object-cover" />
                            <div>
                                <p className="font-medium text-earth-900">{editingListing.residueType}</p>
                                <p className="text-sm text-earth-500">{editingListing.location}</p>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-earth-700 mb-2">Quantity (tons)</label>
                            <input
                                type="number"
                                value={editQuantity}
                                onChange={(e) => setEditQuantity(Number(e.target.value))}
                                className="w-full px-4 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-nature-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-earth-700 mb-2">Price (₹/ton)</label>
                            <input
                                type="number"
                                value={editPrice}
                                onChange={(e) => setEditPrice(Number(e.target.value))}
                                className="w-full px-4 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-nature-500"
                            />
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={() => setEditingListing(null)}
                                className="flex-1 px-4 py-2 border border-earth-300 text-earth-700 rounded-lg font-medium hover:bg-earth-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateListing}
                                className="flex-1 px-4 py-2 bg-nature-600 text-white rounded-lg font-bold hover:bg-nature-700"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AdminDashboard;
