import React, { useState } from 'react';
import { MapPin, Calendar, Scale, Sparkles, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import Modal from './ui/Modal';
import { useApp } from '../context/AppContext';
import { CROP_TYPES, QUALITY_OPTIONS, BASE_PRICES, INDIAN_STATES } from '../constants';
import { UserType, Farmer } from '../types';

interface CreateListingProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateListing: React.FC<CreateListingProps> = ({ isOpen, onClose }) => {
    const { state, createListing } = useApp();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    // Form state
    const [cropType, setCropType] = useState('');
    const [residueType, setResidueType] = useState('');
    const [quantity, setQuantity] = useState(10);
    const [quality, setQuality] = useState<'Premium' | 'Standard' | 'Mixed'>('Standard');
    const [location, setLocation] = useState('');
    const [selectedState, setSelectedState] = useState('Punjab');
    const [harvestStart, setHarvestStart] = useState('');
    const [harvestEnd, setHarvestEnd] = useState('');
    const [useGPS, setUseGPS] = useState(false);
    const [gpsLoading, setGpsLoading] = useState(false);

    const selectedCrop = CROP_TYPES.find(c => c.name === cropType);
    const qualityMultiplier = QUALITY_OPTIONS.find(q => q.id === quality)?.multiplier || 1;
    const basePrice = BASE_PRICES[cropType] || 1000;
    const suggestedPrice = Math.round(basePrice * qualityMultiplier);

    const handleGetLocation = () => {
        setGpsLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // In production, reverse geocode this
                    setLocation('Your Location (GPS)');
                    setUseGPS(true);
                    setGpsLoading(false);
                },
                () => {
                    setGpsLoading(false);
                    alert('Unable to get location. Please enter manually.');
                }
            );
        } else {
            setGpsLoading(false);
            alert('Geolocation not supported');
        }
    };

    const handleSubmit = () => {
        if (!state.user || state.user.type !== UserType.FARMER) return;

        setIsLoading(true);
        const farmer = state.user as Farmer;

        setTimeout(() => {
            createListing({
                farmerId: farmer.id,
                cropType,
                residueType,
                quantityTons: quantity,
                pricePerTon: suggestedPrice,
                location: `${location}, ${selectedState}`,
                district: location,
                state: selectedState,
                farmerName: farmer.name,
                availableDate: harvestStart,
                harvestWindow: { start: harvestStart, end: harvestEnd },
                quality,
                imageUrl: `https://picsum.photos/seed/${cropType.toLowerCase()}/400/300`,
                carbonPotential: quantity * 1.5,
            });

            setIsLoading(false);
            onClose();
            // Reset form
            setStep(1);
            setCropType('');
            setResidueType('');
            setQuantity(10);
            setQuality('Standard');
            setLocation('');
            setHarvestStart('');
            setHarvestEnd('');
        }, 1500);
    };

    const canProceed = () => {
        switch (step) {
            case 1: return cropType && residueType;
            case 2: return quantity > 0 && quality;
            case 3: return location && selectedState && harvestStart && harvestEnd;
            default: return true;
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-earth-700 mb-3">
                                What crop did you harvest?
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {CROP_TYPES.map(crop => (
                                    <button
                                        key={crop.id}
                                        onClick={() => { setCropType(crop.name); setResidueType(''); }}
                                        className={`p-4 rounded-xl border-2 text-center transition-all hover:scale-105 ${cropType === crop.name
                                                ? 'border-nature-500 bg-nature-50'
                                                : 'border-earth-200 hover:border-nature-300'
                                            }`}
                                    >
                                        <span className="text-3xl block mb-2">{crop.icon}</span>
                                        <span className="text-sm font-medium text-earth-800">{crop.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {selectedCrop && (
                            <div className="animate-fadeIn">
                                <label className="block text-sm font-medium text-earth-700 mb-3">
                                    What type of residue do you have?
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {selectedCrop.residues.map(r => (
                                        <button
                                            key={r}
                                            onClick={() => setResidueType(r)}
                                            className={`px-4 py-2 rounded-full border-2 transition-all ${residueType === r
                                                    ? 'border-nature-500 bg-nature-500 text-white'
                                                    : 'border-earth-200 hover:border-nature-300'
                                                }`}
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-earth-700 mb-3">
                                <Scale className="inline mr-2" size={18} />
                                Estimated Quantity (Tons)
                            </label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="range"
                                    min="1"
                                    max="500"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    className="flex-1 accent-nature-600 h-3 rounded-full"
                                />
                                <div className="w-24 text-center">
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                                        className="w-full px-3 py-2 border border-earth-300 rounded-lg text-center text-xl font-bold"
                                    />
                                </div>
                            </div>
                            <p className="text-sm text-earth-500 mt-2">
                                💡 Tip: 1 acre of paddy produces roughly 2-3 tons of stubble
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-earth-700 mb-3">
                                Quality Level
                            </label>
                            <div className="space-y-3">
                                {QUALITY_OPTIONS.map(q => (
                                    <button
                                        key={q.id}
                                        onClick={() => setQuality(q.id as typeof quality)}
                                        className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between ${quality === q.id
                                                ? 'border-nature-500 bg-nature-50'
                                                : 'border-earth-200 hover:border-nature-300'
                                            }`}
                                    >
                                        <div>
                                            <span className="font-bold text-earth-900">{q.name}</span>
                                            <p className="text-sm text-earth-500">{q.description}</p>
                                        </div>
                                        {quality === q.id && (
                                            <Check className="text-nature-600" size={24} />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-nature-50 border border-nature-200 rounded-xl p-4">
                            <div className="flex items-center gap-2 text-nature-700 mb-2">
                                <Sparkles size={20} />
                                <span className="font-bold">AI Price Suggestion</span>
                            </div>
                            <p className="text-3xl font-bold text-nature-800">
                                ₹{suggestedPrice.toLocaleString()}/ton
                            </p>
                            <p className="text-sm text-nature-600 mt-1">
                                Based on current market rates for {quality?.toLowerCase()} quality {cropType?.toLowerCase() || 'crop'}
                            </p>
                            <p className="text-lg font-bold text-nature-900 mt-2">
                                Total Value: ₹{(suggestedPrice * quantity).toLocaleString()}
                            </p>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-earth-700 mb-3">
                                <MapPin className="inline mr-2" size={18} />
                                Location
                            </label>
                            <div className="space-y-3">
                                <button
                                    onClick={handleGetLocation}
                                    disabled={gpsLoading}
                                    className="w-full py-3 border-2 border-dashed border-nature-300 rounded-xl text-nature-700 hover:bg-nature-50 transition flex items-center justify-center gap-2"
                                >
                                    {gpsLoading ? (
                                        <div className="w-5 h-5 border-2 border-nature-300 border-t-nature-600 rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <MapPin size={20} />
                                            Use My Current Location
                                        </>
                                    )}
                                </button>
                                <div className="text-center text-earth-400 text-sm">or enter manually</div>
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="District/Village"
                                        className="px-4 py-3 border border-earth-300 rounded-lg focus:ring-2 focus:ring-nature-500"
                                    />
                                    <select
                                        value={selectedState}
                                        onChange={(e) => setSelectedState(e.target.value)}
                                        className="px-4 py-3 border border-earth-300 rounded-lg focus:ring-2 focus:ring-nature-500"
                                    >
                                        {INDIAN_STATES.map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-earth-700 mb-3">
                                <Calendar className="inline mr-2" size={18} />
                                Harvest Window
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs text-earth-500 mb-1">Available From</label>
                                    <input
                                        type="date"
                                        value={harvestStart}
                                        onChange={(e) => setHarvestStart(e.target.value)}
                                        className="w-full px-4 py-3 border border-earth-300 rounded-lg focus:ring-2 focus:ring-nature-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-earth-500 mb-1">Available Until</label>
                                    <input
                                        type="date"
                                        value={harvestEnd}
                                        onChange={(e) => setHarvestEnd(e.target.value)}
                                        className="w-full px-4 py-3 border border-earth-300 rounded-lg focus:ring-2 focus:ring-nature-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-earth-100 rounded-xl p-4">
                            <h4 className="font-bold text-earth-900 mb-3">Listing Summary</h4>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <span className="text-earth-500">Crop:</span>
                                    <p className="font-medium">{cropType}</p>
                                </div>
                                <div>
                                    <span className="text-earth-500">Residue:</span>
                                    <p className="font-medium">{residueType}</p>
                                </div>
                                <div>
                                    <span className="text-earth-500">Quantity:</span>
                                    <p className="font-medium">{quantity} tons</p>
                                </div>
                                <div>
                                    <span className="text-earth-500">Quality:</span>
                                    <p className="font-medium">{quality}</p>
                                </div>
                                <div>
                                    <span className="text-earth-500">Price:</span>
                                    <p className="font-medium">₹{suggestedPrice}/ton</p>
                                </div>
                                <div>
                                    <span className="text-earth-500">Total Value:</span>
                                    <p className="font-bold text-nature-700">₹{(suggestedPrice * quantity).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="List Crop Waste" size="lg">
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= s ? 'bg-nature-600 text-white' : 'bg-earth-200 text-earth-500'
                            }`}>
                            {step > s ? <Check size={20} /> : s}
                        </div>
                        {s < 3 && (
                            <div className={`flex-1 h-1 mx-2 rounded ${step > s ? 'bg-nature-500' : 'bg-earth-200'
                                }`} />
                        )}
                    </div>
                ))}
            </div>
            <div className="flex justify-between text-xs text-earth-500 -mt-4 mb-6">
                <span>Crop Type</span>
                <span>Quantity</span>
                <span>Location</span>
            </div>

            {renderStep()}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
                <button
                    onClick={() => setStep(Math.max(1, step - 1))}
                    disabled={step === 1}
                    className="flex items-center gap-2 px-4 py-2 text-earth-600 disabled:opacity-50"
                >
                    <ChevronLeft size={20} /> Back
                </button>

                {step < 3 ? (
                    <button
                        onClick={() => setStep(step + 1)}
                        disabled={!canProceed()}
                        className="flex items-center gap-2 px-6 py-3 bg-nature-600 hover:bg-nature-700 disabled:bg-earth-300 text-white rounded-lg font-bold transition-colors"
                    >
                        Next <ChevronRight size={20} />
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={!canProceed() || isLoading}
                        className="flex items-center gap-2 px-6 py-3 bg-nature-600 hover:bg-nature-700 disabled:bg-earth-300 text-white rounded-lg font-bold transition-colors"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <Check size={20} /> List for Sale
                            </>
                        )}
                    </button>
                )}
            </div>
        </Modal>
    );
};

export default CreateListing;
