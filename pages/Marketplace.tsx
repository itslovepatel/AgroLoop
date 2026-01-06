import React, { useState } from 'react';
import { Filter, Search, MapPin, SlidersHorizontal, Map, List, Calendar, Building2 } from 'lucide-react';
import ListingCard from '../components/ListingCard';
import SupplyMap from '../components/SupplyMap';
import { useApp } from '../context/AppContext';
import { CROP_TYPES, INDIAN_STATES } from '../constants';
import { Listing } from '../types';

const Marketplace: React.FC = () => {
  const { state } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedQuality, setSelectedQuality] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [quantityMin, setQuantityMin] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const filteredListings = state.listings.filter(item => {
    const matchesSearch = item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cropType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.residueType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCrop = selectedCrop === 'All' || item.cropType.includes(selectedCrop);
    const matchesState = selectedState === 'All' || item.state === selectedState;
    const matchesQuality = selectedQuality === 'All' || item.quality === selectedQuality;
    const matchesPrice = item.pricePerTon >= priceRange[0] && item.pricePerTon <= priceRange[1];
    const matchesQuantity = item.quantityTons >= quantityMin;
    return matchesSearch && matchesCrop && matchesState && matchesQuality && matchesPrice && matchesQuantity;
  });

  const crops = ['All', ...CROP_TYPES.map(c => c.name)];
  const qualities = ['All', 'Premium', 'Standard', 'Mixed'];

  const totalTons = filteredListings.reduce((acc, l) => acc + l.quantityTons, 0);

  // Open forward contracts
  const openForwardContracts = state.forwardContracts.filter(fc => fc.status === 'open' || fc.status === 'partially_filled');

  const handleListingClick = (listing: Listing) => {
    window.location.href = `#/listing/${listing.id}`;
  };

  return (
    <div className="bg-earth-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-earth-900">Live Marketplace</h1>
            <p className="text-earth-600 mt-1">
              {filteredListings.length} listings • {totalTons.toLocaleString()} tons available
            </p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="bg-white p-2.5 rounded-lg border border-earth-300 flex items-center flex-1 md:w-72">
              <Search size={20} className="text-earth-400 mr-2" />
              <input
                type="text"
                placeholder="Search location, crop, or residue..."
                className="bg-transparent outline-none text-sm w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* View Toggle */}
            <div className="bg-white rounded-lg border border-earth-300 flex overflow-hidden">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 flex items-center justify-center transition-colors ${viewMode === 'list'
                    ? 'bg-nature-600 text-white'
                    : 'text-earth-600 hover:bg-earth-100'
                  }`}
                title="List View"
              >
                <List size={20} />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-2.5 flex items-center justify-center transition-colors ${viewMode === 'map'
                    ? 'bg-nature-600 text-white'
                    : 'text-earth-600 hover:bg-earth-100'
                  }`}
                title="Map View"
              >
                <Map size={20} />
              </button>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden bg-white p-2.5 rounded-lg border border-earth-300 flex items-center"
            >
              <SlidersHorizontal size={20} className="text-earth-600" />
            </button>
          </div>
        </div>

        {/* Forward Contracts Banner */}
        {openForwardContracts.length > 0 && (
          <div className="mb-6 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="bg-amber-500 text-white p-2 rounded-lg">
                <Calendar size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-amber-900">Forward Contracts Available</h3>
                <p className="text-sm text-amber-700 mb-3">
                  {openForwardContracts.length} buyer{openForwardContracts.length > 1 ? 's are' : ' is'} looking for future supply. Lock in your price before harvest!
                </p>
                <div className="flex flex-wrap gap-2">
                  {openForwardContracts.slice(0, 3).map(fc => (
                    <a
                      key={fc.id}
                      href="#/farmer-dashboard"
                      className="bg-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 border border-amber-200 hover:border-amber-400 transition-colors"
                    >
                      <Building2 size={14} className="text-amber-600" />
                      <span className="font-medium text-earth-800">{fc.companyName}</span>
                      <span className="text-earth-500">•</span>
                      <span className="text-nature-600 font-semibold">₹{fc.pricePerTon}/ton</span>
                      <span className="text-earth-500">•</span>
                      <span className="text-earth-600">{fc.quantityRequired} tons {fc.residueType}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`w-full lg:w-72 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white p-6 rounded-xl border border-earth-200 shadow-sm sticky top-24">
              <div className="flex items-center gap-2 mb-6 text-earth-800">
                <Filter size={20} />
                <h3 className="font-bold text-lg">Filters</h3>
              </div>

              {/* Crop Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-earth-700 mb-2">Crop Type</label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {crops.map(crop => (
                    <label key={crop} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="crop"
                        checked={selectedCrop === crop || (selectedCrop === '' && crop === 'All')}
                        onChange={() => setSelectedCrop(crop)}
                        className="text-nature-600 focus:ring-nature-500 h-4 w-4 border-gray-300"
                      />
                      <span className="ml-2 text-earth-600 text-sm">{crop}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* State */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-earth-700 mb-2">State</label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-nature-500 text-sm"
                >
                  <option value="All">All States</option>
                  {INDIAN_STATES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Quality */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-earth-700 mb-2">Quality</label>
                <div className="flex flex-wrap gap-2">
                  {qualities.map(q => (
                    <button
                      key={q}
                      onClick={() => setSelectedQuality(q)}
                      className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${selectedQuality === q
                        ? 'bg-nature-600 text-white border-nature-600'
                        : 'bg-white text-earth-600 border-earth-300 hover:border-nature-500'
                        }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-earth-700 mb-2">
                  Price Range (₹/ton)
                </label>
                <div className="flex items-center gap-2 text-sm mb-2">
                  <span className="text-earth-500">₹{priceRange[0]}</span>
                  <span className="text-earth-400">-</span>
                  <span className="text-earth-500">₹{priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full accent-nature-600"
                />
              </div>

              {/* Minimum Quantity */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-earth-700 mb-2">
                  Min Quantity: {quantityMin} tons
                </label>
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="10"
                  value={quantityMin}
                  onChange={(e) => setQuantityMin(Number(e.target.value))}
                  className="w-full accent-nature-600"
                />
              </div>

              <button
                onClick={() => {
                  setSelectedCrop('All');
                  setSelectedState('All');
                  setSelectedQuality('All');
                  setPriceRange([0, 5000]);
                  setQuantityMin(0);
                  setSearchTerm('');
                }}
                className="w-full bg-earth-100 text-earth-700 py-2 rounded-lg text-sm hover:bg-earth-200 transition font-medium"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {viewMode === 'map' ? (
              <SupplyMap
                listings={filteredListings}
                height="600px"
                onListingClick={handleListingClick}
                selectedCropType={selectedCrop !== 'All' ? selectedCrop : undefined}
                selectedState={selectedState !== 'All' ? selectedState : undefined}
              />
            ) : (
              filteredListings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredListings.map(listing => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              ) : (
                <div className="bg-white p-12 rounded-xl text-center border border-dashed border-earth-300">
                  <MapPin className="mx-auto text-earth-300 mb-4" size={48} />
                  <p className="text-earth-500 text-lg mb-2">No listings found matching your criteria</p>
                  <p className="text-earth-400 text-sm mb-4">Try adjusting your filters or search term</p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCrop('All');
                      setSelectedState('All');
                      setSelectedQuality('All');
                    }}
                    className="text-nature-600 font-medium hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;