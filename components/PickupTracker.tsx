import React from 'react';
import {
    Clock, Package, Truck, MapPin, CheckCircle,
    User, Phone, FileCheck, AlertCircle
} from 'lucide-react';
import { PickupTracking, PickupStatus } from '../types';

interface PickupTrackerProps {
    tracking: PickupTracking;
    compact?: boolean;
}

const STATUS_CONFIG: Record<PickupStatus, {
    label: string;
    icon: React.ReactNode;
    color: string;
    description: string;
}> = {
    pending: {
        label: 'Pending',
        icon: <Clock size={16} />,
        color: 'text-earth-500 bg-earth-100',
        description: 'Waiting for buyer confirmation',
    },
    scheduled: {
        label: 'Scheduled',
        icon: <Clock size={16} />,
        color: 'text-amber-600 bg-amber-100',
        description: 'Pickup date confirmed',
    },
    assigned: {
        label: 'Assigned',
        icon: <User size={16} />,
        color: 'text-blue-600 bg-blue-100',
        description: 'Transporter assigned',
    },
    en_route: {
        label: 'En Route',
        icon: <Truck size={16} />,
        color: 'text-indigo-600 bg-indigo-100',
        description: 'Vehicle on the way',
    },
    collected: {
        label: 'Collected',
        icon: <Package size={16} />,
        color: 'text-purple-600 bg-purple-100',
        description: 'Residue loaded',
    },
    in_transit: {
        label: 'In Transit',
        icon: <MapPin size={16} />,
        color: 'text-cyan-600 bg-cyan-100',
        description: 'On the way to buyer',
    },
    delivered: {
        label: 'Delivered',
        icon: <CheckCircle size={16} />,
        color: 'text-green-600 bg-green-100',
        description: 'Received by buyer',
    },
    completed: {
        label: 'Completed',
        icon: <CheckCircle size={16} />,
        color: 'text-green-700 bg-green-200',
        description: 'Payment released',
    },
};

const STATUS_ORDER: PickupStatus[] = [
    'pending', 'scheduled', 'assigned', 'en_route', 'collected', 'in_transit', 'delivered', 'completed'
];

const PickupTracker: React.FC<PickupTrackerProps> = ({ tracking, compact = false }) => {
    const currentIndex = STATUS_ORDER.indexOf(tracking.status);
    const config = STATUS_CONFIG[tracking.status];

    if (compact) {
        return (
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${config.color}`}>
                {config.icon}
                <span>{config.label}</span>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-earth-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Truck size={20} />
                        <span className="font-semibold">Pickup Status</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full bg-white/20`}>
                        {config.label}
                    </span>
                </div>
            </div>

            {/* Timeline */}
            <div className="p-4">
                <div className="relative">
                    {/* Progress Line */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-earth-200" />
                    <div
                        className="absolute left-4 top-0 w-0.5 bg-indigo-500 transition-all duration-500"
                        style={{ height: `${Math.min(100, (currentIndex / (STATUS_ORDER.length - 1)) * 100)}%` }}
                    />

                    {/* Steps */}
                    <div className="space-y-4">
                        {STATUS_ORDER.slice(0, 6).map((status, index) => {
                            const stepConfig = STATUS_CONFIG[status];
                            const isActive = index <= currentIndex;
                            const isCurrent = status === tracking.status;
                            const timelineEntry = tracking.timeline.find(t => t.status === status);

                            return (
                                <div key={status} className="relative flex gap-4 pl-10">
                                    {/* Icon */}
                                    <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${isCurrent ? 'ring-4 ring-indigo-100 ' + stepConfig.color :
                                            isActive ? stepConfig.color : 'bg-earth-100 text-earth-400'
                                        }`}>
                                        {stepConfig.icon}
                                    </div>

                                    {/* Content */}
                                    <div className={`flex-1 pb-4 ${index === STATUS_ORDER.length - 1 ? '' : 'border-b border-earth-100'}`}>
                                        <div className="flex items-center justify-between">
                                            <span className={`font-medium ${isActive ? 'text-earth-800' : 'text-earth-400'}`}>
                                                {stepConfig.label}
                                            </span>
                                            {timelineEntry && (
                                                <span className="text-xs text-earth-400">
                                                    {new Date(timelineEntry.timestamp).toLocaleString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </span>
                                            )}
                                        </div>
                                        <p className={`text-sm ${isActive ? 'text-earth-500' : 'text-earth-300'}`}>
                                            {timelineEntry?.note || stepConfig.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Transporter Info */}
            {tracking.transporterName && (
                <div className="border-t border-earth-100 p-4 bg-earth-50">
                    <h4 className="font-medium text-earth-700 text-sm mb-3">Transporter Details</h4>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                            <User className="text-indigo-600" size={24} />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-earth-800">{tracking.transporterName}</p>
                            {tracking.vehicleNumber && (
                                <p className="text-sm text-earth-500">Vehicle: {tracking.vehicleNumber}</p>
                            )}
                        </div>
                        {tracking.transporterPhone && (
                            <a
                                href={`tel:${tracking.transporterPhone}`}
                                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                            >
                                <Phone size={16} /> Call
                            </a>
                        )}
                    </div>
                </div>
            )}

            {/* Proof of Collection */}
            {tracking.proofOfCollection && (
                <div className="border-t border-earth-100 p-4">
                    <div className="flex items-center gap-2 text-green-600">
                        <FileCheck size={18} />
                        <span className="font-medium text-sm">Proof of Collection Available</span>
                    </div>
                </div>
            )}

            {/* ETA for active pickup */}
            {tracking.status === 'en_route' && tracking.estimatedArrival && (
                <div className="border-t border-earth-100 p-4 bg-indigo-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-indigo-700">
                            <Clock size={18} />
                            <span className="font-medium">Estimated Arrival</span>
                        </div>
                        <span className="text-lg font-bold text-indigo-800">
                            {new Date(tracking.estimatedArrival).toLocaleTimeString('en-IN', {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PickupTracker;
