import { MenuItem, VIPEvent, Review, Promotion } from './types';

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // ENTREE
  {
    id: 'ent-1',
    name: "Salade d'Avocat Impériale",
    description: "Avocat crémeux des savanes, crevettes tigrées marinées au citron vert, zestes de pamplemousse et sauce cocktail légèrement épicée aux herbes.",
    category: 'entrée',
    price: 6500,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600',
    popular: true,
    preparationTime: '10 min',
    ingredients: ['Avocat de Yamoussoukro', 'Crevettes tigrées', 'Citron vert', 'Agrumes', 'Sauce cocktail royale']
  },
  {
    id: 'ent-2',
    name: 'Pastels Dorés de la Lagune',
    description: 'Petits chaussons croustillants farcis au bœuf haché assaisonné aux épices douces et aux oignons caramélisés, servis avec une réduction de tomates épicées.',
    category: 'entrée',
    price: 5500,
    image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&q=80&w=600',
    preparationTime: '12 min',
    ingredients: ['Farine de blé fine', 'Viande de bœuf marinée', 'Herbes aromatiques', 'Sauce tomate pimentée']
  },

  // PLAT LOCAL
  {
    id: 'loc-4',
    name: 'Salade Fraîcheur au Poulet',
    description: 'Effiloché de poulet mariné aux épices douces, servi en barquettes de laitue croquante, relevé d\'une touche de paprika fumé et garni de fraises fraîches',
    category: 'plat_local',
    price: 7500,
    image: 'https://i.imgur.com/NDxK0h0.jpeg',
    popular: true,
    isNew: true,
    preparationTime: '15 min',
    ingredients: ['Effiloché de poulet', 'Laitue croquante', 'Épices douces', 'Paprika fumé', 'Fraises fraîches']
  },
  {
    id: 'loc-5',
    name: 'Alloco aux Œufs Garni',
    description: 'Plantain mûr frit à l\'huile dorée, servi avec des œufs durs, une salade fraîche de tomates et oignons, accompagné d\'une sauce pimentée maison.',
    category: 'plat_local',
    price: 3500,
    image: 'https://i.imgur.com/KijF1Az.jpeg',
    preparationTime: '20 min',
    ingredients: ['Plantain mûr', 'Œufs durs', 'Tomates fraîches', 'Oignons', 'Sauce pimentée maison']
  },

  // PLAT INTER
  {
    id: 'int-1',
    name: 'Filet Mignon au Poivre de Penja',
    description: 'Cœur de filet mignon de bœuf charolais, grillé à la convenance, nappé d\'une sauce crémeuse au poivre noir de Penja du Cameroun. Servi avec un écrasé de patate douce ivoirienne à la truffe et mini poireaux glacés.',
    category: 'plat_inter',
    price: 16500,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600',
    popular: true,
    preparationTime: '20 min',
    ingredients: ['Filet de bœuf tendre', 'Poivre d\'exception de Penja', 'Crème fraîche normande', 'Patate douce bio', 'Beurre de baratte']
  },
  {
    id: 'int-2',
    name: 'Pavé de Saumon en Croûte de Pistache',
    description: 'Saumon sauvage poêlé sur peau, croûte croustillante de pistaches grillées et herbes fraîches, émulsion de safran local et riz noir Venere parfumé à la citronnelle.',
    category: 'plat_inter',
    price: 15500,
    image: 'https://images.unsplash.com/photo-1485962398705-ef6a13c41e8f?auto=format&fit=crop&q=80&w=600',
    preparationTime: '18 min',
    ingredients: ['Pavé de saumon', 'Pistaches concassées', 'Safran indigène', 'Riz noir Venere', 'Citronnelle du potager']
  },
  {
    id: 'int-3',
    name: 'Ragoût de Bœuf aux Champignons',
    description: 'Morceaux de bœuf mijotés longuement dans une sauce brune riche, accompagnés de champignons, carottes fondantes, lardons fumés et petits oignons.',
    category: 'plat_local',
    price: 11500,
    image: 'https://i.imgur.com/rTScVNP.jpeg',
    preparationTime: '30 min',
    ingredients: ['Morceaux de bœuf savoureux', 'Champignons frais', 'Carottes glacées', 'Lardons fumés', 'Petits oignons rôtis', 'Sauce brune réduction']
  },

  // GRILLADE
  {
    id: 'gri-1',
    name: 'Sole Tressée Braisée de San-Pédro',
    description: 'Une sole fraîche entière pêchée sur la côte ouest sauvage, tressée à la main puis lentement braisée au feu de bois avec nos aromates secrets de Grand-Bassam. Accompagnée d\'Alloco fondant doré et de piment noir traditionnel.',
    category: 'grillade',
    price: 14000,
    image: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&q=80&w=600',
    popular: true,
    bestSeller: true,
    preparationTime: '25 min',
    ingredients: ['Sole fraîche côtière', 'Aromates côtiers', 'Banane mûre plantain (Alloco)', 'Piment noir ancestral']
  },
  {
    id: 'gri-2',
    name: 'Choukouya d\'Agneau impérial aux Épices Kankan',
    description: 'Morceaux de gigot d\'agneau tendres fumés et grillés à feu de bois ardent, assaisonnés généreusement d\'un savoureux mélange d\'épices du Nord et de poudre d\'arachide grillée, servis avec oignons crus et tomates jaunes.',
    category: 'grillade',
    price: 13000,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=600',
    preparationTime: '20 min',
    ingredients: ['Gigot d\'agneau du septentrion', 'Épices Kankan secrètes', 'Poudre d\'arachide bio', 'Oignons doux croquants']
  },

  // DESSERT
  {
    id: 'des-1',
    name: 'Volcan au Chocolat Pur Ivoire (70%)',
    description: 'Cœur coulant intense réalisé à partir de fèves de cacao 100% de la coopérative de Soubré, escorté de sa glace artisanale à la gousse de vanille Bourbon.',
    category: 'dessert',
    price: 5000,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600',
    popular: true,
    preparationTime: '15 min',
    ingredients: ['Chocolat noir de Soubré 70%', 'Beurre de cacao', 'Glace vanille de Madagascar', 'Fleur de sel']
  },
  {
    id: 'des-2',
    name: 'Nuage de Mangue de Yamoussoukro',
    description: 'Mousse aérienne au jus pur de mangue greffée locale, brunoise de mangue fraîche caramélisée au miel de brousse et coulis acidulé à la passion de Korhogo.',
    category: 'dessert',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=600',
    preparationTime: '10 min',
    ingredients: ['Mangues greffées locales', 'Miel de brousse sauvage', 'Fruits de la passion farouches']
  },

  // COCKTAIL
  {
    id: 'cok-1',
    name: 'Yamoussoukro Golden Royale',
    description: 'Cocktail Signature somptueux. Rhum de prestige âgé, infusion maison de fleurs d\'hibiscus rouges bio (Bissap), nectar de mangue et purée de passion, couronné de Champagne brut glacé et de véritables paillettes d\'or alimentaires.',
    category: 'cocktail',
    price: 8500,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600',
    popular: true,
    bestSeller: true,
    preparationTime: '5 min',
    ingredients: ['Rhum d\'exception', 'Infusion de Bissap rouge fleurie', 'Mangue sauvage', 'Champagne Brut', 'Paillettes d\'or 24 carats']
  },
  {
    id: 'cok-2',
    name: 'L’Éclat de la Basilique',
    description: 'Une création désaltérante honorant notre monument historique. Gin infusé au concombre, basilic frais pressé, jus de gingembre fort filtré à froid, jus de citron bio et eau gazeuse infusée à la citronnelle rôtie.',
    category: 'cocktail',
    price: 7000,
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=600',
    preparationTime: '5 min',
    ingredients: ['Gin botanique anglais', 'Basilic frais du chef', 'Gingembre fort ivoirien', 'Eau gazeuse artisanale']
  },

  // BOISSON
  {
    id: 'boi-1',
    name: 'Bissap Royal Artisanal',
    description: 'Brassage lent de calices d\'hibiscus séchés du Sahel, parfumés au sucre de canne roux complet, extrait de vanille, menthe fraîche froissée et eau de fleur d\'oranger.',
    category: 'boisson',
    price: 3000,
    image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&q=80&w=600',
    preparationTime: '3 min',
    ingredients: ['Fleurs de bissap sèches', 'Menthe poivrée fraîche', 'Sucre de canne complet', 'Extrait de vanille']
  },
  {
    id: 'boi-2',
    name: 'Gnamankoudji Gingembre Sauvage',
    description: 'Jus de gingembre pur pressé à l\'ancienne, rééquilibré par une touche de jus d\'ananas sucré du pays, de jus de citron jaune des plateaux et de menthe fraîche. Puissant et tonifiant.',
    category: 'boisson',
    price: 3000,
    image: 'https://images.unsplash.com/photo-1502741126161-b74847a90888?auto=format&fit=crop&q=80&w=600',
    preparationTime: '3 min',
    ingredients: ['Gingembre ivoirien frais', 'Ananas Pain de Sucre d\'Ébimpé', 'Citron frais', 'Sirop d\'agave léger']
  }
];

