import { useState, useEffect } from 'react';
import { MenuItem, CartItem, Reservation, Order, LoyaltyAccount, VIPEvent, Review, Promotion, EventBooking, GalleryImg, AdminUser, AdminSession, SiteSettings } from './types';
import { INITIAL_MENU_ITEMS, INITIAL_EVENTS, INITIAL_REVIEWS, INITIAL_PROMOTIONS } from './data';

export function convertGoogleDriveUrl(url: string): string {
  if (!url) return '';
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://docs.google.com/uc?export=download&id=${match[1]}`;
  }
  return url;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  logoText: 'Le Café Bonne Humeur',
  logoImg: '',
  brandColor: '#D4AF37',
  brandHoverColor: '#B8902A',
  colorPresetName: 'Or Impérial',
  
  heroSlogan: 'Le goût du bonheur',
  heroSubSlogan: 'à chaque instant.',
  heroSubtitle: "Une immersion culinaire unique à Yamoussoukro. L'excellence de la gastronomie ivoirienne tressée avec raffinement, agrémentée de cocktails signatures dorés et d'un lounge feutré d'un prestige rare.",
  
  aboutTitle: 'Un Art de Vivre Authentique',
  aboutStory1: "Depuis sa fondation au cœur de Yamoussoukro, Le Café Bonne Humeur s'impose comme une adresse incontournable alliant avec brio l'authenticité de l'hospitalité ivoirienne et l'architecture moderne des plus grands lounges occidentaux.",
  aboutStory2: "Notre philosophie repose sur le respect des produits maraîchers locaux récoltés dans les plaines d'Afrique de l'Ouest. Nos kédjénous mijotent lentement dans de véritables canaris d'argile faits main, tandis que la Sole tressée braisée est escortée par un Alloco d'une maturité dorée parfaite et un piment noir aux mille vertus secrètes.",
  aboutBadge: 'La Quintessence Royale',
  
  vipTitle: "L'Expérience Privée Impériale",
  vipDescription: "Plongez dans l'intimité feutrée de notre Lounge VIP. Service d'exception à la cloche, cigares de prestige importés de Cuba et spiritueux d'un raffinement unique dans une ambiance sécurisée et climatisée de Yamoussoukro.",
  
  deliveryBannerText: "Livraison Gratuite à Yamoussoukro dès 15 000 FCFA d'achat !",
  
  openingHoursWeekday: '7j / 7 — Ouvert de 11h00 à 02h00',
  openingHoursWeekend: 'Weekend Prolongé de 11h00 à 04h00',
  
  contactPhone: '07 16 19 56 99',
  contactAddress: 'Quartier Millionnaire, Face à la Basilique, Yamoussoukro',
  contactEmail: 'contact@cafe-bonnehumeur.ci',
  
  socialFacebook: 'https://facebook.com/cafebonnehumeuryks',
  socialInstagram: 'https://instagram.com/cafebonnehumeuryks',
  socialTwitter: 'https://twitter.com/cafebonnehumeuryks',
  socialTiktok: 'https://tiktok.com/@cafebonnehumeuryks',
  
  heroImage: 'https://i.imgur.com/bWdnAZi.jpeg',
  aboutImage1: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
  aboutImage2: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&q=80&w=800',
  aboutImage3: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&q=80&w=800',
  vipImage: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=800',
  eventsImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800'
};

