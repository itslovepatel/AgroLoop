import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, TrendingUp, Truck, Wind } from 'lucide-react';
import { IMPACT_STATS } from '../constants';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const Home: React.FC = () => {
  const chartData = [
    { name: 'Energy', value: 400 },
    { name: 'Packaging', value: 300 },
    { name: 'Compost', value: 300 },
    { name: 'Other', value: 200 },
  ];
  const COLORS = ['#16a34a', '#ca8a04', '#78350f', '#0d9488'];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-earth-900 text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
           <img 
            src="https://picsum.photos/seed/farm_landscape/1600/900" 
            alt="Farm Background" 
            className="w-full h-full object-cover"
           />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-earth-900 via-earth-900/80 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight">
              Turn Crop Waste into <span className="text-nature-400">Income</span>. <br/>Not Smoke.
            </h1>
            <p className="text-xl text-earth-200 mb-8 leading-relaxed">
              We connect farmers with bioenergy buyers to monetize crop residue, reduce stubble burning, and clean India's air.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/farmers" className="bg-nature-600 hover:bg-nature-700 text-white text-center px-8 py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-green-500/20 transition-all flex items-center justify-center gap-2">
                List Crop Waste <ArrowRight size={20} />
              </Link>
              <Link to="/marketplace" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white text-center px-8 py-4 rounded-lg font-bold text-lg transition-all">
                Buy Residue
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Metrics Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {IMPACT_STATS.map((stat, idx) => (
              <div key={idx} className="bg-earth-50 p-6 rounded-2xl border border-earth-100 text-center hover:border-nature-200 transition-colors">
                <p className="text-4xl font-bold text-nature-700 mb-2">{stat.value}</p>
                <p className="text-lg font-bold text-earth-800 mb-1">{stat.label}</p>
                <p className="text-earth-500 text-sm">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-earth-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-earth-900 mb-4">How AgriLoop Works</h2>
            <p className="text-earth-600 max-w-2xl mx-auto">A simple, transparent process to move from waste to value in three steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
             {/* Connector Line (Desktop) */}
             <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-1 bg-earth-200 -z-10"></div>

            <div className="text-center relative">
              <div className="w-24 h-24 mx-auto bg-white rounded-full border-4 border-nature-500 flex items-center justify-center mb-6 shadow-sm z-10">
                <Leaf size={40} className="text-nature-600" />
              </div>
              <h3 className="text-xl font-bold text-earth-900 mb-2">1. List Waste</h3>
              <p className="text-earth-600">Farmers list crop type, quantity, and location. AI suggests the best price.</p>
            </div>

            <div className="text-center relative">
              <div className="w-24 h-24 mx-auto bg-white rounded-full border-4 border-nature-500 flex items-center justify-center mb-6 shadow-sm z-10">
                <TrendingUp size={40} className="text-nature-600" />
              </div>
              <h3 className="text-xl font-bold text-earth-900 mb-2">2. Get Bids</h3>
              <p className="text-earth-600">Bioenergy plants and packagers bid for the materials. Best price wins.</p>
            </div>

            <div className="text-center relative">
              <div className="w-24 h-24 mx-auto bg-white rounded-full border-4 border-nature-500 flex items-center justify-center mb-6 shadow-sm z-10">
                <Truck size={40} className="text-nature-600" />
              </div>
              <h3 className="text-xl font-bold text-earth-900 mb-2">3. Pickup & Earn</h3>
              <p className="text-earth-600">Logistics are optimized. Farmers get paid, and waste becomes clean energy.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Visualization */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <h2 className="text-3xl font-serif font-bold text-earth-900 mb-6">Where Does the Waste Go?</h2>
              <p className="text-lg text-earth-600 mb-6 leading-relaxed">
                By creating a circular economy, we ensure crop residue finds a second life instead of polluting our lungs.
                Our diverse buyer network transforms "waste" into valuable resources.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-nature-100 p-1 rounded">
                    <Wind size={20} className="text-nature-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-earth-900">Bio-Energy</h4>
                    <p className="text-sm text-earth-600">Pellets and briquettes for power plants.</p>
                  </div>
                </li>
                 <li className="flex items-start gap-3">
                  <div className="mt-1 bg-nature-100 p-1 rounded">
                    <Leaf size={20} className="text-nature-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-earth-900">Eco-Packaging</h4>
                    <p className="text-sm text-earth-600">Sustainable alternatives to styrofoam.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="flex-1 w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <p className="text-center text-sm text-earth-500 mt-2">Distribution of Waste Utilization</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-nature-700 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">Ready to make a difference?</h2>
          <p className="text-nature-100 text-lg mb-8">Join thousands of farmers and companies building a cleaner, wealthier India.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/farmers" className="bg-white text-nature-800 px-8 py-3 rounded-lg font-bold hover:bg-earth-100 transition shadow-lg">
              Register as Farmer
            </Link>
            <Link to="/buyers" className="bg-nature-800 border border-nature-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-nature-900 transition shadow-lg">
              Register as Buyer
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;