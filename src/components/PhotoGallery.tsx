import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize2, X, Image as ImageIcon, Sparkles } from 'lucide-react';
import { GalleryImg } from '../types';

interface PhotoGalleryProps {
  galleryImages: GalleryImg[];
}

export default function PhotoGallery({ galleryImages }: PhotoGalleryProps) {
  const [activeTab, setActiveTab] = useState<string>('Tout');
  const [lightboxImg, setLightboxImg] = useState<{ url: string; title: string; category: string } | null>(null);

  const tabs = useMemo(() => {
    const baseTabs = ['Tout'];
    
    const hasRestaurant = galleryImages.some(img => 
      ['Façade du restaurant', 'Salle principale', 'Terrasse', 'Galerie générale'].includes(img.category)
    );
    if (hasRestaurant) baseTabs.push('Restaurant');
    
    if (galleryImages.some(img => img.category === 'Plats')) baseTabs.push('Plats');
    if (galleryImages.some(img => img.category === 'Cocktails')) baseTabs.push('Cocktails');
    if (galleryImages.some(img => img.category === 'Lounge VIP')) baseTabs.push('Lounge VIP');
    if (galleryImages.some(img => img.category === 'Événements')) baseTabs.push('Événements');
    
    return baseTabs;
  }, [galleryImages]);

  // Adjust active tab if it's no longer in the tabs list
  useEffect(() => {
    if (!tabs.includes(activeTab)) {
      setActiveTab('Tout');
    }
  }, [tabs, activeTab]);

  const filteredImages = useMemo(() => {
    if (activeTab === 'Tout') return galleryImages;
    if (activeTab === 'Restaurant') {
      return galleryImages.filter(
        (img) =>
          img.category === 'Façade du restaurant' ||
          img.category === 'Salle principale' ||
          img.category === 'Terrasse' ||
          img.category === 'Galerie générale'
      );
    }
    return galleryImages.filter((img) => img.category === activeTab);
  }, [galleryImages, activeTab]);

  return (
    <section id="gallery" className="py-24 bg-stone-900/10 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Title */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-[#D4AF37] font-sans text-xs tracking-widest uppercase font-semibold block mb-2">Immersion Visuelle</span>
          <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#FAF9F6] tracking-tight leading-none mb-4">
            Galerie de l'Élégance
          </h2>
          <p className="text-stone-400 text-sm sm:text-base">
            Laissez votre regard voyager au cœur du raffinement de notre table culinaire, de l'intimité du lounge VIP et des sourires chaleureux partagés sous le ciel de Yamoussoukro.
          </p>
        </div>

        {/* Tab triggers */}
        <div className="flex flex-wrap gap-2.5 justify-center mb-12">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4.5 py-2 rounded-xl text-xs sm:text-sm font-medium uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === tab
                  ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/45'
                  : 'bg-stone-900/40 border border-stone-850 text-stone-400 hover:text-stone-200 hover:border-stone-700'
              }`}
              id={`gallery-tab-${tab.replace(/\s+/g, '')}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Responsive Photo Grid Layout */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          id="gallery-images-container"
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((img) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                key={img.id}
                onClick={() => setLightboxImg(img)}
                className="group relative h-72 rounded-2xl overflow-hidden border border-stone-900/80 shadow-lg cursor-pointer bg-stone-950"
                id={`gallery-img-box-${img.id}`}
              >
                {/* Visual Image */}
                <img
                  src={img.url}
                  alt={img.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Glassy Overlay on Hover */}
                <div className="absolute inset-0 bg-stone-950/70 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-wider font-mono">
                      {img.category}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-300">
                      <Maximize2 size={13} />
                    </div>
                  </div>

                  <div className="text-left">
                    <span className="text-[9px] uppercase text-stone-500 tracking-widest block font-mono">Café Bonne Humeur</span>
                    <h4 className="font-serif text-sm sm:text-base font-bold text-[#FAF9F6] mt-0.5">{img.title}</h4>
                  </div>
                </div>

                {/* Static indicator for simple visual clue */}
                <div className="absolute bottom-4 left-4 bg-[#050505]/75 backdrop-blur-sm px-2.5 py-1 rounded-md border border-stone-900 text-[10px] text-stone-350 tracking-wide flex items-center gap-1 group-hover:opacity-0 transition-opacity font-mono">
                  <Sparkles size={11} className="text-[#D4AF37] shrink-0" />
                  <span>{img.title}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Fullscreen Zoom Lightbox overlay */}
        <AnimatePresence>
          {lightboxImg && (
            <div
              className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-md"
              onClick={() => setLightboxImg(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative max-w-4xl w-full rounded-2xl overflow-hidden border border-stone-800 shadow-2xl bg-stone-950"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close trigger button */}
                <button
                  onClick={() => setLightboxImg(null)}
                  className="absolute top-4 right-4 w-9 h-9 bg-black/80 border border-stone-800 hover:border-[#D4AF37] text-white rounded-full flex items-center justify-center transition-colors z-10 cursor-pointer"
                >
                  <X size={18} />
                </button>

                {/* Screen size photo aspect layout */}
                <div className="h-[50vh] sm:h-[65vh] relative bg-stone-950">
                  <img
                    src={lightboxImg.url}
                    alt={lightboxImg.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Label metadata footer */}
                <div className="p-5 sm:p-6 bg-[#0c0c0c] border-t border-stone-850 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <div>
                    <span className="text-[10px] text-[#D4AF37] tracking-widest font-mono uppercase font-bold bg-[#D4AF37]/5 px-2 py-0.5 rounded border border-[#D4AF37]/10 inline-block mb-1">
                      {lightboxImg.category}
                    </span>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#FAF9F6]">{lightboxImg.title}</h3>
                  </div>
                  <span className="text-xs text-stone-500 font-mono">© Le Café Bonne Humeur Yamoussoukro</span>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
