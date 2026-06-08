import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, MessageSquareCode, Quote, ArrowLeft, ArrowRight, CheckCircle2, Heart } from 'lucide-react';
import { Review } from '../types';

interface ReviewsSectionProps {
  reviews: Review[];
  addReview: (author: string, rating: number, comment: string) => void;
}

export default function ReviewsSection({ reviews, addReview }: ReviewsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [authorName, setAuthorName] = useState('');
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const totalPossible = reviews.length;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPossible);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPossible) % totalPossible);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !commentInput.trim()) return;

    addReview(authorName, ratingInput, commentInput);
    setAuthorName('');
    setCommentInput('');
    setRatingInput(5);
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setIsSubmitOpen(false);
    }, 2800);
  };

  // Score stats bars
  const stats = [
    { stars: 5, percentage: 92, count: 182 },
    { stars: 4, percentage: 6, count: 12 },
    { stars: 3, percentage: 2, count: 4 },
    { stars: 2, percentage: 0, count: 0 },
    { stars: 1, percentage: 0, count: 0 }
  ];

  return (
    <section id="reviews" className="py-24 px-4 max-w-7xl mx-auto scroll-mt-24">
      
      {/* Title */}
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <span className="text-[#D4AF37] font-sans text-xs tracking-widest uppercase font-semibold block mb-2">L'Avis de nos Esthètes</span>
        <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#FAF9F6] tracking-tight leading-none mb-4">
          Témoignages & Distinctions
        </h2>
        <p className="text-stone-450 text-sm sm:text-base">
          Votre satisfaction est notre signature dorée. Lisez les retours d'expériences de nos clients habituels de la terrasse clasique et du salon lounge VIP.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side: Score summary */}
        <div className="lg:col-span-5 bg-stone-950 p-6 sm:p-8 rounded-3xl border border-stone-850 shadow-xl flex flex-col justify-between self-stretch">
          
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold block">Indicateur de Prestige</span>
            
            {/* Average block */}
            <div className="flex items-center gap-5 mt-4">
              <span className="text-5xl sm:text-6xl font-serif font-black text-[#FAF9F6]">4.8</span>
              <div>
                <div className="flex text-amber-400 gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={18} fill={s <= 4.8 ? '#D4AF37' : 'none'} className="text-[#D4AF37]" />
                  ))}
                </div>
                <p className="text-xs text-stone-500 font-mono mt-1">Note certifiée de 4.8 / 5.0</p>
                <p className="text-[11px] text-[#D4AF37] font-semibold mt-1">Établissement Recommandé d'Afrique</p>
              </div>
            </div>

            {/* Stars bars list representation */}
            <div className="space-y-3 mt-8">
              {stats.map((st) => (
                <div key={st.stars} className="flex items-center gap-3 text-xs text-stone-400">
                  <span className="w-3 text-center">{st.stars}</span>
                  <Star size={11} className="text-[#D4AF37]" fill="#D4AF37" />
                  <div className="flex-1 h-1.5 bg-stone-900 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#D4AF37] to-[#B8902A]" style={{ width: `${st.percentage}%` }} />
                  </div>
                  <span className="w-10 text-right text-[10px] font-mono">{st.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action to add review */}
          <div className="pt-8 border-t border-stone-850 mt-8 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-[11px] text-stone-500 font-mono">Dîner récent chez nous ?</p>
              <p className="text-xs text-stone-300">Partagez vos émotions avec notre équipe gastronomique.</p>
            </div>
            <button
              onClick={() => setIsSubmitOpen(!isSubmitOpen)}
              className="px-5 py-2.5 rounded-xl border border-stone-800 hover:border-[#D4AF37]/50 text-xs font-bold text-stone-300 hover:text-[#D4AF37] uppercase tracking-wider transition-all cursor-pointer"
            >
              Écrire un Avis
            </button>
          </div>

        </div>

        {/* Right Side: Horizontal Testimonial Carousel or Modal form */}
        <div className="lg:col-span-7 flex flex-col justify-center min-h-[300px] relative">
          
          <AnimatePresence mode="wait">
            {!isSubmitOpen ? (
              // Swipe Carousel
              <motion.div
                key="carousel-pane"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-stone-900/40 border border-stone-850 rounded-3xl p-6 sm:p-10 relative overflow-hidden flex flex-col justify-between gap-6 min-h-[280px]"
                id="testimonial-carousel-panel"
              >
                
                {/* Visual symbol quotes */}
                <span className="absolute top-6 right-8 text-[#D4AF37]/10 pointer-events-none">
                  <Quote size={120} />
                </span>

                {/* Stars index */}
                <div>
                  <div className="flex text-[#D4AF37] gap-0.5 mb-5">
                    {Array.from({ length: reviews[currentIndex].rating }).map((_, st) => (
                      <Star key={st} size={15} fill="#D4AF37" className="text-[#D4AF37]" />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="font-serif italic text-base sm:text-lg text-stone-200 leading-relaxed font-light mb-4 relative z-10">
                    "{reviews[currentIndex].comment}"
                  </p>
                </div>

                {/* Reviewer author bottom line */}
                <div className="flex justify-between items-center pt-5 border-t border-stone-850 mt-auto relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-stone-850 border border-stone-700 flex items-center justify-center font-bold font-serif text-[#D4AF37] text-sm">
                      {reviews[currentIndex].initials}
                    </div>
                    <div>
                      <h4 className="font-serif text-sm font-bold text-stone-105">{reviews[currentIndex].author}</h4>
                      <p className="text-[10px] text-[#D4AF37] uppercase tracking-wider font-semibold font-mono flex items-center gap-1">
                        ✓ Gastronome Vérifié <span className="text-stone-500 font-normal">({reviews[currentIndex].date})</span>
                      </p>
                    </div>
                  </div>

                  {/* Nav widgets */}
                  <div className="flex gap-2">
                    <button
                      onClick={handlePrev}
                      className="p-2.5 rounded-full bg-stone-950 hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer border border-stone-850"
                      title="Précédent"
                    >
                      <ArrowLeft size={14} />
                    </button>
                    <button
                      onClick={handleNext}
                      className="p-2.5 rounded-full bg-stone-950 hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer border border-stone-850"
                      title="Suivant"
                    >
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

              </motion.div>
            ) : (
              // Write a review collapsible form
              <motion.div
                key="form-pane"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-stone-950 border border-stone-850 rounded-3xl p-6 sm:p-8"
              >
                <AnimatePresence mode="wait">
                  {submitSuccess ? (
                    <motion.div
                      key="success-rv"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-6 space-y-4"
                    >
                      <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 size={24} />
                      </div>
                      <h4 className="font-serif text-lg font-bold text-stone-100">Merci Infiniment !</h4>
                      <p className="text-stone-450 text-xs max-w-sm mx-auto">Votre avis d'exception a été validé et intégré instantanément à notre liste d'or du restaurant.</p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmitReview} className="space-y-4" id="feedback-form">
                      
                      <div className="flex justify-between items-center border-b border-stone-850 pb-3">
                        <h3 className="font-serif text-base sm:text-lg font-bold text-stone-100 flex items-center gap-1.5">
                          <MessageSquareCode size={18} className="text-[#D4AF37]" />
                          Votre Expression Gastronomique
                        </h3>
                        <button
                          type="button"
                          onClick={() => setIsSubmitOpen(false)}
                          className="text-xs text-stone-500 hover:text-stone-300"
                        >
                          Fermer
                        </button>
                      </div>

                      {/* Stars rate input */}
                      <div className="flex items-center gap-3 py-1">
                        <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block">Votre note globale :</span>
                        <div className="flex gap-1.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setRatingInput(star)}
                              className="text-amber-500 hover:scale-110 transition-transform cursor-pointer"
                            >
                              <Star
                                size={18}
                                fill={star <= ratingInput ? '#D4AF37' : 'none'}
                                className="text-[#D4AF37]"
                              />
                            </button>
                          ))}
                        </div>
                        <span className="text-xs font-mono font-bold text-[#D4AF37]">{ratingInput} / 5</span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-stone-450 uppercase tracking-widest font-bold block">Votre nom complet</span>
                        <input
                          type="text"
                          placeholder="Ex: Curtis Kouadio"
                          value={authorName}
                          onChange={(e) => setAuthorName(e.target.value)}
                          className="w-full bg-stone-900 border border-stone-850 px-3.5 py-2.5 rounded-lg text-xs md:text-sm text-stone-200 focus:outline-none focus:border-[#D4AF37]"
                          required
                          id="review-author-field"
                        />
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-stone-450 uppercase tracking-widest font-bold block">Votre Témoignage</span>
                        <textarea
                          placeholder="Ex: Un repas d'exception, l'alloco et la sole braisée ont des notes fumées d'une grande perfection. Le sommelier VIP s'est montré d'une bienveillance royale..."
                          value={commentInput}
                          onChange={(e) => setCommentInput(e.target.value)}
                          rows={3}
                          className="w-full bg-stone-900 border border-stone-850 px-3.5 py-2.5 rounded-lg text-xs md:text-sm text-stone-300 focus:outline-none focus:border-[#D4AF37]"
                          required
                          id="review-comment-field"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#B8902A] text-stone-950 font-bold text-xs uppercase tracking-widest rounded-xl transition-colors cursor-pointer"
                        id="submit-review-action"
                      >
                        Soumettre ma griffe d'or
                      </button>
                    </form>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </section>
  );
}
