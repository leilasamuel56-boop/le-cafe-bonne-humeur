import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar as CalendarIcon, Clock, Users, MapPin, CheckCircle2, AlertTriangle, ArrowRight, NotebookPen, Phone, Send } from 'lucide-react';
import { ZoneType, Reservation } from '../types';

interface ReservationSectionProps {
  createReservation: (rData: Omit<Reservation, 'id' | 'status' | 'requestedAt'>) => Reservation;
}

export default function ReservationSection({ createReservation }: ReservationSectionProps) {
  const [date, setDate] = useState<string>('2026-06-08');
  const [time, setTime] = useState<string>('20:00');
  const [guests, setGuests] = useState<number>(2);
  const [zone, setZone] = useState<ZoneType>('salle');

  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const [bookedTicket, setBookedTicket] = useState<Reservation | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isError, setIsError] = useState<string | null>(null);

  // Simulated capacities left for this specific request
  const capacitiesLeft = useMemo(() => {
    // Generate simple seed values depending on zone and hour
    const seed = (parseInt(time.split(':')[0]) || 20) + guests + zone.length;
    const tablesLeft = (seed % 5) + 1; // 1 to 5 tables left
    return tablesLeft;
  }, [date, time, guests, zone]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setIsError("Veuillez saisir votre nom complet.");
      return;
    }
    if (!phone.trim()) {
      setIsError("Veuillez renseigner votre numéro de téléphone.");
      return;
    }

    setIsError(null);
    setIsVerifying(true);

    // Simulate luxury API verification
    setTimeout(() => {
      setIsVerifying(false);

      if (zone === 'vip' && guests > 10) {
        setIsError("Le Lounge VIP accepte un maximum de 10 personnes par réservation standard. Pour des événements plus importants, veuillez utiliser l'Espace Événements ci-dessous ou nous appeler directement.");
        return;
      }

      const ticket = createReservation({
        date,
        time,
        guests,
        zone,
        clientName: name,
        clientPhone: phone,
        clientEmail: email || `${name.toLowerCase().replace(/\s+/g, '')}@example.com`,
      });

      setBookedTicket(ticket);

      const zoneName = zone === 'vip' ? 'Lounge VIP Impérial' : zone === 'terrasse' ? 'Terrasse Plein Air' : 'Salle Classique';
      const formattedDate = new Date(date).toLocaleDateString('fr-FR');
      
      const whatsappMessage = `Confirmation de Réservation - Le Panier Gourmet

Numéro du client : ${phone}
Nom du client : ${name}
Adresse e-mail : ${email || 'Non renseignée'}
Date : ${formattedDate}
Heure : ${time}
Nombre de personnes : ${guests}
Espace choisi : ${zoneName}`;

      const whatsappUrl = `https://wa.me/2250716195699?text=${encodeURIComponent(whatsappMessage)}`;
      
      try {
        window.open(whatsappUrl, '_blank');
      } catch (e) {
        window.location.href = whatsappUrl;
      }
    }, 1200);
  };

  const handleReset = () => {
    setBookedTicket(null);
    setName('');
    setPhone('');
    setEmail('');
  };

  const zonesMeta = [
    {
      id: 'salle' as ZoneType,
      title: 'Salle Classique',
      desc: 'Climatisée, feutrée, musique d\'ambiance douce pour repas conviviaux.',
      multiplier: 1,
      tag: 'Idéal dîner d\'affaires'
    },
    {
      id: 'terrasse' as ZoneType,
      title: 'Terrasse Plein Air',
      desc: 'Brumisateurs de fraîcheur, vue sur le boulevard illuminé, bercé par le vent.',
      multiplier: 1.2,
      tag: 'Le plus populaire'
    },
    {
      id: 'vip' as ZoneType,
      title: 'Lounge VIP Impérial',
      desc: 'Privilèges haut de gamme, mobilier en cuir, service sommelier dédié, cigares fins.',
      multiplier: 2,
      tag: 'Expérience d\'exception'
    }
  ];

  const timeSlots = [
    '12:00', '13:00', '14:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '23:00'
  ];

  // Simulating an offline WhatsApp notification preview
  const whatsappPreviewText = useMemo(() => {
    if (!bookedTicket) return '';
    const zoneName = bookedTicket.zone === 'vip' ? 'Lounge VIP Impérial' : bookedTicket.zone === 'terrasse' ? 'Terrasse Plein Air' : 'Salle Classique';
    const formattedDate = new Date(bookedTicket.date).toLocaleDateString('fr-FR');
    return `Confirmation de Réservation - Le Panier Gourmet

Numéro du client : ${bookedTicket.clientPhone}
Nom du client : ${bookedTicket.clientName}
Adresse e-mail : ${bookedTicket.clientEmail || 'Non renseignée'}
Date : ${formattedDate}
Heure : ${bookedTicket.time}
Nombre de personnes : ${bookedTicket.guests}
Espace choisi : ${zoneName}`;
  }, [bookedTicket]);

  return (
    <section id="reservation" className="py-24 bg-stone-950 text-stone-100 relative scroll-mt-24">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Text and information Column */}
          <div>
            <span className="text-[#D4AF37] font-sans text-xs tracking-widest uppercase font-semibold block mb-2">Réservation Immédiate</span>
            <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#FAF9F6] tracking-tight leading-none mb-6">
              Assurez votre Table
            </h2>
            <p className="text-stone-400 text-sm sm:text-base leading-relaxed mb-8">
              Évitez les files d'attente et sécurisez votre table instantanément. Notre plateforme intelligente gère l'attribution de nos différents espaces pour vous proposer l'expérience la plus mémorable de Yamoussoukro.
            </p>

            {/* Quick benefits */}
            <div className="space-y-4 mb-8">
              <div className="flex gap-4 items-start p-4 rounded-xl bg-stone-900/40 border border-stone-800">
                <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-[#FAF9F6]">Confirmation par SMS & WhatsApp</h4>
                  <p className="text-xs text-stone-400">Recevez un récapitulatif instantané de votre validation par canal officiel.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-4 rounded-xl bg-stone-900/40 border border-stone-800">
                <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-[#FAF9F6]">Maintien de table de 30 minutes</h4>
                  <p className="text-xs text-stone-400">Nous protégeons votre table en cas de léger imprévu de circulation routière.</p>
                </div>
              </div>
            </div>

            {/* Immediate call button */}
            <div className="p-5 border border-stone-800 rounded-xl bg-stone-900/20 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <p className="text-xs text-[#D4AF37] font-mono uppercase tracking-widest">Besoin d'aide immédiate ?</p>
                <p className="text-sm text-stone-300">Notre hotline conciergerie VIP est ouverte 7j/7.</p>
              </div>
              <a
                href="tel:+2250716195699"
                className="px-5 py-2.5 rounded-lg bg-stone-900 border border-stone-700 hover:border-[#D4AF37] text-stone-200 transition-colors flex items-center gap-2 text-xs uppercase tracking-wider font-bold"
              >
                <Phone size={14} className="text-[#D4AF37]" /> Call 07 16 19 56 99
              </a>
            </div>
          </div>

          {/* Form and Ticket Column */}
          <div className="bg-[#0c0c0c] border border-stone-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            <AnimatePresence mode="wait">
              {!bookedTicket ? (
                <motion.form
                  key="reservation-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  id="table-booking-form"
                >
                  <div className="flex items-center gap-2 pb-4 border-b border-stone-800">
                    <NotebookPen className="text-[#D4AF37]" size={20} />
                    <h3 className="font-serif text-lg sm:text-xl font-bold">Formulaire Haute Conciergerie</h3>
                  </div>

                  {/* Date, Time, guests */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-stone-400 uppercase tracking-widest font-semibold block">Date choisie</label>
                      <div className="relative">
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full bg-stone-900/60 border border-stone-800 px-3 py-2.5 rounded-lg text-xs md:text-sm text-stone-200 focus:border-[#D4AF37] focus:outline-none"
                          min="2026-06-07"
                          required
                          id="booking-date"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-stone-400 uppercase tracking-widest font-semibold block">Créneau Horaire</label>
                      <select
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full bg-stone-900/60 border border-stone-800 px-3 py-2.5 rounded-lg text-xs md:text-sm text-stone-200 focus:border-[#D4AF37] focus:outline-none"
                        id="booking-time"
                      >
                        {timeSlots.map((ts) => (
                          <option key={ts} value={ts} className="bg-stone-950 text-stone-300">{ts}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-stone-400 uppercase tracking-widest font-semibold block">Nombre d'invités</label>
                      <select
                        value={guests}
                        onChange={(e) => setGuests(parseInt(e.target.value))}
                        className="w-full bg-stone-900/60 border border-stone-800 px-3 py-2.5 rounded-lg text-xs md:text-sm text-stone-200 focus:border-[#D4AF37] focus:outline-none"
                        id="booking-guests"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15].map((num) => (
                          <option key={num} value={num} className="bg-stone-950 text-stone-300">
                            {num} {num === 1 ? 'Couverte' : 'Couverts'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Custom Zone select slider */}
                  <div className="space-y-2">
                    <label className="text-[10px] text-stone-400 uppercase tracking-widest font-semibold block">Sélectionnez votre Expérience de Zone</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {zonesMeta.map((zo) => (
                        <button
                          key={zo.id}
                          type="button"
                          onClick={() => setZone(zo.id)}
                          className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all duration-300 cursor-pointer ${
                            zone === zo.id
                              ? 'bg-[#D4AF37]/5 border-[#D4AF37] text-stone-100 shadow-[#D4AF37]/5 shadow-md'
                              : 'bg-stone-900/40 border-stone-850 text-stone-400 hover:border-stone-700 hover:text-[#FAF9F6]'
                          }`}
                          id={`booking-zone-tab-${zo.id}`}
                        >
                          <div>
                            <span className="text-[9px] uppercase font-bold text-[#D4AF37] block tracking-wide">{zo.tag}</span>
                            <h4 className="font-serif text-sm font-bold mt-1 text-[#FAF9F6]">{zo.title}</h4>
                          </div>
                          <p className="text-[10px] leading-tight mt-1.5 text-stone-400 text-stone-500 line-clamp-2">{zo.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Availability badge indicator */}
                  <div className="p-3.5 bg-stone-900/60 rounded-xl border border-stone-800/80 flex items-center justify-between text-xs my-2">
                    <span className="text-stone-400">Vérification de table pour ce créneau:</span>
                    <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Disponibilité validée ({capacitiesLeft} tables prêtes)
                    </span>
                  </div>

                  {/* Customer Information Contacts */}
                  <div className="space-y-3.5">
                    <div className="space-y-1">
                      <label className="text-[10px] text-stone-400 uppercase tracking-widest font-semibold block">Votre nom complet</label>
                      <input
                        type="text"
                        placeholder="Ex: Curtis Kouadio"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-stone-900/50 border border-stone-800 px-4 py-2.5 rounded-lg text-sm text-stone-200 focus:border-[#D4AF37] focus:outline-none"
                        required
                        id="booking-name-input"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-stone-400 uppercase tracking-widest font-semibold block">Téléphone mobile</label>
                        <input
                          type="tel"
                          placeholder="Ex: 07 16 19 56 99"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-stone-900/50 border border-stone-800 px-4 py-2.5 rounded-lg text-sm text-stone-200 focus:border-[#D4AF37] focus:outline-none"
                          required
                          id="booking-phone-input"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-stone-400 uppercase tracking-widest font-semibold block">Adresse Email (Envoi de reçu)</label>
                        <input
                          type="email"
                          placeholder="Ex: curtis@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-[#121212] border border-stone-800 px-4 py-2.5 rounded-lg text-sm text-stone-200 focus:border-[#D4AF37] focus:outline-none"
                          id="booking-email-input"
                        />
                      </div>
                    </div>
                  </div>

                  {isError && (
                    <div className="p-3.5 rounded-lg bg-red-950/40 border border-red-500/30 text-xs text-red-300 flex items-start gap-2">
                      <AlertTriangle size={15} className="shrink-0 mt-0.5" />
                      <span>{isError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="w-full py-3.5 rounded-xl bg-[#D4AF37] hover:bg-[#B8902A] disabled:bg-[#D4AF37]/50 text-[#050505] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-[#D4AF37]/5 transition-all duration-300 cursor-pointer"
                    id="submit-booking-action"
                  >
                    {isVerifying ? (
                      <>
                        <span className="w-4 h-4 border-2 border-[#050505] border-t-transparent rounded-full animate-spin" />
                        Vérification Haute Performance...
                      </>
                    ) : (
                      <>
                        Garantir ma Réservation
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="reservation-success"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="text-center p-3"
                  id="checkout-ticket-success"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={32} />
                  </div>

                  <span className="text-[10px] uppercase tracking-widest font-mono text-[#D4AF37] font-bold">Réservation Confiée</span>
                  <h3 className="font-serif text-2xl sm:text-3.5xl font-extrabold text-[#FAF9F6] mt-1 mb-2">Table Validée !</h3>
                  <p className="text-stone-400 text-xs sm:text-sm max-w-sm mx-auto mb-6">
                    Un sommelier s'occupe de dresser votre table et de préparer l'accueil. Votre reçu numérique est prêt.
                  </p>

                  {/* Simulated High-end Boarding pass */}
                  <div className="p-5 bg-stone-900 border border-[#D4AF37]/20 border-dashed rounded-2xl text-left font-sans max-w-sm mx-auto relative overflow-hidden mb-6">
                    <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-[#0c0c0c]" />
                    <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-[#0c0c0c]" />
                    <div className="absolute -bottom-3 -left-3 w-6 h-6 rounded-full bg-[#0c0c0c]" />
                    <div className="absolute -bottom-3 -right-3 w-6 h-6 rounded-full bg-[#0c0c0c]" />
                    
                    <div className="flex justify-between items-center text-[10px] text-stone-500 uppercase tracking-widest border-b border-stone-850 pb-3 mb-3">
                      <span>L'Expérience Bonne Humeur</span>
                      <span className="font-bold font-mono text-[#D4AF37]">{bookedTicket.id}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs pb-3 mb-3 border-b border-stone-850">
                      <div>
                        <span className="text-stone-500 block text-[9px] uppercase tracking-wider">Hôte</span>
                        <span className="font-bold text-[#FAF9F6] truncate block">{bookedTicket.clientName}</span>
                      </div>
                      <div>
                        <span className="text-stone-500 block text-[9px] uppercase tracking-wider">Téléphone</span>
                        <span className="font-semibold text-stone-300 font-mono block">{bookedTicket.clientPhone}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-stone-500 block text-[9px] uppercase tracking-wider">Date</span>
                        <span className="font-bold text-stone-200 block">{new Date(bookedTicket.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}</span>
                      </div>
                      <div>
                        <span className="text-stone-500 block text-[9px] uppercase tracking-wider">Créneau</span>
                        <span className="font-bold text-stone-200 block">{bookedTicket.time}</span>
                      </div>
                      <div>
                        <span className="text-stone-500 block text-[9px] uppercase tracking-wider">Nbre</span>
                        <span className="font-bold text-[#D4AF37] block">{bookedTicket.guests} pers.</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-stone-850 mt-3 flex justify-between items-center">
                      <span className="text-[10px] text-stone-400 capitalize">Espace : <strong className="text-stone-200">{bookedTicket.zone === 'vip' ? 'Lounge VIP' : bookedTicket.zone === 'terrasse' ? 'Terrasse' : 'Salle'}</strong></span>
                      <span className="bg-yellow-500/10 text-[#D4AF37] border border-[#D4AF37]/30 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded">Status: Confirmé</span>
                    </div>
                  </div>

                  {/* Action sharing triggers */}
                  <div className="flex flex-col gap-3 max-w-sm mx-auto">
                    <a
                      href={`https://wa.me/2250716195699?text=${encodeURIComponent(whatsappPreviewText)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Send size={14} />
                      Confirmer via WhatsApp (+225)
                    </a>
                    <button
                      onClick={handleReset}
                      className="px-5 py-3 rounded-xl border border-stone-800 hover:border-stone-600 text-stone-400 hover:text-stone-200 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Prendre une autre réservation
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
