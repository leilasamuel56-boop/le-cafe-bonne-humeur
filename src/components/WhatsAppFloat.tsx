import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquareShare, Send, X, Check, Laptop, Clock, Star } from 'lucide-react';

export default function WhatsAppFloat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: '🌞 Akwaba ! Bienvenue au Café Bonne Humeur de Yamoussoukro. Je suis Affoué, votre assistant gastronomique. Comment puis-je égayer votre journée ?',
      time: 'À l\'instant'
    }
  ]);
  const [inputText, setInputText] = useState('');

  const preWrittenQueries = [
    { q: '📍 Quelle est l\'adresse exacte ?', a: '📍 Nous sommes situés sur le grand boulevard principal à Yamoussoukro, à moins de 5 minutes de l\'incomparable Basilique Notre-Dame de la Paix. Vous êtes les bienvenus !' },
    { q: '⏰ Quels sont vos horaires ?', a: '⏰ Nous sommes ouverts 7 jours sur 7, de 11h00 du matin à 02h00 de la nuit pour le lounge VIP et les cocktails signatures.' },
    { q: '🛵 Livrez-vous au quartier Millionnaire ?', a: '🛵 Oui, absolument ! Nous livrons dans tout Yamoussoukro (Millionnaire, Sopim, Dioulabougou, INPHB) pour un tarif fixe de 1500 FCFA. Les plats arrivent chauds sous couverture hermétique.' },
    { q: '👑 Comment privatiser le Lounge VIP ?', a: '👑 C\'est un plaisir ! Pour privatiser le Lounge VIP pour un anniversaire ou une soirée d\'affaires d\'exception, veuillez remplir notre formulaire de "Moments VIP" ou appeler fissa le +225 01 41 92 33 96.' }
  ];

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: textToSend,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Simulated responsive automation reply
    setTimeout(() => {
      let replyText = 'Merci de nous écrire ! Un gestionnaire de notre conciergerie VIP de Yamoussoukro va se connecter d\'un instant à l\'autre. Vous pouvez aussi nous appeler directement au +225 01 41 92 33 96 pour une réponse en 3 secondes ! 🌟';

      // Find if pre-written questions were selected
      const queryFound = preWrittenQueries.find((p) => p.q === textToSend);
      if (queryFound) {
        replyText = queryFound.a;
      } else if (textToSend.toLowerCase().includes('adresse') || textToSend.toLowerCase().includes('où')) {
        replyText = '📍 Nous sommes situés sur le grand boulevard à Yamoussoukro, à proximité immédiate de la Basilique Notre-Dame. Venez savourer le bonheur !';
      } else if (textToSend.toLowerCase().includes('carte') || textToSend.toLowerCase().includes('manger')) {
        replyText = '🍽️ Notre carte propose des plats d\'exception: Kédjénou au canari traditionnel, sole tressée grillée de San-Pédro et de sublimes cocktails dorés à l\'or fin. Vous pouvez commander en ligne sur ce site directement !';
      }

      const botMsg = {
        sender: 'bot' as const,
        text: replyText,
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="w-80 sm:w-88 h-104 bg-stone-950 border border-[#D4AF37]/30 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between mb-4 border-glow-gold"
          >
            {/* Header phone box */}
            <div className="bg-stone-900 px-4 py-3 border-b border-stone-850 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Phone avatar indicator */}
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-[#D4AF37]/10 flex items-center justify-center font-bold font-serif text-[#D4AF37] border border-[#D4AF37]/20">
                    AH
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-stone-900" />
                </div>
                <div>
                  <h4 className="font-serif text-xs font-bold text-white leading-tight">Affoué — Conciergerie</h4>
                  <p className="text-[9px] text-[#25D366] font-mono leading-none flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-[#25D366] rounded-full animate-ping" />
                    En ligne (Assistance)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-stone-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Chat Body messages display area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0A0A0A]">
              <p className="text-[9px] text-center text-stone-600 uppercase font-mono tracking-widest my-1">Crypté par canal de bienveillance</p>
              
              {messages.map((m, id) => (
                <div
                  key={id}
                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`p-3 max-w-[85%] rounded-xl text-xs space-y-1 ${
                    m.sender === 'user'
                      ? 'bg-[#D4AF37] text-stone-950 font-bold rounded-tr-none'
                      : 'bg-stone-900/60 border border-stone-850 text-stone-300 rounded-tl-none'
                  }`}>
                    <p className="leading-relaxed whitespace-pre-line">{m.text}</p>
                    <span className="text-[8px] opacity-60 block text-right font-mono">{m.time}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Prewritten prompt suggestions box */}
            {messages.length < 4 && (
              <div className="px-3 py-2 bg-stone-950/90 border-t border-stone-850 flex flex-col gap-1.5 overflow-x-auto">
                <span className="text-[8px] uppercase tracking-widest text-[#D4AF37] font-bold">Faîtes défiler les questions rapides :</span>
                <div className="flex flex-col gap-1">
                  {preWrittenQueries.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(item.q)}
                      className="text-left text-[10px] text-stone-450 hover:text-[#D4AF37] truncate hover:whitespace-normal py-1 border-b border-stone-900"
                    >
                      {item.q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input message footer */}
            <div className="p-3 border-t border-stone-850 bg-stone-950 flex gap-2 items-center">
              <input
                type="text"
                placeholder="Écrivez votre message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage(inputText);
                }}
                className="flex-1 bg-stone-900 border border-stone-850 px-3 py-2 rounded-xl text-xs text-stone-300 focus:outline-none focus:border-[#D4AF37]"
                id="whatsapp-chat-input"
              />
              <button
                onClick={() => handleSendMessage(inputText)}
                className="w-8 h-8 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <Send size={12} fill="white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger button */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-12 h-12 sm:w-14 sm:h-14 bg-[#25D366] hover:bg-[#20ba59] rounded-full flex items-center justify-center text-white shadow-2xl relative cursor-pointer border border-[#25D366]"
        id="whatsapp-floating-trigger"
        title="Discutez avec nous"
      >
        <MessageSquareShare size={24} fill="white" />
        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#D4AF37] border-2 border-[#25D366] rounded-full text-[9px] font-bold text-stone-950 flex items-center justify-center animate-bounce">
          1
        </span>
      </motion.button>
    </div>
  );
}
