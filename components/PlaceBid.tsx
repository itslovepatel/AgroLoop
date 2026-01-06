import React, { useState } from 'react';
import { IndianRupee, Truck, Calendar, FileText, AlertCircle } from 'lucide-react';
import Modal from './ui/Modal';
import { useApp } from '../context/AppContext';
import { Listing, UserType, Buyer } from '../types';

interface PlaceBidProps {
    isOpen: boolean;
    onClose: () => void;
    listing: Listing;
}

const PlaceBid: React.FC<PlaceBidProps> = ({ isOpen, onClose, listing }) => {
    const { state, placeBid } = useApp();
    const [pricePerTon, setPricePerTon] = useState(listing.pricePerTon);
    const [quantity, setQuantity] = useState(listing.quantityTons);
    const [deliveryTerms, setDeliveryTerms] = useState<'pickup' | 'delivery'>('pickup');
    const [isForwardContract, setIsForwardContract] = useState(false);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const totalAmount = pricePerTon * quantity;
    const platformFee = totalAmount * 0.05;
    const carbonCredits = quantity * 1.5;
    const carbonValue = carbonCredits * 15;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!state.user || state.user.type !== UserType.BUYER) return;

        setIsLoading(true);
        const buyer = state.user as Buyer;

        setTimeout(() => {
            placeBid(listing.id, {
                listingId: listing.id,
                buyerId: buyer.id,
                buyerName: buyer.name,
                companyName: buyer.companyName,
                pricePerTon,
                quantity,
                totalAmount,
                deliveryTerms,
                isForwardContract,
                status: 'pending',
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                message,
            });

            setIsLoading(false);
            onClose();
        }, 1500);
    };

    const isLoggedIn = state.user && state.user.type === UserType.BUYER;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Place a Bid" size="lg">
            {!isLoggedIn ? (
                <div className="text-center py-8">
                    <AlertCircle className="mx-auto text-amber-500 mb-4" size={48} />
                    <h3 className="text-lg font-bold text-earth-900 mb-2">Sign In Required</h3>
                    <p className="text-earth-500 mb-4">Please sign in as a buyer to place bids.</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Listing Summary */}
                    <div className="bg-earth-50 rounded-xl p-4 flex items-start gap-4">
                        <img
                            src={listing.imageUrl}
                            alt={listing.cropType}
                            className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                            <h3 className="font-bold text-earth-900">{listing.residueType}</h3>
                            <p className="text-sm text-earth-500">{listing.cropType} • {listing.location}</p>
                            <p className="text-sm text-earth-500">
                                Available: {listing.quantityTons} tons @ ₹{listing.pricePerTon}/ton
                            </p>
                            <p className="text-sm font-medium text-nature-700">
                                Quality: {listing.quality}
                            </p>
                        </div>
                    </div>

                    {/* Price Input */}
                    <div>
                        <label className="block text-sm font-medium text-earth-700 mb-2">
                            <IndianRupee className="inline mr-1" size={16} />
                            Your Bid Price (per ton)
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-400">₹</span>
                            <input
                                type="number"
                                value={pricePerTon}
                                onChange={(e) => setPricePerTon(Math.max(100, Number(e.target.value)))}
                                className="w-full pl-10 pr-4 py-3 border border-earth-300 rounded-lg text-xl font-bold focus:ring-2 focus:ring-nature-500"
                            />
                        </div>
                        <div className="flex justify-between mt-2 text-sm">
                            <span className={pricePerTon >= listing.pricePerTon ? 'text-nature-600' : 'text-amber-600'}>
                                {pricePerTon >= listing.pricePerTon ? '✓ Meets asking price' : '⚠ Below asking price'}
                            </span>
                            <button
                                type="button"
                                onClick={() => setPricePerTon(listing.pricePerTon)}
                                className="text-nature-600 hover:underline"
                            >
                                Match asking price
                            </button>
                        </div>
                    </div>

                    {/* Quantity */}
                    <div>
                        <label className="block text-sm font-medium text-earth-700 mb-2">
                            Quantity (tons)
                        </label>
                        <input
                            type="range"
                            min="1"
                            max={listing.quantityTons}
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="w-full accent-nature-600"
                        />
                        <div className="flex justify-between mt-1">
                            <span className="text-sm text-earth-500">1 ton</span>
                            <span className="font-bold text-lg text-earth-900">{quantity} tons</span>
                            <span className="text-sm text-earth-500">{listing.quantityTons} tons</span>
                        </div>
                    </div>

                    {/* Delivery Terms */}
                    <div>
                        <label className="block text-sm font-medium text-earth-700 mb-2">
                            <Truck className="inline mr-1" size={16} />
                            Delivery Terms
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setDeliveryTerms('pickup')}
                                className={`p-4 rounded-lg border-2 text-center transition-all ${deliveryTerms === 'pickup'
                                        ? 'border-nature-500 bg-nature-50'
                                        : 'border-earth-200 hover:border-nature-300'
                                    }`}
                            >
                                <p className="font-bold text-earth-900">Buyer Pickup</p>
                                <p className="text-xs text-earth-500">You arrange collection</p>
                            </button>
                            <button
                                type="button"
                                onClick={() => setDeliveryTerms('delivery')}
                                className={`p-4 rounded-lg border-2 text-center transition-all ${deliveryTerms === 'delivery'
                                        ? 'border-nature-500 bg-nature-50'
                                        : 'border-earth-200 hover:border-nature-300'
                                    }`}
                            >
                                <p className="font-bold text-earth-900">Farmer Delivery</p>
                                <p className="text-xs text-earth-500">Farmer delivers to you</p>
                            </button>
                        </div>
                    </div>

                    {/* Forward Contract */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="forwardContract"
                            checked={isForwardContract}
                            onChange={(e) => setIsForwardContract(e.target.checked)}
                            className="w-5 h-5 text-nature-600 rounded border-earth-300 focus:ring-nature-500"
                        />
                        <label htmlFor="forwardContract" className="flex-1">
                            <span className="font-medium text-earth-900">Forward Contract</span>
                            <p className="text-xs text-earth-500">
                                Lock this price for future harvests (pre-season agreement)
                            </p>
                        </label>
                        <Calendar className="text-earth-400" size={20} />
                    </div>

                    {/* Message */}
                    <div>
                        <label className="block text-sm font-medium text-earth-700 mb-2">
                            <FileText className="inline mr-1" size={16} />
                            Message to Farmer (optional)
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Add a note about your requirements..."
                            className="w-full px-4 py-3 border border-earth-300 rounded-lg focus:ring-2 focus:ring-nature-500 resize-none"
                            rows={2}
                        />
                    </div>

                    {/* Cost Breakdown */}
                    <div className="bg-nature-50 border border-nature-200 rounded-xl p-4">
                        <h4 className="font-bold text-earth-900 mb-3">Cost Breakdown</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-earth-600">{quantity} tons × ₹{pricePerTon}</span>
                                <span className="font-medium">₹{totalAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-earth-500">Platform Fee (5%)</span>
                                <span className="text-earth-500">₹{platformFee.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-nature-200">
                                <span className="font-bold text-earth-900">Total Cost</span>
                                <span className="font-bold text-xl text-nature-700">
                                    ₹{(totalAmount + platformFee).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-nature-200 text-nature-700">
                                <span>🌱 Carbon Credits Earned</span>
                                <span className="font-medium">{carbonCredits.toFixed(1)} tCO₂ (~₹{carbonValue.toLocaleString()})</span>
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-nature-600 hover:bg-nature-700 disabled:bg-earth-300 text-white py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Submitting Bid...
                            </>
                        ) : (
                            <>
                                Place Bid for ₹{(totalAmount + platformFee).toLocaleString()}
                            </>
                        )}
                    </button>
                </form>
            )}
        </Modal>
    );
};

export default PlaceBid;
