import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp,
  ShoppingBag,
  CalendarCheck,
  Users2,
  ListPlus,
  Coins,
  Check,
  X,
  Plus,
  Trash2,
  FilePen,
  Percent,
  Search,
  Sparkles,
  Sliders,
  Utensils,
  Image as ImageIcon,
  Lock,
  Unlock,
  Key,
  LogOut,
  Clock,
  Eye,
  AlertTriangle,
  Play,
  Square,
  Maximize2,
  Upload
} from 'lucide-react';
import { MenuItem, Reservation, Order, Promotion, GalleryImg, AdminUser, AdminSession } from '../types';

interface AdminPanelProps {
  menuItems: MenuItem[];
  reservations: Reservation[];
  orders: Order[];
  galleryImages: GalleryImg[];
  adminUsers: AdminUser[];
  adminSession: AdminSession | null;
  adminAddMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  adminEditMenuItem: (id: string, updated: Partial<MenuItem>) => void;
  adminDeleteMenuItem: (id: string) => void;
  adminUpdateReservationStatus: (id: string, status: Reservation['status'], tableNum?: string) => void;
  adminUpdateOrderStatus: (id: string, status: Order['status']) => void;
  adminAddGalleryImage: (img: Omit<GalleryImg, 'id'>) => void;
  adminDeleteGalleryImage: (id: string) => void;
  adminEditGalleryImage: (id: string, updated: Partial<GalleryImg>) => void;
  loginAdmin: (email: string, pass: string) => { success: boolean; message: string; user?: AdminUser };
  logoutAdmin: () => void;
  resetAdminPassword: (email: string) => { success: boolean; message: string };
  updateAdminLastActive: () => void;
  adminAddSubUser: (name: string, email: string, role: AdminUser['role']) => void;
  // Dynamic layout customizer props
  publishedSettings: any;
  draftSettings: any;
  isPreviewMode: boolean;
  setIsPreviewMode: (val: boolean) => void;
  activeSettings: any;
  promotions: Promotion[];
  adminAddPromotion: (promo: Promotion) => void;
  adminEditPromotion: (code: string, updated: Partial<Promotion>) => void;
  adminDeletePromotion: (code: string) => void;
  adminUpdateDraftSettings: (settings: any) => void;
  adminPublishSettings: () => void;
  adminResetDraftSettings: () => void;
}

