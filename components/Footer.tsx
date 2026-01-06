import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-earth-900 text-earth-100 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-xl font-serif font-bold text-white mb-4">AgriLoop</h3>
            <p className="text-earth-300 text-sm leading-relaxed">
              Transforming agricultural waste into wealth. Join us in our mission to stop stubble burning and create a sustainable future for India.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-earth-300">
              <li><a href="#" className="hover:text-nature-400">About Us</a></li>
              <li><a href="#" className="hover:text-nature-400">For Farmers</a></li>
              <li><a href="#" className="hover:text-nature-400">For Buyers</a></li>
              <li><a href="#" className="hover:text-nature-400">Carbon Credits</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-earth-300">
              <li><a href="#" className="hover:text-nature-400">Help Center</a></li>
              <li><a href="#" className="hover:text-nature-400">Safety Guidelines</a></li>
              <li><a href="#" className="hover:text-nature-400">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-nature-400">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white mb-4">Connect</h4>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="bg-earth-800 p-2 rounded-full hover:bg-nature-600 transition"><Facebook size={18} /></a>
              <a href="#" className="bg-earth-800 p-2 rounded-full hover:bg-nature-600 transition"><Twitter size={18} /></a>
              <a href="#" className="bg-earth-800 p-2 rounded-full hover:bg-nature-600 transition"><Instagram size={18} /></a>
              <a href="#" className="bg-earth-800 p-2 rounded-full hover:bg-nature-600 transition"><Linkedin size={18} /></a>
            </div>
            <p className="text-xs text-earth-400">
              Government Recognized Startup <br/> #StartupIndia
            </p>
          </div>
        </div>

        <div className="border-t border-earth-800 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-earth-400">
          <p>&copy; 2024 AgriLoop India Pvt Ltd. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-2 md:mt-0">Made with <Heart size={14} className="text-red-500 fill-red-500" /> for Indian Farmers</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;