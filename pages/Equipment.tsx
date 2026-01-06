import React, { useState } from 'react';
import { MapPin, Star, Phone, Calendar, Check, Truck, Package, Wrench } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';

const Equipment: React.FC = () => {
    const { state } = useApp();
    const [selectedType, setSelectedType] = useState('all');
    const [selectedEquipment, setSelectedEquipment] = useState<typeof state.equipment[0] | null>(null);
    const [showBookingModal, setShowBookingModal] = useState(false);

    const equipmentTypes = [
        { id: 'all', name: 'All Equipment', icon: '🔧' },
        { id: 'baler', name: 'Balers', icon: '📦' },
        { id: 'rake', name: 'Rakes', icon: '🧹' },
        { id: 'collector', name: 'Collectors', icon: '🚜' },
        { id: 'transport', name: 'Transport', icon: '🚛' },
    ];

    const filteredEquipment = state.equipment.filter(e =>
        selectedType === 'all' || e.type === selectedType
    );

    const handleBookEquipment = (equipment: typeof state.equipment[0]) => {
        setSelectedEquipment(equipment);
        setShowBookingModal(true);
    };

    return (
        <div className="min-h-screen bg-earth-50 pb-20">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-600 to-amber-500 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl">
                        <span className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm font-medium mb-4">
                            <Truck size={16} /> Equipment-as-a-Service
                        </span>
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">
                            Rent Collection Equipment
                        </h1>
                        <p className="text-amber-100 text-lg">
                            No need to buy expensive machinery. Rent balers, rakes, and transport from local operators. Cost is deducted from your waste sale!
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
                {/* Value Props */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-5 shadow-md border border-earth-100">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-nature-100 p-2 rounded-lg">
                                <Package className="text-nature-600" size={24} />
                            </div>
                            <h3 className="font-bold text-earth-900">Zero Upfront Cost</h3>
                        </div>
                        <p className="text-sm text-earth-600">Equipment cost is deducted from your waste sale earnings</p>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-md border border-earth-100">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-nature-100 p-2 rounded-lg">
                                <Wrench className="text-nature-600" size={24} />
                            </div>
                            <h3 className="font-bold text-earth-900">Trained Operators</h3>
                        </div>
                        <p className="text-sm text-earth-600">Equipment comes with skilled operators who handle everything</p>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-md border border-earth-100">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-nature-100 p-2 rounded-lg">
                                <Calendar className="text-nature-600" size={24} />
                            </div>
                            <h3 className="font-bold text-earth-900">Flexible Scheduling</h3>
                        </div>
                        <p className="text-sm text-earth-600">Book equipment when you need it - daily or per-ton pricing</p>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {equipmentTypes.map(type => (
                        <button
                            key={type.id}
                            onClick={() => setSelectedType(type.id)}
                            className={`px-4 py-2 rounded-full font-medium transition-all ${selectedType === type.id
                                ? 'bg-amber-600 text-white'
                                : 'bg-white text-earth-700 hover:bg-amber-50 border border-earth-200'
                                }`}
                        >
                            <span className="mr-2">{type.icon}</span>
                            {type.name}
                        </button>
                    ))}
                </div>

                {/* Equipment Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEquipment.map(equipment => (
                        <div
                            key={equipment.id}
                            className="bg-white rounded-xl shadow-sm border border-earth-100 overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            <div className="relative">
                                <img
                                    src={equipment.imageUrl}
                                    alt={equipment.name}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="absolute top-3 right-3">
                                    <Badge
                                        variant={equipment.available ? 'success' : 'error'}
                                        size="sm"
                                    >
                                        {equipment.available ? 'Available' : 'Booked'}
                                    </Badge>
                                </div>
                            </div>

                            <div className="p-5">
                                <h3 className="font-bold text-lg text-earth-900 mb-2">{equipment.name}</h3>
                                <p className="text-sm text-earth-600 mb-4">{equipment.description}</p>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="text-earth-400" size={16} />
                                        <span className="text-earth-600">{equipment.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Star className="text-amber-500" size={16} />
                                        <span className="text-earth-600">{equipment.rating} rating</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-earth-100">
                                    <div>
                                        <p className="text-lg font-bold text-amber-600">
                                            ₹{equipment.pricePerDay}/day
                                        </p>
                                        <p className="text-xs text-earth-500">
                                            or ₹{equipment.pricePerTon}/ton
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleBookEquipment(equipment)}
                                        disabled={!equipment.available}
                                        className="bg-amber-600 hover:bg-amber-700 disabled:bg-earth-300 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                    >
                                        {equipment.available ? 'Book Now' : 'Unavailable'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Become a Partner CTA */}
                <div className="mt-12 bg-earth-900 rounded-2xl p-8 md:p-12 text-white text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">
                        Own Agricultural Equipment?
                    </h2>
                    <p className="text-earth-300 mb-6 max-w-2xl mx-auto">
                        List your balers, rakes, or transport vehicles on AgriLoop and earn extra income during harvest season.
                    </p>
                    <button className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-lg font-bold transition-colors">
                        Become an Equipment Partner
                    </button>
                </div>
            </div>

            {/* Booking Modal */}
            <Modal
                isOpen={showBookingModal}
                onClose={() => setShowBookingModal(false)}
                title="Book Equipment"
                size="md"
            >
                {selectedEquipment && (
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <img
                                src={selectedEquipment.imageUrl}
                                alt={selectedEquipment.name}
                                className="w-20 h-20 rounded-lg object-cover"
                            />
                            <div>
                                <h3 className="font-bold text-earth-900">{selectedEquipment.name}</h3>
                                <p className="text-sm text-earth-500">{selectedEquipment.location}</p>
                                <p className="text-lg font-bold text-amber-600 mt-1">
                                    ₹{selectedEquipment.pricePerDay}/day
                                </p>
                            </div>
                        </div>

                        <div className="bg-earth-50 rounded-lg p-4">
                            <h4 className="font-medium text-earth-900 mb-2">Operator Contact</h4>
                            <div className="flex items-center gap-2">
                                <Phone className="text-nature-600" size={20} />
                                <span className="font-medium">{selectedEquipment.operatorName}</span>
                                <span className="text-earth-500">{selectedEquipment.operatorPhone}</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-earth-700 mb-2">
                                Booking Date
                            </label>
                            <input
                                type="date"
                                className="w-full px-4 py-3 border border-earth-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-earth-700 mb-2">
                                Number of Days
                            </label>
                            <input
                                type="number"
                                defaultValue={1}
                                min={1}
                                className="w-full px-4 py-3 border border-earth-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                            />
                        </div>

                        <div className="bg-nature-50 border border-nature-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-nature-700 mb-2">
                                <Check size={20} />
                                <span className="font-medium">Payment Deducted from Waste Sale</span>
                            </div>
                            <p className="text-sm text-nature-600">
                                Equipment cost will be automatically deducted from your crop waste sale earnings. No upfront payment needed!
                            </p>
                        </div>

                        <button className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-bold transition-colors">
                            Confirm Booking
                        </button>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Equipment;
