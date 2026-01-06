import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, IndianRupee, Package, Percent, Clock, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserType, ForwardContract } from '../types';
import { CROP_TYPES } from '../constants';
import { getAllStates, getDistrictsByState } from '../data/india-geography';
import Modal from './ui/Modal';

interface CreateForwardContractProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateForwardContract: React.FC<CreateForwardContractProps> = ({ isOpen, onClose }) => {
    const { state, dispatch } = useApp();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        cropType: '',
        residueType: '',
        quantityRequired: 100,
        pricePerTon: 1500,
        deliveryStart: '',
        deliveryEnd: '',
        selectedState: '',
        selectedDistrict: '',
        advancePaymentPercent: 20,
    });

    const [districts, setDistricts] = useState<string[]>([]);
    const allStates = getAllStates();

    // Update districts when state changes
    useEffect(() => {
        if (formData.selectedState) {
            const districtList = getDistrictsByState(formData.selectedState);
            setDistricts(districtList);
            setFormData(prev => ({ ...prev, selectedDistrict: '' }));
        }
    }, [formData.selectedState]);

    const selectedCrop = CROP_TYPES.find(c => c.name === formData.cropType);
    const residueOptions = selectedCrop?.residues || [];

    const handleSubmit = () => {
        if (!state.user || state.user.type !== UserType.BUYER) return;

        const location = formData.selectedDistrict
            ? `${formData.selectedDistrict}, ${formData.selectedState}`
            : formData.selectedState;

        const newContract: ForwardContract = {
            id: `fc_${Date.now()}`,
            buyerId: state.user.id,
            buyerName: state.user.name,
            companyName: (state.user as any).companyName || 'Your Company',
            cropType: formData.cropType,
            residueType: formData.residueType,
            quantityRequired: formData.quantityRequired,
            pricePerTon: formData.pricePerTon,
            deliveryWindow: { start: formData.deliveryStart, end: formData.deliveryEnd },
            location: location,
            state: formData.selectedState,
            advancePaymentPercent: formData.advancePaymentPercent,
            status: 'open',
            acceptedFarmers: [],
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        };

        dispatch({ type: 'ADD_FORWARD_CONTRACT', payload: newContract });
        onClose();
        resetForm();
    };

    const resetForm = () => {
        setStep(1);
        setFormData({
            cropType: '',
            residueType: '',
            quantityRequired: 100,
            pricePerTon: 1500,
            deliveryStart: '',
            deliveryEnd: '',
            selectedState: '',
            selectedDistrict: '',
            advancePaymentPercent: 20,
        });
    };

    const totalValue = formData.quantityRequired * formData.pricePerTon;
    const advanceAmount = (totalValue * formData.advancePaymentPercent) / 100;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create Forward Contract">
            <div className="p-6">
                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-8">
                    {[1, 2, 3].map((s, i) => (
                        <React.Fragment key={s}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${step >= s ? 'bg-nature-600 text-white' : 'bg-earth-200 text-earth-500'
                                }`}>
                                {step > s ? <CheckCircle size={20} /> : s}
                            </div>
                            {i < 2 && (
                                <div className={`w-16 h-1 mx-2 rounded transition-colors ${step > s ? 'bg-nature-600' : 'bg-earth-200'
                                    }`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Step 1: Crop & Quantity */}
                {step === 1 && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-earth-800 mb-4">What residue do you need?</h3>

                        <div>
                            <label className="block text-sm font-medium text-earth-700 mb-2">Crop Type</label>
                            <div className="grid grid-cols-2 gap-3">
                                {CROP_TYPES.map(crop => (
                                    <button
                                        key={crop.id}
                                        onClick={() => setFormData({ ...formData, cropType: crop.name, residueType: '' })}
                                        className={`p-3 rounded-lg border-2 text-left transition-all ${formData.cropType === crop.name
                                            ? 'border-nature-600 bg-nature-50'
                                            : 'border-earth-200 hover:border-nature-300'
                                            }`}
                                    >
                                        <span className="text-2xl mb-1 block">{crop.icon}</span>
                                        <span className="font-medium text-earth-800">{crop.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {residueOptions.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-earth-700 mb-2">Residue Type</label>
                                <div className="flex flex-wrap gap-2">
                                    {residueOptions.map(residue => (
                                        <button
                                            key={residue}
                                            onClick={() => setFormData({ ...formData, residueType: residue })}
                                            className={`px-4 py-2 rounded-full border-2 font-medium transition-all ${formData.residueType === residue
                                                ? 'border-nature-600 bg-nature-600 text-white'
                                                : 'border-earth-300 hover:border-nature-400'
                                                }`}
                                        >
                                            {residue}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-earth-700 mb-2">
                                <Package size={16} className="inline mr-1" />
                                Quantity Required (tons)
                            </label>
                            <input
                                type="number"
                                min="10"
                                step="10"
                                value={formData.quantityRequired}
                                onChange={(e) => setFormData({ ...formData, quantityRequired: Number(e.target.value) })}
                                className="w-full px-4 py-3 border border-earth-300 rounded-lg focus:ring-2 focus:ring-nature-500 focus:border-nature-500"
                            />
                        </div>
                    </div>
                )}

                {/* Step 2: Pricing & Terms */}
                {step === 2 && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-earth-800 mb-4">Set your pricing terms</h3>

                        <div>
                            <label className="block text-sm font-medium text-earth-700 mb-2">
                                <IndianRupee size={16} className="inline mr-1" />
                                Price per Ton (₹)
                            </label>
                            <input
                                type="number"
                                min="500"
                                step="50"
                                value={formData.pricePerTon}
                                onChange={(e) => setFormData({ ...formData, pricePerTon: Number(e.target.value) })}
                                className="w-full px-4 py-3 border border-earth-300 rounded-lg focus:ring-2 focus:ring-nature-500 focus:border-nature-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-earth-700 mb-2">
                                <Percent size={16} className="inline mr-1" />
                                Advance Payment: {formData.advancePaymentPercent}%
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="50"
                                step="5"
                                value={formData.advancePaymentPercent}
                                onChange={(e) => setFormData({ ...formData, advancePaymentPercent: Number(e.target.value) })}
                                className="w-full accent-nature-600"
                            />
                            <div className="flex justify-between text-xs text-earth-500 mt-1">
                                <span>No advance</span>
                                <span>50% advance</span>
                            </div>
                        </div>

                        {/* Summary Card */}
                        <div className="bg-gradient-to-br from-nature-50 to-nature-100 p-4 rounded-xl border border-nature-200">
                            <h4 className="font-semibold text-nature-800 mb-3">Contract Summary</h4>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <span className="text-earth-500">Total Value</span>
                                    <p className="font-bold text-earth-800">₹{totalValue.toLocaleString()}</p>
                                </div>
                                <div>
                                    <span className="text-earth-500">Advance Payment</span>
                                    <p className="font-bold text-nature-700">₹{advanceAmount.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Delivery Details with Cascading Dropdowns */}
                {step === 3 && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-earth-800 mb-4">Delivery requirements</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-earth-700 mb-2">
                                    <Calendar size={16} className="inline mr-1" />
                                    Delivery Start
                                </label>
                                <input
                                    type="date"
                                    value={formData.deliveryStart}
                                    onChange={(e) => setFormData({ ...formData, deliveryStart: e.target.value })}
                                    className="w-full px-4 py-3 border border-earth-300 rounded-lg focus:ring-2 focus:ring-nature-500 focus:border-nature-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-earth-700 mb-2">
                                    <Clock size={16} className="inline mr-1" />
                                    Delivery End
                                </label>
                                <input
                                    type="date"
                                    value={formData.deliveryEnd}
                                    onChange={(e) => setFormData({ ...formData, deliveryEnd: e.target.value })}
                                    className="w-full px-4 py-3 border border-earth-300 rounded-lg focus:ring-2 focus:ring-nature-500 focus:border-nature-500"
                                />
                            </div>
                        </div>

                        {/* State & District Cascading Dropdowns */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-earth-700 mb-2">
                                    <MapPin size={16} className="inline mr-1" />
                                    State *
                                </label>
                                <select
                                    value={formData.selectedState}
                                    onChange={(e) => setFormData({ ...formData, selectedState: e.target.value })}
                                    className="w-full px-4 py-3 border border-earth-300 rounded-lg focus:ring-2 focus:ring-nature-500 focus:border-nature-500"
                                >
                                    <option value="">Select State</option>
                                    {allStates.map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-earth-700 mb-2">
                                    District (Optional)
                                </label>
                                <select
                                    value={formData.selectedDistrict}
                                    onChange={(e) => setFormData({ ...formData, selectedDistrict: e.target.value })}
                                    disabled={!formData.selectedState}
                                    className="w-full px-4 py-3 border border-earth-300 rounded-lg focus:ring-2 focus:ring-nature-500 focus:border-nature-500 disabled:bg-earth-100"
                                >
                                    <option value="">Any District</option>
                                    {districts.map(d => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Final Summary */}
                        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200">
                            <h4 className="font-semibold text-amber-800 mb-3">Your Forward Contract</h4>
                            <div className="text-sm space-y-1 text-earth-700">
                                <p><strong>{formData.quantityRequired} tons</strong> of {formData.residueType} ({formData.cropType})</p>
                                <p>Price: <strong>₹{formData.pricePerTon}/ton</strong> (Total: ₹{totalValue.toLocaleString()})</p>
                                <p>Advance: <strong>{formData.advancePaymentPercent}%</strong> (₹{advanceAmount.toLocaleString()})</p>
                                <p>Delivery: {formData.deliveryStart} to {formData.deliveryEnd}</p>
                                <p>Location: {formData.selectedDistrict ? `${formData.selectedDistrict}, ` : ''}{formData.selectedState}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t border-earth-200">
                    <button
                        onClick={() => step > 1 ? setStep(step - 1) : onClose()}
                        className="px-6 py-2.5 border border-earth-300 text-earth-700 rounded-lg hover:bg-earth-50 font-medium transition-colors"
                    >
                        {step === 1 ? 'Cancel' : 'Back'}
                    </button>

                    {step < 3 ? (
                        <button
                            onClick={() => setStep(step + 1)}
                            disabled={step === 1 && (!formData.cropType || !formData.residueType)}
                            className="px-6 py-2.5 bg-nature-600 text-white rounded-lg hover:bg-nature-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Continue
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={!formData.deliveryStart || !formData.deliveryEnd || !formData.selectedState}
                            className="px-6 py-2.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Publish Contract
                        </button>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default CreateForwardContract;
