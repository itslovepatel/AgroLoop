import React, { useState } from 'react';
import { CloudLightning, DollarSign, Globe, Calculator, Leaf, ArrowRight, Check, Award, Download, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CARBON_RATES } from '../constants';
import { Contract } from '../types';
import Modal from '../components/ui/Modal';
import CarbonCertificate from '../components/CarbonCertificate';
import Badge from '../components/ui/Badge';

const CarbonCredits: React.FC = () => {
    const { state, getUserContracts } = useApp();
    const [showCalculator, setShowCalculator] = useState(false);
    const [calcTons, setCalcTons] = useState(50);
    const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

    const contracts = getUserContracts();
    const totalCarbonCredits = contracts.reduce((acc, c) => acc + c.carbonCredits, 0);
    const totalCarbonRevenue = contracts.reduce((acc, c) => acc + c.carbonRevenue, 0);

    // Calculator values
    const co2Avoided = calcTons * CARBON_RATES.CO2_PER_TON_BURNED;
    const creditValue = co2Avoided * CARBON_RATES.CREDIT_PRICE;
    const farmerShare = creditValue * CARBON_RATES.FARMER_SHARE;
    const buyerShare = creditValue * CARBON_RATES.BUYER_SHARE;
    const platformShare = creditValue * CARBON_RATES.PLATFORM_SHARE;

    return (
        <div className="min-h-screen bg-earth-50 pt-8 pb-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <span className="text-nature-600 font-bold tracking-wider text-sm uppercase">
                        Sustainability Rewards
                    </span>
                    <h1 className="text-3xl md:text-5xl font-serif font-bold text-earth-900 mt-2">
                        Earn from Impact
                    </h1>
                    <p className="text-earth-600 mt-4 text-lg max-w-2xl mx-auto">
                        We integrate carbon registries to verify emissions avoided by not burning crop residue.
                        Every ton saved is money earned.
                    </p>
                </div>

                {/* Stats (if user has contracts) */}
                {contracts.length > 0 && (
                    <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-8 mb-12 text-white">
                        <h2 className="font-bold text-lg mb-6">Your Carbon Impact</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div>
                                <p className="text-3xl font-bold">{totalCarbonCredits.toFixed(1)}</p>
                                <p className="text-teal-200 text-sm">Tons CO₂ Avoided</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold">₹{totalCarbonRevenue.toLocaleString()}</p>
                                <p className="text-teal-200 text-sm">Carbon Revenue</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold">{contracts.length}</p>
                                <p className="text-teal-200 text-sm">Verified Contracts</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold">🏆</p>
                                <p className="text-teal-200 text-sm">Green Certified</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-earth-100 hover:shadow-md transition-shadow">
                        <Globe className="text-blue-500 mb-4" size={32} />
                        <h3 className="font-bold text-lg mb-2">Global Standards</h3>
                        <p className="text-earth-600 text-sm">
                            Our methodology aligns with Verra and Gold Standard for voluntary carbon markets.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-earth-100 hover:shadow-md transition-shadow">
                        <CloudLightning className="text-nature-500 mb-4" size={32} />
                        <h3 className="font-bold text-lg mb-2">Avoided Emissions</h3>
                        <p className="text-earth-600 text-sm">
                            Every ton of paddy straw used for energy avoids ~1.5 tons of CO₂e vs open burning.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-earth-100 hover:shadow-md transition-shadow">
                        <DollarSign className="text-amber-500 mb-4" size={32} />
                        <h3 className="font-bold text-lg mb-2">Revenue Share</h3>
                        <p className="text-earth-600 text-sm">
                            80% of carbon revenue goes directly back to the farmer as a bonus payment.
                        </p>
                    </div>
                </div>

                {/* How It Works */}
                <div className="bg-white rounded-2xl p-8 mb-12 border border-earth-100">
                    <h2 className="text-2xl font-bold text-earth-900 mb-6 text-center">How Carbon Credits Work</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { step: 1, icon: '🌾', title: 'List Residue', desc: 'Farmer lists crop waste instead of burning' },
                            { step: 2, icon: '🤝', title: 'Complete Sale', desc: 'Buyer purchases residue via AgriLoop' },
                            { step: 3, icon: '📊', title: 'Verify Impact', desc: 'We calculate CO₂ avoided vs burning' },
                            { step: 4, icon: '💰', title: 'Earn Credits', desc: 'Revenue shared between all parties' },
                        ].map((item, idx) => (
                            <div key={idx} className="text-center">
                                <div className="w-16 h-16 bg-nature-100 rounded-full flex items-center justify-center mx-auto mb-3 text-3xl">
                                    {item.icon}
                                </div>
                                <p className="text-xs text-nature-600 font-bold mb-1">STEP {item.step}</p>
                                <h4 className="font-bold text-earth-900 mb-1">{item.title}</h4>
                                <p className="text-sm text-earth-500">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Calculator CTA */}
                <div className="bg-nature-800 text-white rounded-2xl p-8 md:p-12 relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="md:flex items-center justify-between">
                            <div className="mb-6 md:mb-0 md:w-2/3">
                                <h2 className="text-2xl font-bold mb-4">Calculate Your Carbon Potential</h2>
                                <p className="text-nature-200">
                                    Are you a buyer or farmer? See how much credit you can generate this season.
                                </p>
                            </div>
                            <button
                                onClick={() => setShowCalculator(true)}
                                className="inline-flex items-center gap-2 bg-white text-nature-900 px-6 py-3 rounded-lg font-bold hover:bg-nature-50 transition"
                            >
                                <Calculator size={20} />
                                Open Calculator
                            </button>
                        </div>
                    </div>
                    <div className="absolute right-0 bottom-0 opacity-10">
                        <Globe size={300} />
                    </div>
                </div>

                {/* Revenue Split Visualization */}
                <div className="mt-12 bg-white rounded-2xl p-8 border border-earth-100">
                    <h2 className="text-2xl font-bold text-earth-900 mb-6 text-center">Revenue Distribution</h2>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                        <div className="flex-1 max-w-sm">
                            <div className="relative h-8 bg-earth-100 rounded-full overflow-hidden">
                                <div
                                    className="absolute left-0 top-0 bottom-0 bg-nature-500 transition-all"
                                    style={{ width: '80%' }}
                                />
                                <div
                                    className="absolute top-0 bottom-0 bg-blue-500 transition-all"
                                    style={{ left: '80%', width: '15%' }}
                                />
                                <div
                                    className="absolute right-0 top-0 bottom-0 bg-amber-500 transition-all"
                                    style={{ width: '5%' }}
                                />
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-nature-500 rounded" />
                                <span className="text-sm text-earth-700">Farmer (80%)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-blue-500 rounded" />
                                <span className="text-sm text-earth-700">Buyer ESG (15%)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-amber-500 rounded" />
                                <span className="text-sm text-earth-700">Platform (5%)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transaction History */}
                {contracts.length > 0 && (
                    <div className="mt-12 bg-white rounded-2xl border border-earth-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-earth-100 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-earth-900 flex items-center gap-2">
                                <FileText size={22} /> Carbon Transaction History
                            </h2>
                            <button className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 font-medium">
                                <Download size={16} /> Export ESG Report
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-earth-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-earth-600 uppercase">Transaction</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-earth-600 uppercase">Quantity</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-earth-600 uppercase">CO₂ Avoided</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-earth-600 uppercase">Carbon Value</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-earth-600 uppercase">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-earth-600 uppercase">Certificate</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-earth-100">
                                    {contracts.map(contract => (
                                        <tr key={contract.id} className="hover:bg-earth-50">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-earth-900">{contract.farmerName}</p>
                                                    <p className="text-sm text-earth-500">→ {contract.buyerName}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-earth-800">{contract.quantity} tons</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Leaf size={16} className="text-teal-600" />
                                                    <span className="font-bold text-teal-700">{contract.carbonCredits.toFixed(2)} t</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-nature-600">
                                                ₹{contract.carbonRevenue.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge
                                                    variant={contract.status === 'completed' ? 'success' : contract.status === 'active' ? 'info' : 'warning'}
                                                    size="sm"
                                                >
                                                    {contract.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {contract.status === 'completed' ? (
                                                    <button
                                                        onClick={() => setSelectedContract(contract)}
                                                        className="flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-700 ml-auto"
                                                    >
                                                        <Award size={16} /> View Certificate
                                                    </button>
                                                ) : (
                                                    <span className="text-sm text-earth-400">Pending completion</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Calculator Modal */}
            <Modal
                isOpen={showCalculator}
                onClose={() => setShowCalculator(false)}
                title="Carbon Credit Calculator"
                size="lg"
            >
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-earth-700 mb-2">
                            <Leaf className="inline mr-2" size={16} />
                            Tons of Residue (not burned)
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="500"
                            value={calcTons}
                            onChange={(e) => setCalcTons(Number(e.target.value))}
                            className="w-full accent-nature-600 h-3"
                        />
                        <div className="flex justify-between mt-2">
                            <span className="text-sm text-earth-500">1 ton</span>
                            <span className="text-2xl font-bold text-nature-700">{calcTons} tons</span>
                            <span className="text-sm text-earth-500">500 tons</span>
                        </div>
                    </div>

                    <div className="bg-nature-50 border border-nature-200 rounded-xl p-6">
                        <h4 className="font-bold text-earth-900 mb-4">Calculation Results</h4>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CloudLightning className="text-nature-600" size={20} />
                                    <span className="text-earth-700">CO₂ Emissions Avoided</span>
                                </div>
                                <span className="text-xl font-bold text-nature-700">
                                    {co2Avoided.toFixed(1)} tons
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <DollarSign className="text-amber-600" size={20} />
                                    <span className="text-earth-700">Total Credit Value</span>
                                </div>
                                <span className="text-xl font-bold text-amber-600">
                                    ₹{creditValue.toLocaleString()}
                                </span>
                            </div>

                            <hr className="border-nature-200" />

                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="bg-white rounded-lg p-3">
                                    <p className="text-lg font-bold text-nature-600">₹{farmerShare.toLocaleString()}</p>
                                    <p className="text-xs text-earth-500">Farmer (80%)</p>
                                </div>
                                <div className="bg-white rounded-lg p-3">
                                    <p className="text-lg font-bold text-blue-600">₹{buyerShare.toLocaleString()}</p>
                                    <p className="text-xs text-earth-500">Buyer ESG (15%)</p>
                                </div>
                                <div className="bg-white rounded-lg p-3">
                                    <p className="text-lg font-bold text-amber-600">₹{platformShare.toLocaleString()}</p>
                                    <p className="text-xs text-earth-500">Platform (5%)</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-earth-50 rounded-lg p-4 flex items-start gap-3">
                        <Check className="text-nature-600 flex-shrink-0 mt-0.5" size={20} />
                        <div>
                            <p className="font-medium text-earth-900">Verified by AgriLoop</p>
                            <p className="text-sm text-earth-600">
                                All calculations are based on IPCC emission factors and verified against Verra VCS methodology.
                            </p>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Certificate Modal */}
            <Modal
                isOpen={!!selectedContract}
                onClose={() => setSelectedContract(null)}
                title="Carbon Credit Certificate"
                size="lg"
            >
                {selectedContract && (
                    <div className="p-4">
                        <CarbonCertificate
                            contract={selectedContract}
                            onClose={() => setSelectedContract(null)}
                        />
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default CarbonCredits;