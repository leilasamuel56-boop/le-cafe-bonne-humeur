import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Award, ShieldAlert, Sliders, Menu as MenuIcon, X, PhoneCall, Utensils } from 'lucide-react';
import { LoyaltyAccount, CartItem } from '../types';

interface HeaderProps {
  cart: CartItem[];
  loyaltyAccount: LoyaltyAccount | null;
  openCart: () => void;
  openLoyalty: () => void;
  toggleAdmin: () => void;
  isAdminView: boolean;
  logoText?: string;
  brandColor?: string;
  brandHoverColor?: string;
  contactPhone?: string;
  openingHours?: string;
}

export default function Header({
  cart,
  loyaltyAccount,
  openCart,
  openLoyalty,
  toggleAdmin,
  isAdminView,
  logoText = 'Le Café Bonne Humeur',
  brandColor = '#D4AF37',
  brandHoverColor = '#B8902A',
  contactPhone = '07 16 19 56 99',
  openingHours = '11h00 à 02h00'
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartCount = cart.reduce((acc, i) => acc + i.quantity, 0);

  const handleNavClick = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const navLinks = [
    { label: 'Accueil', target: 'hero' },
    { label: 'À Propos', target: 'about' },
    { label: 'Menu', target: 'menu' },
    { label: 'Réservation', target: 'reservation' },
    { label: 'Moments VIP', target: 'events' },
    { label: 'Galerie', target: 'gallery' },
    { label: 'Avis', target: 'reviews' },
    { label: 'Contact', target: 'contact' }
  ];

  // Helper to split logoText for double-stacked typography
  const words = logoText.trim().split(' ');
  const mainLogoText = words.slice(0, words.length - 2 > 0 ? words.length - 2 : 2).join(' ').toUpperCase();
  const subLogoText = words.slice(words.length - 2 > 0 ? words.length - 2 : 2).join(' ').toUpperCase() || 'BONNE HUMEUR';

  return (
    <header className="fixed top-0 left-0 w-full z-45 transition-all duration-300">
      {/* Top micro banner */}
      <div className="bg-stone-950/90 border-b border-stone-900 py-1 text-center text-xs tracking-wider text-stone-300 font-medium uppercase px-4 flex justify-between items-center max-w-7xl mx-auto rounded-b-xl my-1 backdrop-blur-md">
        <span className="hidden sm:inline">📍 Yamoussoukro, Côte d'Ivoire — Proche Basilique</span>
        <span className="sm:hidden">📍 Yamoussoukro</span>
        <span className="flex items-center gap-1 font-mono font-bold text-[#D4AF37]" style={{ color: brandColor }}>
          <PhoneCall size={12} className="inline animate-pulse text-amber-500" /> {contactPhone}
        </span>
      </div>

      {/* Main glass navbar */}
      <div className="w-[95%] max-w-7xl mx-auto rounded-2xl glassmorphism mt-1 px-4 sm:px-8 py-3 flex justify-between items-center transition-all duration-300 shadow-xl">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('hero')}
          className="flex items-center gap-2 group cursor-pointer text-left"
          id="btn-logo-nav"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-stone-800 to-stone-950 flex items-center justify-center border border-stone-800 shadow-lg group-hover:scale-105 transition-transform duration-300" style={{ borderColor: `${brandColor}40` }}>
            <Utensils size={20} style={{ color: brandColor }} />
          </div>
          <div>
            <h1 className="font-serif text-md sm:text-lg font-black tracking-tight text-[#FAF9F6] flex flex-col leading-none">
              {mainLogoText}
              <span className="text-xs font-sans tracking-widest uppercase mt-0.5" style={{ color: brandColor }}>{subLogoText}</span>
            </h1>
          </div>
        </button>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              key={link.target}
              onClick={() => handleNavClick(link.target)}
              className="text-xs tracking-wider uppercase text-[#FAF9F6]/80 hover:text-[#D4AF37] transition-colors duration-200 font-medium cursor-pointer"
              id={`nav-link-${link.target}`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Action Widgets */}
        <div className="flex items-center gap-3">
          {/* Loyalty Panel Widget */}
          <button
            onClick={openLoyalty}
            className={`relative p-2.5 rounded-xl border transition-all duration-300 group cursor-pointer ${
              loyaltyAccount
                ? 'bg-[#D4AF37]/10 border-[#D4AF37]/30 text-[#D4AF37]'
                : 'bg-stone-900/60 border-stone-800 text-[#FAF9F6]/80 hover:border-[#D4AF37]/50'
            }`}
            title="Mon Compte Fidélité"
            id="loyalty-btn"
          >
            <Award size={18} className="group-hover:rotate-12 transition-transform duration-200" />
            {loyaltyAccount && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full animate-ping" />
            )}
          </button>

          {/* Cart Widget */}
          <button
            onClick={openCart}
            className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-[#FAF9F6]/80 hover:border-[#D4AF37]/50 relative group cursor-pointer"
            id="cart-trigger-btn"
          >
            <ShoppingBag size={18} className="group-hover:scale-110 transition-transform duration-200 text-[#FAF9F6]" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#D4AF37] text-[#050505] text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center font-mono shadow-md animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-stone-900/60 border border-stone-800 text-[#FAF9F6] cursor-pointer"
            id="mobile-menu-trigger"
          >
            {isMobileMenuOpen ? <X size={18} /> : <MenuIcon size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden w-[95%] mx-auto mt-2 p-5 rounded-2xl glassmorphism shadow-2xl flex flex-col gap-4 text-center"
            id="mobile-drawer"
          >
            <p className="text-[10px] tracking-widest uppercase font-semibold" style={{ color: brandColor }}>{logoText}</p>
            <hr className="border-stone-850" />
            <div className="flex flex-col gap-3 py-2">
              {navLinks.map((link) => (
                <button
                  key={link.target}
                  onClick={() => handleNavClick(link.target)}
                  className="py-1 text-sm tracking-wide uppercase text-stone-300 hover:text-white font-medium transition-colors cursor-pointer"
                  id={`nav-mob-${link.target}`}
                >
                  {link.label}
                </button>
              ))}
            </div>
            <hr className="border-stone-850" />
            <div className="flex justify-center gap-4 text-xs text-stone-305 text-[#FAF9F6]/60">
              <span className="truncate">⏰ {openingHours}</span>
              <span>📞 {contactPhone}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
