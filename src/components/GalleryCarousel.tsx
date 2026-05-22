import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Sparkles, MessageCircle } from "lucide-react";
import { GalleryPhoto } from "../types.ts";

export default function GalleryCarousel() {
  const [featuredPhotos, setFeaturedPhotos] = useState<GalleryPhoto[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  const fetchFeatured = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/gallery?featured=1");
      const json = await res.json();
      if (json.status === "success" && json.data.length > 0) {
        setFeaturedPhotos(json.data);
      } else {
        // Fallback to active featured items from seed if empty
        const defaultFeatured: GalleryPhoto[] = [
          {
            id: "seed-1",
            filename: "kemeja-batik-premium.jpg",
            description: "Kemeja Batik Premium - Jahitan halus furing katun hero dengan pola simetris rapi.",
            category: "pria",
            is_featured: true,
            is_active: true,
            created_at: "",
            url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1000&auto=format&fit=crop&q=80"
          },
          {
            id: "seed-3",
            filename: "gaun-kebaya-modern.jpg",
            description: "Gaun Kebaya Modern - Perpaduan brokat prada premium dengan payet berkilau mewah.",
            category: "wanita",
            is_featured: true,
            is_active: true,
            created_at: "",
            url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1000&auto=format&fit=crop&q=80"
          },
          {
            id: "seed-5",
            filename: "pashmina-silk-luxury.jpg",
            description: "Pashmina Silk Luxury - Koleksi hijab premium mulus berkilau, adem dan sangat mudah dibentuk.",
            category: "jilbab",
            is_featured: true,
            is_active: true,
            created_at: "",
            url: "https://images.unsplash.com/photo-1609172765481-30926e2a5b4a?w=1000&auto=format&fit=crop&q=80"
          }
        ];
        setFeaturedPhotos(defaultFeatured);
      }
    } catch (e) {
      console.error("Failed to load featured catalog:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatured();
  }, []);

  // Set up autoplay
  useEffect(() => {
    if (featuredPhotos.length === 0) return;

    resetAutoplay();

    return () => {
      stopAutoplay();
    };
  }, [featuredPhotos, currentIndex]);

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

  if (loading) {
    return (
      <div className="bg-white/50 animate-pulse rounded-2xl h-[450px] flex items-center justify-center">
        <div className="text-gray-400">Loading Featured Carousel...</div>
      </div>
    );
  }

  if (featuredPhotos.length === 0) {
    return (
      <div className="bg-gray-100 border border-gray-200 rounded-2xl h-[300px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 font-serif text-lg">Foto Segera Hadir</p>
          <p className="text-gray-400 text-xs mt-1">Belum ada foto utama yang diunggulkan oleh admin.</p>
        </div>
      </div>
    );
  }

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
            {/* Image background with gradient overlay */}
            <img
              src={photo.url}
              alt={photo.description}
              className="absolute inset-0 w-full h-full object-cover select-none"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />

            {/* Slider Content */}
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
                  Kategori: <strong className="text-brand-gold font-semibold">{photo.category === "pria" ? "Baju Pria" : photo.category === "wanita" ? "Baju Wanita" : photo.category === "jilbab" ? "Jilbab" : "Peralatan Jahit"}</strong>
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

      {/* Pre/Next Navigation Controls */}
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

      {/* Dot Indicators Pagination */}
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
