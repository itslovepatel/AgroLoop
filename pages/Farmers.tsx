import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Tractor, IndianRupee, ShieldCheck, Plus, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserType } from '../types';
import CreateListing from '../components/CreateListing';
import AuthModal from '../components/AuthModal';

const Farmers: React.FC = () => {
  const { state } = useApp();
  const [showCreateListing, setShowCreateListing] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const isFarmer = state.user?.type === UserType.FARMER;

  const handleListWaste = () => {
    if (isFarmer) {
      setShowCreateListing(true);
    } else {
      setShowAuth(true);
    }
  };

  return (
    <div className="min-h-screen bg-earth-50 pb-20">
      <div className="bg-nature-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4">Earn More. Burn Less.</h1>
          <p className="text-xl text-nature-100 max-w-2xl mx-auto mb-8">
            Your crop residue is gold. Don't set fire to your profits. List it on AgriLoop and get paid.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleListWaste}
              className="inline-flex items-center justify-center gap-2 bg-white text-nature-700 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-nature-50 transition-all"
            >
              <Plus size={20} /> List Crop Waste
            </button>
            {isFarmer && (
              <Link
                to="/farmer-dashboard"
                className="inline-flex items-center justify-center gap-2 bg-nature-800 border border-nature-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-nature-900 transition-all"
              >
                My Dashboard <ArrowRight size={20} />
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-xl shadow-lg p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-4">
            <div className="bg-nature-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <IndianRupee size={32} className="text-nature-700" />
            </div>
            <h3 className="font-bold text-lg mb-2">Instant Income</h3>
            <p className="text-earth-600 text-sm">Get paid per ton for stubble you used to burn. Direct bank transfer.</p>
          </div>
          <div className="text-center p-4">
            <div className="bg-nature-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tractor size={32} className="text-nature-700" />
            </div>
            <h3 className="font-bold text-lg mb-2">Free Equipment</h3>
            <p className="text-earth-600 text-sm">We provide balers and collection tools. Cost is deducted from your sale.</p>
          </div>
          <div className="text-center p-4">
            <div className="bg-nature-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={32} className="text-nature-700" />
            </div>
            <h3 className="font-bold text-lg mb-2">No Penalties</h3>
            <p className="text-earth-600 text-sm">Avoid government fines for burning. Get a "Green Farmer" certificate.</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-16">
        <h2 className="text-3xl font-serif font-bold text-earth-900 text-center mb-10">Simple Listing Process</h2>
        <div className="space-y-6">
          {[
            { title: 'Register via Mobile', desc: 'Use your phone number. No complex forms.' },
            { title: 'Select Crop & Quantity', desc: 'Pick from dropdowns. AI suggests the best price.' },
            { title: 'Set Location', desc: 'Use GPS or enter your village/district.' },
            { title: 'Get Bids & Earn', desc: 'Accept the best price and schedule pickup.' }
          ].map((step, idx) => (
            <div key={idx} className="flex items-start gap-4 bg-white p-6 rounded-lg border border-earth-200 hover:border-nature-300 transition-colors">
              <div className="bg-earth-900 text-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                {idx + 1}
              </div>
              <div>
                <h4 className="font-bold text-lg text-earth-900">{step.title}</h4>
                <p className="text-earth-600">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={handleListWaste}
            className="inline-flex items-center justify-center gap-2 bg-nature-600 hover:bg-nature-700 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg transition-all"
          >
            <Plus size={20} /> Start Selling Now
          </button>
        </div>
      </div>

      {/* WhatsApp Floating Action Button (Mock) */}
      <div className="fixed bottom-24 right-6 md:bottom-6 md:right-24 z-40">
        <button className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2 font-bold transition-transform hover:scale-105">
          <span className="hidden md:inline">Chat on WhatsApp</span>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
        </button>
      </div>

      <CreateListing isOpen={showCreateListing} onClose={() => setShowCreateListing(false)} />
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  );
};

export default Farmers;