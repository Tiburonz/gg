import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import { useTranslation } from '@/hooks/use-translation';
import { useEditMode } from '@/contexts/EditModeContext';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { 
  LogOut, 
  User, 
  ShoppingCart, 
  Menu,
  X,
  Home,
  Trophy,
  ShoppingBag,
  Newspaper,
  Shield,
  Edit2
} from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { account, isAuthenticated, logout } = useAuthStore();
  const { getItemCount } = useCartStore();
  const { t } = useTranslation();
  const { isEditMode, setIsEditMode } = useEditMode();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = account?.role === 'admin' || account?.role === 'moderator';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cartItemCount = getItemCount();

  return (
    <header className="sticky top-0 z-50 glass border-b border-wow-ice/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-wow-ice to-wow-ice-light rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:inline">
              Frostmourne
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-300 hover:text-wow-ice transition-colors flex items-center space-x-1">
              <Home className="w-4 h-4" />
              <span>{t('nav.home')}</span>
            </Link>
            <Link to="/rankings" className="text-gray-300 hover:text-wow-ice transition-colors flex items-center space-x-1">
              <Trophy className="w-4 h-4" />
              <span>{t('nav.rankings')}</span>
            </Link>
            <Link to="/shop" className="text-gray-300 hover:text-wow-ice transition-colors flex items-center space-x-1">
              <ShoppingBag className="w-4 h-4" />
              <span>{t('nav.shop')}</span>
            </Link>
            <Link to="/news" className="text-gray-300 hover:text-wow-ice transition-colors flex items-center space-x-1">
              <Newspaper className="w-4 h-4" />
              <span>{t('nav.news')}</span>
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Cart */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={() => navigate('/cart')}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-wow-ice text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Button>

                {/* Account Menu */}
                <div className="hidden md:flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white">{account?.username}</p>
                    <p className="text-xs text-wow-gold">{account?.balance} {t('header.coins')}</p>
                  </div>
                  {isAdmin && (
                    <>
                      <Button
                        variant={isEditMode ? "default" : "ghost"}
                        size="icon"
                        onClick={() => setIsEditMode(!isEditMode)}
                        title={isEditMode ? "Вимкнути редагування" : "Включити редагування"}
                        className={isEditMode ? "bg-wow-ice/30 text-wow-ice" : "text-blue-400 hover:text-wow-ice"}
                      >
                        <Edit2 className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate('/admin')}
                        title="Admin Panel"
                        className="text-wow-gold hover:text-wow-ice"
                      >
                        <Shield className="w-5 h-5" />
                      </Button>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('/account')}
                  >
                    <User className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-5 h-5" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/login')}
                >
                  {t('nav.login')}
                </Button>
                <Button
                  className="btn-primary"
                  onClick={() => navigate('/register')}
                >
                  {t('nav.register')}
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <LanguageSwitcher />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-wow-ice/20">
            <nav className="flex flex-col space-y-3">
              <Link
                to="/"
                className="text-gray-300 hover:text-wow-ice transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.home')}
              </Link>
              <Link
                to="/rankings"
                className="text-gray-300 hover:text-wow-ice transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.rankings')}
              </Link>
              <Link
                to="/shop"
                className="text-gray-300 hover:text-wow-ice transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.shop')}
              </Link>
              <Link
                to="/news"
                className="text-gray-300 hover:text-wow-ice transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.news')}
              </Link>

              {isAuthenticated ? (
                <>
                  {account?.role === 'admin' || account?.role === 'moderator' ? (
                    <Link
                      to="/admin"
                      className="text-wow-gold hover:text-wow-ice transition-colors py-2 font-semibold"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  ) : null}
                  <Link
                    to="/account"
                    className="text-gray-300 hover:text-wow-ice transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.myAccount')}
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-gray-300 hover:text-wow-ice transition-colors py-2 text-left"
                  >
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-300 hover:text-wow-ice transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/register"
                    className="text-gray-300 hover:text-wow-ice transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.register')}
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}