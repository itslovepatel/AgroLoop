import React, { useRef } from 'react';
import {
    Award, Download, Leaf, CheckCircle, Calendar,
    Building2, Tractor, MapPin, QrCode, ExternalLink
} from 'lucide-react';
import { Contract } from '../types';
import { CARBON_RATES } from '../constants';

interface CarbonCertificateProps {
    contract: Contract;
    onClose?: () => void;
}

const CarbonCertificate: React.FC<CarbonCertificateProps> = ({ contract, onClose }) => {
    const certificateRef = useRef<HTMLDivElement>(null);

    const carbonData = {
        co2Avoided: contract.carbonCredits,
        creditValue: contract.carbonCredits * CARBON_RATES.CREDIT_PRICE * 83, // INR
        emissionFactor: CARBON_RATES.CO2_PER_TON_BURNED,
        verificationId: `AGRI-${contract.id.slice(0, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`,
        issuedDate: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    };

    const handleDownload = () => {
        // In production, would use html2canvas/jspdf for PDF generation
        // For now, trigger print dialog
        window.print();
    };

    return (
        <div className="max-w-2xl mx-auto">
            {/* Certificate Card */}
            <div
                ref={certificateRef}
                className="bg-gradient-to-br from-teal-50 via-white to-green-50 rounded-2xl border-4 border-teal-600 p-8 shadow-2xl print:shadow-none"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                            <Award className="text-white" size={40} />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-teal-800 mb-2">Carbon Credit Certificate</h1>
                    <p className="text-teal-600">Certified Environmental Impact Verification</p>
                </div>

                {/* Decorative Border */}
                <div className="border-t-2 border-b-2 border-teal-200 py-6 mb-6">
                    <div className="text-center">
                        <p className="text-earth-600 mb-2">This certifies that</p>
                        <h2 className="text-2xl font-bold text-earth-900 mb-2">{contract.farmerName}</h2>
                        <p className="text-earth-600">has avoided the following greenhouse gas emissions</p>
                    </div>
                </div>

                {/* Impact Stats */}
                <div className="bg-gradient-to-r from-teal-600 to-green-600 rounded-xl p-6 text-white mb-6 shadow-lg">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="text-center">
                            <Leaf className="mx-auto mb-2" size={28} />
                            <p className="text-4xl font-bold">{carbonData.co2Avoided.toFixed(2)}</p>
                            <p className="text-teal-100 text-sm">Tons of CO₂ Avoided</p>
                        </div>
                        <div className="text-center">
                            <Award className="mx-auto mb-2" size={28} />
                            <p className="text-4xl font-bold">₹{carbonData.creditValue.toLocaleString()}</p>
                            <p className="text-teal-100 text-sm">Carbon Credit Value</p>
                        </div>
                    </div>
                </div>

                {/* Transaction Details */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white rounded-lg p-4 border border-earth-200 shadow-sm">
                        <div className="flex items-center gap-2 text-earth-500 text-sm mb-1">
                            <Tractor size={14} /> Farmer
                        </div>
                        <p className="font-semibold text-earth-900">{contract.farmerName}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-earth-200 shadow-sm">
                        <div className="flex items-center gap-2 text-earth-500 text-sm mb-1">
                            <Building2 size={14} /> Buyer
                        </div>
                        <p className="font-semibold text-earth-900">{contract.buyerName}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-earth-200 shadow-sm">
                        <div className="flex items-center gap-2 text-earth-500 text-sm mb-1">
                            <MapPin size={14} /> Quantity Traded
                        </div>
                        <p className="font-semibold text-earth-900">{contract.quantity} tons</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-earth-200 shadow-sm">
                        <div className="flex items-center gap-2 text-earth-500 text-sm mb-1">
                            <Calendar size={14} /> Issue Date
                        </div>
                        <p className="font-semibold text-earth-900">
                            {new Date(carbonData.issuedDate).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                            })}
                        </p>
                    </div>
                </div>

                {/* Verification Section */}
                <div className="bg-earth-50 rounded-xl p-4 mb-6 border border-earth-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 text-earth-600 text-sm mb-1">
                                <QrCode size={14} /> Verification ID
                            </div>
                            <p className="font-mono font-bold text-earth-900 text-lg">{carbonData.verificationId}</p>
                        </div>
                        <div className="w-20 h-20 bg-black rounded-lg flex items-center justify-center">
                            <div className="w-16 h-16 bg-white rounded grid grid-cols-4 gap-px p-1">
                                {/* Simulated QR pattern */}
                                {[...Array(16)].map((_, i) => (
                                    <div key={i} className={`${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Methodology Note */}
                <div className="text-center text-xs text-earth-500 mb-4">
                    <p className="mb-1">
                        Calculated using emission factor: {carbonData.emissionFactor} kg CO₂ / ton of crop residue burned
                    </p>
                    <p>Methodology aligned with IPCC Guidelines for National Greenhouse Gas Inventories</p>
                </div>

                {/* Verification Badge */}
                <div className="flex items-center justify-center gap-2 text-green-600">
                    <CheckCircle size={18} />
                    <span className="font-medium text-sm">Verified by AgriLoop India</span>
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-earth-200 flex items-center justify-between text-xs text-earth-400">
                    <span>agriloop.in/verify/{carbonData.verificationId}</span>
                    <span>Valid until {new Date(carbonData.expiryDate).toLocaleDateString()}</span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-6 print:hidden">
                {onClose && (
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 border border-earth-300 text-earth-700 rounded-lg font-medium hover:bg-earth-50"
                    >
                        Close
                    </button>
                )}
                <button
                    onClick={handleDownload}
                    className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-teal-700"
                >
                    <Download size={18} /> Download Certificate
                </button>
            </div>
        </div>
    );
};

export default CarbonCertificate;
