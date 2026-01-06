import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    MapPin, Calendar, Scale, Star, ArrowLeft, Leaf,
    Clock, User, Phone, TrendingUp, Truck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Badge from '../components/ui/Badge';
import PlaceBid from '../components/PlaceBid';
import { UserType } from '../types';

const ListingDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { state } = useApp();
    const [showBidModal, setShowBidModal] = useState(false);

    const listing = state.listings.find(l => l.id === id);

    if (!listing) {
        return (
            <div className="min-h-screen bg-earth-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-earth-900 mb-4">Listing Not Found</h1>
                    <Link to="/marketplace" className="text-nature-600 hover:underline">
                        ← Back to Marketplace
                    </Link>
                </div>
            </div>
        );
    }

    const isBuyer = state.user?.type === UserType.BUYER;
    const carbonCredits = listing.carbonPotential;
    const carbonValue = carbonCredits * 15;
    const totalValue = listing.quantityTons * listing.pricePerTon;

    return (
        <div className="min-h-screen bg-earth-50 pb-20">
            {/* Header */}
            <div className="bg-earth-900 text-white py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link to="/marketplace" className="inline-flex items-center gap-2 text-earth-300 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                        Back to Marketplace
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Image */}
                        <div className="relative rounded-2xl overflow-hidden shadow-lg">
                            <img
                                src={listing.imageUrl}
                                alt={listing.cropType}
                                className="w-full h-64 md:h-96 object-cover"
                            />
                            <div className="absolute top-4 left-4">
                                <Badge
                                    variant={
                                        listing.status === 'available' ? 'success' :
                                            listing.status === 'bidding' ? 'warning' : 'info'
                                    }
                                    size="md"
                                    pulse={listing.status === 'bidding'}
                                >
                                    {listing.status === 'available' ? 'Available Now' :
                                        listing.status === 'bidding' ? `${listing.bids.length} Active Bid(s)` : 'Contracted'}
                                </Badge>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                                <h1 className="text-2xl md:text-3xl font-bold text-white">
                                    {listing.residueType}
                                </h1>
                                <p className="text-earth-200">{listing.cropType}</p>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white rounded-xl p-4 shadow-sm border border-earth-100 text-center">
                                <Scale className="mx-auto text-nature-600 mb-2" size={24} />
                                <p className="text-2xl font-bold text-earth-900">{listing.quantityTons}</p>
                                <p className="text-xs text-earth-500">Tons Available</p>
                            </div>
                            <div className="bg-white rounded-xl p-4 shadow-sm border border-earth-100 text-center">
                                <TrendingUp className="mx-auto text-amber-500 mb-2" size={24} />
                                <p className="text-2xl font-bold text-earth-900">₹{listing.pricePerTon}</p>
                                <p className="text-xs text-earth-500">Per Ton</p>
                            </div>
                            <div className="bg-white rounded-xl p-4 shadow-sm border border-earth-100 text-center">
                                <Star className="mx-auto text-nature-600 mb-2" size={24} />
                                <p className="text-2xl font-bold text-earth-900">{listing.quality}</p>
                                <p className="text-xs text-earth-500">Quality Grade</p>
                            </div>
                            <div className="bg-white rounded-xl p-4 shadow-sm border border-earth-100 text-center">
                                <Leaf className="mx-auto text-teal-600 mb-2" size={24} />
                                <p className="text-2xl font-bold text-earth-900">{carbonCredits.toFixed(1)}</p>
                                <p className="text-xs text-earth-500">CO₂ Credits</p>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="bg-white rounded-xl shadow-sm border border-earth-100 p-6">
                            <h2 className="font-bold text-lg text-earth-900 mb-4">Listing Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="text-nature-600 flex-shrink-0 mt-1" size={20} />
                                        <div>
                                            <p className="font-medium text-earth-900">Location</p>
                                            <p className="text-earth-600">{listing.location}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Calendar className="text-nature-600 flex-shrink-0 mt-1" size={20} />
                                        <div>
                                            <p className="font-medium text-earth-900">Harvest Window</p>
                                            <p className="text-earth-600">
                                                {new Date(listing.harvestWindow.start).toLocaleDateString()} - {new Date(listing.harvestWindow.end).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Clock className="text-nature-600 flex-shrink-0 mt-1" size={20} />
                                        <div>
                                            <p className="font-medium text-earth-900">Available From</p>
                                            <p className="text-earth-600">{new Date(listing.availableDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <User className="text-nature-600 flex-shrink-0 mt-1" size={20} />
                                        <div>
                                            <p className="font-medium text-earth-900">Farmer</p>
                                            <p className="text-earth-600">{listing.farmerName}</p>
                                        </div>
                                    </div>
                                    {listing.moistureContent && (
                                        <div className="flex items-start gap-3">
                                            <div className="w-5 h-5 flex items-center justify-center text-nature-600">💧</div>
                                            <div>
                                                <p className="font-medium text-earth-900">Moisture Content</p>
                                                <p className="text-earth-600">{listing.moistureContent}%</p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-start gap-3">
                                        <Truck className="text-nature-600 flex-shrink-0 mt-1" size={20} />
                                        <div>
                                            <p className="font-medium text-earth-900">Pickup Available</p>
                                            <p className="text-earth-600">Buyer arranges collection</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Current Bids */}
                        {listing.bids.length > 0 && (
                            <div className="bg-white rounded-xl shadow-sm border border-earth-100 p-6">
                                <h2 className="font-bold text-lg text-earth-900 mb-4">
                                    Current Bids ({listing.bids.length})
                                </h2>
                                <div className="space-y-3">
                                    {listing.bids.map((bid, index) => (
                                        <div
                                            key={bid.id}
                                            className={`flex items-center justify-between p-4 rounded-lg ${index === 0 ? 'bg-nature-50 border border-nature-200' : 'bg-earth-50'
                                                }`}
                                        >
                                            <div>
                                                <p className="font-medium text-earth-900">{bid.companyName}</p>
                                                <p className="text-sm text-earth-500">{bid.quantity} tons</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-lg text-nature-700">
                                                    ₹{bid.pricePerTon}/ton
                                                </p>
                                                <Badge
                                                    variant={bid.status === 'pending' ? 'warning' : bid.status === 'accepted' ? 'success' : 'error'}
                                                    size="sm"
                                                >
                                                    {bid.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Pricing Card */}
                        <div className="bg-white rounded-xl shadow-lg border border-earth-100 p-6 sticky top-24">
                            <div className="text-center mb-6">
                                <p className="text-earth-500 text-sm">Total Value</p>
                                <p className="text-4xl font-bold text-earth-900">
                                    ₹{totalValue.toLocaleString()}
                                </p>
                                <p className="text-sm text-earth-500 mt-1">
                                    {listing.quantityTons} tons × ₹{listing.pricePerTon}/ton
                                </p>
                            </div>

                            {isBuyer && listing.status !== 'contracted' ? (
                                <button
                                    onClick={() => setShowBidModal(true)}
                                    className="w-full bg-nature-600 hover:bg-nature-700 text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-lg hover:shadow-xl"
                                >
                                    Place a Bid
                                </button>
                            ) : listing.status === 'contracted' ? (
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                                    <p className="text-blue-700 font-medium">This listing has been contracted</p>
                                </div>
                            ) : (
                                <Link
                                    to="/buyers"
                                    className="block w-full bg-nature-600 hover:bg-nature-700 text-white py-4 rounded-xl font-bold text-lg text-center transition-colors"
                                >
                                    Sign In as Buyer to Bid
                                </Link>
                            )}

                            <div className="mt-6 pt-6 border-t border-earth-100">
                                <h4 className="font-bold text-earth-900 mb-3">Carbon Credit Potential</h4>
                                <div className="bg-teal-50 rounded-lg p-4">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-earth-600">CO₂ Avoided</span>
                                        <span className="font-bold text-teal-700">{carbonCredits.toFixed(1)} tons</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-earth-600">Credit Value</span>
                                        <span className="font-bold text-teal-700">~₹{carbonValue.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-earth-100">
                                <h4 className="font-bold text-earth-900 mb-3">Need Equipment?</h4>
                                <Link
                                    to="/equipment"
                                    className="flex items-center justify-between p-3 bg-earth-50 rounded-lg hover:bg-earth-100 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <Truck className="text-amber-600" size={20} />
                                        <span className="text-earth-700">Rent balers & transport</span>
                                    </div>
                                    <ArrowLeft className="text-earth-400 rotate-180" size={16} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {listing && (
                <PlaceBid
                    isOpen={showBidModal}
                    onClose={() => setShowBidModal(false)}
                    listing={listing}
                />
            )}
        </div>
    );
};

export default ListingDetail;
