import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Listing } from '../types';
import { Link } from 'react-router-dom';
import { Package, IndianRupee, Calendar, MapPin } from 'lucide-react';

// Fix for default marker icon in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icons by crop type
const getCropIcon = (cropType: string): L.DivIcon => {
    const colors: Record<string, string> = {
        'Paddy (Rice)': '#16a34a', // green
        'Wheat': '#ca8a04', // amber
        'Sugarcane': '#059669', // emerald
        'Cotton': '#6366f1', // indigo
        'Mustard': '#eab308', // yellow
        'Maize': '#f97316', // orange
        'Groundnut': '#a16207', // brown
        'Soybean': '#65a30d', // lime
    };

    const color = colors[cropType] || '#16a34a';

    return L.divIcon({
        className: 'custom-marker',
        html: `
      <div style="
        background: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="transform: rotate(45deg); font-size: 14px;">🌾</span>
      </div>
    `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    });
};

// India coordinates for centering
const INDIA_CENTER: [number, number] = [22.5937, 78.9629];
const INDIA_ZOOM = 5;

// State coordinates for mock data mapping
const STATE_COORDS: Record<string, [number, number]> = {
    'Punjab': [31.1471, 75.3412],
    'Haryana': [29.0588, 76.0856],
    'Uttar Pradesh': [26.8467, 80.9462],
    'Madhya Pradesh': [22.9734, 78.6569],
    'Rajasthan': [27.0238, 74.2179],
    'Gujarat': [22.2587, 71.1924],
    'Maharashtra': [19.7515, 75.7139],
    'Karnataka': [15.3173, 75.7139],
    'Andhra Pradesh': [15.9129, 79.7400],
    'Tamil Nadu': [11.1271, 78.6569],
    'Bihar': [25.0961, 85.3131],
    'West Bengal': [22.9868, 87.8550],
    'Odisha': [20.9517, 85.0985],
    'Chhattisgarh': [21.2787, 81.8661],
    'Jharkhand': [23.6102, 85.2799],
};

// Get coordinates from listing location/state
const getListingCoords = (listing: Listing): [number, number] | null => {
    if (listing.coordinates) {
        return [listing.coordinates.lat, listing.coordinates.lng];
    }

    // Use state coordinates with small random offset for demo
    const state = listing.state || listing.location.split(', ').pop() || 'Punjab';
    const baseCoords = STATE_COORDS[state];
    if (baseCoords) {
        const offset = () => (Math.random() - 0.5) * 1.5;
        return [baseCoords[0] + offset(), baseCoords[1] + offset()];
    }
    return null;
};

interface SupplyMapProps {
    listings: Listing[];
    height?: string;
    onListingClick?: (listing: Listing) => void;
    selectedCropType?: string;
    selectedState?: string;
}

const SupplyMap: React.FC<SupplyMapProps> = ({
    listings,
    height = '500px',
    onListingClick,
    selectedCropType,
    selectedState,
}) => {
    // Filter and map listings to coordinates
    const mappedListings = useMemo(() => {
        return listings
            .filter(l => l.status === 'available' || l.status === 'bidding')
            .filter(l => !selectedCropType || l.cropType === selectedCropType)
            .filter(l => !selectedState || l.state === selectedState)
            .map(listing => ({
                listing,
                coords: getListingCoords(listing),
            }))
            .filter(item => item.coords !== null) as { listing: Listing; coords: [number, number] }[];
    }, [listings, selectedCropType, selectedState]);

    // Calculate total supply
    const totalSupply = mappedListings.reduce((sum, item) => sum + item.listing.quantityTons, 0);

    return (
        <div className="relative rounded-xl overflow-hidden shadow-lg border border-stone-200">
            {/* Stats overlay */}
            <div className="absolute top-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                <div className="text-xs text-stone-500 uppercase tracking-wide">Available Supply</div>
                <div className="text-2xl font-bold text-green-600">{totalSupply.toLocaleString()} Tons</div>
                <div className="text-sm text-stone-600">{mappedListings.length} Listings</div>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 right-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                <div className="text-xs font-semibold text-stone-700 mb-2">Crop Types</div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    <div className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full bg-green-600"></span> Paddy
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full bg-amber-500"></span> Wheat
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Sugarcane
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full bg-indigo-500"></span> Cotton
                    </div>
                </div>
            </div>

            <MapContainer
                center={INDIA_CENTER}
                zoom={INDIA_ZOOM}
                style={{ height, width: '100%' }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {mappedListings.map(({ listing, coords }) => (
                    <Marker
                        key={listing.id}
                        position={coords}
                        icon={getCropIcon(listing.cropType)}
                        eventHandlers={{
                            click: () => onListingClick?.(listing),
                        }}
                    >
                        <Popup>
                            <div className="min-w-[220px]">
                                <div className="font-semibold text-stone-800 text-base mb-1">
                                    {listing.residueType}
                                </div>
                                <div className="text-sm text-stone-500 mb-2">{listing.cropType}</div>

                                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                                    <div className="flex items-center gap-1 text-stone-600">
                                        <Package size={14} />
                                        <span>{listing.quantityTons} tons</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-green-600 font-semibold">
                                        <IndianRupee size={14} />
                                        <span>{listing.pricePerTon}/ton</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-stone-600 col-span-2">
                                        <MapPin size={14} />
                                        <span>{listing.location}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-stone-600 col-span-2">
                                        <Calendar size={14} />
                                        <span>Available: {new Date(listing.availableDate).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between border-t pt-2">
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${listing.quality === 'Premium' ? 'bg-green-100 text-green-700' :
                                        listing.quality === 'Standard' ? 'bg-amber-100 text-amber-700' :
                                            'bg-stone-100 text-stone-700'
                                        }`}>
                                        {listing.quality}
                                    </span>
                                    <Link
                                        to={`/listing/${listing.id}`}
                                        className="text-green-600 hover:text-green-700 text-sm font-medium"
                                    >
                                        View Details →
                                    </Link>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default SupplyMap;
