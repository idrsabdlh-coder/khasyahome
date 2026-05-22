import { motion } from "motion/react";
import { MessageSquare, ArrowDown, Scissors, Sparkles, Shirt } from "lucide-react";

interface HeroProps {
  onExploreGallery: () => void;
}

export default function Hero({ onExploreGallery }: HeroProps) {
  return (
    <section
      id="beranda"
      className="relative min-h-[92vh] flex items-center justify-center bg-brand-black overflow-hidden"
    >
      {/* Background Decorative Graphic or pattern */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-brand-black to-brand-black opacity-95" />
      
      {/* Subtle lines or shapes */}
      <div className="absolute inset-0 opacity-10 z-0 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
        
        {/* Badge Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 mb-8"
        >
          <Scissors className="w-4 h-4 text-brand-gold animate-pulse" />
          <span className="text-xs font-semibold tracking-widest text-[#E0E0E0] uppercase">
            Jasa Jahit & Koleksi Jilbab Jambi
          </span>
        </motion.div>

        {/* H1 Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight leading-tight mb-6"
        >
          Khasya<span className="text-brand-gold">_</span>Home
        </motion.h1>

        {/* Slogan & Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-300 font-sans font-light leading-relaxed mb-6"
        >
          Eksplorasi mahakarya tata busana dengan pengerjaan presisi butik, 
          menghadirkan jahit kustom pria & wanita, serta koleksi jilbab eksklusif 
          yang memperanggun penampilan Anda setiap saat.
        </motion.p>

        {/* Dynamic decorative icons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1.5, delay: 0.6 }}
          className="flex justify-center items-center space-x-6 text-brand-gold mb-12"
        >
          <div className="flex items-center space-x-1.5 text-xs tracking-wider uppercase font-medium">
            <Shirt className="w-4 h-4" />
            <span>Premium Tailoring</span>
          </div>
          <span className="text-[#C9A84C]/50">•</span>
          <div className="flex items-center space-x-1.5 text-xs tracking-wider uppercase font-medium">
            <Sparkles className="w-4 h-4" />
            <span>Syar'i Elegance</span>
          </div>
        </motion.div>

        {/* Action Call To Actions */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-4"
        >
          <a
            href="https://wa.me/6282184163987?text=Halo%20Khasya_Home%2C%20saya%20ingin%20bertanya%20tentang%20layanan%20jahit"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex justify-center items-center space-x-3 bg-brand-gold hover:bg-[#b0913c] text-neutral-900 hover:text-black font-semibold text-base py-4 px-8 rounded-xl shadow-lg shadow-brand-gold/10 hover:shadow-brand-gold/20 transition-all hover:-translate-y-0.5 duration-200"
          >
            <MessageSquare className="w-5 h-5 fill-current" />
            <span>Konsultasi Sekarang</span>
          </a>

          <button
            onClick={onExploreGallery}
            className="w-full sm:w-auto inline-flex justify-center items-center space-x-2 bg-transparent hover:bg-white/5 text-white font-medium text-base py-4 px-8 rounded-xl border border-white/20 hover:border-white/40 transition-all duration-200"
          >
            <span>Katalog Galeri</span>
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </button>
        </motion.div>
      </div>

      {/* Decorative Bottom Wave/Border */}
      <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#F5F5F5] to-transparent pointer-events-none" />
    </section>
  );
}
