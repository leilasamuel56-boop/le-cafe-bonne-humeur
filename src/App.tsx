import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  Facebook,
  Coffee,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Heart,
  Utensils,
  LogOut,
  ChevronRight,
  BookmarkCheck
} from 'lucide-react';

import { useAppState } from './useAppState';
import Header from './components/Header';
import MenuSection from './components/MenuSection';
import ReservationSection from './components/ReservationSection';
import CartDrawer from './components/CartDrawer';
import LoyaltySection from './components/LoyaltySection';
import EventsSection from './components/EventsSection';
import ReviewsSection from './components/ReviewsSection';
import PhotoGallery from './components/PhotoGallery';
import AdminPanel from './components/AdminPanel';
import WhatsAppFloat from './components/WhatsAppFloat';

export default function App() {
  const {
    menuItems,
    loyaltyAccount,
    cart,
    appliedPromo,
    deliveryType,
    deliveryAddress,
    reviews,
    reservations,
    orders,
    galleryImages,
    adminUsers,
    adminSession,
    publishedSettings,
    draftSettings,
    isPreviewMode,
    setIsPreviewMode,
    activeSettings,
    promotions,
    setDeliveryType,
    setDeliveryAddress,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    applyPromoCode,
    checkout,
    createReservation,
    bookEvent,
    addReview,
    handleLoyaltySignup,
    logoutLoyalty,
    adminAddMenuItem,
    adminEditMenuItem,
    adminDeleteMenuItem,
    adminUpdateReservationStatus,
    adminUpdateOrderStatus,
    getPhotoFor,
    adminAddGalleryImage,
    adminDeleteGalleryImage,
    adminEditGalleryImage,
    loginAdmin,
    logoutAdmin,
    resetAdminPassword,
    updateAdminLastActive,
    adminAddSubUser,
    adminAddPromotion,
    adminEditPromotion,
    adminDeletePromotion,
    adminUpdateDraftSettings,
    adminPublishSettings,
    adminResetDraftSettings
  } = useAppState();

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Synchronise path route for URL-based admin portal mapping
  const [currentRoute, setCurrentRoute] = useState(() => {
    return window.location.pathname + window.location.hash;
  });

  useEffect(() => {
    const handleUrlUpdate = () => {
      setCurrentRoute(window.location.pathname + window.location.hash);
    };
    window.addEventListener('popstate', handleUrlUpdate);
    window.addEventListener('hashchange', handleUrlUpdate);
    return () => {
      window.removeEventListener('popstate', handleUrlUpdate);
      window.removeEventListener('hashchange', handleUrlUpdate);
    };
  }, []);

  const isAdminActive = currentRoute.toLowerCase().includes('admin');

  const exitAdminPortal = () => {
    logoutAdmin();
    window.location.hash = '';
    if (window.location.pathname.toLowerCase().includes('admin')) {
      window.history.pushState(null, '', '/');
    }
    setCurrentRoute('/');
  };

  // Scroll to section helper
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 90;
      const elPosition = el.getBoundingClientRect().top;
      const offsetPos = elPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPos,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-[#050505] min-h-screen text-[#FAF9F6] selection:bg-[#D4AF37] selection:text-[#050505] font-sans antialiased relative overflow-hidden">
      
      {/* Background ambient lighting accents */}
      <div className="absolute top-0 right-10 w-[500px] h-[500px] bg-gradient-to-br from-[#D4AF37]/5 to-[#B8902A]/0 rounded-full blur-[120px] pointer-events-none animate-pulse-slow font-sans" style={{ '--tw-gradient-from': `${activeSettings.brandColor}0a` } as React.CSSProperties} />
      <div className="absolute top-[25vh] left-10 w-[400px] h-[400px] bg-stone-900/10 rounded-full blur-[100px] pointer-events-none" />

      {/* ADMIN PREVIEW CONTROLLER STATUS BAR */}
      {adminSession && (
        <div className="bg-stone-950 border-b border-amber-500/20 py-2.5 px-4 text-xs select-none sticky top-0 z-50 flex items-center justify-between gap-4 md:flex-row flex-col shadow-md">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="text-stone-300 font-medium">
              👁️ <strong>Mode Prévisualisation Actif</strong> — personnalisé pour le restaurant. Brouillon disponible immediately.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-1.5 text-[11px] cursor-pointer text-stone-400 hover:text-white">
              <input
                type="checkbox"
                checked={isPreviewMode}
                onChange={(e) => setIsPreviewMode(e.target.checked)}
                className="rounded border-stone-850 bg-stone-950 text-amber-500 focus:ring-0 focus:ring-offset-0"
              />
              <span>Afficher mon Brouillon</span>
            </label>
            <button
              onClick={() => {
                adminPublishSettings();
                alert("✨ Succès ! Vos modifications de textes, d'horaires et de bannières ont été publiées sur le site en direct.");
              }}
              className="bg-[#D4AF37] hover:bg-[#B8902A] text-stone-950 font-extrabold px-3 py-1 rounded-lg text-[10px] uppercase tracking-wider cursor-pointer"
              style={{ backgroundColor: activeSettings.brandColor }}
            >
              Publier les modifications
            </button>
            <button
              onClick={() => {
                if (confirm("Voulez-vous restaurer les paramètres en ligne et annuler tous vos brouillons ?")) {
                  adminResetDraftSettings();
                }
              }}
              className="bg-stone-850 hover:bg-stone-800 text-stone-300 px-3 py-1 rounded-lg text-[10px] uppercase tracking-wider cursor-pointer"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      )}

      {/* Header element */}
      <Header
        cart={cart}
        loyaltyAccount={loyaltyAccount}
        openCart={() => setIsCartOpen(true)}
        openLoyalty={() => scrollTo('loyalty')}
        toggleAdmin={() => {}}
        isAdminView={isAdminActive}
        logoText={activeSettings.logoText}
        brandColor={activeSettings.brandColor}
        brandHoverColor={activeSettings.brandHoverColor}
        contactPhone={activeSettings.contactPhone}
        openingHours={activeSettings.openingHoursWeekday}
      />

      <AnimatePresence mode="wait">
        {isAdminActive ? (
          /* SECRET ADMIN PORTAL OVERLAY CONTAINER */
          <motion.div
            key="admin-view"
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            className="pt-28 pb-12 px-4"
          >
            <div className="max-w-7xl mx-auto flex justify-between items-center mb-6 bg-stone-900/40 p-4 border border-stone-850 rounded-2xl md:flex-row flex-col gap-3">
              <div className="text-xs text-stone-400 font-medium">
                🔒 Espace d'Administration Sécurisé invisible du public. Conforme aux rôles et watchdogs.
              </div>
              <button
                onClick={exitAdminPortal}
                className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#D4AF37] hover:bg-[#B8902A] text-[#050505] rounded-xl transition-all cursor-pointer shadow"
              >
                ⬅ Quitter le portail admin
              </button>
            </div>

            <AdminPanel
              menuItems={menuItems}
              reservations={reservations}
              orders={orders}
              galleryImages={galleryImages}
              adminUsers={adminUsers}
              adminSession={adminSession}
              adminAddMenuItem={adminAddMenuItem}
              adminEditMenuItem={adminEditMenuItem}
              adminDeleteMenuItem={adminDeleteMenuItem}
              adminUpdateReservationStatus={adminUpdateReservationStatus}
              adminUpdateOrderStatus={adminUpdateOrderStatus}
              adminAddGalleryImage={adminAddGalleryImage}
              adminDeleteGalleryImage={adminDeleteGalleryImage}
              adminEditGalleryImage={adminEditGalleryImage}
              loginAdmin={loginAdmin}
              logoutAdmin={logoutAdmin}
              resetAdminPassword={resetAdminPassword}
              updateAdminLastActive={updateAdminLastActive}
              adminAddSubUser={adminAddSubUser}
              publishedSettings={publishedSettings}
              draftSettings={draftSettings}
              isPreviewMode={isPreviewMode}
              setIsPreviewMode={setIsPreviewMode}
              activeSettings={activeSettings}
              promotions={promotions}
              adminAddPromotion={adminAddPromotion}
              adminEditPromotion={adminEditPromotion}
              adminDeletePromotion={adminDeletePromotion}
              adminUpdateDraftSettings={adminUpdateDraftSettings}
              adminPublishSettings={adminPublishSettings}
              adminResetDraftSettings={adminResetDraftSettings}
            />
          </motion.div>
        ) : (
          /* STANDARD GUEST PROMOTIONAL FRONTEND WEB LAYOUT */
          <motion.div
            key="guest-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Top promo delivery alert banner */}
            {activeSettings.deliveryBannerText && (
              <div className="bg-[#D4AF37] text-stone-950 font-extrabold text-center text-[10px] sm:text-xs uppercase py-2 px-4 shadow sticky top-20 z-40 relative flex items-center justify-center gap-2" style={{ backgroundColor: activeSettings.brandColor }}>
                <Sparkles size={12} className="animate-spin-slow text-[#050505]" />
                <span>{activeSettings.deliveryBannerText}</span>
              </div>
            )}

            {/* HERO SECTION SPECTACULAIRE */}
            <section id="hero" className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-4 scroll-mt-32">
              {/* Giant backdrop image layer with parallax style */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src={getPhotoFor('hero')}
                  alt="Le Café Bonne Humeur Lounge"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover scale-102 brightness-[0.25]"
                />
                {/* Visual grid pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(#FAF9F6/3%_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
              </div>

              {/* Text content card */}
              <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
                {/* Micro branding */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-stone-900 to-stone-950 border border-[#D4AF37]/35 rounded-full text-xs font-semibold uppercase tracking-widest shadow-xl shadow-amber-500/5"
                  style={{ borderColor: `${activeSettings.brandColor}50`, color: activeSettings.brandColor }}
                >
                  <Sparkles size={13} className="animate-pulse" />
                  <span>Gastronomie Fine — Cocktail Premium — Lounge VIP</span>
                </motion.div>

                {/* Main Heading title */}
                <motion.h1
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="font-serif text-4.5xl sm:text-7xl font-black text-[#FAF9F6] tracking-tight leading-none"
                >
                  {activeSettings.heroSlogan} <br />
                  <span className="text-transparent bg-clip-text text-glow-gold" style={{ backgroundImage: `linear-gradient(to right, ${activeSettings.brandColor}, #FAF9F6, ${activeSettings.brandHoverColor})` }}>{activeSettings.heroSubSlogan}</span>
                </motion.h1>

                {/* Subtitle statement */}
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-stone-300 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed"
                >
                  {activeSettings.heroSubtitle}
                </motion.p>

                {/* Call to actions layout */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
                >
                  <button
                    onClick={() => scrollTo('reservation')}
                    className="w-full sm:w-auto px-8 py-4 text-stone-950 font-bold uppercase tracking-widest text-xs rounded-xl shadow-xl hover:brightness-110 hover:scale-101 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    id="hero-booking-btn"
                    style={{ backgroundColor: activeSettings.brandColor, boxShadow: `0 10px 15px -3px ${activeSettings.brandColor}20` }}
                  >
                    Réserver une Table
                    <ChevronRight size={15} />
                  </button>
                  <button
                    onClick={() => scrollTo('menu')}
                    className="w-full sm:w-auto px-8 py-4 bg-stone-900 border border-stone-850 text-stone-200 hover:text-[#D4AF37] hover:border-[#D4AF37]/40 font-bold uppercase tracking-widest text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    id="hero-order-btn"
                  >
                    Commander en Ligne
                  </button>
                </motion.div>

                {/* Trust and address proof bars */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-10"
                >
                  {[
                    { val: '4.8 / 5', label: '180+ Avis Certifiés' },
                    { val: 'Lounge VIP', label: 'Privilèges et Confort' },
                    { val: 'Yamoussoukro', label: 'Proche Basilique' },
                    { val: '7j / 7', label: 'Ouvert 11h à 02h' }
                  ].map((it, idx) => (
                    <div key={idx} className="bg-stone-900/40 p-3 rounded-xl border border-stone-850 text-center backdrop-blur-xs">
                      <span className="text-sm sm:text-base font-serif font-bold block" style={{ color: activeSettings.brandColor }}>{it.val}</span>
                      <span className="text-stone-500 text-[10px] uppercase font-bold tracking-wider mt-0.5 block">{it.label}</span>
                    </div>
                  ))}
                </motion.div>
              </div>
            </section>

            {/* SECTION À PROPOS */}
            <section id="about" className="py-24 max-w-7xl mx-auto px-4 scroll-mt-24">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Text and story block */}
                <div className="lg:col-span-6 space-y-6">
                  <span className="text-xs tracking-widest uppercase font-semibold block" style={{ color: activeSettings.brandColor }}>{activeSettings.aboutBadge}</span>
                  
                  <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#FAF9F6] tracking-tight leading-none">
                    {activeSettings.aboutTitle}
                  </h2>
                  
                  <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                    {activeSettings.aboutStory1}
                  </p>

                  <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
                    {activeSettings.aboutStory2}
                  </p>

                  {/* Highlights checklist */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    <div className="flex gap-2.5 items-start text-xs text-stone-350">
                      <ShieldCheck className="text-emerald-500 shrink-0 mt-0.5" size={16} />
                      <div>
                        <strong className="text-white block font-medium">Ingrédients de Cueillette</strong>
                        <span className="text-stone-500">Manioc fin, herbes côtières, poissons frais péchés à San-Pédro.</span>
                      </div>
                    </div>

                    <div className="flex gap-2.5 items-start text-xs text-stone-350">
                      <Heart className="text-pink-500 shrink-0 mt-0.5" size={16} />
                      <div>
                        <strong className="text-white block font-medium">Cave VIP d'Exception</strong>
                        <span className="text-stone-500">Nectars d'importation, champagnes et cigares raffinés.</span>
                      </div>
                    </div>
                  </div>

                  <hr className="border-stone-850 pt-3" />

                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-full border border-stone-800 flex items-center justify-center font-serif font-extrabold" style={{ color: activeSettings.brandColor, borderColor: `${activeSettings.brandColor}30` }}>
                      BH
                    </div>
                    <div>
                      <p className="text-xs text-stone-500 font-mono">Le Chef Exécutif</p>
                      <h5 className="text-sm font-bold text-stone-300 font-serif">Kouassi Yao Curtis — Concierge Gourmet</h5>
                    </div>
                  </div>
                </div>

                {/* Visual Photo grid collage block */}
                <div className="lg:col-span-6 grid grid-cols-12 gap-4">
                  <div className="col-span-8 h-80 rounded-2xl overflow-hidden border border-stone-850">
                    <img
                      src={getPhotoFor('about_1')}
                      alt="Le Café Bonne Humeur Salle"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-xl transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                  <div className="col-span-4 h-80 rounded-2xl overflow-hidden border border-stone-850 relative">
                    <img
                      src={getPhotoFor('about_2')}
                      alt="Cocktail Bar"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-xl transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[#D4AF37]/5 mix-blend-color" style={{ backgroundColor: `${activeSettings.brandColor}0a` }} />
                  </div>
                  <div className="col-span-4 h-56 rounded-2xl overflow-hidden border border-stone-850">
                    <img
                      src={getPhotoFor('about_3')}
                      alt="Gourmet Fish Sole"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-xl transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                  <div className="col-span-8 h-56 rounded-2xl overflow-hidden border border-stone-850 relative">
                    <div className="absolute inset-0 bg-stone-950/70 p-6 flex flex-col justify-between">
                      <span className="text-[9px] font-mono uppercase tracking-widest font-bold" style={{ color: activeSettings.brandColor }}>L'Ambiance de Nuit</span>
                      <div>
                        <h4 className="font-serif text-lg font-bold text-white">{activeSettings.vipTitle}</h4>
                        <p className="text-[11px] text-stone-400 mt-1">{activeSettings.vipDescription}</p>
                      </div>
                    </div>
                    <img
                      src={getPhotoFor('vip')}
                      alt="Cozy Lounge Club"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                </div>

              </div>
            </section>

            {/* INTERACTIVE MENU SECTION */}
            <MenuSection
              menuItems={menuItems}
              addToCart={addToCart}
              openCart={() => setIsCartOpen(true)}
            />

            {/* INTEGRATED INTELLIGENT RESERVATION SYSTEM */}
            <ReservationSection createReservation={createReservation} />

            {/* VIP SOCIAL EVENTS SCHEDULE */}
            <EventsSection bookEvent={bookEvent} />

            {/* IMMERSIVE LIGHTBOX GALLERY */}
            <PhotoGallery galleryImages={galleryImages} />

            {/* LOYALTY CARD PROGRAM */}
            <LoyaltySection
              loyaltyAccount={loyaltyAccount}
              handleLoyaltySignup={handleLoyaltySignup}
              logoutLoyalty={logoutLoyalty}
            />

            {/* CUSTOMER REVIEWS SLIDER */}
            <ReviewsSection reviews={reviews} addReview={addReview} />

            {/* CONTACTS, MAP & HORAIRES DETAILS Section */}
            <section id="contact" className="py-24 bg-stone-950 text-stone-105 border-t border-stone-900 scroll-mt-24">
              <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
                  
                  {/* Left block form and text info */}
                  <div className="lg:col-span-5 space-y-8">
                    <div>
                      <span className="font-sans text-xs tracking-widest uppercase font-semibold block mb-2" style={{ color: activeSettings.brandColor }}>Conciergerie Gourmet</span>
                      <h2 className="font-serif text-3xl sm:text-4.5xl font-extrabold text-[#FAF9F6] tracking-tight leading-none">
                        Où nous trouver ?
                      </h2>
                      <p className="text-stone-400 text-sm mt-3 leading-relaxed">
                        Idéalement situé près de la magnifique Basilique Notre-Dame-de-la-Paix de Yamoussoukro, Le Café Bonne Humeur bénéficie d'un emplacement royal facile d'accès avec parking sécurisé 24h/24.
                      </p>
                    </div>

                    {/* Direct meta details cards */}
                    <div className="space-y-4">
                      <div className="flex gap-4 items-center p-4 bg-stone-900/40 border border-stone-850 rounded-xl">
                        <MapPin size={20} className="shrink-0" style={{ color: activeSettings.brandColor }} />
                        <div>
                          <strong className="text-xs uppercase tracking-widest block font-mono" style={{ color: activeSettings.brandColor }}>Adresse exacte</strong>
                          <span className="text-sm text-stone-300">{activeSettings.contactAddress}</span>
                        </div>
                      </div>

                      <div className="flex gap-4 items-center p-4 bg-stone-900/40 border border-stone-850 rounded-xl">
                        <Phone size={20} className="shrink-0" style={{ color: activeSettings.brandColor }} />
                        <div>
                          <strong className="text-xs uppercase tracking-widest block font-mono" style={{ color: activeSettings.brandColor }}>Téléphone direct</strong>
                          <a href={`tel:${activeSettings.contactPhone.replace(/\s+/g, '')}`} className="text-sm text-stone-300 hover:underline">{activeSettings.contactPhone}</a>
                        </div>
                      </div>

                      <div className="flex gap-4 items-center p-4 bg-stone-900/40 border border-stone-850 rounded-xl">
                        <Clock size={20} className="shrink-0" style={{ color: activeSettings.brandColor }} />
                        <div>
                          <strong className="text-xs uppercase tracking-widest block font-mono" style={{ color: activeSettings.brandColor }}>Heures de Service (Semaine)</strong>
                          <span className="text-sm text-stone-300">{activeSettings.openingHoursWeekday}</span>
                        </div>
                      </div>
                    </div>

                    {/* Social networks trigger buttons */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-stone-500 uppercase tracking-widest block font-mono mr-2">Bâtir le contact:</span>
                      <a
                        href={activeSettings.socialInstagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center hover:bg-stone-850 transition-colors"
                        style={{ color: activeSettings.brandColor }}
                      >
                        <Instagram size={16} />
                      </a>
                      <a
                        href={activeSettings.socialFacebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center hover:bg-stone-850 transition-colors"
                        style={{ color: activeSettings.brandColor }}
                      >
                        <Facebook size={16} />
                      </a>
                    </div>
                  </div>

                  {/* Right block: High performance Google Maps Simulator frame */}
                  <div className="lg:col-span-7 flex flex-col">
                    <div className="flex-1 min-h-[350px] bg-stone-900/30 border border-stone-850 rounded-3xl overflow-hidden relative shadow-inner">
                      
                      {/* Premium simulated map viewport */}
                      <div className="absolute inset-0 z-0 opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-500">
                        <iframe
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3948.330833215888!2d-5.2764121248039805!3d6.818440093179244!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1fc307525ab58bb7%3A0xc3959958ac4666cf!2sBasilique%20Notre-Dame%20de%20la%20Paix!5e0!3m2!1sfr!2sci!4v1717770000000!5m2!1sfr!2sci"
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          title="Carte de Yamoussoukro"
                        />
                      </div>

                      {/* Sticky coordinates badge floating */}
                      <div className="absolute bottom-6 left-6 z-10 p-4 rounded-xl bg-stone-950/95 border border-stone-850 hover:border-[#D4AF37] backdrop-blur-md max-w-xs transition-colors pointer-events-auto" style={{ hoverBorderColor: activeSettings.brandColor } as React.CSSProperties}>
                        <h4 className="font-serif text-xs font-bold text-white mb-1">⛪ Face à la Basilique</h4>
                        <p className="text-[11px] text-stone-400">À seulement 900 mètres du célèbre Chef d'œuvre architectural mondial, au cœur de Yamoussoukro.</p>
                      </div>

                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* COMPLETED BRASS FOOTER */}
            <footer className="bg-[#050505] border-t border-stone-900 py-12 px-4 text-center">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-stone-550 border-b border-stone-900 pb-8 mb-8">
                <div className="flex items-center gap-2 group">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-stone-850 to-stone-950 flex items-center justify-center border border-stone-805" style={{ borderColor: `${activeSettings.brandColor}50` }}>
                    <Utensils size={15} style={{ color: activeSettings.brandColor }} />
                  </div>
                  <h4 className="font-serif text-sm font-bold text-stone-200">{activeSettings.logoText}</h4>
                </div>

                <nav className="flex flex-wrap justify-center gap-6 col-span-2 text-stone-400">
                  <button onClick={() => scrollTo('hero')} className="hover:text-white transition-colors uppercase tracking-wider text-[10px]">Accueil</button>
                  <button onClick={() => scrollTo('about')} className="hover:text-white transition-colors uppercase tracking-wider text-[10px]">À Propos</button>
                  <button onClick={() => scrollTo('menu')} className="hover:text-white transition-colors uppercase tracking-wider text-[10px]">La Carte</button>
                  <button onClick={() => scrollTo('reservation')} className="hover:text-white transition-colors uppercase tracking-wider text-[10px]">Réserver</button>
                </nav>

                <p className="text-stone-300 font-mono text-[10px]">📞 {activeSettings.contactPhone} — {activeSettings.contactAddress.split(',')[1] || 'Yamoussoukro'}</p>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-stone-500 font-mono">
                <p>© 2026 {activeSettings.logoText}. Tous droits réservés.</p>
                <div className="flex gap-4">
                  <span>Conditions de Service</span>
                  <span>Politique de Confidentialité</span>
                </div>
              </div>
            </footer>

            {/* INTEGRATED FLOATING WHATSAPP CHAT BUTTON */}
            <WhatsAppFloat />
          </motion.div>
        )}
      </AnimatePresence>

      {/* SHOPPING CART OVERLAY GLIDE-IN DRAWER SCREEN */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        appliedPromo={appliedPromo}
        deliveryType={deliveryType}
        deliveryAddress={deliveryAddress}
        setDeliveryType={setDeliveryType}
        setDeliveryAddress={setDeliveryAddress}
        updateCartQuantity={updateCartQuantity}
        removeFromCart={removeFromCart}
        applyPromoCode={applyPromoCode}
        checkout={checkout}
        orders={orders}
      />

    </div>
  );
}
