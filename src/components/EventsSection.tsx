import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, MapPin, Sparkles, User, Users, CheckCircle2, AlertTriangle, Send } from 'lucide-react';
import { VIPEvent, EventBooking } from '../types';
import { INITIAL_EVENTS } from '../data';

interface EventsSectionProps {
  bookEvent: (booking: Omit<EventBooking, 'id' | 'requestedAt'>) => EventBooking;
}

export default function EventsSection({ bookEvent }: EventsSectionProps) {
  const [events, setEvents] = useState<VIPEvent[]>(INITIAL_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<VIPEvent | null>(INITIAL_EVENTS[0]);

  // Booking fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [guestsCount, setGuestsCount] = useState(2);

  const [bookingSuccess, setBookingSuccess] = useState<EventBooking | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;
    if (!name.trim() || !phone.trim()) {
      setErrorMsg("Veuillez remplir votre nom complet et numéro de téléphone.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    // Simulate luxury webhook
    setTimeout(() => {
      setIsSubmitting(false);
      const booking = bookEvent({
        eventId: selectedEvent.id,
        clientName: name,
        clientPhone: phone,
        clientEmail: email || `${name.toLowerCase().replace(/\s+/g, '')}@example.com`,
        guestsCount
      });

      // Reduce slots
      setEvents((prev) =>
        prev.map((evt) =>
          evt.id === selectedEvent.id
            ? { ...evt, slotsLeft: Math.max(0, evt.slotsLeft - guestsCount) }
            : evt
        )
      );

      setBookingSuccess(booking);
    }, 1500);
  };

  const handleReset = () => {
    setBookingSuccess(null);
    setName('');
    setPhone('');
    setEmail('');
    setGuestsCount(2);
  };

  return (
    <section id="events" className="py-24 bg-stone-950 text-stone-105 relative scroll-mt-24">
      {/* Decorative radial background */}
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Title */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-[#D4AF37] font-sans text-xs tracking-widest uppercase font-semibold block mb-2">Soirées & Privatisations</span>
          <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#FAF9F6] tracking-tight leading-none mb-4">
            Moments VIP & Festivités
          </h2>
          <p className="text-stone-400 text-sm sm:text-base">
            Des concerts d'exception aux mythiques fins de semaine sportifs en passant par nos prestigieuses soirées jazz feutrées. Réservez votre carton d'accès.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Area: VIP Event cards */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] border-b border-stone-850 pb-2 mb-4">Prochains Rendez-vous</h3>
            
            <div className="space-y-5">
              {events.map((evt) => {
                const isSelected = selectedEvent?.id === evt.id;
                return (
                  <div
                    key={evt.id}
                    onClick={() => {
                      setSelectedEvent(evt);
                      setBookingSuccess(null);
                    }}
                    className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row gap-5 cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? 'bg-[#121212] border-[#D4AF37]'
                        : 'bg-stone-900/30 border-stone-850 hover:border-stone-700'
                    }`}
                    id={`event-card-${evt.id}`}
                  >
                    {/* Event image card preview */}
                    <div className="w-full sm:w-44 h-32 rounded-xl overflow-hidden shrink-0">
                      <img
                        src={evt.image}
                        alt={evt.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>

                    {/* Metadata text */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        {/* Categories tags info */}
                        <div className="flex justify-between items-start gap-2 mb-1.5">
                          <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#D4AF37] bg-[#D4AF37]/5 px-2 py-0.5 rounded border border-[#D4AF37]/10">
                            {evt.category}
                          </span>
                          <span className="text-xs font-mono font-bold text-stone-400">{evt.price}</span>
                        </div>
                        
                        <h4 className="font-serif text-lg font-bold text-[#FAF9F6] mb-1">{evt.title}</h4>
                        <p className="text-xs text-stone-450 line-clamp-2 leading-relaxed">{evt.description}</p>
                      </div>

                      {/* Bottom line status bar */}
                      <div className="flex flex-wrap items-center gap-4 text-[11px] text-stone-500 mt-2.5 pt-2 border-t border-stone-850/60 font-mono">
                        <span className="flex items-center gap-1">
                          <Calendar size={11} className="text-[#D4AF37]" />
                          {evt.date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={11} />
                          {evt.time}
                        </span>
                        <span>•</span>
                        <span className="text-amber-500 font-bold">{evt.slotsLeft} places dispo</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Area: Booking Event Invitation Pass */}
          <div className="lg:col-span-5">
            <div className="bg-[#0b0b0b] border border-stone-850 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
              <AnimatePresence mode="wait">
                {bookingSuccess ? (
                  <motion.div
                    key="success-booking-box"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="text-center py-6"
                    id="event-booking-success-ticket"
                  >
                    <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 size={24} />
                    </div>

                    <span className="text-[10px] uppercase tracking-widest font-mono text-[#D4AF37]">Confirmation Reçue</span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-105 mt-1 leading-tight">Réservation Enregistrée !</h3>
                    <p className="text-stone-450 text-xs mt-2 max-w-xs mx-auto">
                      Votre présence VIP est sécurisée pour {selectedEvent?.title}. Un carton d'invitation vous a été réservé.
                    </p>

                    {/* Simulation Invitation Ticket Pass */}
                    <div className="my-6 p-4 rounded-xl border border-dashed border-[#D4AF37]/30 bg-stone-900/60 text-left relative overflow-hidden">
                      <p className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-semibold border-b border-stone-850 pb-2 mb-2 font-mono">
                        🎟️ VIP INVITATION PASS
                      </p>
                      <h4 className="font-serif text-sm font-bold text-white mb-2">{selectedEvent?.title}</h4>
                      
                      <div className="grid grid-cols-2 gap-2 text-[10px] text-stone-400 font-mono">
                        <div>
                          <span>HÔTE PRINCIPAL</span>
                          <p className="font-bold text-stone-250 truncate">{bookingSuccess.clientName}</p>
                        </div>
                        <div>
                          <span>INVITÉS</span>
                          <p className="font-bold text-[#D4AF37]">{bookingSuccess.guestsCount} Invités</p>
                        </div>
                        <div className="mt-2">
                          <span>DATE & HEURE</span>
                          <p className="font-semibold text-stone-300">{selectedEvent?.date}</p>
                        </div>
                        <div className="mt-2">
                          <span>RÉSERVED SUR</span>
                          <p className="text-stone-300">Café Bonne Humeur</p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-stone-800 mt-2 text-center">
                        <span className="text-[9px] font-mono text-stone-500">ID: {bookingSuccess.id}</span>
                      </div>
                    </div>

                    <button
                      onClick={handleReset}
                      className="w-full py-2.5 rounded-lg bg-stone-900 hover:bg-stone-850 border border-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Prendre un autre billet
                    </button>
                  </motion.div>
                ) : selectedEvent ? (
                  <motion.form
                    key="booking-evt-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                    id="booking-event-form"
                  >
                    <div className="border-b border-stone-850 pb-3">
                      <span className="text-[10px] uppercase text-[#D4AF37] font-bold tracking-widest block font-mono">Formulaire d'accès VIP</span>
                      <h4 className="font-serif text-lg font-bold text-[#FAF9F6] mt-0.5">{selectedEvent.title}</h4>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-stone-450 uppercase tracking-widest font-bold block">Votre Nom / Entreprise</span>
                      <input
                        type="text"
                        placeholder="Ex: Curtis Kouadio"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-stone-900 border border-stone-850 px-3.5 py-2.5 rounded-lg text-xs md:text-sm text-stone-200 focus:outline-none focus:border-[#D4AF37]"
                        required
                        id="event-booking-name-field"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] text-stone-450 uppercase tracking-widest font-bold block">Mobile</span>
                        <input
                          type="tel"
                          placeholder="Ex: 07 16 19 56 99"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-stone-900 border border-stone-850 px-3.5 py-2.5 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-[#D4AF37]"
                          required
                          id="event-booking-phone-field"
                        />
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-stone-450 uppercase tracking-widest font-bold block">Couverts requis</span>
                        <select
                          value={guestsCount}
                          onChange={(e) => setGuestsCount(parseInt(e.target.value))}
                          className="w-full bg-stone-900 border border-stone-850 px-3.5 py-2.5 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-[#D4AF37]"
                        >
                          {[1, 2, 3, 4, 5, 6, 8, 10, 15].map((num) => (
                            <option key={num} value={num} className="bg-stone-950 text-stone-300">
                              {num} {num === 1 ? 'Personne' : 'Personnes'}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-stone-450 uppercase tracking-widest font-bold block">Adresse Email</span>
                      <input
                        type="email"
                        placeholder="Ex: curtis@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-stone-900 border border-stone-850 px-3.5 py-2.5 rounded-lg text-xs text-stone-300 focus:outline-none focus:border-[#D4AF37]"
                        id="event-booking-email-field"
                      />
                    </div>

                    {errorMsg && (
                      <div className="p-3 bg-red-950/40 border border-red-500/30 text-xs text-red-300 flex items-start gap-1.5 rounded-lg">
                        <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting || selectedEvent.slotsLeft <= 0}
                      className="w-full py-3 bg-[#D4AF37] hover:bg-[#B8902A] text-stone-950 font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 shadow-lg cursor-pointer"
                      id="action-book-event"
                    >
                      {isSubmitting ? 'Réservation en cours...' : 'Réserver mon Accès Privilège'}
                    </button>
                    
                    <p className="text-[10px] text-stone-500 text-center leading-relaxed">
                      Remarque : Un sms d'attribution vous parviendra. Pour toute modification ou annulation d'événement, veuillez contacter le +225 07 16 19 56 99.
                    </p>
                  </motion.form>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-xs text-stone-500">Sélectionnez une date d'événement à gauche pour réserver votre carton.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