export default function AdminPanel({
  menuItems,
  reservations,
  orders,
  galleryImages,
  adminUsers,
  adminSession,
  adminAddMenuItem,
  adminEditMenuItem,
  adminDeleteMenuItem,
  adminUpdateReservationStatus,
  adminUpdateOrderStatus,
  adminAddGalleryImage,
  adminDeleteGalleryImage,
  adminEditGalleryImage,
  loginAdmin,
  logoutAdmin,
  resetAdminPassword,
  updateAdminLastActive,
  adminAddSubUser,
  publishedSettings,
  draftSettings,
  isPreviewMode,
  setIsPreviewMode,
  activeSettings,
  promotions,
  adminAddPromotion,
  adminEditPromotion,
  adminDeletePromotion,
  adminUpdateDraftSettings,
  adminPublishSettings,
  adminResetDraftSettings
}: AdminPanelProps) {
  // Login input states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  
  // Password reset state
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccessMsg, setResetSuccessMsg] = useState<string | null>(null);
  const [resetErrorMsg, setResetErrorMsg] = useState<string | null>(null);

  // Active admin tab selection
  const [adminTab, setAdminTab] = useState<'stats' | 'customizer' | 'orders' | 'reservations' | 'menu' | 'media' | 'promos' | 'admins' | 'interface'>('menu');

  // Interface sub-tabs
  const [interfaceSubTab, setInterfaceSubTab] = useState<'logo' | 'banner' | 'restaurant' | 'gallery' | 'sections'>('logo');

  // Search states
  const [menuSearch, setMenuSearch] = useState('');
  const [mediaSearch, setMediaSearch] = useState('');
  
  // Media Category active filtering
  const [mediaActiveTab, setMediaActiveTab] = useState<string>('Tout');

  // Media Library Addition forms
  const [isAddingMedia, setIsAddingMedia] = useState(false);
  const [newMediaTitle, setNewMediaTitle] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaCategory, setNewMediaCategory] = useState<GalleryImg['category']>('Restaurant');
  const [newMediaHomeAssign, setNewMediaHomeAssign] = useState<GalleryImg['homepageAssignment']>('none');

  // Edit media ID/Modal
  const [editingMediaId, setEditingMediaId] = useState<string | null>(null);
  const [editMediaTitle, setEditMediaTitle] = useState('');
  const [editMediaUrl, setEditMediaUrl] = useState('');
  const [editMediaCategory, setEditMediaCategory] = useState<GalleryImg['category']>('Restaurant');
  const [editMediaHomeAssign, setEditMediaHomeAssign] = useState<GalleryImg['homepageAssignment']>('none');

  // Slideshow preview states inside library
  const [slideshowActive, setSlideshowActive] = useState(false);
  const [slideshowIdx, setSlideshowIdx] = useState(0);
  const [slideshowInterval, setSlideshowInterval] = useState(3000); // 3 seconds interval

  // Table assignments helper
  const [tableAssignInputs, setTableAssignInputs] = useState<Record<string, string>>({});

  // Menu Adding form Expand
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState(5000);
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<MenuItem['category']>('plat_local');
  const [newItemPrep, setNewItemPrep] = useState('15 min');
  const [newItemImg, setNewItemImg] = useState('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600');
  const [newItemIngs, setNewItemIngs] = useState('');
  const [newItemIsPopular, setNewItemIsPopular] = useState(true);
  const [newItemIsNew, setNewItemIsNew] = useState(false);
  const [newItemIsActive, setNewItemIsActive] = useState(true);
  const [newItemImagesStr, setNewItemImagesStr] = useState('');

  // Menu editing states
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editItemName, setEditItemName] = useState('');
  const [editItemPrice, setEditItemPrice] = useState(0);
  const [editItemDesc, setEditItemDesc] = useState('');
  const [editItemCategory, setEditItemCategory] = useState<MenuItem['category']>('plat_local');
  const [editItemImg, setEditItemImg] = useState('');
  const [editItemIsPopular, setEditItemIsPopular] = useState(false);
  const [editItemIsNew, setEditItemIsNew] = useState(false);
  const [editItemIsActive, setEditItemIsActive] = useState(true);


  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoDiscount, setNewPromoDiscount] = useState(10);
  const [newPromoDesc, setNewPromoDesc] = useState('');

  // Administrators creator form (Super Admin ONLY)
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<AdminUser['role']>('employe');

  // Inactivity notification helper
  const [heartbeatMessage, setHeartbeatMessage] = useState<string | null>(null);

  // Trigger local state synchronization for user activity tracking
  const triggerActivityPulse = () => {
    updateAdminLastActive();
    setHeartbeatMessage('Activité détectée - Session prolongée');
    setTimeout(() => {
      setHeartbeatMessage(null);
    }, 2500);
  };

  // Automated Slideshow trigger effect
  useEffect(() => {
    if (!slideshowActive || galleryImages.length === 0) return;
    const intervalObj = setInterval(() => {
      setSlideshowIdx((prev) => (prev + 1) % galleryImages.length);
    }, slideshowInterval);
    return () => clearInterval(intervalObj);
  }, [slideshowActive, galleryImages.length, slideshowInterval]);

  // STATS & REVENUE CALCULATIONS
  const statsSummary = useMemo(() => {
    const salesTotal = orders
      .filter((o) => o.status === 'livree' || o.status === 'livraison' || o.status === 'cuisine')
      .reduce((sum, o) => sum + o.total, 0);

    const pendingOrdersCount = orders.filter((o) => o.status !== 'livree' && o.status !== 'annulee').length;
    const pendingResCount = reservations.filter((r) => r.status === 'pending').length;

    const counts: Record<string, number> = {};
    orders.forEach((o) => {
      o.items.forEach((it) => {
        counts[it.name] = (counts[it.name] || 0) + it.quantity;
      });
    });

    const topSelling = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Kédjénou de Poulet';

    return {
      salesTotal,
      pendingOrdersCount,
      pendingResCount,
      topSelling
    };
  }, [orders, reservations]);

  // LOGIN HANDLE SUBMIT
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError("Veuillez saisir votre email et votre mot de passe d'accès.");
      return;
    }

    const res = loginAdmin(loginEmail.trim(), loginPassword.trim());
    if (res.success) {
      // Auto routing according to privileges
      if (res.user?.role === 'super') {
        setAdminTab('stats');
      } else {
        setAdminTab('orders');
      }
      setLoginEmail('');
      setLoginPassword('');
    } else {
      setLoginError(res.message);
    }
  };

  // PASSWORD RESET HANDLE SUBMIT
  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResetSuccessMsg(null);
    setResetErrorMsg(null);

    if (!resetEmail.trim()) {
      setResetErrorMsg("Veuillez renseigner votre adresse e-mail professionnelle.");
      return;
    }

    const res = resetAdminPassword(resetEmail.trim());
    if (res.success) {
      setResetSuccessMsg(res.message);
      setResetEmail('');
    } else {
      setResetErrorMsg(res.message);
    }
  };

  // ADD NEW MEDIA HANDLER
  const handleCreateMediaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMediaTitle.trim() || !newMediaUrl.trim()) return;

    adminAddGalleryImage({
      title: newMediaTitle.trim(),
      url: newMediaUrl.trim(),
      category: newMediaCategory,
      homepageAssignment: newMediaHomeAssign
    });

    // Reset fields
    setNewMediaTitle('');
    setNewMediaUrl('');
    setNewMediaCategory('Restaurant');
    setNewMediaHomeAssign('none');
    setIsAddingMedia(false);
  };

  // EDIT MEDIA SUBMIT
  const handleSaveEditMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMediaId || !editMediaTitle.trim() || !editMediaUrl.trim()) return;

    adminEditGalleryImage(editingMediaId, {
      title: editMediaTitle.trim(),
      url: editMediaUrl.trim(),
      category: editMediaCategory,
      homepageAssignment: editMediaHomeAssign
    });

    setEditingMediaId(null);
  };

  // NEW MENU DISH HANDLER
  const handleCreateMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminSession?.user.role === 'employe') return;
    if (!newItemName.trim()) return;

    const extraImages = newItemImagesStr
      ? newItemImagesStr.split(',').map((it) => it.trim()).filter(Boolean)
      : [];

    adminAddMenuItem({
      name: newItemName.trim(),
      price: newItemPrice,
      description: newItemDesc.trim(),
      category: newItemCategory,
      preparationTime: newItemPrep,
      image: newItemImg.trim(),
      images: [newItemImg.trim(), ...extraImages],
      ingredients: newItemIngs ? newItemIngs.split(',').map((it) => it.trim()) : [],
      popular: newItemIsPopular,
      isNew: newItemIsNew,
      isActive: newItemIsActive
    });

    setNewItemName('');
    setNewItemDesc('');
    setNewItemIngs('');
    setNewItemImagesStr('');
    setNewItemIsPopular(true);
    setNewItemIsNew(false);
    setNewItemIsActive(true);
    setIsAddingItem(false);
  };

  // EDIT MENU DISH HANDLER
  const handleSaveEditMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminSession?.user.role === 'employe') return;
    if (!editingItem) return;
    if (!editItemName.trim()) return;

    adminEditMenuItem(editingItem.id, {
      name: editItemName.trim(),
      price: editItemPrice,
      description: editItemDesc.trim(),
      category: editItemCategory,
      image: editItemImg.trim(),
      images: [editItemImg.trim()],
      popular: editItemIsPopular,
      isNew: editItemIsNew,
      isActive: editItemIsActive
    });

    setEditingItem(null);
  };

  // NEW PROMO ADD HANDLER
  const handleAddPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoCode.trim()) return;
    const item: Promotion = {
      code: newPromoCode.trim().toUpperCase(),
      discountPercentage: newPromoDiscount,
      description: newPromoDesc || `Réduction de ${newPromoDiscount}%`,
      isActive: true
    };
    adminAddPromotion(item);
    setNewPromoCode('');
    setNewPromoDesc('');
  };

  // NEW SUB ADMIN ACCOUNT HANDLER
  const handleAddSubUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminName.trim() || !newAdminEmail.trim()) return;
    adminAddSubUser(newAdminName.trim(), newAdminEmail.trim().toLowerCase(), newAdminRole);
    setNewAdminName('');
    setNewAdminEmail('');
    setNewAdminRole('employe');
  };

  const handleTableAssignChange = (resId: string, value: string) => {
    setTableAssignInputs((prev) => ({ ...prev, [resId]: value }));
  };

  // Filters
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter(
      (item) =>
        item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
        item.category.toLowerCase().includes(menuSearch.toLowerCase())
    );
  }, [menuItems, menuSearch]);

  const filteredMediaImages = useMemo(() => {
    let list = galleryImages;
    if (mediaActiveTab !== 'Tout') {
      list = galleryImages.filter((img) => img.category === mediaActiveTab);
    }
    if (mediaSearch.trim()) {
      list = list.filter((img) => img.title.toLowerCase().includes(mediaSearch.toLowerCase()));
    }
    return list;
  }, [galleryImages, mediaActiveTab, mediaSearch]);

  const activeRole = adminSession?.user.role;

  // RENDER ACCESS DENIED ALERTER
  const renderAccessDenied = (requiredRole: string) => (
    <div className="p-12 text-center bg-stone-900/30 border border-red-500/10 rounded-2xl max-w-xl mx-auto my-12 space-y-4">
      <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto">
        <AlertTriangle size={32} className="animate-bounce" />
      </div>
      <div>
        <h4 className="font-serif text-lg font-bold text-red-400">Accès Refusé — Permissions Insuffisantes</h4>
        <p className="text-stone-400 text-xs mt-1.5 leading-relaxed">
          Le module demandé requiert des privilèges exclusifs de type <span className="font-bold text-[#D4AF37] uppercase font-mono">{requiredRole}</span>. <br />
          Votre rôle actuel est répertorié comme <span className="underline italic mb-0.5 text-stone-200">"{activeRole === 'gestionnaire' ? 'Gestionnaire' : 'Employé'}"</span>. 
          Veuillez contacter le Super Administrateur de l'établissement si vous avez besoin de modifier cette accréditation.
        </p>
      </div>
    </div>
  );

  return (
    <div 
      onClick={triggerActivityPulse}
      onKeyDown={triggerActivityPulse}
      className="bg-[#050505] min-h-screen text-stone-100 py-6 px-4 max-w-7xl mx-auto rounded-3xl border border-stone-850 shadow-2xl space-y-8 my-10 relative overflow-hidden"
    >
      {/* Decors glow background */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/2.5 rounded-full blur-[100px] pointer-events-none" />

      {/* HEARTBEAT WATCHDOG NOTIFIER */}
      <AnimatePresence>
        {heartbeatMessage && adminSession && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -15 }}
            className="fixed bottom-6 right-6 z-50 px-4 py-2 bg-stone-950 border border-green-500/30 text-green-400 rounded-xl text-xs font-mono font-bold flex items-center gap-2 shadow-2xl backdrop-blur-md"
          >
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
            <span>{heartbeatMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* IF ADMIN NOT LOGGED IN - RENDER GLAMOROUS LOGIN SECURE SCREEN */}
      {!adminSession ? (
        <div className="max-w-md mx-auto my-12" id="admin-login-screen">
          <div className="bg-[#0B0B0B] border border-stone-850 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
            
            {/* Visual banner */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#D4AF37] via-[#FFF] to-[#D4AF37]" />

            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-stone-900 border border-[#D4AF37]/30 rounded-2xl flex items-center justify-center text-[#D4AF37] mx-auto shadow-lg shadow-amber-500/5">
                <Lock size={22} className="animate-pulse" />
              </div>
              <p className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF37]">Portail Sécurisé</p>
              <h3 className="font-serif text-xl sm:text-2xl font-black text-white">Connexion Administration</h3>
              <p className="text-stone-500 text-xs">
                Seul le personnel habilité du restaurant Café Bonne Humeur dispose d'accès de gestion.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {isResetMode ? (
                /* PASSWORD RESET ACCORDION LOOP */
                <motion.form
                  key="reset-form"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  onSubmit={handleResetSubmit}
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] text-stone-450 uppercase tracking-widest font-bold block">E-mail Professionnel</span>
                    <input
                      type="email"
                      placeholder="Ex: admin@cafe-bonnehumeur.ci"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-850 p-2.5 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-[#D4AF37] font-mono"
                      required
                    />
                  </div>

                  {resetSuccessMsg && (
                    <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 rounded-lg">
                      {resetSuccessMsg}
                    </div>
                  )}

                  {resetErrorMsg && (
                    <div className="p-3 bg-red-950/40 border border-red-500/30 text-xs text-red-300 rounded-lg">
                      {resetErrorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#B8902A] text-stone-950 text-xs uppercase tracking-widest font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Simuler Réinitialisation
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsResetMode(false);
                      setResetSuccessMsg(null);
                      setResetErrorMsg(null);
                    }}
                    className="w-full py-2 text-stone-450 hover:text-white text-xs block text-center"
                  >
                    Retourner à la connexion
                  </button>
                </motion.form>
              ) : (
                /* MAIN LOGIN FORM SYSTEM */
                <motion.form
                  key="login-form"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  onSubmit={handleLoginSubmit}
                  className="space-y-4 font-sans"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] text-stone-450 uppercase tracking-widest font-bold block">Identifiant E-mail</span>
                    <input
                      type="email"
                      placeholder="Ex: admin@cafe-bonnehumeur.ci"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-850 p-2.5 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-[#D4AF37] font-mono"
                      required
                      id="admin-email-login"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-stone-450 uppercase tracking-widest font-bold block">Clé Secrète</span>
                    <input
                      type="password"
                      placeholder="Saisir le mot de passe"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-850 p-2.5 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-[#D4AF37] font-mono"
                      required
                      id="admin-password-login"
                    />
                  </div>

                  {loginError && (
                    <div className="p-3 bg-red-950/40 border border-red-500/30 text-xs text-red-300 rounded-lg flex items-start gap-1">
                      <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#D4AF37] hover:bg-[#B8902A] text-stone-950 text-xs uppercase tracking-widest font-extrabold rounded-xl transition-all shadow-md cursor-pointer"
                    id="admin-submit-login"
                  >
                    Se connecter à l'espace
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsResetMode(true);
                      setLoginError(null);
                    }}
                    className="w-full py-2 text-stone-500 hover:text-[#D4AF37] text-xs block text-center"
                  >
                    Mot de passe oublié ?
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Quick accreditations switcher selector specifically for easy testing */}
          <div className="mt-8 p-4 bg-stone-900/10 border border-stone-850 rounded-2xl space-y-3">
            <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest font-bold block text-center">🔐 DEMO LOGINS QUICK-SWITCH</span>
            <div className="grid grid-cols-1 gap-2">
              {[
                { r: 'Super Admin', m: 'admin@cafe-bonnehumeur.ci', p: 'superadmin', desc: 'Gestion totale, stats & bibliothèque' },
                { r: 'Gestionnaire', m: 'gestion@cafe-bonnehumeur.ci', p: 'gestionnaire', desc: 'Editions menus, réservations & commandes' },
                { r: 'Employé', m: 'employe@cafe-bonnehumeur.ci', p: 'employe', desc: 'Lecture et consultations seules' }
              ].map((act, id) => (
                <button
                  key={id}
                  onClick={() => {
                    setLoginEmail(act.m);
                    setLoginPassword(act.p);
                  }}
                  className="p-2 bg-stone-950 hover:bg-stone-900 border border-stone-800 rounded-xl text-left block transition-colors group cursor-pointer"
                >
                  <div className="flex justify-between items-center text-[11px] font-bold">
                    <span className="text-[#D4AF37]">{act.r}</span>
                    <span className="text-stone-400 font-mono text-[10px] underline">{act.p}</span>
                  </div>
                  <p className="text-[10px] text-stone-500 mt-0.5 truncate">{act.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* LOGGED IN ACTIVE DASHBOARD VIEW CONTAINER */
        <div className="space-y-6" id="admin-active-dashboard">
          
          {/* Header metadata bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-[#0B0B0B] border border-stone-850 rounded-2xl gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/20 rounded-xl">
                <Sliders size={22} className="animate-spin-slow" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded text-[#D4AF37] font-mono">
                    RÔLE: {activeRole === 'super' ? 'Super Administrateur' : activeRole === 'gestionnaire' ? 'Gestionnaire' : 'Employé (Consultant)'}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] text-green-400 font-mono">Heartbeat Actif</span>
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-black text-white flex items-center gap-1.5 mt-1">
                  Espace Gestion "Le Café Bonne Humeur"
                  <span className="text-stone-450 font-sans text-xs font-semibold block sm:inline">({adminSession.user.name})</span>
                </h2>
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={logoutAdmin}
              className="px-4 py-2 border border-red-500/30 text-xs bg-red-950/10 hover:bg-red-900 hover:text-white rounded-xl text-red-400 transition-all flex items-center gap-1.5 cursor-pointer font-bold uppercase tracking-wider"
              id="admin-logout-btn"
            >
              <LogOut size={13} />
              Déconnexion
            </button>
          </div>

          {/* Secure Tabs selection */}
          <div className="flex flex-wrap gap-1 bg-stone-950 p-1 rounded-xl border border-stone-850 overflow-x-auto w-full">
            {[
              { id: 'menu', label: 'Menu', role: 'all' },
              { id: 'interface', label: 'Interface', role: 'all' },
              { id: 'reservations', label: 'Réservations', role: 'all' }
            ].map((tab) => {
              const isActive = adminTab === tab.id;
              // Check if restricted
              const isRestricted = tab.role === 'super' && activeRole !== 'super';
              return (
                <button
                  key={tab.id}
                  onClick={() => setAdminTab(tab.id as any)}
                  className={`px-3.5 py-2.5 rounded-lg text-xs leading-none uppercase tracking-wider font-extrabold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#D4AF37] text-stone-950 shadow-md font-black'
                      : isRestricted
                      ? 'text-stone-600 hover:text-stone-300 transition-colors'
                      : 'text-stone-400 hover:text-white'
                  }`}
                  id={`admin-tab-btn-${tab.id}`}
                >
                  {tab.label}
                  {isRestricted && <span className="text-[9px] text-red-500 ml-1.5">🔒</span>}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {/* TAB 1: THE DASHBOARD STATS */}
            {adminTab === 'stats' && (
              <motion.div
                key="tab-stats"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8 animate-fade-in"
              >
                {activeRole !== 'super' ? renderAccessDenied('Super Administrateur') : (
                  <>
                    {/* Stats summary grids */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="p-6 bg-stone-900/40 rounded-2xl border border-stone-850 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-stone-500 uppercase tracking-widest block font-mono">Chiffre d'Affaires</span>
                          <span className="text-2xl font-serif font-black text-[#D4AF37] mt-1 block">
                            {statsSummary.salesTotal.toLocaleString('fr-FR')} FCFA
                          </span>
                          <span className="text-[10px] text-emerald-400 mt-1 block font-mono">✓ Ventes encaissées en ligne</span>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                          <Coins size={22} />
                        </div>
                      </div>

                      <div className="p-6 bg-stone-900/40 rounded-2xl border border-stone-850 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-stone-500 uppercase tracking-widest block font-mono">Réservations Certifiées</span>
                          <span className="text-2xl font-serif font-black text-stone-100 mt-1 block">
                            {reservations.length} Demandes
                          </span>
                          <span className="text-[10px] text-[#D4AF37] mt-1 block font-mono">
                            {statsSummary.pendingResCount} en attente de table
                          </span>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                          <CalendarCheck size={22} />
                        </div>
                      </div>

                      <div className="p-6 bg-stone-900/40 rounded-2xl border border-stone-850 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-stone-500 uppercase tracking-widest block font-mono">Commandes de livraison</span>
                          <span className="text-2xl font-serif font-black text-stone-100 mt-1 block">
                            {orders.length} Commandes
                          </span>
                          <span className="text-[10px] text-amber-500 mt-1 block font-mono">
                            {statsSummary.pendingOrdersCount} en cuisine/motard
                          </span>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                          <ShoppingBag size={22} />
                        </div>
                      </div>

                      <div className="p-6 bg-stone-900/40 rounded-2xl border border-stone-850 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-stone-500 uppercase tracking-widest block font-mono">Spécialité Star</span>
                          <span className="text-sm font-bold text-stone-200 mt-1.5 block truncate max-w-[170px]">
                            {statsSummary.topSelling}
                          </span>
                          <span className="text-[10px] text-[#D4AF37] mt-1 block font-mono">Le coup de cœur culinaire</span>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                          <TrendingUp size={22} />
                        </div>
                      </div>
                    </div>

                    {/* Progress visual representation graph */}
                    <div className="p-6 bg-stone-900/20 border border-stone-850 rounded-2xl space-y-4">
                      <div>
                        <h4 className="font-serif font-bold text-lg text-stone-200">Revenus de Ventes du Restaurant</h4>
                        <p className="text-stone-500 text-xs">Cumul d'activité sur les 5 derniers jours ouvrés en FCFA.</p>
                      </div>

                      <div className="h-64 flex items-end justify-around gap-4 pt-10 border-b border-stone-850 relative">
                        {[
                          { day: '03 Juin', val: 125000, pct: '30%', color: 'from-stone-850 to-stone-750' },
                          { day: '04 Juin', val: 280000, pct: '55%', color: 'from-stone-800 to-stone-700' },
                          { day: '05 Juin', val: 410000, pct: '70%', color: 'from-amber-600/30 to-[#D4AF37]/30' },
                          { day: '06 Juin', val: 562000, pct: '85%', color: 'from-[#D4AF37]/45 to-[#A37B1F]/45' },
                          { day: '07 Juin (Aujourd\'hui)', val: statsSummary.salesTotal || 350000, pct: '100%', color: 'from-[#D4AF37] to-[#8C6B13]' }
                        ].map((item, id) => (
                          <div key={id} className="flex-1 flex flex-col items-center gap-2 group relative z-10 font-mono">
                            <span className="text-[10px] font-bold text-stone-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-stone-950 border border-stone-800 px-2 py-0.5 rounded absolute -top-8 z-20">
                              {item.val.toLocaleString('fr-FR')} F
                            </span>
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: item.pct }}
                              transition={{ duration: 0.6, delay: id * 0.1 }}
                              className={`w-10 sm:w-16 rounded-t-lg bg-gradient-to-t ${item.color} shadow-lg relative group-hover:brightness-125 transition-all`}
                            />
                            <span className="text-[10px] text-stone-500 mt-1 block">{item.day}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* TAB 8: SITE INTERFACE & IMAGE MANAGER (🎨) */}
            {adminTab === 'interface' && (
              <motion.div
                key="tab-interface"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {activeRole !== 'super' ? renderAccessDenied('Super Administrateur') : (
                  <>
                    <div className="border-b border-stone-850 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h3 className="font-serif text-lg font-bold flex items-center gap-2">
                          <span>🎨 Espace Interface & Gestion des Images</span>
                          <span className="text-[10px] uppercase font-mono font-bold bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 px-2 py-0.5 rounded">Gestion Directe</span>
                        </h3>
                        <p className="text-stone-500 text-xs mt-1">
                          Modifiez l'intégralité du contenu visuel de "Le Café Bonne Humeur" sans toucher une seule ligne de code. Toutes vos images sont stockées dans la base de données.
                        </p>
                      </div>
                      
                      <div className="flex gap-2.5">
                        <label className="inline-flex items-center gap-1.5 text-xs bg-stone-900/60 border border-stone-850 px-3 py-1.5 rounded-xl cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isPreviewMode}
                            onChange={(e) => setIsPreviewMode(e.target.checked)}
                            className="rounded bg-stone-950 border-stone-800 text-[#D4AF37] focus:ring-0 focus:ring-offset-0"
                          />
                          <span className="text-stone-300 font-semibold text-[11px]">Mode Prévisualisation</span>
                        </label>
                        
                        <button
                          onClick={() => {
                            adminPublishSettings();
                            alert("✨ Félicitations ! Votre charte graphique et toutes les bannières d'images ont été mises en ligne en temps réel !");
                          }}
                          className="bg-emerald-500 hover:bg-emerald-600 text-stone-950 font-extrabold px-4 py-2 rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow flex items-center gap-1.5"
                        >
                          <Check size={13} />
                          Mettre en ligne
                        </button>
                        
                        <button
                          onClick={() => {
                            if (confirm("Voulez-vous réinitialiser vos modifications temporaires et restaurer les réglages actuellement en ligne ?")) {
                              adminResetDraftSettings();
                            }
                          }}
                          className="bg-stone-850 hover:bg-stone-800 text-stone-300 font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>

                    <div className="bg-amber-500/5 border border-amber-500/15 p-4 rounded-2xl flex items-start gap-3">
                      <Sparkles size={18} className="text-[#D4AF37] shrink-0 mt-0.5" />
                      <div className="text-xs text-stone-300 leading-relaxed">
                        <strong className="text-white block font-medium">💡 Synchronisation en temps réel :</strong>
                        Modifiez vos bannières et logos ci-dessous puis cochez le <strong className="text-[#D4AF37]">Mode Prévisualisation</strong> pour apprécier le magnifique changement immédiat sur votre site de démonstration. Cliquez sur <strong>"Mettre en ligne"</strong> pour propager l'image à vos clients de Yamoussoukro ! Le site ne contient aucune photo codée en dur.
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">
                      {/* Left: Content customizer fields */}
                      <div className="lg:col-span-8 space-y-6">
                        
                        {/* Interactive sub-tabs selection */}
                        <div className="flex border-b border-stone-850 gap-2 overflow-x-auto pb-1 mb-6">
                          {[
                            { id: 'logo', label: '🏷️ Logo' },
                            { id: 'banner', label: '📢 Bannière' },
                            { id: 'restaurant', label: '🏢 Images du restaurant' },
                            { id: 'gallery', label: '📸 Galerie' },
                            { id: 'sections', label: '🖼️ Images des sections' }
                          ].map((subTab) => (
                            <button
                              key={subTab.id}
                              type="button"
                              onClick={() => setInterfaceSubTab(subTab.id as any)}
                              className={`px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider border-b-2 transition-all shrink-0 cursor-pointer ${
                                interfaceSubTab === subTab.id
                                  ? 'border-[#D4AF37] text-[#D4AF37] bg-stone-900/40'
                                  : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-900/10'
                              }`}
                            >
                              {subTab.label}
                            </button>
                          ))}
                        </div>

                        {/* SUB-TAB 1: LOGO */}
                        {interfaceSubTab === 'logo' && (
                          <div className="bg-[#0b0b0b] border border-stone-850 p-5 rounded-2xl space-y-4">
                            <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#D4AF37] border-b border-stone-850 pb-2 mb-2">
                              🏷️ Réglages du Logo & Nom de la Marque
                            </h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold block">Texte Typographique du Logo</span>
                                <input
                                  type="text"
                                  value={draftSettings.logoText}
                                  onChange={(e) => adminUpdateDraftSettings({ ...draftSettings, logoText: e.target.value })}
                                  className="w-full bg-stone-950 border border-stone-850 p-2.5 rounded-lg text-xs font-medium text-stone-100 focus:outline-none focus:border-amber-500"
                                />
                                <p className="text-[9px] text-stone-500">S'affiche dans la barre de navigation et sur les bas de page.</p>
                              </div>

                              <div className="space-y-1">
                                <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold block">Logo Graphique (Télécharger)</span>
                                <div className="flex gap-3 items-center bg-stone-950 p-2.5 rounded-lg border border-stone-850">
                                  {draftSettings.logoImg ? (
                                    <img src={draftSettings.logoImg} alt="Logo preview" className="w-10 h-10 object-contain rounded bg-stone-900 border" />
                                  ) : (
                                    <div className="w-10 h-10 bg-stone-900 border border-dashed border-stone-800 rounded flex items-center justify-center text-stone-600 text-[10px]">LOGO</div>
                                  )}
                                  <div className="flex-1 space-y-1.5">
                                    <input
                                      type="file"
                                      id="brand-logo-file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          const reader = new FileReader();
                                          reader.onloadend = () => {
                                            if (typeof reader.result === 'string') {
                                              adminUpdateDraftSettings({ ...draftSettings, logoImg: reader.result });
                                            }
                                          };
                                          reader.readAsDataURL(file);
                                        }
                                      }}
                                    />
                                    <div className="flex gap-1">
                                      <label
                                        htmlFor="brand-logo-file"
                                        className="px-2.5 py-1 bg-stone-900 text-[10px] hover:bg-stone-850 text-stone-200 border border-stone-800 font-bold rounded cursor-pointer transition-colors"
                                      >
                                        Uploader
                                      </label>
                                      {draftSettings.logoImg && (
                                        <button
                                          type="button"
                                          onClick={() => adminUpdateDraftSettings({ ...draftSettings, logoImg: '' })}
                                          className="px-1.5 py-1 bg-red-950/20 text-red-500 border border-red-950/40 text-[10px] hover:bg-red-950/40 font-bold rounded transition-colors cursor-pointer"
                                        >
                                          Retirer
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* SUB-TAB 2: BANNIÈRE */}
                        {interfaceSubTab === 'banner' && (
                          <div className="bg-[#0b0b0b] border border-stone-850 p-5 rounded-2xl space-y-4">
                            <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#D4AF37] border-b border-stone-850 pb-2 mb-2">
                              📢 Bannière d'Annonces & Livraisons
                            </h4>
                            <p className="text-[10px] text-stone-400 leading-relaxed">
                              Configurez l'annonce textuelle qui s'affiche en haut de toutes les pages de la plateforme web pour mettre en avant une promotion ou une information clef.
                            </p>
                            
                            <div className="space-y-4 pt-2">
                              <div className="space-y-1">
                                <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold block">Texte de l'annonce de livraison / promotion</span>
                                <input
                                  type="text"
                                  placeholder="Ex: Livraison Gratuite dès 15 000 FCFA d'achat !"
                                  value={draftSettings.deliveryBannerText || ''}
                                  onChange={(e) => adminUpdateDraftSettings({ ...draftSettings, deliveryBannerText: e.target.value })}
                                  className="w-full bg-stone-950 border border-stone-850 p-2.5 rounded-lg text-xs font-medium text-stone-100 focus:outline-none focus:border-[#D4AF37]"
                                />
                                <p className="text-[9px] text-stone-500 font-mono">Laissez ce champ vide si vous souhaitez masquer complètement la bannière.</p>
                              </div>

                              {/* Live preview */}
                              <div className="space-y-1 pt-2">
                                <span className="text-[10px] text-stone-500 uppercase tracking-widest font-semibold block">Prévisualisation de la Bannière</span>
                                {draftSettings.deliveryBannerText ? (
                                  <div className="bg-[#D4AF37] text-stone-950 text-xs py-2.5 px-4 rounded-xl font-extrabold text-center flex items-center justify-center gap-1.5 shadow" style={{ backgroundColor: draftSettings.brandColor }}>
                                    <Sparkles size={12} className="animate-spin-slow text-stone-950" />
                                    <span>{draftSettings.deliveryBannerText}</span>
                                  </div>
                                ) : (
                                  <div className="border border-stone-850/60 p-3 text-stone-600 rounded-lg text-[10px] text-center italic">
                                    Bannière actuellement masquée
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* SUB-TAB 3: IMAGES DU RESTAURANT */}
                        {interfaceSubTab === 'restaurant' && (
                          <div className="bg-[#0b0b0b] border border-stone-850 p-5 rounded-2xl space-y-4">
                            <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#D4AF37] border-b border-stone-850 pb-2 mb-2">
                              🏢 Galerie des Espaces du Restaurant
                            </h4>
                            <p className="text-[10px] text-stone-400 leading-relaxed">
                              Uploadez les photos de vos différentes zones physiques du restaurant. Elles s'afficheront dans les présentations de récits historiques et lounges.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                              {/* Salle unique / About_1 */}
                              <div className="p-3 bg-stone-950 border border-stone-850 rounded-xl space-y-2">
                                <span className="text-[9px] text-[#D4AF37] uppercase tracking-wider font-extrabold block">Image de la Salle Principale</span>
                                <div className="relative h-28 rounded-lg overflow-hidden border border-stone-850 bg-stone-900 flex items-center justify-center">
                                  <img src={draftSettings.aboutImage1} alt="Salle principale preview" className="absolute inset-0 w-full h-full object-cover" />
                                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/90 to-transparent p-1">
                                    <span className="text-[8px] font-mono text-stone-400 block truncate">aboutImage1 key</span>
                                  </div>
                                </div>
                                <input
                                  type="file"
                                  id="sub-about1-coverage-file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        if (typeof reader.result === 'string') {
                                          adminUpdateDraftSettings({ ...draftSettings, aboutImage1: reader.result });
                                        }
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                                <label
                                  htmlFor="sub-about1-coverage-file"
                                  className="w-full py-1.5 block pb-1.5 bg-stone-900 text-center hover:bg-stone-850 text-stone-200 text-[10px] font-bold rounded border border-stone-800 cursor-pointer transition-colors"
                                >
                                  Remplacer l'image de la salle
                                </label>
                              </div>

                              {/* Terrasse / About_2 */}
                              <div className="p-3 bg-stone-950 border border-stone-850 rounded-xl space-y-2">
                                <span className="text-[9px] text-[#D4AF37] uppercase tracking-wider font-extrabold block">Image de la Terrasse Extérieure</span>
                                <div className="relative h-28 rounded-lg overflow-hidden border border-stone-850 bg-stone-900 flex items-center justify-center">
                                  <img src={draftSettings.aboutImage2} alt="Terrasse preview" className="absolute inset-0 w-full h-full object-cover" />
                                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/90 to-transparent p-1">
                                    <span className="text-[8px] font-mono text-stone-400 block truncate">aboutImage2 key</span>
                                  </div>
                                </div>
                                <input
                                  type="file"
                                  id="sub-about2-coverage-file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        if (typeof reader.result === 'string') {
                                          adminUpdateDraftSettings({ ...draftSettings, aboutImage2: reader.result });
                                        }
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                                <label
                                  htmlFor="sub-about2-coverage-file"
                                  className="w-full py-1.5 block pb-1.5 bg-stone-900 text-center hover:bg-stone-850 text-stone-200 text-[10px] font-bold rounded border border-stone-800 cursor-pointer transition-colors"
                                >
                                  Remplacer l'image de la terrasse
                                </label>
                              </div>

                              {/* VIP Lounge */}
                              <div className="p-3 bg-stone-950 border border-stone-850 rounded-xl space-y-2 md:col-span-2">
                                <span className="text-[9px] text-[#D4AF37] uppercase tracking-wider font-extrabold block">Image de l'Espace Lounge VIP Privé</span>
                                <div className="relative h-28 rounded-lg overflow-hidden border border-stone-850 bg-stone-900 flex items-center justify-center">
                                  <img src={draftSettings.vipImage} alt="VIP space preview" className="absolute inset-0 w-full h-full object-cover" />
                                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/90 to-transparent p-1">
                                    <span className="text-[8px] font-mono text-stone-400 block truncate">vipImage key</span>
                                  </div>
                                </div>
                                <input
                                  type="file"
                                  id="sub-vip-coverage-file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        if (typeof reader.result === 'string') {
                                          adminUpdateDraftSettings({ ...draftSettings, vipImage: reader.result });
                                        }
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                                <label
                                  htmlFor="sub-vip-coverage-file"
                                  className="w-full py-1.5 block pb-1.5 bg-stone-900 text-center hover:bg-stone-850 text-stone-200 text-[10px] font-bold rounded border border-stone-800 cursor-pointer transition-colors"
                                >
                                  Remplacer l'image Lounge VIP
                                </label>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* SUB-TAB 4: GALERIE */}
                        {interfaceSubTab === 'gallery' && (
                          <div className="bg-[#0b0b0b] border border-stone-850 p-5 rounded-2xl space-y-4">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-850 pb-3">
                              <div>
                                <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#D4AF37]">
                                  📸 Bibliothèque d'Images (Galerie Photo Générale)
                                </h4>
                                <p className="text-[9px] text-stone-500 mt-1">Gérez le portfolio défilant d'assiettes, d'équipe et d'atmosphère.</p>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  setIsAddingMedia(!isAddingMedia);
                                  setEditingMediaId(null);
                                }}
                                className="px-3 py-1.5 bg-[#D4AF37] hover:bg-[#B8902A] text-stone-950 text-[10px] font-extrabold uppercase tracking-wider rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <Plus size={11} /> Ajouter une photo
                              </button>
                            </div>

                            {/* 3.1 EXPANDER FORM TO ADD GALLERY IMAGES */}
                            <AnimatePresence>
                              {isAddingMedia && (
                                <motion.form
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  onSubmit={handleCreateMediaSubmit}
                                  className="p-4 bg-stone-950 border border-stone-850 rounded-xl space-y-3 overflow-hidden"
                                >
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 block">Nouvelle Image de la Galerie</span>
                                  
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="sm:col-span-2 space-y-1">
                                      <span className="text-[9px] text-stone-400 font-bold block">Fichier Photo</span>
                                      <div className="flex gap-4 items-center bg-stone-900/60 p-3 rounded-lg border border-stone-850">
                                        {newMediaUrl ? (
                                          <img src={newMediaUrl} alt="New raw file" className="w-12 h-12 object-cover rounded" />
                                        ) : (
                                          <div className="w-12 h-12 bg-stone-950 border border-dashed border-stone-800 rounded flex items-center justify-center text-stone-500 text-[9px]">Vide</div>
                                        )}
                                        <input
                                          type="file"
                                          id="new-gallery-image-uploader"
                                          accept="image/*"
                                          className="hidden"
                                          onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                              const reader = new FileReader();
                                              reader.onloadend = () => {
                                                if (typeof reader.result === 'string') {
                                                  setNewMediaUrl(reader.result);
                                                }
                                              };
                                              reader.readAsDataURL(file);
                                            }
                                          }}
                                        />
                                        <label
                                          htmlFor="new-gallery-image-uploader"
                                          className="px-3 py-1.5 bg-stone-950 hover:bg-stone-850 text-stone-200 text-[10px] font-bold rounded border cursor-pointer"
                                        >
                                          Uploader Photo
                                        </label>
                                      </div>
                                    </div>

                                    <div className="space-y-1">
                                      <span className="text-[9px] text-stone-400 font-bold block">Nom de la Photo</span>
                                      <input
                                        type="text"
                                        placeholder="Ex: Façade de nuit"
                                        value={newMediaTitle}
                                        onChange={(e) => setNewMediaTitle(e.target.value)}
                                        className="w-full bg-stone-900 border border-stone-850 p-2 rounded-lg text-xs"
                                        required
                                      />
                                    </div>

                                    <div className="space-y-1">
                                      <span className="text-[9px] text-stone-400 font-bold block">Catégorie</span>
                                      <select
                                        value={newMediaCategory}
                                        onChange={(e) => setNewMediaCategory(e.target.value as any)}
                                        className="w-full bg-stone-900 border border-stone-850 p-2 rounded-lg text-xs text-stone-250"
                                      >
                                        <option value="Façade du restaurant">Façade du restaurant</option>
                                        <option value="Salle principale">Salle principale</option>
                                        <option value="Terrasse">Terrasse</option>
                                        <option value="Lounge VIP">Lounge VIP</option>
                                        <option value="Plats">Plats</option>
                                        <option value="Desserts">Desserts</option>
                                        <option value="Cocktails">Cocktails</option>
                                        <option value="Événements">Événements</option>
                                        <option value="Équipe">Équipe</option>
                                        <option value="Galerie générale">Galerie générale</option>
                                      </select>
                                    </div>
                                  </div>

                                  <div className="flex gap-2 pt-2">
                                    <button
                                      type="submit"
                                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-stone-950 text-[10px] font-extrabold uppercase rounded shadow cursor-pointer transition-colors"
                                    >
                                      Ajouter à la Galerie
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setIsAddingMedia(false);
                                        setNewMediaUrl('');
                                        setNewMediaTitle('');
                                      }}
                                      className="px-3 py-2 bg-stone-850 text-stone-300 text-[10px] font-medium rounded transition-colors"
                                    >
                                      Annuler
                                    </button>
                                  </div>
                                </motion.form>
                              )}
                            </AnimatePresence>

                            {/* 3.2 EXPANDER FORM TO EDIT GALLERY IMAGES */}
                            <AnimatePresence>
                              {editingMediaId && (
                                <motion.form
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  onSubmit={handleSaveEditMedia}
                                  className="p-4 bg-stone-950 border border-[#D4AF37] rounded-xl space-y-3 overflow-hidden"
                                >
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] block">Modifier l'Image de la Galerie</span>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="sm:col-span-2 space-y-1">
                                      <span className="text-[9px] text-stone-400 font-bold block">Remplacer le fichier photo</span>
                                      <div className="flex gap-4 items-center bg-stone-900/60 p-3 rounded-lg border border-stone-850">
                                        {editMediaUrl ? (
                                          <img src={editMediaUrl} alt="Selected edit photo" className="w-12 h-12 object-cover rounded" />
                                        ) : (
                                          <div className="w-12 h-12 bg-stone-950 border border-dashed border-stone-800 rounded flex items-center justify-center text-stone-500 text-[9px]">Vide</div>
                                        )}
                                        <input
                                          type="file"
                                          id="edit-gallery-image-uploader"
                                          accept="image/*"
                                          className="hidden"
                                          onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                              const reader = new FileReader();
                                              reader.onloadend = () => {
                                                if (typeof reader.result === 'string') {
                                                  setEditMediaUrl(reader.result);
                                                }
                                              };
                                              reader.readAsDataURL(file);
                                            }
                                          }}
                                        />
                                        <label
                                          htmlFor="edit-gallery-image-uploader"
                                          className="px-3 py-1.5 bg-stone-950 hover:bg-stone-800 text-stone-200 text-[10px] font-bold rounded border cursor-pointer"
                                        >
                                          Charger une nouvelle photo
                                        </label>
                                      </div>
                                    </div>

                                    <div className="space-y-1">
                                      <span className="text-[9px] text-stone-400 font-bold block">Nom de la Photo</span>
                                      <input
                                        type="text"
                                        value={editMediaTitle}
                                        onChange={(e) => setEditMediaTitle(e.target.value)}
                                        className="w-full bg-stone-900 border border-stone-850 p-2 rounded-lg text-xs"
                                        required
                                      />
                                    </div>

                                    <div className="space-y-1">
                                      <span className="text-[9px] text-stone-400 font-bold block">Catégorie</span>
                                      <select
                                        value={editMediaCategory}
                                        onChange={(e) => setEditMediaCategory(e.target.value as any)}
                                        className="w-full bg-stone-900 border border-stone-850 p-2 rounded-lg text-xs text-stone-250"
                                      >
                                        <option value="Façade du restaurant">Façade du restaurant</option>
                                        <option value="Salle principale">Salle principale</option>
                                        <option value="Terrasse">Terrasse</option>
                                        <option value="Lounge VIP">Lounge VIP</option>
                                        <option value="Plats">Plats</option>
                                        <option value="Desserts">Desserts</option>
                                        <option value="Cocktails">Cocktails</option>
                                        <option value="Événements">Événements</option>
                                        <option value="Équipe">Équipe</option>
                                        <option value="Galerie générale">Galerie générale</option>
                                      </select>
                                    </div>
                                  </div>

                                  <div className="flex gap-2 pt-2">
                                    <button
                                      type="submit"
                                      className="px-4 py-2 bg-[#D4AF37] hover:bg-[#B8902A] text-stone-950 text-[10px] font-extrabold uppercase rounded shadow cursor-pointer transition-colors"
                                    >
                                      Sauvegarder les modifications
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setEditingMediaId(null)}
                                      className="px-3 py-2 bg-stone-850 text-stone-300 text-[10px] font-medium rounded transition-colors"
                                    >
                                      Fermer
                                    </button>
                                  </div>
                                </motion.form>
                              )}
                            </AnimatePresence>

                            {/* CATEGORY SELECTOR CHIPS */}
                            <div className="flex flex-wrap gap-1.5 py-2 border-b border-stone-850/30">
                              {['Tout', 'Façade du restaurant', 'Salle principale', 'Terrasse', 'Lounge VIP', 'Plats', 'Desserts', 'Cocktails', 'Événements', 'Équipe', 'Galerie générale'].map((tab) => (
                                <button
                                  key={tab}
                                  type="button"
                                  onClick={() => setMediaActiveTab(tab)}
                                  className={`px-2.5 py-1 text-[9px] font-bold uppercase rounded-lg border transition-all cursor-pointer ${
                                    mediaActiveTab === tab
                                      ? 'bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/40 font-black'
                                      : 'bg-stone-950 text-stone-400 border-stone-850 hover:text-stone-300'
                                  }`}
                                >
                                  {tab}
                                </button>
                              ))}
                            </div>

                            {/* THE GALLERY PHOTOS GRID */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                              {galleryImages
                                .filter(img => mediaActiveTab === 'Tout' || img.category === mediaActiveTab)
                                .map((img) => (
                                  <div key={img.id} className="group relative bg-stone-950 border border-stone-850 rounded-lg overflow-hidden flex flex-col hover:border-stone-800 transition-colors">
                                    <div className="relative aspect-video bg-stone-900 overflow-hidden">
                                      <img src={img.url} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                      <div className="absolute top-1 left-1 bg-stone-950/80 px-1 py-0.5 rounded border border-[#D4AF37]/20">
                                        <span className="text-[7px] text-[#D4AF37] font-bold font-mono tracking-wider block uppercase">{img.category}</span>
                                      </div>
                                    </div>
                                    <div className="p-2 flex-1 flex flex-col justify-between space-y-2">
                                      <span className="text-[10px] text-stone-200 font-bold block leading-tight truncate-2-lines">{img.title}</span>
                                      
                                      <div className="flex items-center gap-1.5 border-t border-stone-900 pt-1.5">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setEditingMediaId(img.id);
                                            setEditMediaTitle(img.title);
                                            setEditMediaUrl(img.url);
                                            setEditMediaCategory(img.category);
                                            setEditMediaHomeAssign(img.homepageAssignment || 'none');
                                            setIsAddingMedia(false); // Close add mode
                                          }}
                                          className="p-1 px-1.5 text-[8px] uppercase tracking-wider bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white rounded border border-stone-850 font-bold cursor-pointer transition-colors"
                                        >
                                          Modifier
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (confirm(`Voulez-vous réformer/supprimer cette photo de la galerie ?`)) {
                                              adminDeleteGalleryImage(img.id);
                                            }
                                          }}
                                          className="p-1 text-red-400 bg-red-950/15 hover:bg-red-500 hover:text-white border border-red-950/30 rounded cursor-pointer transition-colors"
                                          title="Supprimer la photo de la galerie"
                                        >
                                          <Trash2 size={9} />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}

                        {/* SUB-TAB 5: IMAGES DES SECTIONS */}
                        {interfaceSubTab === 'sections' && (
                          <div className="bg-[#0b0b0b] border border-stone-850 p-5 rounded-2xl space-y-4">
                            <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#D4AF37] border-b border-stone-850 pb-2 mb-2">
                              🖼️ Coquetterie Visuelle des Couvertures de Section
                            </h4>
                            <p className="text-[10px] text-stone-400 leading-relaxed">
                              Mettez à jour les images jouant le rôle de décors géants ou de bannières graphiques au dos des grandes rubriques de la page d'accueil d'un simple clic.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                              {/* Hero Image */}
                              <div className="p-3 bg-stone-950 border border-stone-850 rounded-xl space-y-2">
                                <span className="text-[9px] text-[#D4AF37] uppercase tracking-wider font-extrabold block">Bannière Accueil (Façade / Hero Backdrop)</span>
                                <div className="relative h-28 rounded-lg overflow-hidden border border-stone-850 bg-stone-900 flex items-center justify-center">
                                  <img src={draftSettings.heroImage} alt="Hero Backdrop preview" className="absolute inset-0 w-full h-full object-cover" />
                                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/90 to-transparent p-1">
                                    <span className="text-[8px] font-mono text-stone-400 block truncate">heroImage key</span>
                                  </div>
                                </div>
                                <input
                                  type="file"
                                  id="sub-hero-coverage-file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        if (typeof reader.result === 'string') {
                                          adminUpdateDraftSettings({ ...draftSettings, heroImage: reader.result });
                                        }
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                                <label
                                  htmlFor="sub-hero-coverage-file"
                                  className="w-full py-1.5 block pb-1.5 bg-stone-900 text-center hover:bg-stone-850 text-stone-200 text-[10px] font-bold rounded border border-stone-800 cursor-pointer transition-colors"
                                >
                                  Remplacer la couverture d'accueil
                                </label>
                              </div>

                              {/* Culinary / About_3 */}
                              <div className="p-3 bg-stone-950 border border-stone-850 rounded-xl space-y-2">
                                <span className="text-[9px] text-[#D4AF37] uppercase tracking-wider font-extrabold block">Section Cuisine (Gastronomie & Saveurs)</span>
                                <div className="relative h-28 rounded-lg overflow-hidden border border-stone-850 bg-stone-900 flex items-center justify-center">
                                  <img src={draftSettings.aboutImage3} alt="Cuisine detail preview" className="absolute inset-0 w-full h-full object-cover" />
                                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/90 to-transparent p-1">
                                    <span className="text-[8px] font-mono text-stone-400 block truncate">aboutImage3 key</span>
                                  </div>
                                </div>
                                <input
                                  type="file"
                                  id="sub-about3-coverage-file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        if (typeof reader.result === 'string') {
                                          adminUpdateDraftSettings({ ...draftSettings, aboutImage3: reader.result });
                                        }
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                                <label
                                  htmlFor="sub-about3-coverage-file"
                                  className="w-full py-1.5 block pb-1.5 bg-stone-900 text-center hover:bg-stone-850 text-stone-200 text-[10px] font-bold rounded border border-stone-800 cursor-pointer transition-colors"
                                >
                                  Remplacer l'image de cuisine
                                </label>
                              </div>

                              {/* Events Background */}
                              <div className="p-3 bg-stone-950 border border-stone-850 rounded-xl space-y-2 md:col-span-2">
                                <span className="text-[9px] text-[#D4AF37] uppercase tracking-wider font-extrabold block">Bannière Cocktails, Vins & Événements</span>
                                <div className="relative h-28 rounded-lg overflow-hidden border border-stone-850 bg-stone-900 flex items-center justify-center">
                                  <img src={draftSettings.eventsImage} alt="Events background preview" className="absolute inset-0 w-full h-full object-cover" />
                                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/90 to-transparent p-1">
                                    <span className="text-[8px] font-mono text-stone-400 block truncate">eventsImage key</span>
                                  </div>
                                </div>
                                <input
                                  type="file"
                                  id="sub-events-coverage-file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        if (typeof reader.result === 'string') {
                                          adminUpdateDraftSettings({ ...draftSettings, eventsImage: reader.result });
                                        }
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                                <label
                                  htmlFor="sub-events-coverage-file"
                                  className="w-full py-1.5 block pb-1.5 bg-stone-900 text-center hover:bg-stone-850 text-stone-200 text-[10px] font-bold rounded border border-stone-800 cursor-pointer transition-colors"
                                >
                                  Remplacer l'image d'événements
                                </label>
                              </div>
                            </div>
                          </div>
                        )}

                      </div>

                      {/* Right: State preview column */}
                      <div className="lg:col-span-4 space-y-6">
                        <div className="bg-[#0e0e0e] border border-stone-850 p-5 rounded-2xl space-y-4">
                          <h4 className="text-xs font-bold uppercase text-stone-400 tracking-wider">📦 État de vos Réglages</h4>
                          
                          <div className="space-y-2 border-b border-stone-850/50 pb-4 text-xs">
                            <div className="flex justify-between">
                              <span className="text-stone-500">Logo actif :</span>
                              <span className="text-stone-300 font-medium">{draftSettings.logoText}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-stone-500">Logo Graphique :</span>
                              <span className="text-[10px] text-[#D4AF37] font-mono">{draftSettings.logoImg ? "✓ Téléchargé" : "Aucun"}</span>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <button
                              onClick={() => {
                                adminPublishSettings();
                                alert("✨ Félicitations ! Vos modifications d'images et de bannières ont été enregistrées avec succès et publiées en direct !");
                              }}
                              className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#B8902A] text-stone-950 text-xs font-extrabold uppercase tracking-wider rounded-xl transition-colors cursor-pointer text-center block"
                            >
                              Publier les modifications
                            </button>
                            
                            <button
                              onClick={() => {
                                if (confirm("Voulez-vous restaurer les paramètres d'origine ?")) {
                                  adminResetDraftSettings();
                                }
                              }}
                              className="w-full py-2 bg-stone-950 hover:bg-stone-900 text-stone-400 hover:text-white border border-stone-850 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer text-center block"
                            >
                              Réinitialiser le Brouillon
                            </button>
                          </div>
                        </div>

                        <div className="bg-stone-900/10 border border-stone-850 p-5 rounded-2xl relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
                          <h4 className="text-xs font-bold uppercase text-[#D4AF37] tracking-wider mb-2">💡 Conseil d'Exploitant</h4>
                          <p className="text-[11px] text-stone-400 leading-relaxed">
                            Afin d'offrir une fluidité maximale aux clients consultant le site sur smartphone à Yamoussoukro, toutes vos images locales téléchargées sont automatiquement optimisées avant d'être persistées dans le stockage sécurisé.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* TAB 2: ACTIVE ORDERS LIST */}
            {adminTab === 'orders' && (
              <motion.div
                key="tab-orders"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center border-b border-stone-850 pb-4 mb-2">
                  <div>
                    <h3 className="font-serif text-lg font-bold">Gestion des Commandes Clients</h3>
                    <p className="text-stone-500 text-xs">Traitement des demandes reçues en ligne.</p>
                  </div>
                  <span className="text-xs bg-stone-900 border border-stone-800 px-3 py-1 rounded-xl text-stone-400 font-mono font-bold">
                    {orders.length} au total
                  </span>
                </div>

                {activeRole === 'employe' && (
                  <div className="p-3 bg-stone-900 text-stone-400 border border-stone-800 text-xs font-mono rounded-xl">
                    ⚠️ Mode Consultation Seule: Les serveurs (rôle Employé) disposent d'un accès de consultation uniquement. La modification des états de cuisine ou livraisons est restreinte.
                  </div>
                )}

                {orders.length === 0 ? (
                  <p className="text-stone-500 text-xs py-10 text-center">Aucune commande pour le moment.</p>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="p-5 bg-stone-900/30 border border-stone-850 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-stone-750 transition-colors"
                      >
                        <div>
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className="text-xs font-mono font-black text-stone-200">#{order.id}</span>
                            <span className="text-xs font-bold text-[#D4AF37]">{order.clientName}</span>
                            <span>•</span>
                            <span className="text-xs font-mono text-stone-400">{order.clientPhone}</span>
                            <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full ${
                              order.deliveryType === 'livraison'
                                ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20'
                                : 'bg-stone-850 text-stone-300'
                            }`}>
                              {order.deliveryType}
                            </span>
                          </div>

                          <p className="text-xs text-stone-450 mt-2.5 leading-relaxed bg-[#0c0c0c] p-2.5 rounded-lg border border-stone-900 font-medium">
                            {order.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                          </p>

                          <div className="flex flex-wrap items-center gap-4 text-[10px] text-stone-500 font-mono mt-2">
                            <span>Reçue à: {new Date(order.requestedAt).toLocaleTimeString('fr-FR')}</span>
                            {order.address && (
                              <span className="truncate max-w-[250px] block">📍 {order.address}</span>
                            )}
                            <span className="text-[#D4AF37] font-bold">💰 Total: {order.total.toLocaleString('fr-FR')} FCFA</span>
                          </div>
                        </div>

                        {/* Operational update switch controls */}
                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          <span className="text-[10px] uppercase font-mono text-stone-500 block mr-2">Modifier l'état :</span>
                          
                          {[
                            { status: 'recue', label: '1. Reçue' },
                            { status: 'cuisine', label: '2. En Cuisine' },
                            { status: 'livraison', label: '3. En Route' },
                            { status: 'livree', label: '4. Livrée' }
                          ].map((step) => {
                            const isCurrent = order.status === step.status;
                            return (
                              <button
                                key={step.status}
                                disabled={activeRole === 'employe'}
                                onClick={() => adminUpdateOrderStatus(order.id, step.status as any)}
                                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-colors ${
                                  isCurrent
                                    ? 'bg-[#D4AF37] text-stone-950 font-black'
                                    : 'bg-[#121212] border border-stone-800 text-stone-450 hover:bg-stone-800 hover:text-white cursor-pointer'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                              >
                                {step.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB 3: BOOKINGS RESERVATIONS LIST */}
            {adminTab === 'reservations' && (
              <motion.div
                key="tab-res"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center border-b border-stone-850 pb-4 mb-2">
                  <div>
                    <h3 className="font-serif text-lg font-bold">Approbation des Tables Réservées</h3>
                    <p className="text-stone-500 text-xs">Gestion du placement physique de notre clientèle.</p>
                  </div>
                  <span className="text-xs bg-stone-900 border border-stone-800 px-3 py-1 rounded-xl text-stone-400 font-mono font-bold">
                    {reservations.length} demandes
                  </span>
                </div>

                {activeRole === 'employe' && (
                  <div className="p-3 bg-stone-900 text-stone-400 border border-stone-800 text-xs font-mono rounded-xl">
                    ⚠️ Mode Consultation Seule: Les serveurs (rôle Employé) disposent d'un accès de consultation uniquement. L'attribution des tables et approbation des réservations sont restreintes.
                  </div>
                )}

                {reservations.length === 0 ? (
                  <p className="text-stone-500 text-xs py-10 text-center">Aucune table réservée.</p>
                ) : (
                  <div className="space-y-4">
                    {reservations.map((res) => {
                      const tableVal = tableAssignInputs[res.id] || '';
                      return (
                        <div
                          key={res.id}
                          className={`p-5 rounded-2xl border flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 transition-all ${
                            res.status === 'confirmed'
                              ? 'bg-emerald-950/5 border-emerald-900/30'
                              : res.status === 'cancelled'
                              ? 'bg-red-950/5 border-red-900/20 opacity-60'
                              : 'bg-stone-900/35 border-stone-850'
                          }`}
                        >
                          <div>
                            <div className="flex flex-wrap items-center gap-2.5">
                              <span className="text-xs font-semibold uppercase tracking-wider text-amber-505 text-[#D4AF37]">{res.zone === 'vip' ? '👑 Lounge VIP' : res.zone === 'terrasse' ? 'Terrasse' : 'Salle Classique'}</span>
                              <span>•</span>
                              <span className="text-xs font-bold text-stone-100">{res.clientName}</span>
                              <span className="text-xs text-stone-500 font-mono">({res.clientPhone})</span>
                              {res.tableNumber && (
                                <span className="ml-2 font-mono text-[10px] bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-0.5 rounded border border-[#D4AF37]/20 font-bold">
                                  Table : {res.tableNumber}
                                </span>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-xs text-stone-400 mt-2 font-mono">
                              <span>📅 Le: {res.date} à {res.time}</span>
                              <span>👤 Invités: {res.guests} couverts</span>
                              <span className="text-[10px] text-stone-605 text-stone-500">Requis à: {new Date(res.requestedAt).toLocaleTimeString('fr-FR')}</span>
                            </div>
                          </div>

                          {/* Approvals actions */}
                          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto mt-2 lg:mt-0">
                            {res.status === 'pending' && (
                              <div className="flex gap-2 w-full sm:w-auto">
                                <input
                                  type="text"
                                  placeholder="Ex: TBL-12"
                                  value={tableVal}
                                  disabled={activeRole === 'employe'}
                                  onChange={(e) => handleTableAssignChange(res.id, e.target.value)}
                                  className="bg-stone-950 border border-stone-850 px-2.5 py-1.5 rounded-lg text-xs font-bold uppercase w-24 text-stone-200 focus:outline-none focus:border-[#D4AF37] disabled:opacity-50"
                                  title="Numéro de table à attribuer"
                                />
                                
                                <button
                                  disabled={activeRole === 'employe'}
                                  onClick={() => adminUpdateReservationStatus(res.id, 'confirmed', tableVal || 'TBL-05')}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-500 text-stone-950 text-xs font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                >
                                  <Check size={14} /> Confirmer
                                </button>
                                <button
                                  disabled={activeRole === 'employe'}
                                  onClick={() => adminUpdateReservationStatus(res.id, 'cancelled')}
                                  className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                >
                                  <X size={14} /> Refuser
                                </button>
                              </div>
                            )}

                            {res.status === 'confirmed' && (
                              <span className="text-xs font-bold text-emerald-400 block px-3 py-1.5 bg-emerald-950/20 border border-emerald-900/30 rounded-lg">
                                ✓ Réservation Confirmée
                              </span>
                            )}

                            {res.status === 'cancelled' && (
                              <span className="text-xs font-semibold text-red-500 block px-3 py-1.5 bg-red-950/10 border border-red-900/20 rounded-lg">
                                ✕ Refusée / Annulée
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB 4: REAL-TIME MENU EDITOR */}
            {adminTab === 'menu' && (
              <motion.div
                key="tab-menu-edit"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-850 pb-4 mb-2">
                  <div>
                    <h3 className="font-serif text-lg font-bold">Éditeur des Recettes des Plats</h3>
                    <p className="text-stone-500 text-xs">Mise à jour en temps réel de notre carte en ligne.</p>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      value={menuSearch}
                      onChange={(e) => setMenuSearch(e.target.value)}
                      className="bg-stone-950 border border-stone-850 px-3 py-2 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-[#D4AF37]"
                    />
                    <button
                      disabled={activeRole === 'employe'}
                      onClick={() => setIsAddingItem(!isAddingItem)}
                      className="px-4 py-2 bg-[#D4AF37] hover:bg-[#B8902A] text-stone-950 text-xs font-bold rounded-xl flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Plus size={14} /> Ajouter un Plat
                    </button>
                  </div>
                </div>

                {activeRole === 'employe' && (
                  <div className="p-3 bg-stone-900 text-stone-400 border border-stone-800 text-xs font-mono rounded-xl">
                    ⚠️ Mode Consultation Seule: Les serveurs (rôle Employé) ne peuvent pas ajouter, modifier les prix ou supprimer des plats du menu.
                  </div>
                )}

                {/* Expander form to create dishes */}
                <AnimatePresence>
                  {isAddingItem && activeRole !== 'employe' && (
                    <motion.form
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      onSubmit={handleCreateMenuItem}
                      className="p-5 bg-stone-900 border border-[#D4AF37]/30 rounded-2xl space-y-4 overflow-hidden"
                    >
                      <h4 className="font-serif font-black text-sm text-[#D4AF37] flex items-center gap-1.5"><ListPlus size={15} /> Ajouter un nouveau plat à la carte</h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* 1. Télécharger l'image du plat */}
                        <div className="space-y-1 sm:col-span-3">
                          <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold block">1. Télécharger l'image du plat</span>
                          <div className="flex flex-col sm:flex-row gap-4 items-center bg-stone-950 p-4 rounded-xl border border-stone-850 hover:border-stone-800 transition-colors">
                            {newItemImg ? (
                              <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border border-[#D4AF37]/35">
                                <img src={newItemImg} alt="Preview" className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <div className="w-20 h-20 shrink-0 bg-stone-900 border border-dashed border-stone-800 rounded-lg flex flex-col items-center justify-center text-stone-500">
                                <ImageIcon size={20} />
                                <span className="text-[8px] uppercase tracking-wider mt-1">Aucune photo</span>
                              </div>
                            )}
                            <div className="flex-1 w-full space-y-2">
                              <div className="flex flex-wrap gap-2">
                                <input
                                  type="file"
                                  accept="image/*"
                                  id="add-dish-file"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        if (typeof reader.result === 'string') {
                                          setNewItemImg(reader.result);
                                        }
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                                <label
                                  htmlFor="add-dish-file"
                                  className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-stone-200 ring-1 ring-stone-850 text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1.5 transition-colors"
                                >
                                  <Upload size={12} /> Choisir un fichier...
                                </label>
                                {newItemImg && (
                                  <button
                                    type="button"
                                    onClick={() => setNewItemImg('')}
                                    className="px-2.5 py-2 bg-red-950/20 text-red-400 border border-red-900/40 rounded-lg text-xs font-semibold hover:bg-red-950/40 transition-colors cursor-pointer"
                                  >
                                    Supprimer la photo
                                  </button>
                                )}
                              </div>
                              <p className="text-[9px] text-stone-500 font-mono">
                                Téléchargez une photo d'illustration pour ce plat culinaire à enregistrer.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* 2. Nom du plat */}
                        <div className="space-y-1">
                          <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold block">2. Nom du plat</span>
                          <input
                            type="text"
                            placeholder="Ex: Kedjenou Impérial"
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            className="w-full bg-stone-950 border border-stone-850 p-2.5 rounded-lg text-xs text-stone-250 focus:outline-none focus:border-[#D4AF37] font-medium"
                            required
                          />
                        </div>

                        {/* 3. Description du plat */}
                        <div className="space-y-1 sm:col-span-2">
                          <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold block">3. Description du plat</span>
                          <input
                            type="text"
                            placeholder="Mijoté lentement au feu de bois avec ses épices locales..."
                            value={newItemDesc}
                            onChange={(e) => setNewItemDesc(e.target.value)}
                            className="w-full bg-stone-950 border border-stone-850 p-2.5 rounded-lg text-xs text-stone-250 focus:outline-none focus:border-[#D4AF37] font-medium"
                            required
                          />
                        </div>

                        {/* 4. Catégorie */}
                        <div className="space-y-1">
                          <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold block">4. Catégorie</span>
                          <select
                            value={newItemCategory}
                            onChange={(e) => setNewItemCategory(e.target.value as any)}
                            className="w-full bg-stone-950 border border-stone-850 p-2.5 rounded-lg text-xs text-stone-250 focus:outline-none focus:border-[#D4AF37] font-medium"
                          >
                            <option value="entrée">Entrée</option>
                            <option value="plat_local">Plat Local Ivoirien</option>
                            <option value="plat_inter">Plat International</option>
                            <option value="grillade">Grillades</option>
                            <option value="dessert">Dessert</option>
                            <option value="cocktail">Cocktail Signature</option>
                            <option value="boisson">Boisson fraîche</option>
                          </select>
                        </div>

                        {/* 5. Prix */}
                        <div className="space-y-1">
                          <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold block">5. Prix (FCFA)</span>
                          <input
                            type="number"
                            placeholder="11000"
                            value={newItemPrice}
                            onChange={(e) => setNewItemPrice(parseInt(e.target.value) || 0)}
                            className="w-full bg-stone-950 border border-stone-850 p-2.5 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-[#D4AF37] font-mono font-bold"
                            required
                          />
                        </div>

                        {/* 6. Disponibilité */}
                        <div className="space-y-1">
                          <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold block">6. Disponibilité</span>
                          <div className="flex gap-4 p-2 bg-stone-950 border border-stone-850 rounded-lg h-[41px] items-center">
                            <label className="flex items-center gap-1.5 text-xs text-stone-300 cursor-pointer">
                              <input
                                type="radio"
                                name="newItemIsActive"
                                checked={newItemIsActive === true}
                                onChange={() => setNewItemIsActive(true)}
                                className="text-[#D4AF37] bg-stone-900 border-stone-850 focus:ring-0"
                              />
                              <span>Oui</span>
                            </label>
                            <label className="flex items-center gap-1.5 text-xs text-stone-300 cursor-pointer">
                              <input
                                type="radio"
                                name="newItemIsActive"
                                checked={newItemIsActive === false}
                                onChange={() => setNewItemIsActive(false)}
                                className="text-red-500 bg-stone-900 border-stone-850 focus:ring-0"
                              />
                              <span>Non</span>
                            </label>
                          </div>
                        </div>

                        {/* 7. Plat populaire */}
                        <div className="space-y-1">
                          <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold block">7. Plat populaire</span>
                          <div className="flex gap-4 p-2 bg-stone-950 border border-stone-850 rounded-lg h-[41px] items-center">
                            <label className="flex items-center gap-1.5 text-xs text-stone-300 cursor-pointer">
                              <input
                                type="radio"
                                name="newItemIsPopular"
                                checked={newItemIsPopular === true}
                                onChange={() => setNewItemIsPopular(true)}
                                className="text-[#D4AF37] bg-stone-900 border-stone-850 focus:ring-0"
                              />
                              <span>Oui</span>
                            </label>
                            <label className="flex items-center gap-1.5 text-xs text-stone-300 cursor-pointer">
                              <input
                                type="radio"
                                name="newItemIsPopular"
                                checked={newItemIsPopular === false}
                                onChange={() => setNewItemIsPopular(false)}
                                className="text-stone-500 bg-stone-900 border-stone-850 focus:ring-0"
                              />
                              <span>Non</span>
                            </label>
                          </div>
                        </div>

                        {/* 8. Nouveau plat */}
                        <div className="space-y-1">
                          <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold block">8. Nouveau plat</span>
                          <div className="flex gap-4 p-2 bg-stone-950 border border-stone-850 rounded-lg h-[41px] items-center">
                            <label className="flex items-center gap-1.5 text-xs text-stone-300 cursor-pointer">
                              <input
                                type="radio"
                                name="newItemIsNew"
                                checked={newItemIsNew === true}
                                onChange={() => setNewItemIsNew(true)}
                                className="text-[#D4AF37] bg-stone-900 border-stone-850 focus:ring-0"
                              />
                              <span>Oui</span>
                            </label>
                            <label className="flex items-center gap-1.5 text-xs text-stone-300 cursor-pointer">
                              <input
                                type="radio"
                                name="newItemIsNew"
                                checked={newItemIsNew === false}
                                onChange={() => setNewItemIsNew(false)}
                                className="text-stone-500 bg-stone-900 border-stone-850 focus:ring-0"
                              />
                              <span>Non</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#B8902A] text-stone-950 text-xs font-extrabold uppercase tracking-widest rounded-xl transition-all cursor-pointer"
                      >
                        Enregistrer
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* EDIT DISH FORM CONTAINER */}
                <AnimatePresence>
                  {editingItem && activeRole !== 'employe' && (
                    <motion.form
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      onSubmit={handleSaveEditMenuItem}
                      className="p-5 bg-stone-900 border border-[#D4AF37] rounded-2xl space-y-4 overflow-hidden"
                    >
                      <div className="flex justify-between items-center border-b border-stone-850 pb-3">
                        <h4 className="font-serif font-black text-sm text-[#D4AF37] flex items-center gap-1.5">
                          <FilePen size={15} /> Modifier le plat : {editingItem.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => setEditingItem(null)}
                          className="text-stone-400 hover:text-white text-xs font-semibold cursor-pointer"
                        >
                          Fermer [X]
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* 1. Remplacer l'image du plat */}
                        <div className="space-y-1 sm:col-span-3">
                          <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold block">1. Remplacer l'image du plat</span>
                          <div className="flex flex-col sm:flex-row gap-4 items-center bg-stone-950 p-4 rounded-xl border border-stone-850">
                            {editItemImg ? (
                              <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border border-[#D4AF37]/35">
                                <img src={editItemImg} alt="Preview" className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <div className="w-20 h-20 shrink-0 bg-stone-900 border border-dashed border-stone-800 rounded-lg flex flex-col items-center justify-center text-stone-500">
                                <ImageIcon size={20} />
                                <span className="text-[8px] uppercase tracking-wider mt-1">Aucune photo</span>
                              </div>
                            )}
                            <div className="flex-1 w-full space-y-2">
                              <div className="flex flex-wrap gap-2">
                                <input
                                  type="file"
                                  accept="image/*"
                                  id="edit-dish-file"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        if (typeof reader.result === 'string') {
                                          setEditItemImg(reader.result);
                                        }
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                                <label
                                  htmlFor="edit-dish-file"
                                  className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-stone-200 ring-1 ring-stone-850 text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1.5 transition-colors"
                                >
                                  <Upload size={12} /> Télécharger une Image
                                </label>
                                {editItemImg && (
                                  <button
                                    type="button"
                                    onClick={() => setEditItemImg('')}
                                    className="px-2.5 py-2 bg-red-950/20 text-red-400 border border-red-900/40 rounded-lg text-xs font-semibold hover:bg-red-950/45 transition-colors cursor-pointer"
                                  >
                                    Supprimer la photo
                                  </button>
                                )}
                              </div>
                              <p className="text-[9px] text-stone-500 font-mono">
                                Téléchargez ou glissez-déposez pour remplacer la photo actuelle de ce plat.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* 2. Nom du plat */}
                        <div className="space-y-1">
                          <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold block">2. Nom du plat</span>
                          <input
                            type="text"
                            value={editItemName}
                            onChange={(e) => setEditItemName(e.target.value)}
                            className="w-full bg-stone-950 border border-stone-850 p-2.5 rounded-lg text-xs text-stone-250 focus:outline-none focus:border-[#D4AF37] font-medium"
                            required
                          />
                        </div>

                        {/* 3. Description du plat */}
                        <div className="space-y-1 sm:col-span-2">
                          <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold block">3. Description du plat</span>
                          <input
                            type="text"
                            value={editItemDesc}
                            onChange={(e) => setEditItemDesc(e.target.value)}
                            className="w-full bg-stone-950 border border-stone-850 p-2.5 rounded-lg text-xs text-stone-250 focus:outline-none focus:border-[#D4AF37] font-medium"
                            required
                          />
                        </div>

                        {/* 4. Catégorie */}
                        <div className="space-y-1">
                          <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold block">4. Catégorie</span>
                          <select
                            value={editItemCategory}
                            onChange={(e) => setEditItemCategory(e.target.value as any)}
                            className="w-full bg-stone-950 border border-stone-850 p-2.5 rounded-lg text-xs text-stone-250 focus:outline-none focus:border-[#D4AF37] font-medium"
                          >
                            <option value="entrée">Entrée</option>
                            <option value="plat_local">Plat Local Ivoirien</option>
                            <option value="plat_inter">Plat International</option>
                            <option value="grillade">Grillades</option>
                            <option value="dessert">Dessert</option>
                            <option value="cocktail">Cocktail Signature</option>
                            <option value="boisson">Boisson fraîche</option>
                          </select>
                        </div>

                        {/* 5. Prix */}
                        <div className="space-y-1">
                          <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold block">5. Prix (FCFA)</span>
                          <input
                            type="number"
                            value={editItemPrice}
                            onChange={(e) => setEditItemPrice(parseInt(e.target.value) || 0)}
                            className="w-full bg-stone-950 border border-stone-850 p-2.5 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-[#D4AF37] font-mono font-bold"
                            required
                          />
                        </div>

                        {/* 6. Disponibilité */}
                        <div className="space-y-1">
                          <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold block">6. Disponibilité</span>
                          <div className="flex gap-4 p-2 bg-stone-950 border border-stone-850 rounded-lg h-[41px] items-center">
                            <label className="flex items-center gap-1.5 text-xs text-stone-300 cursor-pointer">
                              <input
                                type="radio"
                                name="editItemIsActive"
                                checked={editItemIsActive === true}
                                onChange={() => setEditItemIsActive(true)}
                                className="text-[#D4AF37] bg-stone-900 border-stone-850 focus:ring-0"
                              />
                              <span>Oui</span>
                            </label>
                            <label className="flex items-center gap-1.5 text-xs text-stone-300 cursor-pointer">
                              <input
                                type="radio"
                                name="editItemIsActive"
                                checked={editItemIsActive === false}
                                onChange={() => setEditItemIsActive(false)}
                                className="text-red-500 bg-stone-900 border-stone-850 focus:ring-0"
                              />
                              <span>Non</span>
                            </label>
                          </div>
                        </div>

                        {/* 7. Plat populaire */}
                        <div className="space-y-1">
                          <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold block">7. Plat populaire</span>
                          <div className="flex gap-4 p-2 bg-stone-950 border border-stone-850 rounded-lg h-[41px] items-center">
                            <label className="flex items-center gap-1.5 text-xs text-stone-300 cursor-pointer">
                              <input
                                type="radio"
                                name="editItemIsPopular"
                                checked={editItemIsPopular === true}
                                onChange={() => setEditItemIsPopular(true)}
                                className="text-[#D4AF37] bg-stone-900 border-stone-850 focus:ring-0"
                              />
                              <span>Oui</span>
                            </label>
                            <label className="flex items-center gap-1.5 text-xs text-stone-300 cursor-pointer">
                              <input
                                type="radio"
                                name="editItemIsPopular"
                                checked={editItemIsPopular === false}
                                onChange={() => setEditItemIsPopular(false)}
                                className="text-stone-500 bg-stone-900 border-stone-850 focus:ring-0"
                              />
                              <span>Non</span>
                            </label>
                          </div>
                        </div>

                        {/* 8. Nouveau plat */}
                        <div className="space-y-1">
                          <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold block">8. Nouveau plat</span>
                          <div className="flex gap-4 p-2 bg-stone-950 border border-stone-850 rounded-lg h-[41px] items-center">
                            <label className="flex items-center gap-1.5 text-xs text-stone-300 cursor-pointer">
                              <input
                                type="radio"
                                name="editItemIsNew"
                                checked={editItemIsNew === true}
                                onChange={() => setEditItemIsNew(true)}
                                className="text-[#D4AF37] bg-stone-900 border-stone-850 focus:ring-0"
                              />
                              <span>Oui</span>
                            </label>
                            <label className="flex items-center gap-1.5 text-xs text-stone-300 cursor-pointer">
                              <input
                                type="radio"
                                name="editItemIsNew"
                                checked={editItemIsNew === false}
                                onChange={() => setEditItemIsNew(false)}
                                className="text-stone-500 bg-stone-900 border-stone-850 focus:ring-0"
                              />
                              <span>Non</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#B8902A] text-stone-950 text-xs font-extrabold uppercase tracking-widest rounded-xl transition-all cursor-pointer"
                      >
                        Enregistrer
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredMenuItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-stone-900/30 border border-stone-850 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-stone-800 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 rounded-lg object-cover bg-stone-950 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="font-bold text-xs text-white leading-tight">{item.name}</h4>
                            {item.isNew && (
                              <span className="text-[8px] bg-amber-500/15 text-amber-500 border border-amber-500/20 px-1 py-0.2 rounded uppercase font-bold font-mono">Nouveau</span>
                            )}
                            {item.popular && (
                              <span className="text-[8px] bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/20 px-1 py-0.2 rounded uppercase font-bold font-mono">Vedette ★</span>
                            )}
                            {!item.isActive && (
                              <span className="text-[8px] bg-red-500/15 text-red-400 border border-red-500/20 px-1 py-0.2 rounded uppercase font-bold font-mono">Masqué</span>
                            )}
                          </div>
                          <p className="text-[10px] text-[#D4AF37] underline capitalize tracking-wide mt-0.5">{item.category.replace('_', ' ')}</p>
                          <p className="text-[11px] font-mono text-zinc-300 mt-1 font-extrabold">{item.price.toLocaleString('fr-FR')} F</p>
                          
                          {/* Secondary images quantity if any */}
                          {item.images && item.images.length > 1 && (
                            <p className="text-[8px] text-stone-500 mt-0.5 font-mono">📁 {item.images.length} photos réelles</p>
                          )}
                        </div>
                      </div>

                      {/* Toggles & Actions */}
                      <div className="flex flex-wrap items-center gap-1.5 self-end sm:self-auto">
                        <button
                          disabled={activeRole === 'employe'}
                          onClick={() => {
                            adminEditMenuItem(item.id, { isActive: !item.isActive });
                          }}
                          className={`px-2 py-1 rounded text-[9px] uppercase font-mono font-bold border transition-colors cursor-pointer ${
                            item.isActive
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                              : 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
                          }`}
                          title="Attribuer statut d'affichage du produit"
                        >
                          {item.isActive ? 'En ligne' : 'Masqué'}
                        </button>

                        <button
                          disabled={activeRole === 'employe'}
                          onClick={() => {
                            adminEditMenuItem(item.id, { popular: !item.popular });
                          }}
                          className={`px-2 py-1 rounded text-[9px] uppercase font-mono font-semibold border transition-colors cursor-pointer ${
                            item.popular
                              ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20 hover:bg-[#D4AF37]/25'
                              : 'bg-stone-900 text-stone-500 border-stone-850 hover:text-stone-400'
                          }`}
                          title="Activer/Basculer l'affichage Vedette"
                        >
                          ★ Vedette
                        </button>

                        <button
                          disabled={activeRole === 'employe'}
                          onClick={() => {
                            adminEditMenuItem(item.id, { isNew: !item.isNew });
                          }}
                          className={`px-2 py-1 rounded text-[9px] uppercase font-mono font-semibold border transition-colors cursor-pointer ${
                            item.isNew
                              ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/25'
                              : 'bg-stone-900 text-stone-500 border-stone-850 hover:text-stone-400'
                          }`}
                          title="Bascule le statut Nouveauté"
                        >
                          ✨ Nouveau
                        </button>

                        <button
                          disabled={activeRole === 'employe'}
                          onClick={() => {
                            setEditingItem(item);
                            setEditItemName(item.name);
                            setEditItemPrice(item.price);
                            setEditItemDesc(item.description);
                            setEditItemCategory(item.category);
                            setEditItemImg(item.image);
                            setEditItemIsPopular(item.popular || false);
                            setEditItemIsNew(item.isNew || false);
                            setEditItemIsActive(item.isActive !== false);
                            setIsAddingItem(false); // Close addition
                          }}
                          className="p-1.5 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/25 hover:bg-[#D4AF37]/20 rounded border transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1 text-[10px]"
                          title="Modifier le produit"
                        >
                          <FilePen size={12} />
                          <span>Modifier</span>
                        </button>

                        <button
                          disabled={activeRole === 'employe'}
                          onClick={() => {
                            if (confirm(`Voulez-vous vraiment retirer "${item.name}" du menu ?`)) {
                              adminDeleteMenuItem(item.id);
                            }
                          }}
                          className="p-1.5 bg-red-950/25 border border-red-900/30 text-red-400 hover:bg-red-500 hover:text-white rounded transition-all cursor-pointer disabled:opacity-50"
                          title="Supprimer définitivement"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* TAB 5 REFERENCE PREVIOUSLY KNOWN AS MEDIA MOVED AND INTEGRATED WITHIN INTERFACE */}
            {adminTab === 'unused_media' && (
              <motion.div
                key="tab-media"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {activeRole !== 'super' ? renderAccessDenied('Super Administrateur') : (
                  <>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-850 pb-4">
                      <div>
                        <h3 className="font-serif text-lg font-bold">Bibliothèque Multimédia</h3>
                        <p className="text-stone-500 text-xs">Uploadez, organisez et affectez vos photos réelles aux sections d'affiche de notre site.</p>
                      </div>

                      <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                        <input
                          type="text"
                          placeholder="Rechercher une photo..."
                          value={mediaSearch}
                          onChange={(e) => setMediaSearch(e.target.value)}
                          className="bg-stone-950 border border-stone-850 px-3 py-2 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-[#D4AF37]"
                        />

                        <button
                          onClick={() => setIsAddingMedia(!isAddingMedia)}
                          className="px-4 py-2 bg-[#D4AF37] hover:bg-[#B8902A] text-stone-950 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus size={14} /> Ajouter une Photo Réelle
                        </button>
                      </div>
                    </div>

                    {/* PHOTO ADD FORM */}
                    <AnimatePresence>
                      {isAddingMedia && (
                        <motion.form
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          onSubmit={handleCreateMediaSubmit}
                          className="p-5 bg-stone-900 border border-[#D4AF37]/35 rounded-2xl space-y-4 overflow-hidden"
                        >
                          <h4 className="font-serif font-bold text-sm text-[#D4AF37] flex items-center gap-2">
                            <ImageIcon size={16} /> Nouvelle Photo de l'Établissement
                          </h4>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold block">Titre de la Photo</span>
                              <input
                                type="text"
                                placeholder="Ex: Grand Salon Klimatisé VIP"
                                value={newMediaTitle}
                                onChange={(e) => setNewMediaTitle(e.target.value)}
                                className="w-full bg-stone-950 border border-stone-850 p-2.5 rounded-lg text-xs text-stone-200 focus:outline-none"
                                required
                              />
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold block">Lien URL de l'image (Haute Qualité)</span>
                              <input
                                type="text"
                                placeholder="Insérer l'URL Unsplash ou le lien de l'image"
                                value={newMediaUrl}
                                onChange={(e) => setNewMediaUrl(e.target.value)}
                                className="w-full bg-stone-950 border border-stone-850 p-2.5 rounded-lg text-xs text-stone-200 focus:outline-none"
                                required
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold block">Classification Catégorie</span>
                              <select
                                value={newMediaCategory}
                                onChange={(e) => setNewMediaCategory(e.target.value as any)}
                                className="w-full bg-stone-950 border border-stone-850 p-2.5 rounded-lg text-xs text-stone-200"
                              >
                                <option value="Restaurant">Restaurant (Locaux, Espaces)</option>
                                <option value="Plats">Plats de Restauration</option>
                                <option value="Cocktails">Cocktails & Boissons</option>
                                <option value="Lounge VIP">Lounge VIP Imperial</option>
                                <option value="Événements">Moments Speciaux & Événements</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold block">Affectation Page d'Accueil (Slot)</span>
                              <select
                                value={newMediaHomeAssign}
                                onChange={(e) => setNewMediaHomeAssign(e.target.value as any)}
                                className="w-full bg-stone-950 border border-stone-850 p-2.5 rounded-lg text-xs text-[#D4AF37] font-bold"
                              >
                                <option value="none">Aucune (Afficher uniquement dans la galerie)</option>
                                <option value="hero">Bannière Principale (Section Hero Backdrop)</option>
                                <option value="about_1:">Section À Propos - Photo 1 (En-haut Gauche)</option>
                                <option value="about_2">Section À Propos - Photo 2 (En-haut Droite)</option>
                                <option value="about_3">Section À Propos - Photo 3 (Au-dessous Gauche)</option>
                                <option value="vip">Présentation Lounge VIP (Bannière Spotlight)</option>
                                <option value="events">Événements Spéciaux (Affiche Billet)</option>
                                <option value="cocktails_feature">Section Cocktails Majeurs</option>
                                <option value="reviews">Arrière-plan des Témoignages Clients</option>
                              </select>
                            </div>
                          </div>

                          <button
                            type="submit"
                            className="w-full py-2.5 bg-emerald-500 text-stone-950 text-xs font-extrabold uppercase tracking-widest rounded-xl hover:brightness-110"
                          >
                            Téléverser et Indexer la Photo Réelle
                          </button>
                        </motion.form>
                      )}
                    </AnimatePresence>

                    {/* SLIDESHOW SIMULATOR PANEL */}
                    <div className="p-4 bg-stone-900/40 border border-stone-850 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${slideshowActive ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-stone-800 text-stone-400'}`}>
                          <Clock size={16} className={slideshowActive ? 'animate-spin-slow' : ''} />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold font-serif text-white">Testeur de Diaporama automatique (Auto-Slideshow)</h4>
                          <p className="text-stone-500 text-[10px]">Activez le défilement automatique des photos réelles présentes dans la médiathèque.</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSlideshowActive(!slideshowActive)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors flex items-center gap-1.5 cursor-pointer ${slideshowActive ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}
                          >
                            {slideshowActive ? (
                              <>
                                <Square size={12} />
                                Arrêter
                              </>
                            ) : (
                              <>
                                <Play size={12} />
                                Lancer
                              </>
                            )}
                          </button>

                          <select
                            value={slideshowInterval}
                            onChange={(e) => setSlideshowInterval(parseInt(e.target.value))}
                            className="bg-stone-950 border border-stone-850 px-2.5 py-1.5 rounded-lg text-[11px] text-stone-300 focus:outline-none"
                          >
                            <option value="2000">Toutes les 2s</option>
                            <option value="3000">Toutes les 3s</option>
                            <option value="5000">Toutes les 5s</option>
                            <option value="10000">Toutes les 10s</option>
                          </select>
                        </div>

                        {slideshowActive && galleryImages.length > 0 && (
                          <div className="text-xs font-mono text-stone-400 flex items-center gap-2">
                            <span>Image active ({slideshowIdx + 1}/{galleryImages.length}) :</span>
                            <span className="text-[#D4AF37] font-semibold underline truncate max-w-[120px]">{galleryImages[slideshowIdx].title}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* DIAPORAMA PREVIEW BOX */}
                    <AnimatePresence>
                      {slideshowActive && galleryImages.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="h-[300px] border border-[#D4AF37]/50 rounded-2xl overflow-hidden relative bg-black flex items-center justify-center shadow-lg"
                        >
                          <AnimatePresence mode="wait">
                            <motion.img
                              key={galleryImages[slideshowIdx].id}
                              src={galleryImages[slideshowIdx].url}
                              alt={galleryImages[slideshowIdx].title}
                              initial={{ opacity: 0, scale: 1.02 }}
                              animate={{ opacity: 0.8, scale: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.7 }}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          </AnimatePresence>

                          <div className="relative z-10 text-center space-y-2 p-6 bg-stone-950/75 border border-stone-800 rounded-xl backdrop-blur-md max-w-sm">
                            <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-1 rounded border border-[#D4AF37]/20 font-mono">
                              DIAPORAMA : {galleryImages[slideshowIdx].category}
                            </span>
                            <h4 className="font-serif text-base font-black text-white leading-tight">{galleryImages[slideshowIdx].title}</h4>
                            {galleryImages[slideshowIdx].homepageAssignment && galleryImages[slideshowIdx].homepageAssignment !== 'none' && (
                              <p className="text-[10px] text-green-400 font-bold font-mono">⭐ Placé sur page d'accueil: {galleryImages[slideshowIdx].homepageAssignment}</p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* CATEGORY SELECTOR CHIPS */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {['Tout', 'Restaurant', 'Plats', 'Cocktails', 'Lounge VIP', 'Événements'].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setMediaActiveTab(tab)}
                          className={`px-3 py-1.5 rounded-lg text-xs uppercase font-bold tracking-wider cursor-pointer ${mediaActiveTab === tab ? 'bg-amber-500/10 text-[#D4AF37] border border-[#D4AF37]/40' : 'bg-stone-900 text-stone-400 border border-stone-850 hover:text-white'}`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    {/* EDIT MEDIA FORM POPUP BLOCK */}
                    <AnimatePresence>
                      {editingMediaId && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        >
                          <form
                            onSubmit={handleSaveEditMedia}
                            className="bg-[#0B0B0B] border border-stone-800 p-6 rounded-3xl max-w-md w-full space-y-4"
                          >
                            <h4 className="font-serif font-black text-lg text-[#D4AF37] border-b border-stone-850 pb-2 flex justify-between items-center">
                              🔑 Propriétés de l'Affichage
                              <button type="button" onClick={() => setEditingMediaId(null)} className="text-stone-500 hover:text-white"><X size={18} /></button>
                            </h4>

                            <div className="space-y-1">
                              <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold block">Titre de l'Image</span>
                              <input
                                type="text"
                                value={editMediaTitle}
                                onChange={(e) => setEditMediaTitle(e.target.value)}
                                className="w-full bg-stone-950 border border-stone-850 p-2.5 rounded-lg text-xs text-white"
                                required
                              />
                            </div>

                            <div className="space-y-1">
                              <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold block">Lien URL Photo</span>
                              <input
                                type="text"
                                value={editMediaUrl}
                                onChange={(e) => setEditMediaUrl(e.target.value)}
                                className="w-full bg-stone-950 border border-stone-850 p-2.5 rounded-lg text-xs text-white font-mono"
                                required
                              />
                            </div>

                            <div className="space-y-1">
                              <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold block">Catégorie filtre</span>
                              <select
                                value={editMediaCategory}
                                onChange={(e) => setEditMediaCategory(e.target.value as any)}
                                className="w-full bg-stone-950 border border-stone-850 p-2.5 rounded-lg text-xs text-white"
                              >
                                <option value="Restaurant">Restaurant</option>
                                <option value="Plats">Plats</option>
                                <option value="Cocktails">Cocktails</option>
                                <option value="Lounge VIP">Lounge VIP</option>
                                <option value="Événements">Événements</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold block">Affectation Page d'Accueil (Section)</span>
                              <select
                                value={editMediaHomeAssign}
                                onChange={(e) => setEditMediaHomeAssign(e.target.value as any)}
                                className="w-full bg-stone-950 border border-stone-850 p-2.5 rounded-lg text-xs text-[#D4AF37] font-bold"
                              >
                                <option value="none">Aucune (Affichage en galerie seulement)</option>
                                <option value="hero">Bannière Principale (Backdrop Hero)</option>
                                <option value="about_1">Section À Propos - Image 1 (Gauche Haut)</option>
                                <option value="about_2">Section À Propos - Image 2 (Droite Haut)</option>
                                <option value="about_3">Section À Propos - Image 3 (Gauche Bas)</option>
                                <option value="vip"> spotlight Présentation Lounge VIP</option>
                                <option value="events">Événements Spéciaux</option>
                                <option value="cocktails_feature">Cocktails & Boissons à l'Affiche</option>
                                <option value="reviews">Arrière-plan des Avis Témoignages</option>
                              </select>
                            </div>

                            <div className="flex gap-3 pt-3">
                              <button
                                type="submit"
                                className="flex-1 py-2 bg-[#D4AF37] hover:bg-[#B8902A] text-stone-950 text-xs font-bold uppercase rounded-xl"
                              >
                                Sauvegarder les modifications
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingMediaId(null)}
                                className="px-4 py-2 bg-stone-900 border border-stone-800 text-stone-300 text-xs font-bold uppercase rounded-xl"
                              >
                                Annuler
                              </button>
                            </div>
                          </form>
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {/* LIST IMAGES CELLS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {filteredMediaImages.map((img) => (
                        <div
                          key={img.id}
                          className="bg-stone-900/30 border border-stone-850 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-stone-700 transition-colors"
                        >
                          <div className="h-44 relative bg-black overflow-hidden">
                            <img
                              src={img.url}
                              alt={img.title}
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            />
                            {img.homepageAssignment && img.homepageAssignment !== 'none' && (
                              <div className="absolute top-2 left-2 bg-[#D4AF37] text-stone-950 text-[9px] uppercase font-mono px-2 py-0.5 rounded font-black border border-stone-900 shadow">
                                slot: {img.homepageAssignment}
                              </div>
                            )}

                            <div className="absolute top-2 right-2 bg-stone-950/80 backdrop-blur-sm text-[10px] uppercase font-bold text-stone-300 px-2 py-0.5 rounded border border-stone-800">
                              {img.category}
                            </div>
                          </div>

                          <div className="p-4 space-y-3">
                            <h4 className="font-serif text-sm font-bold truncate text-white" title={img.title}>{img.title}</h4>
                            <p className="text-[10px] font-mono text-stone-500 truncate">{img.url}</p>

                            <hr className="border-stone-850" />

                            <div className="flex justify-between items-center">
                              <button
                                onClick={() => {
                                  setEditingMediaId(img.id);
                                  setEditMediaTitle(img.title);
                                  setEditMediaUrl(img.url);
                                  setEditMediaCategory(img.category);
                                  setEditMediaHomeAssign(img.homepageAssignment || 'none');
                                }}
                                className="px-3 py-1.5 text-[10px] uppercase font-bold bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 rounded-lg hover:bg-[#D4AF37]/20 transition-all flex items-center gap-1.5 cursor-pointer"
                              >
                                <FilePen size={11} />
                                Configurer
                              </button>

                              <button
                                onClick={() => {
                                  if (confirm(`Voulez-vous supprimer cette photo de la médiathèque ?`)) {
                                    adminDeleteGalleryImage(img.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg border border-red-500/20 bg-red-950/10 hover:bg-red-500 text-red-400 hover:text-white transition-all cursor-pointer"
                                title="Supprimer de la bibliothèque"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {filteredMediaImages.length === 0 && (
                      <p className="text-stone-500 text-xs py-10 text-center">Aucune photo de l'établissement ne correspond à vos filtres.</p>
                    )}
                  </>
                )}
              </motion.div>
            )}

            {/* TAB 6: DYNAMIC PROMOTIONS CODE MAKER (COUPONS) */}
            {adminTab === 'promos' && (
              <motion.div
                key="tab-promos"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {activeRole !== 'super' ? renderAccessDenied('Super Administrateur') : (
                  <>
                    <div className="border-b border-stone-850 pb-4 mb-2">
                      <h3 className="font-serif text-lg font-bold">Générateur de Bons de Réduction</h3>
                      <p className="text-stone-500 text-xs">Configurez de nouveaux coupons de réduction actifs instantanément pour les commandes clients.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      {/* Creator form */}
                      <form onSubmit={handleAddPromo} className="lg:col-span-4 bg-[#0c0c0c] p-5 border border-stone-850 rounded-2xl space-y-4">
                        <h4 className="font-bold text-xs uppercase text-[#D4AF37] tracking-widest flex items-center gap-1.5">
                          <Percent size={14} />
                          Nouveau Coupon
                        </h4>

                        <div className="space-y-1">
                          <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold block">CODE DE RÉDUCTION (Pas d'espace)</span>
                          <input
                            type="text"
                            placeholder="Ex: SPECIALSUMMER"
                            value={newPromoCode}
                            onChange={(e) => setNewPromoCode(e.target.value.replace(/\s+/g, '').toUpperCase())}
                            className="w-full bg-stone-950 border border-stone-850 p-2.5 rounded-lg text-xs text-stone-200 uppercase focus:outline-none focus:border-[#D4AF37]"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold block">Taux de Remise (%)</span>
                          <input
                            type="number"
                            min="5"
                            max="90"
                            value={newPromoDiscount}
                            onChange={(e) => setNewPromoDiscount(parseInt(e.target.value) || 10)}
                            className="w-full bg-stone-950 border border-stone-850 p-2.5 rounded-lg text-xs text-stone-200 focus:outline-none"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold block">Description de l'offre</span>
                          <input
                            type="text"
                            placeholder="Économisez 10% sur les Kédjénous..."
                            value={newPromoDesc}
                            onChange={(e) => setNewPromoDesc(e.target.value)}
                            className="w-full bg-stone-950 border border-stone-850 p-2.5 rounded-lg text-xs text-stone-200 focus:outline-none"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#B8902A] text-stone-950 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                        >
                          Publier l'Offre Promo
                        </button>
                      </form>

                      {/* Promo code list */}
                      <div className="lg:col-span-8 space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2 font-sans">Coupons de Réduction Actifs</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {promotions.map((vc, idx) => (
                            <div
                              key={vc.code || idx}
                              className="p-4 bg-stone-950 border border-[#D4AF37]/20 rounded-xl flex items-center justify-between relative overflow-hidden group"
                            >
                              <div className="space-y-1 pr-4">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-xs font-mono font-black text-white px-2 py-0.5 bg-stone-900 border border-stone-800 rounded">
                                    {vc.code}
                                  </span>
                                  <span className="text-xs font-bold text-emerald-400 font-mono">-{vc.discountPercentage}%</span>
                                </div>
                                <p className="text-[10px] text-stone-400 mt-1.5 leading-tight">{vc.description}</p>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    if (confirm(`Voulez-vous supprimer définitivement le code promo ${vc.code} ?`)) {
                                      adminDeletePromotion(vc.code);
                                    }
                                  }}
                                  className="p-1.5 rounded-lg border border-red-500/20 bg-red-950/20 hover:bg-red-500 text-red-500 hover:text-white transition-all cursor-pointer opacity-80 group-hover:opacity-100"
                                  title="Supprimer ce coupon"
                                >
                                  <Trash2 size={12} />
                                </button>
                                <span className="text-[8px] uppercase tracking-wider text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded font-mono shrink-0">
                                  Actif
                                </span>
                              </div>
                            </div>
                          ))}
                          {promotions.length === 0 && (
                            <div className="col-span-2 text-center py-8 bg-stone-900/10 border border-stone-850 rounded-xl">
                              <p className="text-xs text-stone-500">Aucun code promo actif actuellement. Créez-en un à gauche !</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* TAB 7: ADMINISTRATORS & ROLES MANAGER */}
            {adminTab === 'admins' && (
              <motion.div
                key="tab-admins"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {activeRole !== 'super' ? renderAccessDenied('Super Administrateur') : (
                  <>
                    <div className="border-b border-stone-850 pb-4 mb-2">
                      <h3 className="font-serif text-lg font-bold">Habilitations & Rôles Admin</h3>
                      <p className="text-stone-500 text-xs">Vérifiez les comptes d'accès, rôles et créez de nouvelles habilitations.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      {/* Creator form */}
                      <form onSubmit={handleAddSubUserSubmit} className="lg:col-span-4 bg-[#0c0c0c] p-5 border border-stone-850 rounded-2xl space-y-4">
                        <h4 className="font-bold text-xs uppercase text-[#D4AF37] tracking-widest flex items-center gap-1.5">
                          <Users2 size={14} />
                          Habiliter un Membre
                        </h4>

                        <div className="space-y-1">
                          <span className="text-[10px] text-stone-405 uppercase tracking-widest font-bold block">Nom Complet</span>
                          <input
                            type="text"
                            placeholder="Ex: Curtis Kouadip"
                            value={newAdminName}
                            onChange={(e) => setNewAdminName(e.target.value)}
                            className="w-full bg-stone-950 border border-stone-850 p-2.5 rounded-lg text-xs text-stone-200"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] text-stone-405 uppercase tracking-widest font-bold block">Adresse Email</span>
                          <input
                            type="email"
                            placeholder="Ex: curtis@cafe-bonnehumeur.ci"
                            value={newAdminEmail}
                            onChange={(e) => setNewAdminEmail(e.target.value)}
                            className="w-full bg-stone-950 border border-stone-850 p-2.5 rounded-lg text-xs text-stone-200 font-mono"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] text-stone-450 uppercase tracking-widest font-bold block">Rôle assigné</span>
                          <select
                            value={newAdminRole}
                            onChange={(e) => setNewAdminRole(e.target.value as any)}
                            className="w-full bg-stone-950 border border-stone-850 p-2.5 rounded-lg text-xs text-stone-200"
                          >
                            <option value="super">Super Administrateur (Accès total)</option>
                            <option value="gestionnaire">Gestionnaire (Réservations, Commandes, Menu)</option>
                            <option value="employe">Employé (Consultations seules de la cuisine)</option>
                          </select>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#B8902A] text-stone-950 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                        >
                          Créer l'Accès Habilité
                        </button>
                      </form>

                      {/* Accounts lists */}
                      <div className="lg:col-span-8 space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Comptes d'Administration</h4>
                        <div className="space-y-3">
                          {adminUsers.map((user) => (
                            <div
                              key={user.id}
                              className="p-4 bg-stone-950 border border-stone-850 rounded-xl flex justify-between items-center"
                            >
                              <div>
                                <span className="text-xs font-bold text-white block">{user.name}</span>
                                <span className="text-[10px] text-stone-500 font-mono">{user.email}</span>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className={`text-[9px] uppercase font-mono font-bold px-2 py-0.5 rounded border ${
                                  user.role === 'super'
                                    ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                    : user.role === 'gestionnaire'
                                    ? 'bg-amber-500/10 text-[#D4AF37] border-amber-500/20'
                                    : 'bg-stone-800 text-stone-400 border-stone-700'
                                }`}>
                                  {user.role === 'super' ? 'Super Admin' : user.role === 'gestionnaire' ? 'Gestionnaire' : 'Serveur / Employé'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
