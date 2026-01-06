import React, { useState, useEffect } from 'react';
import { IndianRupee, Package, Truck, Calculator, TrendingUp, Leaf, HelpCircle } from 'lucide-react';
import { CROP_TYPES, BASE_PRICES, QUALITY_OPTIONS, CARBON_RATES, PLATFORM_FEES } from '../constants';

interface PriceCalculatorProps {
    cropType?: string;
    residueType?: string;
    quantity?: number;
    quality?: 'Premium' | 'Standard' | 'Mixed';
    location?: string;
    compact?: boolean;
    onEstimateChange?: (estimate: PriceEstimate) => void;
}

export interface PriceEstimate {
    grossValue: number;
    basePrice: number;
    qualityMultiplier: number;
    logisticsCost: number;
    platformFee: number;
    netPayout: number;
    carbonCredits: number;
    carbonValue: number;
    totalEarnings: number;
}

// Simulated logistics cost based on region
const getLogisticsCost = (quantity: number, location?: string): number => {
    // Base cost is ₹100/ton + ₹50/ton for equipment
    const baseCost = 150;
    // Add distance factor (simulated)
    const distanceFactor = location?.toLowerCase().includes('punjab') ? 1.0 :
        location?.toLowerCase().includes('haryana') ? 1.1 :
            location?.toLowerCase().includes('uttar') ? 1.2 : 1.3;
    return Math.round(quantity * baseCost * distanceFactor);
};

