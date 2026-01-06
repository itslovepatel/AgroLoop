import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import Farmers from './pages/Farmers';
import Buyers from './pages/Buyers';
import CarbonCredits from './pages/CarbonCredits';
import FarmerDashboard from './pages/FarmerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import Equipment from './pages/Equipment';
import ListingDetail from './pages/ListingDetail';
import AdminDashboard from './pages/AdminDashboard';

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <div className="flex flex-col min-h-screen font-sans text-earth-900 bg-earth-50">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/listing/:id" element={<ListingDetail />} />
              <Route path="/farmers" element={<Farmers />} />
              <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
              <Route path="/buyers" element={<Buyers />} />
              <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
              <Route path="/equipment" element={<Equipment />} />
              <Route path="/carbon-credits" element={<CarbonCredits />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>
          <Footer />
          <AIAssistant />
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;