export const INITIAL_EVENTS: VIPEvent[] = [
  {
    id: 'evt-1',
    title: 'Soirée Jazz & Champagne Prestige',
    description: 'Une ambiance feutrée avec le meilleur quintet de Jazz de la capitale, accompagnée d\'une dégustation de champagnes millésimés et de canapés gastronomiques locaux créés par notre chef.',
    date: 'Samedi Prochain, 20h',
    time: '20:00 - 02:00',
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=700',
    price: '25 000 FCFA',
    slotsLeft: 12,
    category: 'Soirée VIP'
  },
  {
    id: 'evt-2',
    title: 'Match de Finale CAN - Ambiance Arena VIP',
    description: 'Suivez la finale de la Coupe d\'Afrique des Nations sur trois écrans géants laser 4K haute fidélité. Animations surprises, Happy Hour non-stop sur les cocktails signatures et grillades enflammées.',
    date: '14 Juin 2026',
    time: '18:00 - 23:30',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=700',
    price: 'Entrée Libre (Réservation Obligatoire)',
    slotsLeft: 45,
    category: 'Match'
  },
  {
    id: 'evt-3',
    title: 'Concert Privé : Éclat Acoustique',
    description: 'Une session acoustique intimiste avec des voix majeures d\'Afrique de l\'Ouest dans notre Lounge VIP climatisé haut de gamme. Dîner gastronomique inclus en 3 temps.',
    date: '28 Juin 2026',
    time: '19:30 - 23:00',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=700',
    price: '40 000 FCFA',
    slotsLeft: 8,
    category: 'Concert'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Serge Koffi',
    initials: 'SK',
    rating: 5,
    comment: 'Une expérience absolument unique à Yamoussoukro ! Le Kédjénou cuit au canari traditionnel a gardé toutes ses saveurs d\'antan. La présentation est moderne, le cadre chic et le service chaleureux. Le Lounge VIP est tout simplement le plus raffiné de la région.',
    date: 'Il y a 2 jours',
    verified: true
  },
  {
    id: 'rev-2',
    author: 'Awa Diarrassouba',
    initials: 'AD',
    rating: 5,
    comment: 'Le cocktail Signature \'Yamoussoukro Golden Royale\' est un chef-d\'œuvre absolu ! Avec ses paillettes d\'or et le bissap fait maison, j\'ai cru rêver. Le personnel fait preuve d\'un professionnalisme rare. Idéal pour mes dîners d\'affaires et réceptions privées.',
    date: 'Il y a une semaine',
    verified: true
  },
  {
    id: 'rev-3',
    author: 'Dr. Jean-Marc Yao',
    initials: 'JY',
    rating: 4,
    comment: 'Recommandé par des confrères et pas du tout déçu. Les grillades de Sole tressée braisée sont exceptionnelles, fondantes à souhait et accompagnées d\'un Alloco bien doré comme on l\'aime chez nous. La carte des vins est également d\'un excellent choix.',
    date: 'Il y a 3 semaines',
    verified: true
  }
];

