import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, TrendingUp, Users } from 'lucide-react';
import Badge from './ui/Badge';
import { Listing, UserType } from '../types';
import { useApp } from '../context/AppContext';

interface ListingCardProps {
  listing: Listing;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const { state } = useApp();
  const navigate = useNavigate();
  const isBuyer = state.user?.type === UserType.BUYER;
  const pendingBids = listing.bids.filter(b => b.status === 'pending').length;
  const highestBid = listing.bids.length > 0
    ? Math.max(...listing.bids.map(b => b.pricePerTon))
    : null;

  const handleClick = () => {
    navigate(`/listing/${listing.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-xl border border-earth-100 shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden group"
    >
      <div className="relative">
        <img
          src={listing.imageUrl}
          alt={listing.cropType}
          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge
            variant={
              listing.status === 'available' ? 'success' :
                listing.status === 'bidding' ? 'warning' :
                  listing.status === 'contracted' ? 'info' : 'neutral'
            }
            size="sm"
            pulse={listing.status === 'bidding'}
          >
            {listing.status === 'available' ? 'Available' :
              listing.status === 'bidding' ? 'Active Bids' :
                listing.status === 'contracted' ? 'Contracted' : listing.status}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded text-xs font-medium ${listing.quality === 'Premium' ? 'bg-amber-100 text-amber-800' :
              listing.quality === 'Standard' ? 'bg-earth-100 text-earth-800' :
                'bg-gray-100 text-gray-800'
            }`}>
            {listing.quality}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-bold text-lg text-earth-900 group-hover:text-nature-700 transition-colors">
              {listing.residueType}
            </h3>
            <p className="text-sm text-earth-500">{listing.cropType}</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-nature-700">
              ₹{listing.pricePerTon.toLocaleString()}
            </p>
            <p className="text-xs text-earth-500">per ton</p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-earth-600">
            <MapPin size={14} className="text-earth-400" />
            {listing.location}
          </div>
          <div className="flex items-center gap-2 text-sm text-earth-600">
            <Calendar size={14} className="text-earth-400" />
            Available: {new Date(listing.availableDate).toLocaleDateString()}
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-earth-100">
          <div className="flex items-center gap-4 text-sm">
            <span className="font-bold text-earth-900">
              {listing.quantityTons} tons
            </span>
            {pendingBids > 0 && (
              <span className="flex items-center gap-1 text-amber-600">
                <Users size={14} />
                {pendingBids} bid{pendingBids > 1 ? 's' : ''}
              </span>
            )}
          </div>
          {highestBid && (
            <div className="flex items-center gap-1 text-sm text-nature-600">
              <TrendingUp size={14} />
              <span>₹{highestBid}</span>
            </div>
          )}
        </div>

        {isBuyer && listing.status !== 'contracted' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/listing/${listing.id}`);
            }}
            className="w-full mt-4 bg-nature-600 hover:bg-nature-700 text-white py-2 rounded-lg font-medium text-sm transition-colors"
          >
            View & Bid
          </button>
        )}
      </div>
    </div>
  );
};

export default ListingCard;