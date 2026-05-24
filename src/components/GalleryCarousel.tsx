import imgBajuPria from '../assets/bajupria.jpg'
import imgBajuWanita from '../assets/bajuwanita.jpg'
import imgPasmina from '../assets/pasmina.jpg'
import imgPeralatan from '../assets/peralatanjhait.jpeg'
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Sparkles, MessageCircle } from "lucide-react";
import { GalleryPhoto } from "../types.ts";

const defaultFeatured: GalleryPhoto[] = [
  {
    id: "seed-1",
    filename: "bajupria.jpg",
    description: "Kemeja Batik Premium - Jahitan halus furing katun hero dengan pola simetris rapi.",
    category: "pria",
    is_featured: true,
    is_active: true,
    created_at: "",
    url: imgBajuPria
  },
  {
    id: "seed-2",
    filename: "bajuwanita.jpg",
    description: "Gaun Kebaya Modern - Perpaduan brokat prada premium dengan payet berkilau mewah.",
    category: "wanita",
    is_featured: true,
    is_active: true,
    created_at: "",
    url: imgBajuWanita
  },
  {
    id: "seed-4",
    filename: "pasmina.jpg",
    description: "Pashmina Silk Luxury - Koleksi hijab premium mulus berkilau, adem dan sangat mudah dibentuk.",
    category: "jilbab",
    is_featured: true,
    is_active: true,
    created_at: "",
    url: imgPasmina
  }
];

export default function GalleryCarousel() {
  const [featuredPhotos] = useState<GalleryPhoto[]>(defaultFeatured);
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    resetAutoplay();
    return () => stopAutoplay();
  }, [currentIndex]);

  const startAutoplay = () => {
    autoplayRef.current = setInterval(() => {
      handleNext();
    }, 4000);
  };

  const stopAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  };

  const resetAutoplay = () => {
    stopAutoplay();
    startAutoplay();
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredPhotos.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredPhotos.length) % featuredPhotos.length);
  };

  const getWaLinkByCat = (category: string, name: string) => {
    const phone = "6282184163987";
    let baseText = "Halo Khasya_Home, saya tertarik dengan koleksi Anda";
    if (category === "pria") baseText = `Halo Khasya_Home, saya tertarik dengan jasa jahit baju pria: ${name}`;
    else if (category === "wanita") baseText = `Halo Khasya_Home, saya tertarik dengan jasa jahit baju wanita: ${name}`;
    else if (category === "jilbab") baseText = `Halo Khasya_Home, saya tertarik dengan koleksi jilbab: ${name}`;
    else if (category === "peralatan") baseText = `Halo Khasya_Home, saya ingin menanyakan ketersediaan peralatan jahit: ${name}`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(baseText)}`;
  };

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl shadow-xl h-[360px] sm:h-[480px] bg-brand-black group"
      onMouseEnter={stopAutoplay}
      onMouseLeave={resetAutoplay}
    >
      {/* Slides Viewport */}
      <div className="relative w-full h-full">
        {featuredPhotos.map((photo, index) => (
          <div
            key={photo.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <img
              src={photo.url}
              alt={photo.description}
              className="absolute inset-0 w-full h-full object-cover select-none"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />

            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 z-20 text-white max-w-4xl">
              <span className="inline-flex items-center space-x-1 bg-brand-gold/95 text-neutral-950 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Koleksi Unggulan</span>
              </span>
              <p className="font-serif text-xl sm:text-3xl font-semibold leading-snug tracking-tight max-w-2xl text-white">
                {photo.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <span className="text-xs text-gray-300 font-sans tracking-wide uppercase">
                  Kategori: <strong className="text-brand-gold font-semibold">
                    {photo.category === "pria" ? "Baju Pria" : photo.category === "wanita" ? "Baju Wanita" : photo.category === "jilbab" ? "Jilbab" : "Peralatan Jahit"}
                  </strong>
                </span>
                <span className="hidden sm:inline text-gray-600">|</span>
                <a
                  href={getWaLinkByCat(photo.category, photo.description)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-brand-gold text-neutral-900 hover:bg-[#b59540] text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                  <span>Tanya Harga</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Prev/Next Navigation */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm transition-all opacity-80 hover:opacity-100 group-hover:scale-105"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm transition-all opacity-80 hover:opacity-100 group-hover:scale-105"
        aria-label="Next image"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-4 right-6 z-30 flex items-center space-x-2">
        {featuredPhotos.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCurrentIndex(idx);
              resetAutoplay();
            }}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              idx === currentIndex ? "bg-brand-gold w-6" : "bg-white/40 hover:bg-white/80"
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}