export const INITIAL_PROMOTIONS: Promotion[] = [
  {
    code: 'BONNEHUMEUR15',
    discountPercentage: 15,
    description: 'Commandez en ligne et bénéficiez de 15% de réduction dès 25 000 FCFA d\'achat sur toute la carte.',
    minOrderValue: 25000,
    isActive: true
  },
  {
    code: 'WELCOMEGUIEST',
    discountPercentage: 10,
    description: 'Une réduction de bienveillance de 10% sur votre toute première commande en ligne chez nous !',
    isActive: true
  },
  {
    code: 'VIPLOUNGE',
    discountPercentage: 20,
    description: 'Promotion spéciale Lounge VIP pour célébrer vos réservations d\'exception en ligne.',
    minOrderValue: 45000,
    isActive: true
  }
];

export const GALLERY_IMGS = [
  {
    id: 'gal-1',
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
    title: 'Notre Salle Principale Cosy',
    category: 'Restaurant'
  },
  {
    id: 'gal-2',
    url: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&q=80&w=800',
    title: 'Gastronomie Ivoirienne Sublimée',
    category: 'Plats'
  },
  {
    id: 'gal-3',
    url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800',
    title: 'Cocktails Signatures du Mixologue',
    category: 'Cocktails'
  },
  {
    id: 'gal-5',
    url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800',
    title: 'Dîners Privés et Soirées d\'Affaires',
    category: 'Événements'
  },
  {
    id: 'gal-6',
    url: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&q=80&w=800',
    title: 'Sélection Exclusive de Vins et Alcools',
    category: 'Façade du restaurant'
  }
];
