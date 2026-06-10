import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Zap, Gift, ShieldCheck, Heart, UserPlus, LogOut, CheckCircle, Smartphone } from 'lucide-react';
import { LoyaltyAccount } from '../types';

interface LoyaltySectionProps {
  loyaltyAccount: LoyaltyAccount | null;
  handleLoyaltySignup: (name: string, phone: string, email: string, birthday: string) => LoyaltyAccount;
  logoutLoyalty: () => void;
}

export default function LoyaltySection({
  loyaltyAccount,
  handleLoyaltySignup,
  logoutLoyalty
}: LoyaltySectionProps) {
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [birthdayInput, setBirthdayInput] = useState('1998-05-18');
  const [showSignup, setShowSignup] = useState(false);
  const [claimedReward, setClaimedReward] = useState<string | null>(null);

  const levelInfo = useMemo(() => {
    if (!loyaltyAccount) return null;
    const current = loyaltyAccount.level;
    const points = loyaltyAccount.points;

    if (current === 'gold') {
      return {
        name: 'Club Or Impérial',
        color: 'from-[#D4AF37] via-[#F3E5AB] to-[#AA7C11]',
        iconColor: 'text-[#D4AF37]',
        bg: 'bg-gradient-to-br from-stone-900 to-stone-950',
        nextTier: null,
        privileges: [
          'Priorité 100% absolue lors des réservations Lounge VIP',
          '20% de remise automatique sur toute commande en ligne',
          'Un sommelier offert lors des dîners de plus de 4 personnes',
          'Couverts en argent personnalisés lors de vos passages',
          'Bouteille de champagne offerte le jour de votre anniversaire'
        ]
      };
    } else if (current === 'silver') {
      return {
        name: 'Club Argent Prestige',
        color: 'from-[#e2e8f0] via-[#cbd5e1] to-[#94a3b8]',
        iconColor: 'text-stone-300',
        bg: 'bg-gradient-to-br from-[#12141c] to-[#07080c]',
        nextTier: { name: 'Or Impérial', pointsLeft: 3000 - points },
        privileges: [
          '15% de remise sur toute commande en ligne',
          'Réservation facilitée de canapé VIP le week-end',
          'Cocktail signature offert lors de chaque passage en salle',
          'Dessert au choix offert le jour de votre anniversaire'
        ]
      };
    } else {
      return {
        name: 'Club Bronze Privilège',
        color: 'from-[#b45309] via-[#d97706] to-[#78350f]',
        iconColor: 'text-amber-600',
        bg: 'bg-gradient-to-br from-[#0c0c0c] to-[#121212]',
        nextTier: { name: 'Argent Prestige', pointsLeft: 1000 - points },
        privileges: [
          '10% de remise sur votre première commande en en ligne',
          'Accumulation de points (1 pnt pour 1000 F dépensés)',
          'Invitations exclusives aux lancements de nouvelles cartes',
          'Cocktail de bienvenue offert à votre anniversaire'
        ]
      };
    }
  }, [loyaltyAccount]);

  // Form submit
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !phoneInput.trim()) return;

    handleLoyaltySignup(nameInput, phoneInput, emailInput, birthdayInput);
    setNameInput('');
    setPhoneInput('');
    setEmailInput('');
  };

  const handleClaim = (rewardName: string, pointCost: number) => {
    if (!loyaltyAccount) return;
    if (loyaltyAccount.points < pointCost) {
      alert("Points insuffisants pour débloquer cette récompense.");
      return;
    }
    // Simulate deduction code
    setClaimedReward(rewardName);
    setTimeout(() => {
      setClaimedReward(null);
    }, 4000);
  };

  const rewardsList = [
    { name: 'Cocktail Signature "Golden Royale" Offert', pointsCost: 350, description: 'Dégustez notre cocktail somptueux pailleté d\'or fin.' },
    { name: 'Kédjénou de Poulet offert', pointsCost: 800, description: 'Un authentique Kédjénou mijoté au canari traditionnel.' },
    { name: 'Réduction de 15 000 FCFA sur facture', pointsCost: 1200, description: 'Bon d\'achat direct déductible sur votre addition globale.' }
  ];

  return (
    <section id="loyalty" className="py-24 px-4 bg-stone-900/20 max-w-7xl mx-auto scroll-mt-24">
      {/* Head */}
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <span className="text-[#D4AF37] font-sans text-xs tracking-widest uppercase font-semibold block mb-2">Fidélité Reconnue</span>
        <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#FAF9F6] tracking-tight leading-none mb-4">
          Le Club d'Exception
        </h2>
        <p className="text-stone-450 text-sm sm:text-base">
          Gagnez des points à chaque instant et accédez à des privilèges confidentiels réservés à nos convives VIP de Yamoussoukro. Enregistrement instantané gratuit.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Dynamic Tier Card Graphic */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {loyaltyAccount && levelInfo ? (
              <motion.div
                key="logged-card"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6 flex-1 flex flex-col justify-between"
              >
                {/* Premium Loyal Card Representation */}
                <div className={`p-6 sm:p-8 rounded-3xl ${levelInfo.bg} border border-[#D4AF37]/35 relative overflow-hidden shadow-2xl flex flex-col justify-between min-h-[260px] border-glow-gold`}>
                  
                  {/* Card shiny effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FAF9F6]/5 to-transparent -translate-x-full animate-[shimmer_5s_infinite] pointer-events-none" />
                  
                  {/* Card head layout */}
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] tracking-widest uppercase text-stone-400 font-mono">Carte de Fidélité Digitale</span>
                      <h4 className="font-serif text-lg sm:text-2xl font-black text-[#FAF9F6] uppercase tracking-tight mt-1">{loyaltyAccount.clientName}</h4>
                      <p className="text-xs text-stone-500 font-mono mt-0.5">{loyaltyAccount.clientPhone}</p>
                    </div>

                    {/* Tier badge representation */}
                    <div className={`px-3 py-1.5 rounded-xl bg-gradient-to-r ${levelInfo.color} text-[#050505] text-xs font-black tracking-widest uppercase shadow-md flex items-center gap-1`}>
                      <Award size={14} />
                      {loyaltyAccount.level}
                    </div>
                  </div>

                  {/* QR simulation */}
                  <div className="flex justify-between items-end mt-8 pt-4 border-t border-stone-850">
                    <div>
                      <div className="flex items-center gap-1 text-xs text-stone-400 font-medium font-mono">
                        <Zap size={13} className="text-[#D4AF37] animate-pulse" />
                        <span>Balance de points</span>
                      </div>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-3xl sm:text-4.5xl font-extrabold font-serif text-[#D4AF37] leading-none">{loyaltyAccount.points}</span>
                        <span className="text-stone-500 text-xs font-semibold">Points GAGNÉS</span>
                      </div>
                      
                      {/* Subtitle helper */}
                      <p className="text-[10px] text-stone-400 mt-2 max-w-xs">{levelInfo.name} — Membre depuis {loyaltyAccount.joinDate}</p>
                    </div>

                    {/* Fake barcode simulation for luxury check in */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="bg-[#FAF9F6] p-2.5 rounded-lg shadow-inner">
                        <Smartphone size={24} className="text-stone-900" />
                      </div>
                      <span className="text-[9px] font-mono text-stone-500">Scan Privé</span>
                    </div>
                  </div>
                </div>

                {/* Progress bar info */}
                {levelInfo.nextTier && (
                  <div className="p-4 bg-[#0A0A0A]/60 rounded-2xl border border-stone-850 shadow-inner">
                    <div className="flex justify-between items-center text-xs text-stone-400 mb-2">
                      <span>Prochain palier: <strong>Club {levelInfo.nextTier.name}</strong></span>
                      <span className="font-semibold text-[#D4AF37]">{levelInfo.nextTier.pointsLeft} pts restants</span>
                    </div>
                    <div className="w-full h-2 bg-stone-900 rounded-full overflow-hidden">
                      {/* Calculate percentage to next tier. bronze needs up to 1000, silver up to 3000 */}
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (loyaltyAccount.points / (loyaltyAccount.level === 'bronze' ? 10 : 30)))}%` }}
                        className="h-full bg-gradient-to-r from-[#D4AF37] to-[#B8902A]"
                      />
                    </div>
                  </div>
                )}

                {/* Privilege card detail list */}
                <div className="bg-stone-950 p-6 rounded-2xl border border-stone-850">
                  <h4 className="text-xs font-semibold uppercase text-stone-400 tracking-widest mb-4 flex items-center gap-1.5">
                    <ShieldCheck size={16} className="text-emerald-500" />
                    Vos Privilèges en Cours ({levelInfo.name})
                  </h4>
                  <ul className="space-y-3">
                    {levelInfo.privileges.map((priv, idx) => (
                      <li key={idx} className="flex gap-2.5 items-start text-xs text-stone-300">
                        <span className="text-[#D4AF37] font-bold">✦</span>
                        <span>{priv}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-5 border-t border-stone-850 mt-5 flex justify-between items-center">
                    <div className="flex items-center gap-1.5 text-xs text-stone-400">
                      <Gift size={15} className="text-pink-500" />
                      <span>Anniversaire le : <strong>{new Date(loyaltyAccount.birthday).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</strong></span>
                    </div>
                    <button
                      onClick={logoutLoyalty}
                      className="text-[10px] text-stone-500 hover:text-red-400 uppercase font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <LogOut size={12} /> Se Déconnecter
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="unlogged-banner"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Visual advertising card */}
                <div className="p-8 rounded-3xl bg-gradient-to-br from-[#121212] to-black border border-stone-850 text-left relative overflow-hidden shadow-2xl min-h-[220px] flex flex-col justify-between">
                  <div className="absolute top-4 right-4 w-28 h-28 bg-[#D4AF37]/5 rounded-full blur-xl pointer-events-none" />
                  
                  <div>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[#D4AF37] block">Avantages exclusives</span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#FAF9F6] mt-1">Épargnez, Savourez, Soyez Récompensé</h3>
                    <p className="text-stone-400 text-xs sm:text-sm mt-3 leading-relaxed max-w-md">
                      Amateurs de gastronomie, rejoignez le Club Fidélité et commencez avec un cadeau gratuit de <strong className="text-[#D4AF37]">100 points de bienvenue</strong> à l'inscription.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-6 border-t border-stone-850">
                    <div className="text-center sm:text-left">
                      <span className="text-stone-500 block text-[9px] uppercase tracking-widest">Niveau 1</span>
                      <strong className="text-stone-300 text-xs uppercase block">🥉 Bronze</strong>
                    </div>
                    <div className="text-center sm:text-left">
                      <span className="text-stone-500 block text-[9px] uppercase tracking-widest">Niveau 2</span>
                      <strong className="text-stone-200 text-xs uppercase block">🥈 Argent</strong>
                    </div>
                    <div className="text-center sm:text-left">
                      <span className="text-stone-500 block text-[9px] uppercase tracking-widest">Niveau 3</span>
                      <strong className="text-[#D4AF37] text-xs uppercase block">👑 Or Impérial</strong>
                    </div>
                  </div>
                </div>

                {/* Privileges recap box */}
                <div className="p-6 rounded-2xl bg-stone-950 border border-stone-850 space-y-4">
                  <h4 className="text-xs uppercase font-bold tracking-widest text-stone-400">Pourquoi rejoindre le club :</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex gap-2 items-start text-xs text-stone-300">
                      <Gift size={14} className="text-[#D4AF37] shrink-0 mt-0.5" />
                      <span>Nectars signatures et desserts offerts lors de votre anniversaire de naissance.</span>
                    </div>
                    <div className="flex gap-2 items-start text-xs text-stone-300">
                      <Zap size={14} className="text-[#D4AF37] shrink-0 mt-0.5" />
                      <span>Accès prioritaire à notre conciergerie VIP pour garantir des salons privatifs.</span>
                    </div>
                    <div className="flex gap-2 items-start text-xs text-stone-300">
                      <Award size={14} className="text-[#D4AF37] shrink-0 mt-0.5" />
                      <span>Jusqu'à 20% de remise sur les validations de commande en ligne.</span>
                    </div>
                    <div className="flex gap-2 items-start text-xs text-stone-300">
                      <Heart size={14} className="text-[#D4AF37] shrink-0 mt-0.5" />
                      <span>Invitations privilégiées à nos soirées secrètes acoustiques et VIP.</span>
                    </div>
                  </div>

                  <div className="pt-2 text-center">
                    <button
                      onClick={() => setShowSignup(!showSignup)}
                      className="px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-850 text-stone-200 border border-[#D4AF37]/30 text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                      id="loyalty-signup-trigger"
                    >
                      <UserPlus size={14} />
                      Créer mon Profil Fidélité (Gratuit)
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: Interactive Forms to Register or Claim Rewards */}
        <div className="lg:col-span-5 flex">
          <div className="bg-[#0A0A0A] border border-stone-850 rounded-3xl p-6 sm:p-8 flex-1 flex flex-col justify-center relative shadow-xl">
            <AnimatePresence mode="wait">
              {showSignup && !loyaltyAccount ? (
                <motion.form
                  key="reg-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleRegister}
                  className="space-y-4"
                  id="loyalty-signup-form"
                >
                  <div className="border-b border-stone-850 pb-4 mb-2 flex justify-between items-center">
                    <h3 className="font-serif text-lg font-bold text-stone-100 flex items-center gap-2">
                      <Award size={18} className="text-[#D4AF37]" />
                      Adhésion Club Privé
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowSignup(false)}
                      className="text-xs text-stone-500 hover:text-stone-300 font-bold"
                    >
                      Annuler
                    </button>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-stone-400 font-bold uppercase block tracking-wider">Votre Nom Prénom</span>
                    <input
                      type="text"
                      placeholder="Ex: Curtis Kouadio"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-850 px-4 py-2.5 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-[#D4AF37]"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-stone-400 font-bold uppercase block tracking-wider">Téléphone Mobile</span>
                    <input
                      type="tel"
                      placeholder="Ex: 01 41 92 33 96"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-850 px-4 py-2.5 rounded-lg text-xs text-stone-250 font-mono focus:outline-none focus:border-[#D4AF37]"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-stone-400 font-bold uppercase block tracking-wider">Adresse Email (Reçu)</span>
                    <input
                      type="email"
                      placeholder="Ex: curtis@example.com"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-850 px-4 py-2.5 rounded-lg text-xs text-stone-300 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-stone-400 font-bold uppercase block tracking-wider">Date d'Anniversaire (Cadeau Royal)</span>
                    <input
                      type="date"
                      value={birthdayInput}
                      onChange={(e) => setBirthdayInput(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-850 px-4 py-2.5 rounded-lg text-xs text-stone-300 focus:outline-none focus:border-[#D4AF37]"
                      required
                    />
                    <p className="text-[9px] text-stone-600 mt-1">Nous l'enquêtons pour vous surprendre le jour J !</p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#D4AF37] hover:bg-[#B8902A] text-stone-950 font-semibold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer"
                    id="loyalty-signup-action-btn"
                  >
                    Activer mon Compte +100 Points Offerts
                  </button>
                </motion.form>
              ) : loyaltyAccount ? (
                // Logged in: Unlock rewards area
                <motion.div
                  key="rewards-hub"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-5"
                >
                  <div className="border-b border-stone-850 pb-3 flex justify-between items-center">
                    <h3 className="font-serif text-lg font-bold text-[#FAF9F6]">Boutique Cadeaux</h3>
                    <span className="text-[10px] bg-stone-900 px-2.5 py-1 rounded border border-stone-800 text-[#D4AF37] font-mono">{loyaltyAccount.points} Pts</span>
                  </div>

                  {claimedReward && (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-center text-xs text-emerald-400 space-y-1"
                    >
                      <CheckCircle className="mx-auto text-emerald-400 mb-1" size={18} />
                      <p className="font-bold">Déblocage réussi !</p>
                      <p className="text-[11px] text-stone-300">Votre coupon cadeau <strong className="text-white">REWARD-{Math.floor(100+Math.random()*900)}</strong> a été ajouté à votre profil et copié.</p>
                    </motion.div>
                  )}

                  <div className="space-y-3.5">
                    {rewardsList.map((reward, i) => {
                      const canClaim = loyaltyAccount.points >= reward.pointsCost;
                      return (
                        <div
                          key={i}
                          className={`p-3.5 rounded-xl border transition-all duration-300 ${
                            canClaim
                              ? 'bg-stone-900/60 border-stone-800 hover:border-[#D4AF37]/30'
                              : 'bg-stone-955/20 border-stone-900 opacity-60'
                          }`}
                        >
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <h4 className={`text-xs font-bold ${canClaim ? 'text-[#FAF9F6]' : 'text-stone-500'}`}>{reward.name}</h4>
                              <p className="text-[10px] text-stone-500 leading-tight mt-1">{reward.description}</p>
                            </div>
                            <span className="text-xs font-bold font-mono text-[#D4AF37] whitespace-nowrap bg-[#D4AF37]/5 px-2 py-0.5 rounded border border-[#D4AF37]/10">
                              {reward.pointsCost} PTS
                            </span>
                          </div>

                          <div className="flex justify-between items-center pt-2.5 mt-2.5 border-t border-stone-850 pl-1">
                            <span className="text-[8px] uppercase text-stone-600 tracking-wider">Cadeau exclusif</span>
                            <button
                              disabled={!canClaim}
                              onClick={() => handleClaim(reward.name, reward.pointsCost)}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase cursor-pointer transition-colors ${
                                canClaim
                                  ? 'bg-[#D4AF37]/10 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-[#050505] border border-[#D4AF37]/35'
                                  : 'bg-stone-900 text-stone-600 border border-stone-850'
                              }`}
                            >
                              Débloquer
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              ) : (
                // Unlogged default view (Shows some nice quotes / info, and clickable trigger)
                <motion.div
                  key="default-hub"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6 text-center"
                >
                  <div className="w-14 h-14 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/35 text-[#D4AF37] flex items-center justify-center mx-auto">
                    <Award size={28} className="animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-stone-200">Rejoindre la Communauté</h3>
                    <p className="text-stone-500 text-xs mt-2.5 leading-relaxed max-w-xs mx-auto">
                      Une inscription d'une minute suffit pour commencer à accumuler de l'éclat à Yamoussoukro et débloquer notre carte secrète.
                    </p>
                  </div>

                  <hr className="border-stone-850" />

                  <button
                    onClick={() => setShowSignup(true)}
                    className="w-full py-3.5 bg-stone-900 hover:bg-stone-850 text-stone-200 border border-[#D4AF37]/50 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg shadow-[#D4AF37]/5"
                    id="signup-initial-btn"
                  >
                    Demander ma Carte Premium
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
}