const PriceCalculator: React.FC<PriceCalculatorProps> = ({
    cropType: initialCropType = '',
    residueType: initialResidueType = '',
    quantity: initialQuantity = 50,
    quality: initialQuality = 'Standard',
    location = '',
    compact = false,
    onEstimateChange,
}) => {
    const [cropType, setCropType] = useState(initialCropType);
    const [residueType, setResidueType] = useState(initialResidueType);
    const [quantity, setQuantity] = useState(initialQuantity);
    const [quality, setQuality] = useState<'Premium' | 'Standard' | 'Mixed'>(initialQuality);

    const selectedCrop = CROP_TYPES.find(c => c.name === cropType);
    const residueOptions = selectedCrop?.residues || [];

    // Calculate estimate
    const calculateEstimate = (): PriceEstimate => {
        const basePrice = BASE_PRICES[cropType] || 1200;
        const qualityOption = QUALITY_OPTIONS.find(q => q.id === quality);
        const qualityMultiplier = qualityOption?.multiplier || 1.0;

        const adjustedPrice = Math.round(basePrice * qualityMultiplier);
        const grossValue = adjustedPrice * quantity;
        const logisticsCost = getLogisticsCost(quantity, location);
        const platformFee = Math.round(grossValue * PLATFORM_FEES.TRANSACTION_COMMISSION);
        const netPayout = grossValue - logisticsCost - platformFee;

        // Carbon credits
        const carbonCredits = quantity * CARBON_RATES.CO2_PER_TON_BURNED;
        const carbonValue = Math.round(carbonCredits * CARBON_RATES.CREDIT_PRICE * CARBON_RATES.FARMER_SHARE * 83); // INR conversion

        const totalEarnings = netPayout + carbonValue;

        return {
            grossValue,
            basePrice,
            qualityMultiplier,
            logisticsCost,
            platformFee,
            netPayout,
            carbonCredits,
            carbonValue,
            totalEarnings,
        };
    };

    const estimate = calculateEstimate();

    useEffect(() => {
        onEstimateChange?.(estimate);
    }, [cropType, residueType, quantity, quality]);

    if (compact) {
        return (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-earth-600">Estimated Earnings</span>
                    <Calculator size={16} className="text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-700">
                    ₹{estimate.totalEarnings.toLocaleString()}
                </div>
                <div className="text-xs text-earth-500 mt-1">
                    For {quantity} tons of {residueType || 'residue'}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-earth-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-nature-600 to-nature-700 text-white p-4">
                <div className="flex items-center gap-2">
                    <Calculator size={24} />
                    <div>
                        <h3 className="font-bold text-lg">Price Discovery</h3>
                        <p className="text-nature-100 text-sm">See what your crop waste is worth</p>
                    </div>
                </div>
            </div>

            <div className="p-5 space-y-5">
                {/* Crop Selection */}
                <div>
                    <label className="block text-sm font-medium text-earth-700 mb-2">Crop Type</label>
                    <div className="grid grid-cols-4 gap-2">
                        {CROP_TYPES.slice(0, 8).map(crop => (
                            <button
                                key={crop.id}
                                onClick={() => {
                                    setCropType(crop.name);
                                    setResidueType(crop.residues[0] || '');
                                }}
                                className={`p-2 rounded-lg border text-center transition-all ${cropType === crop.name
                                        ? 'border-nature-500 bg-nature-50 ring-2 ring-nature-500/20'
                                        : 'border-earth-200 hover:border-nature-300'
                                    }`}
                            >
                                <span className="text-xl block">{crop.icon}</span>
                                <span className="text-xs text-earth-600 truncate block">{crop.name.split(' ')[0]}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Residue Type */}
                {residueOptions.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium text-earth-700 mb-2">Residue Type</label>
                        <div className="flex flex-wrap gap-2">
                            {residueOptions.map(r => (
                                <button
                                    key={r}
                                    onClick={() => setResidueType(r)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${residueType === r
                                            ? 'bg-nature-600 text-white'
                                            : 'bg-earth-100 text-earth-600 hover:bg-earth-200'
                                        }`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quantity */}
                <div>
                    <label className="block text-sm font-medium text-earth-700 mb-2">
                        <Package size={14} className="inline mr-1" />
                        Quantity: {quantity} tons
                    </label>
                    <input
                        type="range"
                        min="10"
                        max="500"
                        step="10"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="w-full accent-nature-600"
                    />
                    <div className="flex justify-between text-xs text-earth-400 mt-1">
                        <span>10 tons</span>
                        <span>500 tons</span>
                    </div>
                </div>

                {/* Quality */}
                <div>
                    <label className="block text-sm font-medium text-earth-700 mb-2">Quality Grade</label>
                    <div className="grid grid-cols-3 gap-2">
                        {QUALITY_OPTIONS.map(q => (
                            <button
                                key={q.id}
                                onClick={() => setQuality(q.id as 'Premium' | 'Standard' | 'Mixed')}
                                className={`p-3 rounded-lg border text-center transition-all ${quality === q.id
                                        ? 'border-nature-500 bg-nature-50'
                                        : 'border-earth-200 hover:border-nature-300'
                                    }`}
                            >
                                <span className={`font-medium block ${q.id === 'Premium' ? 'text-green-600' :
                                        q.id === 'Standard' ? 'text-amber-600' : 'text-earth-600'
                                    }`}>{q.name}</span>
                                <span className="text-xs text-earth-400">{q.multiplier}x price</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results */}
                <div className="bg-gradient-to-br from-earth-50 to-earth-100 rounded-xl p-4 space-y-3">
                    <h4 className="font-semibold text-earth-800 flex items-center gap-2">
                        <TrendingUp size={18} className="text-nature-600" />
                        Your Estimated Earnings
                    </h4>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-earth-600">Gross Value ({quantity} × ₹{Math.round(estimate.basePrice * estimate.qualityMultiplier)})</span>
                            <span className="font-medium text-earth-800">₹{estimate.grossValue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-red-600">
                            <span className="flex items-center gap-1">
                                <Truck size={14} /> Logistics Cost
                            </span>
                            <span>-₹{estimate.logisticsCost.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-red-600">
                            <span>Platform Fee (5%)</span>
                            <span>-₹{estimate.platformFee.toLocaleString()}</span>
                        </div>
                        <div className="border-t border-earth-200 pt-2 flex justify-between">
                            <span className="font-medium text-earth-700">Net Sale Value</span>
                            <span className="font-bold text-earth-900">₹{estimate.netPayout.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Carbon Credits */}
                    <div className="bg-teal-50 rounded-lg p-3 border border-teal-100">
                        <div className="flex items-center gap-2 mb-2">
                            <Leaf size={16} className="text-teal-600" />
                            <span className="font-medium text-teal-800">Carbon Credit Bonus</span>
                            <HelpCircle size={14} className="text-teal-400" />
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-teal-700">{estimate.carbonCredits.toFixed(1)} tons CO₂ avoided</span>
                            <span className="font-bold text-teal-700">+₹{estimate.carbonValue.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Total */}
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-4 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm">Total Estimated Earnings</p>
                                <p className="text-3xl font-bold">₹{estimate.totalEarnings.toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-green-100 text-sm">Per Ton</p>
                                <p className="text-xl font-bold">₹{Math.round(estimate.totalEarnings / quantity).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PriceCalculator;
