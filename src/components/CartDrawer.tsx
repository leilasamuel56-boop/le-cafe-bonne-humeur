import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Plus, Minus, Trash2, MapPin, Bike, Store, Ticket, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { CartItem, MenuItem, Promotion, Order } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  appliedPromo: Promotion | null;
  deliveryType: 'livraison' | 'retrait';
  deliveryAddress: string;
  setDeliveryType: (type: 'livraison' | 'retrait') => void;
  setDeliveryAddress: (address: string) => void;
  updateCartQuantity: (itemId: string, qty: number) => void;
  removeFromCart: (itemId: string) => void;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  checkout: (phone: string, name: string, email?: string) => Order | null;
  orders: Order[];
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  appliedPromo,
  deliveryType,
  deliveryAddress,
  setDeliveryType,
  setDeliveryAddress,
  updateCartQuantity,
  removeFromCart,
  applyPromoCode,
  checkout,
  orders
}: CartDrawerProps) {
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoSuccess, setPromoSuccess] = useState<string | null>(null);

  // Address and contact details
  const [customerName, setCustomerName] = useState('Curtis Kouadio');
  const [customerPhone, setCustomerPhone] = useState('07 16 19 56 99');
  const [customerEmail, setCustomerEmail] = useState('kouadiocurtis24@gmail.com');

  // Interactive checkout steps
  const [activeStep, setActiveStep] = useState<'cart' | 'checkout' | 'tracking'>('cart');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [currentTrackedOrder, setCurrentTrackedOrder] = useState<Order | null>(null);

  const cartTotal = cart.reduce((acc, i) => acc + i.menuItem.price * i.quantity, 0);
  const discount = appliedPromo ? Math.round((cartTotal * appliedPromo.discountPercentage) / 100) : 0;
  const deliveryFee = deliveryType === 'livraison' ? 1500 : 0;
  const finalTotal = cartTotal - discount + deliveryFee;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(null);
    setPromoSuccess(null);
    if (!promoInput.trim()) return;

    const result = applyPromoCode(promoInput);
    if (result.success) {
      setPromoSuccess(result.message);
      setPromoInput('');
    } else {
      setPromoError(result.message);
    }
  };

  const handlePlaceOrder = () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      alert("S'il vous plaît complétez votre nom et numéro de téléphone mobile.");
      return;
    }
    setPlacingOrder(true);

    // Simulate luxury order setup on the terminal
    setTimeout(() => {
      setPlacingOrder(false);
      const newOrder = checkout(customerPhone, customerName, customerEmail);
      if (newOrder) {
        setCurrentTrackedOrder(newOrder);
        setActiveStep('tracking');
      }
    }, 1800);
  };

  const latestOrder = currentTrackedOrder || orders[0];

  // Steps tracking state helper
  const getStepStatus = (stepIndex: number, currentStatus: Order['status']) => {
    const statuses: Order['status'][] = ['recue', 'cuisine', 'livraison', 'livree'];
    const currentIndex = statuses.indexOf(currentStatus);
    if (currentIndex >= stepIndex) return 'completed';
    if (currentIndex === stepIndex - 1) return 'active';
    return 'upcoming';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#000] z-50 backdrop-blur-xs"
          />

          {/* Drawer layout */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#090909] border-l border-stone-850/80 shadow-2xl z-50 flex flex-col justify-between overflow-hidden font-sans"
            id="order-panel-drawer"
          >
            {/* Header toolbar */}
            <div className="p-5 border-b border-stone-850 flex justify-between items-center bg-stone-950/80">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} className="text-[#D4AF37]" />
                <h3 className="font-serif text-lg font-bold text-[#FAF9F6]">Le Panier Gourmet</h3>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-stone-900 border border-stone-800 text-stone-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                id="cart-drawer-close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Stepper indicator if checkout has entries */}
            {activeStep !== 'tracking' && (
              <div className="flex bg-stone-900/30 border-b border-stone-850 py-2.5 px-4 justify-around text-[11px] font-semibold text-stone-400 uppercase">
                <button
                  onClick={() => setActiveStep('cart')}
                  className={`cursor-pointer ${activeStep === 'cart' ? 'text-[#D4AF37] font-extrabold underline' : ''}`}
                >
                  1. Mon Panier
                </button>
                <span>➔</span>
                <button
                  disabled={cart.length === 0}
                  onClick={() => setActiveStep('checkout')}
                  className={`cursor-pointer disabled:opacity-40 ${activeStep === 'checkout' ? 'text-[#D4AF37] font-extrabold underline' : ''}`}
                >
                  2. Cordonnées & Mode
                </button>
              </div>
            )}

            {/* Main Content Pane */}
            <div className="flex-1 overflow-y-auto p-5 scroll-smooth">
              <AnimatePresence mode="wait">
                {/* STEP 1: CART LIST */}
                {activeStep === 'cart' && (
                  <motion.div
                    key="cart-step"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-5"
                  >
                    {cart.length === 0 ? (
                      <div className="text-center py-20">
                        <div className="w-16 h-16 rounded-full bg-stone-900/60 flex items-center justify-center mx-auto mb-4 text-stone-650 border border-stone-800 border-dashed">
                          <ShoppingBag size={24} />
                        </div>
                        <p className="text-stone-405 text-sm">Votre panier est encore vide.</p>
                        <p className="text-stone-500 text-xs mt-1">Laissez-vous tenter par nos spécialités et cocktails.</p>
                        <button
                          onClick={onClose}
                          className="mt-6 px-4 py-2 text-xs font-bold uppercase tracking-widest bg-stone-900 border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/5 transition-colors rounded-lg"
                        >
                          Découvrir la carte
                        </button>
                      </div>
                    ) : (
                      <>
                        {/* Cart items list */}
                        <div className="space-y-4">
                          {cart.map((item) => (
                            <div
                              key={item.menuItem.id}
                              className="flex gap-3.5 p-3.5 bg-stone-900/40 border border-stone-850 rounded-xl relative group hover:border-[#D4AF37]/20 transition-colors"
                            >
                              <img
                                src={item.menuItem.image}
                                alt={item.menuItem.name}
                                referrerPolicy="no-referrer"
                                className="w-16 h-16 rounded-lg object-cover bg-stone-900"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm text-[#FAF9F6] truncate pr-5">{item.menuItem.name}</h4>
                                <p className="text-xs text-[#D4AF37] font-semibold mt-0.5">
                                  {item.menuItem.price.toLocaleString('fr-FR')} FCFA
                                </p>
                                
                                {/* Quantity buttons */}
                                <div className="flex items-center gap-2.5 mt-2">
                                  <button
                                    onClick={() => updateCartQuantity(item.menuItem.id, item.quantity - 1)}
                                    className="w-5.5 h-5.5 rounded bg-stone-800 text-stone-450 hover:bg-stone-700 flex items-center justify-center text-xs"
                                  >
                                    <Minus size={10} />
                                  </button>
                                  <span className="text-xs font-bold px-1 text-stone-200">{item.quantity}</span>
                                  <button
                                    onClick={() => updateCartQuantity(item.menuItem.id, item.quantity + 1)}
                                    className="w-5.5 h-5.5 rounded bg-stone-800 text-stone-450 hover:bg-stone-700 flex items-center justify-center text-xs"
                                  >
                                    <Plus size={10} />
                                  </button>
                                </div>
                              </div>

                              {/* Remove trash can */}
                              <button
                                onClick={() => removeFromCart(item.menuItem.id)}
                                className="absolute top-3.5 right-3.5 text-stone-500 hover:text-red-400 p-1 rounded-md transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Promo / Coupon voucher application form */}
                        <form onSubmit={handleApplyPromo} className="pt-4 border-t border-stone-850">
                          <label className="text-[10px] text-stone-400 font-bold uppercase tracking-widest block mb-2">Boucher Coupon Réduction</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Ex: BONNEHUMEUR15"
                              value={promoInput}
                              onChange={(e) => setPromoInput(e.target.value)}
                              className="flex-1 bg-stone-900/60 border border-stone-850 px-3 py-2 rounded-lg text-xs tracking-wider uppercase text-stone-200 focus:outline-none focus:border-[#D4AF37]"
                              id="promo-code-input"
                            />
                            <button
                              type="submit"
                              className="px-4 py-2 text-xs bg-stone-800 hover:bg-stone-750 text-stone-200 font-bold uppercase tracking-wider rounded-lg border border-stone-700 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Ticket size={12} />
                              Appliquer
                            </button>
                          </div>
                          {promoError && <p className="text-xs text-red-400 mt-1.5">{promoError}</p>}
                          {promoSuccess && <p className="text-xs text-emerald-400 mt-1.5 font-semibold">{promoSuccess}</p>}
                        </form>

                        {/* Visual promotion helper suggestion */}
                        {!appliedPromo && (
                          <div className="p-3 bg-stone-900/50 border border-stone-800 border-dashed rounded-xl text-stone-400 text-[11px] leading-relaxed flex items-center gap-2">
                            <span className="text-[#D4AF37] font-bold">✨ TIP:</span>
                            <span>Utilisez le code <strong className="text-stone-200">BONNEHUMEUR15</strong> pour économiser 15% pour toute commande dès 25k FCFA.</span>
                          </div>
                        )}
                      </>
                    )}
                  </motion.div>
                )}

                {/* STEP 2: CHECKOUT CONTACT & CONFIRMATION */}
                {activeStep === 'checkout' && (
                  <motion.div
                    key="checkout-step"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-6"
                  >
                    {/* Mode selector (Delivery or PickUp) */}
                    <div className="space-y-2">
                      <label className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Méthode de Récupération</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setDeliveryType('livraison')}
                          className={`p-3 rounded-xl border flex items-center justify-center gap-2 cursor-pointer ${
                            deliveryType === 'livraison'
                              ? 'bg-[#D4AF37]/5 border-[#D4AF37] text-[#D4AF37]'
                              : 'bg-stone-900/60 border-stone-850 text-stone-400'
                          }`}
                        >
                          <Bike size={16} />
                          <span className="text-xs font-bold uppercase tracking-wider">Livraison (+1500)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeliveryType('retrait')}
                          className={`p-3 rounded-xl border flex items-center justify-center gap-2 cursor-pointer ${
                            deliveryType === 'retrait'
                              ? 'bg-[#D4AF37]/5 border-[#D4AF37] text-[#D4AF37]'
                              : 'bg-stone-900/60 border-stone-850 text-stone-400'
                          }`}
                        >
                          <Store size={16} />
                          <span className="text-xs font-bold uppercase tracking-wider">Retrait sur Place</span>
                        </button>
                      </div>
                    </div>

                    {/* Conditional Delivery Address Input */}
                    {deliveryType === 'livraison' && (
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-stone-400 uppercase tracking-widest font-bold block">Adresse exacte de Livraison (Yamoussoukro)</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                            className="w-full bg-stone-900/50 border border-stone-850 p-3 pl-10 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-[#D4AF37]"
                            required
                            id="checkout-delivery-address"
                          />
                          <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
                        </div>
                        <p className="text-[10px] text-stone-500">Exple: Sophim, Face Lycée Scientifique, Résidence Chouchou, Yamoussoukro.</p>
                      </div>
                    )}

                    {/* Customer Personal data */}
                    <div className="space-y-4">
                      <label className="text-[10px] text-stone-400 uppercase tracking-widest font-bold block border-b border-stone-850 pb-1.5">Cordonnées de Facturation</label>
                      
                      <div className="space-y-1.5">
                        <span className="text-[10px] uppercase text-stone-400">Nom complet</span>
                        <input
                          type="text"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full bg-stone-900/50 border border-stone-850 p-2.5 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-[#D4AF37]"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[10px] uppercase text-stone-400">Téléphone mobile mobile</span>
                        <input
                          type="tel"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          className="w-full bg-stone-900/50 border border-stone-850 p-2.5 rounded-lg text-xs text-stone-250 font-mono focus:outline-none focus:border-[#D4AF37]"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[10px] uppercase text-stone-400">Adresse Email</span>
                        <input
                          type="email"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          className="w-full bg-stone-900/50 border border-stone-850 p-2.5 rounded-lg text-xs text-stone-300 focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                    </div>

                    {/* Quick Payment Advice badge */}
                    <div className="p-3.5 bg-stone-900/70 rounded-xl border border-stone-800 text-xs text-stone-400 space-y-1">
                      <p className="font-bold text-stone-200 uppercase tracking-wider text-[10px]">💵 Mode de Paiement</p>
                      <p className="text-[11px]">Paiement à la livraison / retrait en espèces ou Mobile Money (Orange Money, Wave, MTN MoMo) pour une flexibilité totale.</p>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: LIVE TRACKING STEPPER */}
                {activeStep === 'tracking' && latestOrder && (
                  <motion.div
                    key="tracking-step"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6"
                    id="order-tracking-scroller"
                  >
                    <div className="text-center pb-3 border-b border-stone-850">
                      <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] mx-auto mb-3">
                        <Bike size={22} className="animate-bounce" />
                      </div>
                      <span className="text-[10px] uppercase font-mono text-[#D4AF37]">Suivi en temps réel</span>
                      <h4 className="font-serif text-lg font-bold text-stone-200 mt-0.5">Commande #{latestOrder.id}</h4>
                      <p className="text-stone-500 text-[10px] mt-1">Transmis aux cuisiniers : {new Date(latestOrder.requestedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>

                    {/* Order summary recap */}
                    <div className="space-y-2.5 p-3.5 bg-stone-900/30 border border-stone-850 rounded-xl max-h-40 overflow-y-auto">
                      <p className="text-[10px] uppercase text-stone-500 font-bold">Produits commandés :</p>
                      {latestOrder.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs">
                          <span className="text-stone-305 truncate max-w-[200px]">{it.name} <strong className="text-[#D4AF37]">x{it.quantity}</strong></span>
                          <span className="text-stone-400 font-mono">{(it.price * it.quantity).toLocaleString('fr-FR')} F</span>
                        </div>
                      ))}
                    </div>

                    {/* Step-by-step indicators */}
                    <div className="space-y-5 pl-2 relative">
                      {/* Vertical line indicator */}
                      <div className="absolute left-[13px] top-4 bottom-4 w-0.5 bg-stone-800" />

                      {/* Step 1: Recue */}
                      <div className="flex gap-4 items-center relative z-10">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                          getStepStatus(1, latestOrder.status) === 'completed'
                            ? 'bg-[#D4AF37] text-stone-950 shadow-md shadow-[#D4AF37]/20 font-bold'
                            : 'bg-stone-850 border border-stone-700 text-stone-400'
                        }`}>
                          ✓
                        </div>
                        <div>
                          <p className={`text-xs font-bold ${getStepStatus(1, latestOrder.status) === 'completed' ? 'text-stone-200' : 'text-stone-500'}`}>1. Enregistrée</p>
                          <p className="text-[10px] text-stone-500 leading-none mt-0.5">La commande a bien été reçue par le système.</p>
                        </div>
                      </div>

                      {/* Step 2: Cuisine */}
                      <div className="flex gap-4 items-center relative z-10">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                          getStepStatus(2, latestOrder.status) === 'completed'
                            ? 'bg-[#D4AF37] text-stone-950 font-bold'
                            : getStepStatus(2, latestOrder.status) === 'active'
                            ? 'bg-amber-500 text-stone-950 animate-pulse font-bold'
                            : 'bg-stone-850 border border-stone-700 text-stone-400'
                        }`}>
                          {getStepStatus(2, latestOrder.status) === 'completed' ? '✓' : '2'}
                        </div>
                        <div>
                          <p className={`text-xs font-bold ${
                            getStepStatus(2, latestOrder.status) === 'completed'
                              ? 'text-stone-200'
                              : getStepStatus(2, latestOrder.status) === 'active'
                              ? 'text-amber-400'
                              : 'text-stone-500'
                          }`}>2. En Chef-Cuisine</p>
                          <p className="text-[10px] text-stone-500 leading-none mt-0.5">Vos kédjénous et poissons tressés mijotent à feu doux.</p>
                        </div>
                      </div>

                      {/* Step 3: Livraison */}
                      <div className="flex gap-4 items-center relative z-10">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                          getStepStatus(3, latestOrder.status) === 'completed'
                            ? 'bg-[#D4AF37] text-stone-950 font-bold'
                            : getStepStatus(3, latestOrder.status) === 'active'
                            ? 'bg-amber-500 text-stone-950 animate-pulse font-bold'
                            : 'bg-stone-850 border border-stone-700 text-stone-400'
                        }`}>
                          {getStepStatus(3, latestOrder.status) === 'completed' ? '✓' : '3'}
                        </div>
                        <div>
                          <p className={`text-xs font-bold ${
                            getStepStatus(3, latestOrder.status) === 'completed'
                              ? 'text-stone-200'
                              : getStepStatus(3, latestOrder.status) === 'active'
                              ? 'text-amber-400'
                              : 'text-stone-500'
                          }`}>3. {latestOrder.deliveryType === 'livraison' ? 'En livraison express' : 'Prêt à être retiré'}</p>
                          <p className="text-[10px] text-stone-500 leading-none mt-0.5">
                            {latestOrder.deliveryType === 'livraison' ? 'Notre motard traverse Yamoussoukro vers vous.' : 'La commande est chaude sur le comptoir.'}
                          </p>
                        </div>
                      </div>

                      {/* Step 4: Livree */}
                      <div className="flex gap-4 items-center relative z-10">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                          latestOrder.status === 'livree'
                            ? 'bg-emerald-500 text-stone-950 font-bold'
                            : 'bg-stone-850 border border-stone-700 text-stone-400'
                        }`}>
                          {latestOrder.status === 'livree' ? '✓' : '4'}
                        </div>
                        <div>
                          <p className={`text-xs font-bold ${latestOrder.status === 'livree' ? 'text-emerald-400' : 'text-stone-500'}`}>4. Livrée & Dégustée</p>
                          <p className="text-[10px] text-stone-500 leading-none mt-0.5">Le moment du bonheur ! Bon appétit !</p>
                        </div>
                      </div>
                    </div>

                    {/* Developer sandbox interactive note */}
                    <div className="p-3.5 bg-stone-900 border border-[#D4AF37]/20 rounded-xl text-[10px] text-stone-400">
                      <span className="text-[#D4AF37] font-bold block uppercase tracking-wider mb-1">🛠️ MODULE INTERACTIF SANDBOX :</span>
                      <span>Vous pouvez modifier le statut de cette commande de façon instantanée en ouvrant l'<strong>Espace Administrateur</strong> (Le bouton "Dashboard" flottant du menu supérieur).</span>
                    </div>

                    <button
                      onClick={() => setActiveStep('cart')}
                      className="w-full py-2.5 rounded-lg border border-stone-700 hover:border-stone-500 text-xs font-bold uppercase tracking-wider text-stone-300 transition-colors"
                    >
                      Retour au Panier
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sticky bottom totalizer card if not final tracking order */}
            {activeStep !== 'tracking' && cart.length > 0 && (
              <div className="p-5 border-t border-stone-850 bg-stone-950/90 flex flex-col gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-stone-400">
                    <span>Sous-total plats</span>
                    <span className="font-mono">{cartTotal.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-xs text-emerald-400">
                      <span>Réduction Code Promo ({appliedPromo?.code})</span>
                      <span className="font-mono">-{discount.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                  )}
                  {deliveryType === 'livraison' && (
                    <div className="flex justify-between text-xs text-stone-400">
                      <span>Frais de Moto-Livraison</span>
                      <span className="font-mono">+1 500 FCFA</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-[#FAF9F6] pt-1.5 border-t border-stone-850">
                    <span className="font-serif">Total Net à payer</span>
                    <span className="font-mono text-[#D4AF37]">{finalTotal.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  {activeStep === 'cart' ? (
                    <button
                      onClick={() => setActiveStep('checkout')}
                      className="w-full py-3 rounded-xl bg-[#D4AF37] hover:bg-[#B8902A] text-[#050505] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-lg cursor-pointer"
                      id="cart-next-checkout"
                    >
                      Saisir mes Coordonnées
                      <ArrowRight size={14} />
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => setActiveStep('cart')}
                        disabled={placingOrder}
                        className="w-1/3 py-3 rounded-xl border border-stone-800 text-stone-400 hover:text-stone-200 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Retour
                      </button>
                      <button
                        onClick={handlePlaceOrder}
                        disabled={placingOrder}
                        className="w-2/3 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#B8902A] text-[#050500] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-lg cursor-pointer"
                        id="checkout-order-action"
                      >
                        {placingOrder ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            Validation...
                          </>
                        ) : (
                          <>
                            <CheckCircle size={14} />
                            Valider Commande
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
