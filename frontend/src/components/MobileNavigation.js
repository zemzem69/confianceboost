import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, LogOut, Crown } from 'lucide-react';
import { useAuth } from '../App';

const MobileNavigation = ({ onLogout }) => {
  const { user, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    closeMenu();
    if (onLogout) onLogout();
  };

  return (
    <nav className="mobile-nav border-b border-gray-800">
      <div className="px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3" onClick={closeMenu}>
            <div className="brand-logo w-10 h-10 flex items-center justify-center">
              <span className="text-black font-black text-lg">CB</span>
            </div>
            <span className="text-xl font-bold brand-text">ConfianceBoost</span>
          </Link>
          
          {/* Menu Hamburger */}
          <button
            onClick={toggleMenu}
            className="mobile-menu-button p-2"
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        {isAuthenticated ? (
          <>
            {/* Utilisateur connecté */}
            <div className="mobile-menu-item flex items-center gap-3 border-b border-gray-700 pb-3 mb-3">
              <User className="w-5 h-5" />
              <div>
                <div className="font-semibold">{user?.first_name} {user?.last_name}</div>
                {user?.is_premium && (
                  <div className="badge success text-xs mt-1">
                    <Crown className="w-3 h-3" />
                    Premium
                  </div>
                )}
              </div>
            </div>
            
            <Link 
              to="/dashboard" 
              className="mobile-menu-item"
              onClick={closeMenu}
            >
              📊 Mon Dashboard
            </Link>
            
            {!user?.is_premium && (
              <Link 
                to="/payment" 
                className="mobile-menu-item text-premium"
                onClick={closeMenu}
              >
                👑 Passer Premium - 97€
              </Link>
            )}
            
            <button 
              onClick={handleLogout}
              className="mobile-menu-item w-full text-left text-red-400"
            >
              <LogOut className="w-4 h-4 inline mr-2" />
              Déconnexion
            </button>
          </>
        ) : (
          <>
            {/* Utilisateur non connecté */}
            <Link 
              to="/" 
              className="mobile-menu-item"
              onClick={closeMenu}
            >
              🏠 Accueil
            </Link>
            
            <Link 
              to="/auth" 
              className="mobile-menu-item"
              onClick={closeMenu}
            >
              🔐 Connexion
            </Link>
            
            <Link 
              to="/auth?tab=register" 
              className="mobile-menu-item text-premium"
              onClick={closeMenu}
            >
              ✨ Inscription Gratuite
            </Link>
          </>
        )}
        
        <div className="mobile-menu-item text-xs text-gray-500 text-center mt-4 pt-4 border-t border-gray-700">
          © 2025 ConfianceBoost - Formation Premium
        </div>
      </div>
      
      {/* Overlay pour fermer le menu */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMenu}
          style={{ top: '64px' }}
        />
      )}
    </nav>
  );
};

export default MobileNavigation;