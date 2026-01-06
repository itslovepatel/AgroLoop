import React from 'react';
import { IndianRupee, Lock, CheckCircle, Clock, AlertCircle, ArrowRight, Shield } from 'lucide-react';
import { EscrowPayment, EscrowStatus } from '../types';

interface EscrowStatusCardProps {
    payment: EscrowPayment;
    userRole: 'farmer' | 'buyer';
}

const getStatusColor = (status: EscrowStatus): string => {
    switch (status) {
        case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
        case 'funded': return 'bg-blue-100 text-blue-700 border-blue-200';
        case 'released': return 'bg-green-100 text-green-700 border-green-200';
        case 'disputed': return 'bg-red-100 text-red-700 border-red-200';
        case 'refunded': return 'bg-stone-100 text-stone-700 border-stone-200';
        default: return 'bg-stone-100 text-stone-700';
    }
};

const getStatusIcon = (status: EscrowStatus) => {
    switch (status) {
        case 'pending': return <Clock size={16} />;
        case 'funded': return <Lock size={16} />;
        case 'released': return <CheckCircle size={16} />;
        case 'disputed': return <AlertCircle size={16} />;
        case 'refunded': return <ArrowRight size={16} />;
        default: return <Clock size={16} />;
    }
};

const EscrowStatusCard: React.FC<EscrowStatusCardProps> = ({ payment, userRole }) => {
    const statusSteps: { status: EscrowStatus; label: string }[] = [
        { status: 'pending', label: 'Pending' },
        { status: 'funded', label: 'Funded' },
        { status: 'released', label: 'Released' },
    ];

    const currentStepIndex = statusSteps.findIndex(s => s.status === payment.escrowStatus);

    return (
        <div className="bg-white rounded-xl border border-earth-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Shield size={20} />
                        <span className="font-semibold">Secure Escrow Payment</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(payment.escrowStatus)}`}>
                        {getStatusIcon(payment.escrowStatus)}
                        <span className="ml-1 capitalize">{payment.escrowStatus}</span>
                    </span>
                </div>
            </div>

            {/* Progress Timeline */}
            <div className="p-4 border-b border-earth-100">
                <div className="flex items-center justify-between relative">
                    {statusSteps.map((step, index) => (
                        <div key={step.status} className="flex flex-col items-center z-10">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${index <= currentStepIndex
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-earth-200 text-earth-500'
                                }`}>
                                {index < currentStepIndex ? (
                                    <CheckCircle size={20} />
                                ) : (
                                    getStatusIcon(step.status)
                                )}
                            </div>
                            <span className={`text-xs mt-2 font-medium ${index <= currentStepIndex ? 'text-indigo-600' : 'text-earth-400'
                                }`}>
                                {step.label}
                            </span>
                        </div>
                    ))}
                    {/* Progress Line */}
                    <div className="absolute top-5 left-10 right-10 h-0.5 bg-earth-200 -z-0">
                        <div
                            className="h-full bg-indigo-600 transition-all duration-500"
                            style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Amount Details */}
            <div className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-earth-600 text-sm">Total Amount</span>
                    <span className="font-bold text-earth-900 text-lg">
                        <IndianRupee size={16} className="inline" />
                        {payment.totalAmount.toLocaleString()}
                    </span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-earth-600 text-sm">Advance Payment</span>
                    <span className="font-semibold text-indigo-600">
                        <IndianRupee size={14} className="inline" />
                        {payment.advanceAmount.toLocaleString()}
                        {payment.advancePaidAt && (
                            <CheckCircle size={14} className="inline ml-1 text-green-500" />
                        )}
                    </span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-earth-600 text-sm">Platform Fee (5%)</span>
                    <span className="text-earth-500 text-sm">
                        -₹{payment.platformFee.toLocaleString()}
                    </span>
                </div>

                <div className="border-t border-earth-100 pt-3 flex justify-between items-center">
                    <span className="font-medium text-earth-800">
                        {userRole === 'farmer' ? 'Your Payout' : 'Final Amount'}
                    </span>
                    <span className="font-bold text-green-600 text-lg">
                        <IndianRupee size={16} className="inline" />
                        {payment.farmerPayout.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Transaction History */}
            {payment.transactionHistory.length > 0 && (
                <div className="border-t border-earth-100 p-4">
                    <h4 className="text-sm font-semibold text-earth-700 mb-3">Transaction History</h4>
                    <div className="space-y-2">
                        {payment.transactionHistory.map((tx, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${tx.status === 'completed' ? 'bg-green-500' :
                                            tx.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'
                                        }`} />
                                    <span className="text-earth-600">{tx.action}</span>
                                </div>
                                <div className="text-right">
                                    <span className="font-medium text-earth-800">₹{tx.amount.toLocaleString()}</span>
                                    <span className="text-earth-400 text-xs ml-2">
                                        {new Date(tx.timestamp).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* CTA for pending state */}
            {payment.escrowStatus === 'funded' && userRole === 'farmer' && (
                <div className="p-4 bg-green-50 border-t border-green-100">
                    <p className="text-sm text-green-700 text-center">
                        <Lock size={14} className="inline mr-1" />
                        Funds are secured in escrow. They will be released upon successful pickup confirmation.
                    </p>
                </div>
            )}
        </div>
    );
};

export default EscrowStatusCard;
