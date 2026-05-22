import { MessageCircle, Instagram, Scissors } from "lucide-react";

export default function Footer() {
  const currentYear = 2026; // Static or dynamic, but aligning with the prompt's 2026 contexts

  return (
    <footer id="app-footer" className="bg-brand-black text-white border-t border-white/5 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center pb-8 border-b border-white/10 text-center md:text-left">
          
          {/* Logo & short brand text */}
          <div className="space-y-3">
            <span className="font-serif text-2xl font-bold tracking-tight text-white block">
              Khasya<span className="text-brand-gold">_</span>Home
            </span>
            <p className="text-xs text-gray-400 font-light max-w-sm leading-relaxed mx-auto md:mx-0">
              Layanan jahit kustom berkualitas butik (Pria & Wanita) serta katalog koleksi jilbab modern eksklusif di Jambi.
            </p>
          </div>

          {/* Core location summary */}
          <div className="space-y-2 text-center">
            <div className="inline-flex justify-center items-center w-8 h-8 rounded-full bg-white/10 text-brand-gold mb-1">
              <Scissors className="w-4 h-4" />
            </div>
            <p className="text-xs text-gray-300 font-medium">Studio Khasya_Home</p>
            <p className="text-xs text-gray-500 max-w-xs leading-relaxed mx-auto">
              Jalan Poros Blok E RT.31, Geragai, Tanjung Jabung Timur, Jambi
            </p>
          </div>

          {/* Social Links & contacts */}
          <div className="flex flex-col items-center md:items-end space-y-4">
            <span className="text-xs text-gray-400 tracking-wider uppercase font-semibold">
              Kunjungi Social Media
            </span>
            <div className="flex items-center space-x-4">
              <a
                href="https://wa.me/6282184163987"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all shadow-md hover:shadow-[#25D366]/20"
                title="Sapa Kami di WhatsApp"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
              </a>
              <a
                href="https://instagram.com/rumah.jahit_khasya"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all shadow-md hover:shadow-pink-500/20"
                title="Instagram Khasya_Home"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright segment */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 leading-normal gap-4">
          <span>
            &copy; {currentYear} <strong>Khasya_Home</strong>. All Rights Reserved.
          </span>
          <div className="flex space-x-6 text-gray-500">
            <span className="font-light">Geragai, Jambi</span>
            <span>•</span>
            <span className="font-light font-mono">Verifikasi v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