export function useAppState() {
  // Published active site customization settings
  const [publishedSettings, setPublishedSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('cbh_published_settings');
    const settings = saved ? JSON.parse(saved) : { ...DEFAULT_SITE_SETTINGS };
    settings.heroImage = 'https://i.imgur.com/bWdnAZi.jpeg';
    return settings;
  });

  // Draft/Working customization settings being edited by the manager
  const [draftSettings, setDraftSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('cbh_draft_settings');
    const settings = saved ? JSON.parse(saved) : { ...DEFAULT_SITE_SETTINGS };
    settings.heroImage = 'https://i.imgur.com/bWdnAZi.jpeg';
    return settings;
  });

  // Double state to toggle if we are previewing the working copy
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(true);

  // Dynamic promo codes list (since manager can customize promos)
  const [promotions, setPromotions] = useState<Promotion[]>(() => {
    const saved = localStorage.getItem('cbh_promotions');
    return saved ? JSON.parse(saved) : INITIAL_PROMOTIONS;
  });

  // Media library state with dynamic real photos provided by the owner
  const [galleryImages, setGalleryImages] = useState<GalleryImg[]>(() => {
    const saved = localStorage.getItem('cbh_gallery_images');
    let list: GalleryImg[];
    if (saved) {
      list = JSON.parse(saved);
      list = list.map((img) => {
        if (img.homepageAssignment === 'hero' || img.id === 'gal-6') {
          return {
            ...img,
            url: 'https://i.imgur.com/bWdnAZi.jpeg'
          };
        }
        return img;
      });
    } else {
      list = [
        {
          id: 'gal-1',
          url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
          title: 'Notre Salle Principale Cosy',
          category: 'Salle principale',
          homepageAssignment: 'about_1'
        },
        {
          id: 'gal-2',
          url: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&q=80&w=800',
          title: 'Gastronomie Ivoirienne Sublimée',
          category: 'Plats',
          homepageAssignment: 'about_2'
        },
        {
          id: 'gal-3',
          url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800',
          title: 'Cocktails Signatures du Mixologue',
          category: 'Cocktails',
          homepageAssignment: 'cocktails_feature'
        },
        {
          id: 'gal-5',
          url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800',
          title: 'Dîners Privés et Soirées d\'Affaires',
          category: 'Événements',
          homepageAssignment: 'events'
        },
        {
          id: 'gal-6',
          url: 'https://i.imgur.com/bWdnAZi.jpeg',
          title: 'Sélection Exclusive de Vins et Alcools',
          category: 'Façade du restaurant',
          homepageAssignment: 'hero'
        },
        {
          id: 'gal-7',
          url: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&q=80&w=800',
          title: 'Sole Tressée Braisée au Feu de Bois',
          category: 'Plats',
          homepageAssignment: 'about_3'
        }
      ];
    }

    // Ensure the requested Imgur gallery image exists in the state
    const hasImgur = list.some((img) => img.url === 'https://i.imgur.com/oWgJ2rM.jpeg');
    if (!hasImgur) {
      list.push({
        id: 'gal-imgur-1',
        url: 'https://i.imgur.com/oWgJ2rM.jpeg',
        title: 'Le Café Bonne Humeur',
        category: 'Salle principale',
        homepageAssignment: 'none'
      });
    }

    return list.filter((img) => img && img.id !== 'gal-4' && img.category !== 'Lounge VIP');
  });

  // Admin users state (can be managed or viewed by Super Admin)
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => {
    const saved = localStorage.getItem('cbh_admin_users');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'adm-1', name: 'Alain Kouadio (Super Admin)', email: 'admin@cafe-bonnehumeur.ci', role: 'super' },
      { id: 'adm-2', name: 'Mariam Diallo (Gestionnaire)', email: 'gestion@cafe-bonnehumeur.ci', role: 'gestionnaire' },
      { id: 'adm-3', name: 'Jean-Baptiste Yao (Employé)', email: 'employe@cafe-bonnehumeur.ci', role: 'employe' }
    ];
  });

  // Admin secure session state
  const [adminSession, setAdminSession] = useState<AdminSession | null>(() => {
    const saved = localStorage.getItem('cbh_admin_session');
    return saved ? JSON.parse(saved) : null;
  });

  // Menu items - Editable by admin!
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('cbh_menu_items');
    let list: MenuItem[] = [];
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        list = parsed.map((item: any) => ({
          ...item,
          category: item.id === 'int-3' ? 'plat_local' : item.category,
          images: item.images && item.images.length > 0 ? item.images : [item.image],
          isActive: item.isActive !== undefined ? item.isActive : true,
          isNew: item.isNew !== undefined ? item.isNew : false,
          popular: item.popular !== undefined ? item.popular : false
        }));
      } catch (err) {
        console.error("Format error in menu items", err);
        list = [];
      }
    }

    if (list.length === 0) {
      list = INITIAL_MENU_ITEMS.map((item) => ({
        ...item,
        images: [item.image],
        isActive: true,
        isNew: item.id === 'ent-1' || item.id === 'cok-2' || item.id === 'loc-4' || item.id === 'loc-5' || item.id === 'int-3',
        popular: item.popular || false
      }));
    } else {
      const hasLoc4 = list.some((item) => item.id === 'loc-4');
      if (!hasLoc4) {
        const loc4Item = INITIAL_MENU_ITEMS.find((item) => item.id === 'loc-4');
        if (loc4Item) {
          list.push({
            ...loc4Item,
            images: [loc4Item.image],
            isActive: true,
            isNew: true,
            popular: true
          });
        }
      }
      const hasLoc5 = list.some((item) => item.id === 'loc-5');
      if (!hasLoc5) {
        const loc5Item = INITIAL_MENU_ITEMS.find((item) => item.id === 'loc-5');
        if (loc5Item) {
          list.push({
            ...loc5Item,
            images: [loc5Item.image],
            isActive: true,
            isNew: true,
            popular: false
          });
        }
      }
      const hasInt3 = list.some((item) => item.id === 'int-3');
      if (!hasInt3) {
        const int3Item = INITIAL_MENU_ITEMS.find((item) => item.id === 'int-3');
        if (int3Item) {
          list.push({
            ...int3Item,
            images: [int3Item.image],
            isActive: true,
            isNew: true,
            popular: false
          });
        }
      }
    }
    return list.filter((item) => item && item.id !== 'loc-1' && item.id !== 'loc-2' && item.id !== 'loc-3');
  });

  // Client Loyalty Account
  const [loyaltyAccount, setLoyaltyAccount] = useState<LoyaltyAccount | null>(() => {
    const saved = localStorage.getItem('cbh_loyalty_account');
    if (saved) return JSON.parse(saved);
    // Create a default premium logged in account for immediate high quality demonstration!
    const defaultUser: LoyaltyAccount = {
      id: 'usr-99',
      clientName: 'Curtis Kouadio',
      clientPhone: '07 16 19 56 99',
      clientEmail: 'kouadiocurtis24@gmail.com',
      birthday: '1995-10-12',
      points: 1550, // Let them have some initial points for reward demonstration
      level: 'silver',
      joinDate: '2025-11-20',
      couponsUnlocked: ['WELCOMEGUIEST', 'BONNEHUMEUR15']
    };
    return defaultUser;
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cbh_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Promo code
  const [appliedPromo, setAppliedPromo] = useState<Promotion | null>(null);

  // Deliver type
  const [deliveryType, setDeliveryType] = useState<'livraison' | 'retrait'>('livraison');
  const [deliveryAddress, setDeliveryAddress] = useState('Quartier Millionnaire, Villa 24, Yamoussoukro');

  // Customer Reviews
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('cbh_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  // Reservations
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem('cbh_reservations');
    if (saved) return JSON.parse(saved);

    // Initial dummy reservations for beautiful Admin telemetry
    const defaultRes: Reservation[] = [
      {
        id: 'res-101',
        date: '2026-06-08',
        time: '19:30',
        guests: 4,
        zone: 'vip',
        clientName: 'Abdoulaye Coulibaly',
        clientPhone: '05 45 12 98 76',
        clientEmail: 'a.coulibaly@presidence.ci',
        status: 'confirmed',
        tableNumber: 'VIP-1',
        requestedAt: '2026-06-07T14:30:00Z'
      },
      {
        id: 'res-102',
        date: '2026-06-08',
        time: '20:00',
        guests: 2,
        zone: 'terrasse',
        clientName: 'Marie-Laure Konan',
        clientPhone: '07 89 44 23 11',
        clientEmail: 'ml.konan@inphb.ci',
        status: 'pending',
        requestedAt: '2026-06-07T16:15:00Z'
      },
      {
        id: 'res-103',
        date: '2026-06-09',
        time: '13:00',
        guests: 6,
        zone: 'salle',
        clientName: 'Colonel Koffi Jean',
        clientPhone: '01 07 45 61 22',
        clientEmail: 'jean.koffi@defense.ci',
        status: 'confirmed',
        tableNumber: 'SL-04',
        requestedAt: '2026-06-06T10:00:00Z'
      }
    ];
    return defaultRes;
  });

  // Orders list
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('cbh_orders');
    if (saved) return JSON.parse(saved);

    // Initial dummy orders for beautiful Admin telemetry and order status tracing
    const defaultOrders: Order[] = [
      {
        id: 'cmd-901',
        items: [
          { menuItemId: 'loc-4', name: 'Salade Fraîcheur au Poulet', price: 7500, quantity: 2, image: 'https://i.imgur.com/NDxK0h0.jpeg' },
          { menuItemId: 'des-1', name: 'Volcan au Chocolat Pur Ivoire (70%)', price: 5000, quantity: 2, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600' },
          { menuItemId: 'cok-1', name: 'Yamoussoukro Golden Royale', price: 8500, quantity: 2, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600' }
        ],
        total: 42000,
        clientName: 'Pr. Alassane Soro',
        clientPhone: '07 55 99 88 11',
        clientEmail: 'alassane.soro@univ-yks.ci',
        deliveryType: 'livraison',
        address: 'Quartier Sopim, Résidence les Filaos 12, Yamoussoukro',
        status: 'livree',
        requestedAt: '2026-06-07T12:10:00Z',
        pointsEarned: 42,
        discountApplied: 0
      },
      {
        id: 'cmd-902',
        items: [
          { menuItemId: 'gri-1', name: 'Sole Tressée Braisée de San-Pédro', price: 14000, quantity: 1, image: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&q=80&w=600' },
          { menuItemId: 'boi-2', name: 'Gnamankoudji Gingembre Sauvage', price: 3000, quantity: 2, image: 'https://images.unsplash.com/photo-1502741126161-b74847a90888?auto=format&fit=crop&q=80&w=600' }
        ],
        total: 17000,
        clientName: 'Fatoumata Sylla',
        clientPhone: '05 12 15 17 19',
        clientEmail: 'fatou.sylla@outlook.com',
        deliveryType: 'retrait',
        status: 'cuisine',
        requestedAt: '2026-06-07T21:40:00Z',
        pointsEarned: 17,
        discountApplied: 3000
      }
    ];
    return defaultOrders;
  });

  // Event Bookings
  const [eventBookings, setEventBookings] = useState<any[]>(() => {
    const saved = localStorage.getItem('cbh_event_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  // Track state to localStorage
  useEffect(() => {
    localStorage.setItem('cbh_menu_items', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('cbh_loyalty_account', JSON.stringify(loyaltyAccount));
  }, [loyaltyAccount]);

  useEffect(() => {
    localStorage.setItem('cbh_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('cbh_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('cbh_reservations', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem('cbh_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('cbh_event_bookings', JSON.stringify(eventBookings));
  }, [eventBookings]);

  useEffect(() => {
    localStorage.setItem('cbh_gallery_images', JSON.stringify(galleryImages));
  }, [galleryImages]);

  useEffect(() => {
    localStorage.setItem('cbh_published_settings', JSON.stringify(publishedSettings));
  }, [publishedSettings]);

  useEffect(() => {
    localStorage.setItem('cbh_draft_settings', JSON.stringify(draftSettings));
  }, [draftSettings]);

  useEffect(() => {
    localStorage.setItem('cbh_promotions', JSON.stringify(promotions));
  }, [promotions]);

  useEffect(() => {
    localStorage.setItem('cbh_admin_users', JSON.stringify(adminUsers));
  }, [adminUsers]);

  useEffect(() => {
    if (adminSession) {
      localStorage.setItem('cbh_admin_session', JSON.stringify(adminSession));
    } else {
      localStorage.removeItem('cbh_admin_session');
    }
  }, [adminSession]);

  // Core functions
  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.menuItem.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.menuItem.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { menuItem: item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((i) => i.menuItem.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.menuItem.id === itemId ? { ...i, quantity: qty } : i))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
  };

  const applyPromoCode = (codeInput: string): { success: boolean; message: string } => {
    const found = promotions.find(
      (p) => p.code.toUpperCase() === codeInput.trim().toUpperCase() && p.isActive
    );
    if (!found) {
      return { success: false, message: 'Code promo invalide.' };
    }
    const cartTotal = cart.reduce((acc, i) => acc + i.menuItem.price * i.quantity, 0);
    if (found.minOrderValue && cartTotal < found.minOrderValue) {
      return {
        success: false,
        message: `Ce code nécessite un panier minimum de ${found.minOrderValue.toLocaleString('fr-FR')} FCFA.`
      };
    }
    setAppliedPromo(found);
    return { success: true, message: `Code ${found.code} appliqué : -${found.discountPercentage}%` };
  };

  // Checkout order
  const checkout = (phone: string, name: string, email?: string, paymentMethod?: string): Order | null => {
    if (cart.length === 0) return null;

    const cartTotal = cart.reduce((acc, i) => acc + i.menuItem.price * i.quantity, 0);
    const discount = appliedPromo ? Math.round((cartTotal * appliedPromo.discountPercentage) / 100) : 0;
    const finalTotal = cartTotal - discount;

    // Calculate points: 1 point per 1000 FCFA spent
    const pointsEarned = Math.floor(finalTotal / 1000);

    const newOrder: Order = {
      id: `cmd-${Math.floor(100 + Math.random() * 900)}`,
      items: cart.map((i) => ({
        menuItemId: i.menuItem.id,
        name: i.menuItem.name,
        price: i.menuItem.price,
        quantity: i.quantity,
        image: i.menuItem.image
      })),
      total: finalTotal,
      clientName: name,
      clientPhone: phone,
      clientEmail: email,
      deliveryType,
      address: deliveryType === 'livraison' ? deliveryAddress : undefined,
      status: 'recue',
      requestedAt: new Date().toISOString(),
      pointsEarned,
      discountApplied: discount,
      paymentMethod: paymentMethod || 'Wave'
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Update loyalty points if user is logged in
    if (loyaltyAccount) {
      const updatedPoints = loyaltyAccount.points + pointsEarned;
      let newLevel = loyaltyAccount.level;
      if (updatedPoints >= 3000) {
        newLevel = 'gold';
      } else if (updatedPoints >= 1000) {
        newLevel = 'silver';
      } else {
        newLevel = 'bronze';
      }

      setLoyaltyAccount({
        ...loyaltyAccount,
        points: updatedPoints,
        level: newLevel
      });
    }

    clearCart();
    return newOrder;
  };

  // Create Reservation
  const createReservation = (rData: Omit<Reservation, 'id' | 'status' | 'requestedAt'>): Reservation => {
    const newRes: Reservation = {
      ...rData,
      id: `res-${Math.floor(100 + Math.random() * 900)}`,
      status: 'pending',
      requestedAt: new Date().toISOString()
    };

    setReservations((prev) => [newRes, ...prev]);
    return newRes;
  };

  // Create Event Booking
  const bookEvent = (booking: Omit<EventBooking, 'id' | 'requestedAt'>): EventBooking => {
    const newBooking: EventBooking = {
      ...booking,
      id: `evt-bk-${Math.floor(100 + Math.random() * 900)}`,
      requestedAt: new Date().toISOString()
    };
    setEventBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  };

  // Add customer feedback review
  const addReview = (author: string, rating: number, comment: string) => {
    const initials = author
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'A';
    
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      author,
      initials,
      rating,
      comment,
      date: 'À l\'instant',
      verified: true
    };

    setReviews((prev) => [newRev, ...prev]);
  };

  // Login - registration simulator
  const handleLoyaltySignup = (name: string, phone: string, email: string, birthday: string) => {
    const newAccount: LoyaltyAccount = {
      id: `usr-${Math.floor(100 + Math.random() * 900)}`,
      clientName: name,
      clientPhone: phone,
      clientEmail: email,
      birthday,
      points: 100, // Welcome gift!
      level: 'bronze',
      joinDate: new Date().toISOString().split('T')[0],
      couponsUnlocked: ['WELCOMEGUIEST']
    };
    setLoyaltyAccount(newAccount);
    return newAccount;
  };

  const logoutLoyalty = () => {
    setLoyaltyAccount(null);
  };

  // ADMIN OPERATIONS
  const adminAddMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...item,
      id: `item-${Date.now()}`
    };
    setMenuItems((prev) => [...prev, newItem]);
  };

  const adminEditMenuItem = (id: string, updated: Partial<MenuItem>) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  const adminDeleteMenuItem = (id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  };

  const adminUpdateReservationStatus = (id: string, status: Reservation['status'], tableNumber?: string) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status, tableNumber: tableNumber ?? r.tableNumber } : r))
    );
  };

  const adminUpdateOrderStatus = (id: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
  };

  // DYNAMIC MEDIA RESOLVER & FALLBACK SYSTEM
  const getPhotoFor = (assignment: GalleryImg['homepageAssignment']): string => {
    const settings = isPreviewMode ? draftSettings : publishedSettings;
    const keyMap: Record<string, string> = {
      hero: settings.heroImage,
      about_1: settings.aboutImage1,
      about_2: settings.aboutImage2,
      about_3: settings.aboutImage3,
      vip: settings.vipImage,
      events: settings.eventsImage
    };
    if (assignment && keyMap[assignment]) {
      return convertGoogleDriveUrl(keyMap[assignment]);
    }

    const found = galleryImages.find((img) => img.homepageAssignment === assignment);
    if (found && found.url) return convertGoogleDriveUrl(found.url);
    
    // Luxurious fallback photography
    const fallbacks: Record<string, string> = {
      hero: 'https://i.imgur.com/bWdnAZi.jpeg',
      about_1: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
      about_2: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&q=80&w=800',
      about_3: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&q=80&w=800',
      vip: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=800',
      events: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800',
      cocktails_feature: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800',
      reviews: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800'
    };
    return convertGoogleDriveUrl(fallbacks[assignment || ''] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800');
  };

  // MEDIA LIBRARY OPERATIONS
  const adminAddGalleryImage = (img: Omit<GalleryImg, 'id'>) => {
    const newImg: GalleryImg = {
      ...img,
      id: `gal-img-${Date.now()}`
    };
    setGalleryImages((prev) => {
      // Clear other assignments to the same slot
      let updated = prev;
      if (img.homepageAssignment && img.homepageAssignment !== 'none') {
        updated = prev.map((item) =>
          item.homepageAssignment === img.homepageAssignment ? { ...item, homepageAssignment: 'none' } : item
        );
      }
      return [...updated, newImg];
    });
  };

  const adminDeleteGalleryImage = (id: string) => {
    setGalleryImages((prev) => prev.filter((img) => img.id !== id));
  };

  const adminEditGalleryImage = (id: string, updated: Partial<GalleryImg>) => {
    setGalleryImages((prev) => {
      let cleaned = prev;
      if (updated.homepageAssignment && updated.homepageAssignment !== 'none') {
        cleaned = prev.map((item) =>
          item.id !== id && item.homepageAssignment === updated.homepageAssignment
            ? { ...item, homepageAssignment: 'none' }
            : item
        );
      }
      return cleaned.map((img) => (img.id === id ? { ...img, ...updated } : img));
    });
  };

  // ADMINISTRATION SECURITY OPERATIONS
  const loginAdmin = (email: string, pass: string): { success: boolean; message: string; user?: AdminUser } => {
    const emailToPass: Record<string, string> = {
      'admin@cafe-bonnehumeur.ci': 'superadmin',
      'gestion@cafe-bonnehumeur.ci': 'gestionnaire',
      'employe@cafe-bonnehumeur.ci': 'employe'
    };
    
    const foundUser = adminUsers.find(u => u.email.toLowerCase().trim() === email.toLowerCase().trim());
    const expectedPass = emailToPass[email.toLowerCase().trim()] || 'pass123';
    
    if (foundUser && pass === expectedPass) {
      const now = Date.now();
      const session: AdminSession = {
        user: foundUser,
        loginTime: now,
        lastActive: now
      };
      setAdminSession(session);
      return { success: true, message: 'Authentification réussie ! Bienvenue sur vorte espace.', user: foundUser };
    }
    
    return { success: false, message: 'Identifiants de connexion incorrects. Veuillez réessayer.' };
  };

  const logoutAdmin = () => {
    setAdminSession(null);
  };

  const resetAdminPassword = (email: string): { success: boolean; message: string } => {
    const foundUser = adminUsers.some(u => u.email.toLowerCase().trim() === email.toLowerCase().trim());
    if (foundUser) {
      return { 
        success: true, 
        message: `Un e-mail de réinitialisation contenant un lien sécurisé a été simulé et envoyé à ${email}.` 
      };
    }
    return { success: false, message: "Cette adresse e-mail n'est pas répertoriée dans notre annuaire d'administration." };
  };

  const updateAdminLastActive = () => {
    if (adminSession) {
      setAdminSession(prev => prev ? { ...prev, lastActive: Date.now() } : null);
    }
  };

  const adminAddSubUser = (name: string, email: string, role: AdminUser['role']) => {
    const newUser: AdminUser = {
      id: `adm-${Date.now()}`,
      name,
      email,
      role
    };
    setAdminUsers((prev) => [...prev, newUser]);
  };

  // Customize promotions administration
  const adminAddPromotion = (promo: Promotion) => {
    setPromotions((prev) => {
      if (prev.some((p) => p.code.toUpperCase() === promo.code.toUpperCase())) {
        return prev;
      }
      return [...prev, promo];
    });
  };

  const adminEditPromotion = (code: string, updated: Partial<Promotion>) => {
    setPromotions((prev) =>
      prev.map((p) => (p.code === code ? { ...p, ...updated } : p))
    );
  };

  const adminDeletePromotion = (code: string) => {
    setPromotions((prev) => prev.filter((p) => p.code !== code));
  };

  // Customize layout/settings administration
  const adminUpdateDraftSettings = (updated: Partial<SiteSettings>) => {
    setDraftSettings((prev) => ({
      ...prev,
      ...updated
    }));
  };

  const adminPublishSettings = () => {
    setPublishedSettings(draftSettings);
    localStorage.setItem('cbh_published_settings', JSON.stringify(draftSettings));
  };

  const adminResetDraftSettings = () => {
    setDraftSettings(publishedSettings);
  };

  const activeSettings = adminSession && isPreviewMode ? draftSettings : publishedSettings;

  // Watchdog inactivity logout timer
  useEffect(() => {
    if (!adminSession) return;
    
    const checkInterval = setInterval(() => {
      const now = Date.now();
      const MAX_INACTIVE_MS = 5 * 60 * 1000; // 5 minutes inactivity watchdog
      if (now - adminSession.lastActive > MAX_INACTIVE_MS) {
        setAdminSession(null);
      }
    }, 10000); // verify every 10 seconds

    return () => clearInterval(checkInterval);
  }, [adminSession]);

  return {
    menuItems,
    loyaltyAccount,
    cart,
    appliedPromo,
    deliveryType,
    deliveryAddress,
    reviews,
    reservations,
    orders,
    eventBookings,
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
    clearCart,
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
  };
}
export type AppState = ReturnType<typeof useAppState>;
