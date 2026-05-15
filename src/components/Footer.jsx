import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDB } from '../context/MockDBContext';

const Footer = () => {
  const [email, setEmail] = useState('');
  const { addAlert } = useDB();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if(email) {
      addAlert('Successfully subscribed to Newsletter!');
      setEmail('');
    }
  };

  return (
    <footer className="bg-space-blue text-white py-12 border-t-4 border-mint-green">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* About & Branding */}
          <div>
            <h3 className="text-2xl font-bold text-mint-green mb-4 flex items-center gap-2">
              <i className="bi bi-buildings"></i> Apex Manpower
            </h3>
            <p className="text-gray-400 mb-4 text-sm leading-relaxed">
              Connecting highly skilled professionals with elite organizations globally. We bridge the gap between extraordinary talent and industry leaders.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-mint-green transition-colors"><i className="bi bi-facebook text-xl"></i></a>
              <a href="#" className="text-gray-400 hover:text-mint-green transition-colors"><i className="bi bi-twitter-x text-xl"></i></a>
              <a href="#" className="text-gray-400 hover:text-mint-green transition-colors"><i className="bi bi-linkedin text-xl"></i></a>
              <a href="#" className="text-gray-400 hover:text-mint-green transition-colors"><i className="bi bi-instagram text-xl"></i></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/about" className="hover:text-mint-green transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-mint-green transition-colors">Careers & Jobs</Link></li>
              <li><Link to="/news" className="hover:text-mint-green transition-colors">News & Updates</Link></li>
              <li><Link to="/login" className="hover:text-mint-green transition-colors">Client/Employee Login</Link></li>
              <li><a href="#" className="hover:text-mint-green transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-mint-green transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <i className="bi bi-geo-alt text-mint-green mt-1"></i> 
                <span>123 Apex Tower, Ayala Avenue,<br/>Makati City, Philippines 1226</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="bi bi-telephone text-mint-green"></i> 
                <span>+63 (2) 8123 4567</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="bi bi-envelope text-mint-green"></i> 
                <span>inquiries@apexmanpower.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-bold mb-4">Subscribe to Newsletter</h4>
            <p className="text-sm text-gray-400 mb-4">Get the latest job alerts and HR news delivered directly to your inbox.</p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email" 
                required
                className="bg-gray-800 text-white border border-gray-700 px-4 py-2 rounded focus:outline-none focus:border-mint-green text-sm"
              />
              <button type="submit" className="bg-mint-green text-space-blue font-semibold px-4 py-2 rounded hover:bg-opacity-90 transition-colors text-sm">
                Subscribe
              </button>
            </form>
          </div>

        </div>

        <div className="border-t border-gray-800 pt-8 mt-8 text-center md:flex md:justify-between items-center text-sm">
          <p className="text-gray-500 mb-2 md:mb-0">© {new Date().getFullYear()} Apex Manpower. All Rights Reserved.</p>
          <p className="text-gray-500">
            Designed & Developed by <span className="font-semibold text-mint-green">Christian Designs</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
