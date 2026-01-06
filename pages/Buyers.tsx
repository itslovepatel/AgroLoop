import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart2, Truck, Lock, ArrowRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '../context/AppContext';
import { UserType } from '../types';
import AuthModal from '../components/AuthModal';

const Buyers: React.FC = () => {
    const { state } = useApp();
    const [showAuth, setShowAuth] = useState(false);

    const isBuyer = state.user?.type === UserType.BUYER;

    const supplyData = [
        { month: 'Sep', tons: 2000 },
        { month: 'Oct', tons: 5000 },
        { month: 'Nov', tons: 12000 },
        { month: 'Dec', tons: 8000 },
        { month: 'Jan', tons: 3000 },
    ];

    return (
        <div className="min-h-screen bg-white pb-20">
            <div className="bg-earth-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="md:w-2/3">
                        <h1 className="text-4xl font-serif font-bold mb-4">Secure Your Biomass Supply Chain</h1>
                        <p className="text-xl text-earth-300 mb-8">
                            Source verified agricultural residue directly from farmers. Optimize logistics and stabilize pricing.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            {isBuyer ? (
                                <Link
                                    to="/buyer-dashboard"
                                    className="inline-flex items-center justify-center gap-2 bg-nature-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-nature-700 transition-all"
                                >
                                    Go to Dashboard <ArrowRight size={20} />
                                </Link>
                            ) : (
                                <button
                                    onClick={() => setShowAuth(true)}
                                    className="inline-flex items-center justify-center gap-2 bg-nature-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-nature-700 transition-all"
                                >
                                    Register as Buyer <ArrowRight size={20} />
                                </button>
                            )}
                            <Link
                                to="/marketplace"
                                className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all"
                            >
                                Browse Marketplace
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                        <h2 className="text-2xl font-bold text-earth-900 mb-6">Why Source via AgriLoop?</h2>
                        <ul className="space-y-6">
                            <li className="flex gap-4">
                                <div className="bg-nature-100 p-3 rounded-lg h-fit">
                                    <Lock className="text-nature-700" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-earth-900">Forward Contracts</h3>
                                    <p className="text-earth-600">Lock in prices and quantities before the harvest season begins to avoid spot market volatility.</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="bg-nature-100 p-3 rounded-lg h-fit">
                                    <Truck className="text-nature-700" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-earth-900">Route Optimization</h3>
                                    <p className="text-earth-600">Our algorithm aggregates small farm listings into efficient collection routes to minimize transport costs.</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="bg-nature-100 p-3 rounded-lg h-fit">
                                    <BarChart2 className="text-nature-700" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-earth-900">Quality Assurance</h3>
                                    <p className="text-earth-600">Standardized moisture and ash content verification for every lot listed.</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-earth-50 p-6 rounded-xl border border-earth-200">
                        <h3 className="font-bold text-lg text-earth-900 mb-4">Supply Forecast (Punjab Region)</h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={supplyData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="month" tick={{ fill: '#4b5563' }} />
                                    <YAxis tick={{ fill: '#4b5563' }} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="tons" stroke="#16a34a" fill="#bbf7d0" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="text-xs text-earth-500 mt-2 text-center">
                            *Projected availability based on current sowing data.
                        </p>
                    </div>
                </div>

                {/* Route Optimization Visualization (Mock) */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-earth-900 mb-6">Logistics Visualization</h2>
                    <div className="relative bg-gray-200 rounded-xl h-80 overflow-hidden flex items-center justify-center">
                        <img
                            src="https://picsum.photos/seed/map/1200/400"
                            alt="Map Visualization"
                            className="absolute inset-0 w-full h-full object-cover opacity-50"
                        />
                        <div className="relative z-10 bg-white/90 p-6 rounded-lg shadow-lg text-center max-w-md">
                            <p className="text-earth-800 font-bold mb-2">Smart Allocation Engine</p>
                            <p className="text-sm text-earth-600">
                                We automatically group farms (A, B, C) within a 10km radius to create full truckload lots for your plant.
                            </p>
                            <Link
                                to="/marketplace"
                                className="inline-block mt-4 bg-earth-800 text-white px-4 py-2 rounded text-sm hover:bg-earth-900"
                            >
                                View Live Supply
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Carbon Credits CTA */}
                <div className="mt-16 bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-8 md:p-12 text-white">
                    <div className="md:flex items-center justify-between">
                        <div className="md:w-2/3 mb-6 md:mb-0">
                            <h2 className="text-2xl md:text-3xl font-bold mb-4">Earn Carbon Credits</h2>
                            <p className="text-teal-100">
                                Every purchase generates verified carbon credits. Offset your emissions and boost ESG compliance.
                            </p>
                        </div>
                        <Link
                            to="/carbon-credits"
                            className="inline-flex items-center gap-2 bg-white text-teal-700 px-6 py-3 rounded-lg font-bold hover:bg-teal-50 transition-colors"
                        >
                            Learn More <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </div>

            <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
        </div>
    );
};

export default Buyers;