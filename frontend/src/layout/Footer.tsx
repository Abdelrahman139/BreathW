import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Mail, Phone, MapPin, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Diseases Info', path: '/diseases' },
    { name: 'Health Tips', path: '/health-tips' },
  ];

  const portalLinks = [
    { name: 'Sign In', path: '/login' },
    { name: 'Register', path: '/register' },
    { name: 'Doctor Portal', path: '/login' },
    { name: 'Patient Portal', path: '/register' },
  ];

  return (
    <footer id="site-footer" className="relative bg-slate-950 border-t border-slate-800/60">
      {/* Gradient accent border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="py-12 lg:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Column 1: Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <div className="bg-blue-500/20 p-2 rounded-xl border border-blue-500/30">
                <Activity className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-xl font-bold text-slate-100 tracking-tight">BreathWise</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
              AI-powered chest X-ray analysis platform. Helping doctors and patients detect pulmonary conditions with advanced deep learning technology.
            </p>
            <div className="flex items-center space-x-3">
              {/* Social links placeholder */}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-slate-400 hover:text-blue-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Clinical Portal */}
          <div>
            <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider mb-4">
              Clinical Portal
            </h3>
            <ul className="space-y-3">
              {portalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-slate-400 hover:text-blue-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div>
            <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider mb-4">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <Mail className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <span className="text-sm text-slate-400">support@BreathWise.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <span className="text-sm text-slate-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <span className="text-sm text-slate-400">
                  123 Medical Center Drive<br />
                  San Francisco, CA 94102
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/60 py-6 flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
          <p className="text-xs text-slate-500 flex items-center">
            © {currentYear} BreathWise. Made with{' '}
            <Heart className="w-3 h-3 text-red-400 mx-1 fill-red-400" /> for better healthcare.
          </p>
          <div className="flex items-center space-x-6">
            <a href="#" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
