import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ShoppingBag, Eye, X, Star, Clock, Heart, Sparkles } from 'lucide-react';
import { MenuItem } from '../types';

interface MenuSectionProps {
  menuItems: MenuItem[];
  addToCart: (item: MenuItem) => void;
  openCart: () => void;
}

export default function MenuSection({ menuItems, addToCart, openCart }: MenuSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeImgIdx, setActiveImgIdx] = useState<number>(0);

  React.useEffect(() => {
    setActiveImgIdx(0);
  }, [selectedItem?.id]);

  const categories = [
    { id: 'all', label: 'Tout le Menu' },
    { id: 'entrée', label: 'Entrées' },
    { id: 'plat_local', label: 'Plats Ivoiriens' },
    { id: 'plat_inter', label: 'Plats Internationaux' },
    { id: 'grillade', label: 'Grillades' },
    { id: 'dessert', label: 'Desserts' },
    { id: 'cocktail', label: 'Cocktails' },
    { id: 'boisson', label: 'Boissons' }
  ];

  // Filter items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Hide disabled products from customer
      if (item.isActive === false) return false;

      const matchCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.ingredients && item.ingredients.some((ing) => ing.toLowerCase().includes(searchTerm.toLowerCase())));
      return matchCategory && matchSearch;
    });
  }, [menuItems, activeCategory, searchTerm]);

  const handleAddToCart = (item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(item);
    setToastMessage(`"${item.name}" ajouté avec succès au panier !`);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  return (
    <section id="menu" className="py-24 px-4 max-w-7xl mx-auto scroll-mt-24">
      {/* Title */}
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <span className="text-[#D4AF37] font-sans text-xs tracking-widest uppercase font-semibold block mb-2">Artisans du Goût</span>
        <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#FAF9F6] tracking-tight leading-none mb-4">
          La Carte des Merveilles
        </h2>
        <p className="text-stone-400 text-sm sm:text-base">
          Des spécialités ivoiriennes traditionnelles revisitées avec raffinement jusqu'aux grands classiques internationaux et cocktails dorés à l'or fin. Une audace gastronomique.
        </p>
      </div>

      {/* Instant Search Bar & Tab Filters */}
      <div className="mb-12 flex flex-col md:flex-row gap-6 justify-between items-center bg-stone-900/40 p-4 sm:p-6 rounded-2xl border border-stone-800/80 backdrop-blur-sm shadow-xl">
        {/* Horizontal filters */}
        <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setSearchTerm('');
              }}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8902A] text-[#050505] font-bold shadow-md shadow-[#D4AF37]/10'
                  : 'bg-stone-900/60 border border-stone-800 text-stone-300 hover:text-[#DFAF37] hover:border-stone-700'
              }`}
              id={`filter-tab-${cat.id}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Input search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Rechercher un plat, un ingrédient..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-stone-950/80 text-sm border border-stone-800 focus:border-[#D4AF37] focus:outline-none transition-colors placeholder:text-stone-500 text-stone-200"
            id="menu-search-input"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500" size={16} />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 text-xs font-bold"
            >
              Effacer
            </button>
          )}
        </div>
      </div>

      {/* Grid container */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        id="menu-items-grid"
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="bg-stone-900/40 rounded-2xl border border-stone-800/80 hover:border-[#D4AF37]/30 overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1 shadow-lg cursor-pointer"
              id={`menu-card-${item.id}`}
            >
              {/* Image container */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Backdrop gradient top */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/20 to-transparent opacity-80" />

                {/* Badge tags */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                  {item.isNew && (
                    <span className="bg-emerald-500 text-[#050505] text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md shadow-lg flex items-center gap-1">
                      <Sparkles size={10} /> NOUVEAUTÉ
                    </span>
                  )}
                  {item.popular && (
                    <span className="bg-[#D4AF37] text-[#050505] text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md shadow-lg flex items-center gap-1">
                      <Star size={10} fill="#050505" /> POPULAIRE
                    </span>
                  )}
                </div>

                {/* Prep time badge */}
                <div className="absolute bottom-4 right-4 bg-stone-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-stone-300 text-xs flex items-center gap-1 border border-stone-800">
                  <Clock size={12} className="text-[#D4AF37]" />
                  <span>{item.preparationTime}</span>
                </div>
              </div>

              {/* Text metadata */}
              <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#FAF9F6] group-hover:text-[#D4AF37] transition-colors leading-tight">
                      {item.name}
                    </h3>
                    <span className="font-mono text-[#D4AF37] font-bold text-sm sm:text-base whitespace-nowrap bg-[#D4AF37]/5 px-2.5 py-1 rounded-lg border border-[#D4AF37]/20">
                      {item.price.toLocaleString('fr-FR')} F
                    </span>
                  </div>
                  <p className="text-stone-400 text-xs sm:text-sm line-clamp-2">
                    {item.description}
                  </p>
                </div>

                {/* Card footer CTA */}
                <div className="flex justify-between items-center pt-2 border-t border-stone-800/60 mt-auto">
                  <span className="text-[10px] uppercase font-semibold text-stone-500 tracking-widest">
                    Yamoussoukro Gourmet
                  </span>
                  <div className="flex gap-2">
                    <button
                      className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors cursor-pointer"
                      title="Voir les détails"
                      id={`btn-view-${item.id}`}
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      onClick={(e) => handleAddToCart(item, e)}
                      className="px-3.5 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#B8902A] text-[#050505] text-xs font-bold flex items-center gap-1.5 transition-colors shadow-lg shadow-[#D4AF37]/5 cursor-pointer"
                      id={`btn-add-cart-${item.id}`}
                    >
                      <ShoppingBag size={13} />
                      Ajouter
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty search fallback */}
      {filteredItems.length === 0 && (
        <div className="text-center py-16 bg-stone-900/10 rounded-2xl border border-stone-800 border-dashed">
          <p className="text-stone-400 mb-2">Aucun plat ne correspond à votre recherche.</p>
          <button
            onClick={() => {
              setActiveCategory('all');
              setSearchTerm('');
            }}
            className="text-xs text-[#D4AF37] hover:underline uppercase tracking-wider font-semibold"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}

      {/* Interactive Detail Modal Popup */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 bg-[#000]/80 z-50 flex items-center justify-center p-4 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-stone-950 w-full max-w-2xl rounded-2xl overflow-hidden border border-[#D4AF37]/30 shadow-2xl relative"
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#050505]/80 text-[#FAF9F6] border border-stone-800 hover:border-[#D4AF37] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              {/* Big photo header with multi-image slider support */}
              {(() => {
                const currentImages = selectedItem.images && selectedItem.images.length > 0
                  ? selectedItem.images
                  : [selectedItem.image];
                const currentDisplayedImage = currentImages[activeImgIdx] || selectedItem.image;

                return (
                  <div className="h-64 sm:h-80 relative group">
                    <img
                      src={currentDisplayedImage}
                      alt={selectedItem.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-all duration-500"
                    />
                    
                    {/* Image navigation arrows */}
                    {currentImages.length > 1 && (
                      <>
                        <button
                          onClick={() => setActiveImgIdx(prev => (prev - 1 + currentImages.length) % currentImages.length)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center cursor-pointer transition-all z-10 text-lg font-black"
                          title="Précédent"
                        >
                          ‹
                        </button>
                        <button
                          onClick={() => setActiveImgIdx(prev => (prev + 1) % currentImages.length)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center cursor-pointer transition-all z-10 text-lg font-black"
                          title="Suivant"
                        >
                          ›
                        </button>
                      </>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
                    
                    <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                      <div>
                        <span className="text-[#D4AF37] text-xs font-semibold tracking-widest uppercase block mb-1">
                          {selectedItem.category.replace('_', ' ')}
                        </span>
                        <h3 className="font-serif text-xl sm:text-2.5xl font-extrabold text-[#FAF9F6] tracking-tight leading-none mb-1">
                          {selectedItem.name}
                        </h3>
                      </div>

                      {/* Thumbnail navigation slides overlay */}
                      {currentImages.length > 1 && (
                        <div className="flex gap-1.5 bg-black/50 backdrop-blur-md p-1 rounded-lg border border-stone-800 self-start sm:self-auto">
                          {currentImages.map((img, idx) => (
                            <button
                              key={idx}
                              onClick={() => setActiveImgIdx(idx)}
                              className={`w-8 h-8 rounded overflow-hidden border transition-all cursor-pointer shrink-0 ${
                                idx === activeImgIdx ? 'border-[#D4AF37] scale-105' : 'border-stone-800 opacity-60 hover:opacity-100'
                              }`}
                            >
                              <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Content body */}
              <div className="p-6 sm:p-8 flex flex-col gap-5">
                <div>
                  <h4 className="text-xs font-semibold uppercase text-stone-400 tracking-wider mb-2">Description Gourmande</h4>
                  <p className="text-stone-300 text-sm sm:text-base leading-relaxed">{selectedItem.description}</p>
                </div>

                {selectedItem.ingredients && selectedItem.ingredients.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase text-stone-400 tracking-wider mb-2.5">Ingrédients du Chef</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.ingredients.map((ing, k) => (
                        <span
                          key={k}
                          className="px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-xs text-stone-350"
                        >
                          🍃 {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price and Add item */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-5 border-t border-stone-900 mt-2">
                  <div className="flex flex-col text-center sm:text-left">
                    <span className="text-xs text-stone-500 uppercase tracking-widest">Tarif Unitaire</span>
                    <span className="text-2xl font-serif font-bold text-[#D4AF37]">{selectedItem.price.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => {
                        setSelectedItem(null);
                      }}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl border border-stone-800 text-xs uppercase tracking-wider font-semibold text-stone-400 hover:text-[#FAF9F6] hover:border-stone-650 transition-colors cursor-pointer"
                    >
                      Retour
                    </button>
                    <button
                      onClick={(e) => {
                        addToCart(selectedItem);
                        setSelectedItem(null);
                        setToastMessage(`"${selectedItem.name}" ajouté avec succès au panier !`);
                        setTimeout(() => setToastMessage(null), 2500);
                      }}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#B8902A] text-[#050505] text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-lg cursor-pointer"
                      id="modal-add-to-cart-btn"
                    >
                      <ShoppingBag size={14} />
                      Ajouter au Panier
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Instant Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-xl bg-stone-950 border border-[#D4AF37] text-[#FAF9F6] shadow-2xl shadow-[#D4AF37]/5 flex items-center justify-between gap-4 w-[90%] max-w-md"
            id="toast-notification"
          >
            <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
            <button
              onClick={openCart}
              className="text-[11px] uppercase tracking-wider font-bold text-[#D4AF37] hover:underline"
            >
              Voir panier
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
