import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <span className="font-bold text-xl text-white">BeardStyle</span>
            </div>
            <p className="text-sm text-gray-400">
              Tvoj personalni savjetnik za stil brade. Pronađi savršen izgled u par klikova.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white mb-4">Brzi Linkovi</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/gallery" className="hover:text-primary-400 transition-colors">
                  Galerija Stilova
                </Link>
              </li>
              <li>
                <Link to="/upload" className="hover:text-primary-400 transition-colors">
                  Pronađi Stil
                </Link>
              </li>
              <li>
                <Link to="/salon" className="hover:text-primary-400 transition-colors">
                  Za Salone
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-white mb-4">Podrška</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:text-primary-400 transition-colors">
                  O Nama
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-primary-400 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-primary-400 transition-colors">
                  Privatnost
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-primary-400 transition-colors">
                  Uslovi Korištenja
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-white mb-4">Kontakt</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Mail size={16} className="text-primary-400" />
                <span className="text-sm">info@beardstyle.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={16} className="text-primary-400" />
                <span className="text-sm">+387 33 123 456</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin size={16} className="text-primary-400" />
                <span className="text-sm">Sarajevo, BiH</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>© {currentYear} BeardStyle. Powered by SYNGAS BH. Sva prava zadržana.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
