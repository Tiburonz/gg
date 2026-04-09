import { Link } from 'react-router-dom';
import { Shield, Mail, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-wow-slate border-t border-wow-ice/20 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-wow-ice to-wow-ice-light rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">Frostmourne</span>
            </div>
            <p className="text-gray-400 text-sm">
              Experience the ultimate Wrath of the Lich King 3.3.5a private server.
              Join thousands of players in epic adventures.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-wow-ice transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/rankings" className="text-gray-400 hover:text-wow-ice transition-colors text-sm">
                  Rankings
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-400 hover:text-wow-ice transition-colors text-sm">
                  Donation Shop
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-gray-400 hover:text-wow-ice transition-colors text-sm">
                  News & Updates
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/support" className="text-gray-400 hover:text-wow-ice transition-colors text-sm">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/rules" className="text-gray-400 hover:text-wow-ice transition-colors text-sm">
                  Server Rules
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-wow-ice transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/download" className="text-gray-400 hover:text-wow-ice transition-colors text-sm">
                  Download Client
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-gray-400 text-sm">
                <Mail className="w-4 h-4 text-wow-ice" />
                <span>support@frostmourne.com</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400 text-sm">
                <MessageCircle className="w-4 h-4 text-wow-ice" />
                <span>Discord Community</span>
              </li>
            </ul>
            <div className="mt-4 flex space-x-3">
              <a
                href="https://discord.gg/URjVRJKDzp"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-[#5865F2] hover:bg-[#4752C4] rounded-lg flex items-center justify-center transition-colors"
                title="Join our Discord"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 1-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0-.084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-wow-ice/20 hover:bg-wow-ice/40 rounded-lg flex items-center justify-center transition-colors"
              >
                <span className="text-wow-ice text-sm font-bold">F</span>
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-wow-ice/20 hover:bg-wow-ice/40 rounded-lg flex items-center justify-center transition-colors"
              >
                <span className="text-wow-ice text-sm font-bold">X</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-wow-ice/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2024 Frostmourne WotLK. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/terms" className="text-gray-400 hover:text-wow-ice transition-colors text-sm">
                Terms of Service
              </Link>
              <Link to="/privacy" className="text-gray-400 hover:text-wow-ice transition-colors text-sm">
                Privacy Policy
              </Link>
            </div>
          </div>
          <p className="text-gray-500 text-xs mt-4 text-center">
            World of Warcraft and Blizzard Entertainment are trademarks or registered trademarks of Blizzard Entertainment, Inc. in the U.S. and/or other countries.
            This is a fan-made private server and is not affiliated with or endorsed by Blizzard Entertainment.
          </p>
        </div>
      </div>
    </footer>
  );
}