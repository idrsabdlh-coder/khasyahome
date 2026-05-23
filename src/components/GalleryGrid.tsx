import { useState, useEffect } from "react";
import { MessageCircle, Maximize2, X, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { GalleryPhoto, PhotoCategory } from "../types.ts";

interface FilterTab {
  id: string;
  label: string;
  value: string;
}

export default function GalleryGrid() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  // Lightbox States
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filterTabs: FilterTab[] = [
    { id: "tab-all", label: "Semua", value: "all" },
    { id: "tab-pria", label: "Baju Pria", value: "pria" },
    { id: "tab-wanita", label: "Baju Wanita", value: "wanita" },
    { id: "tab-jilbab", label: "Jilbab", value: "jilbab" },
    { id: "tab-peralatan", label: "Peralatan Jahit", value: "peralatan" }
  ];

  const seedPhotos: GalleryPhoto[] = [
  { id: "seed-1", filename: "bajupria.jpg", description: "Kemeja Batik Premium - Jahitan halus furing katun hero dengan pola simetris rapi.", category: "pria", is_featured: true, is_active: true, created_at: "", url: "/uploads/bajupria.jpg" },
  { id: "seed-2", filename: "bajuwanita.jpg", description: "Gaun Kebaya Modern - Perpaduan brokat prada premium dengan payet berkilau mewah.", category: "wanita", is_featured: true, is_active: true, created_at: "", url: "/uploads/bajuwanita.jpg" },
  { id: "seed-3", filename: "download.jpeg", description: "Koleksi Busana Muslim Modern - Desain anggun dan elegan.", category: "wanita", is_featured: false, is_active: true, created_at: "", url: "/uploads/download.jpeg" },
  { id: "seed-4", filename: "pasmina.jpg", description: "Pashmina Silk Luxury - Koleksi hijab premium mulus berkilau.", category: "jilbab", is_featured: true, is_active: true, created_at: "", url: "/uploads/pasmina.jpg" },
  { id: "seed-5", filename: "segiempat.jpg", description: "Hijab Segiempat Voal - Motif cetak eksklusif, nyaman untuk harian.", category: "jilbab", is_featured: false, is_active: true, created_at: "", url: "/uploads/segiempat.jpg" },
  { id: "seed-6", filename: "peralatanjahit.jpeg", description: "Peralatan Jahit Premium - Didukung peralatan digital presisi super rapi.", category: "peralatan", is_featured: false, is_active: true, created_at: "", url: "/uploads/peralatanjahit.jpeg" },
];

  useEffect(() => {
    fetchPhotos();
  }, []);

  const getFilteredPhotos = () => {
    if (selectedFilter === "all") {
      return photos;
    }
    return photos.filter((p) => p.category === selectedFilter);
  };

  const filteredPhotos = getFilteredPhotos();

  // Helper to generate precise WhatsApp links based on item categories
  const getWhatsAppLink = (category: PhotoCategory, description: string) => {
    const phone = "6282184163987";
    let text = "";

    switch (category) {
      case "pria":
        text = "Halo Khasya_Home, saya tertarik dengan jasa jahit baju pria";
        break;
      case "wanita":
        text = "Halo Khasya_Home, saya tertarik dengan jasa jahit baju wanita";
        break;
      case "jilbab":
        text = "Halo Khasya_Home, saya tertarik dengan koleksi jilbab";
        break;
      case "peralatan":
        text = "Halo Khasya_Home, saya ingin menanyakan ketersediaan peralatan jahit";
        break;
      default:
        text = "Halo Khasya_Home, saya ingin bertanya tentang layanan Anda";
    }

    // Append description if available
    if (description) {
      const shortDesc = description.substring(0, 60);
      text += `: "${shortDesc}"`;
    }

    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  // Lightbox keyboard navigations
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") handleLightboxNext();
      if (e.key === "ArrowLeft") handleLightboxPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, filteredPhotos]);

  const handleLightboxNext = () => {
    if (lightboxIndex === null || filteredPhotos.length === 0) return;
    setLightboxIndex((prev) => ((prev ?? 0) + 1) % filteredPhotos.length);
  };

  const handleLightboxPrev = () => {
    if (lightboxIndex === null || filteredPhotos.length === 0) return;
    setLightboxIndex((prev) => ((prev ?? 0) - 1 + filteredPhotos.length) % filteredPhotos.length);
  };

  return (
    <div className="space-y-10">
      
      {/* Category Selection Tabs */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 py-4 border-y border-gray-100">
        {filterTabs.map((tab) => {
          const isActive = selectedFilter === tab.value;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setSelectedFilter(tab.value);
                setLightboxIndex(null);
              }}
              data-filter={tab.value}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold tracking-wide uppercase transition-all duration-300 pointer-events-auto ${
                isActive
                  ? "bg-brand-gold text-neutral-900 shadow-md shadow-brand-gold/15 scale-102"
                  : "bg-white text-gray-500 hover:text-brand-black hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block w-10 h-10 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm mt-3 font-medium">Memuat katalog Khasya_Home...</p>
        </div>
      ) : filteredPhotos.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 font-serif text-lg">Tidak ada foto katalog di kategori ini.</p>
          <p className="text-gray-300 text-xs mt-2">Daftar item segera diunggah oleh admin.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo, index) => (
            <div
              key={photo.id}
              data-category={photo.category}
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 flex flex-col hover:-translate-y-1"
            >
              <div className="relative aspect-square overflow-hidden bg-gray-50">
                <img
                  src={photo.url}
                  alt={photo.description}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />

                {/* Dark Semi-Transparant Overlay on Hover (Desktop ONLY) */}
                <div className="hidden md:flex absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 p-6 flex-col justify-between items-center text-center">
                  
                  {/* Large visual inspection Trigger button */}
                  <button
                    onClick={() => setLightboxIndex(index)}
                    className="self-end p-2 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 text-white transition-all hover:scale-110 duration-200"
                    title="Perbesar Model Foto"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>

                  <p className="text-white font-medium text-sm px-4 leading-relaxed line-clamp-4">
                    {photo.description}
                  </p>

                  <a
                    href={getWhatsAppLink(photo.category, photo.description)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex justify-center items-center space-x-2 bg-brand-gold hover:bg-[#b0913c] text-neutral-900 font-bold text-sm py-3 px-5 rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Tanya Harga</span>
                  </a>
                </div>

                {/* Small category tag badge overlay */}
                <span className="absolute top-3 left-3 z-10 text-[10px] font-bold uppercase tracking-wider bg-black/75 backdrop-blur-md text-[#E0E0E0] px-3 py-1 rounded-full border border-white/10">
                  {photo.category === "pria" ? "Baju Pria" : photo.category === "wanita" ? "Baju Wanita" : photo.category === "jilbab" ? "Jilbab" : "Peralatan"}
                </span>

                {/* Direct quick preview overlay trigger for mobile */}
                <button
                  onClick={() => setLightboxIndex(index)}
                  className="md:hidden absolute bottom-3 right-3 z-10 bg-black/75 backdrop-blur-md p-2 rounded-full border border-white/10 text-white shadow"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              {/* Card Meta Content (Always visible under photo for Mobile, and provides context) */}
              <div className="p-5 flex-grow flex flex-col justify-between border-t border-gray-50">
                <div className="space-y-2">
                  <p className="text-gray-800 text-sm font-medium leading-relaxed font-sans line-clamp-2 md:line-clamp-none">
                    {photo.description || "Inspirasi Tata Busana Khasya_Home"}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 font-mono tracking-wider uppercase">
                    ID: #{photo.id.replace("photo-", "").replace("seed-", "S")}
                  </span>
                  
                  {/* WhatsApp CTA button: Always visible on mobile, optionally shown inline as safety fallback */}
                  <a
                    href={getWhatsAppLink(photo.category, photo.description)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366]/20 font-bold text-xs px-3.5 py-2 rounded-lg transition-colors md:hidden"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                    <span>Tanya Harga</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LIGHTBOX MODAL OVERLAY */}
      {lightboxIndex !== null && filteredPhotos[lightboxIndex] && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 transition-all animate-fade-in">
          {/* Close Backdrop Trigger */}
          <div className="absolute inset-0 z-0" onClick={() => setLightboxIndex(null)} />

          {/* Close Action Button */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all border border-white/20 hover:scale-105"
            title="Keluar"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Previous Slides Navigation */}
          <button
            onClick={handleLightboxPrev}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/25 hover:scale-110 active:scale-95 transition-all"
            title="Kiri"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Image Container with details */}
          <div className="relative z-10 max-w-4xl w-full max-h-[85vh] flex flex-col items-center">
            <div className="bg-neutral-900 rounded-xl overflow-hidden shadow-2xl border border-white/10 max-w-full flex flex-col md:flex-row max-h-[70vh]">
              {/* Image */}
              <div className="flex-1 overflow-hidden bg-black flex items-center justify-center">
                <img
                  src={filteredPhotos[lightboxIndex].url}
                  alt={filteredPhotos[lightboxIndex].description}
                  className="max-h-[50vh] md:max-h-[70vh] w-auto max-w-full object-contain select-none"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Text Sidebar Context */}
              <div className="w-full md:w-80 bg-neutral-950 p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/10 text-white overflow-y-auto">
                <div>
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-brand-gold text-neutral-950 px-3 py-1 rounded-full mb-4">
                    {filteredPhotos[lightboxIndex].category === "pria" ? "Baju Pria" : filteredPhotos[lightboxIndex].category === "wanita" ? "Baju Wanita" : filteredPhotos[lightboxIndex].category === "jilbab" ? "Jilbab" : "Peralatan Jahit"}
                  </span>
                  
                  <p className="font-serif text-lg font-light leading-relaxed mb-6 text-gray-200">
                    {filteredPhotos[lightboxIndex].description}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
                    <span>Arsip: #{filteredPhotos[lightboxIndex].id}</span>
                  </div>

                  <a
                    href={getWhatsAppLink(filteredPhotos[lightboxIndex].category, filteredPhotos[lightboxIndex].description)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex justify-center items-center space-x-2 bg-brand-gold hover:bg-[#b0913c] text-neutral-950 hover:text-black font-bold text-base py-3.5 px-6 rounded-lg transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-5 h-5 fill-current" />
                    <span>Tanya Harga WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Indicator dots inside Lightbox */}
            <div className="mt-4 flex items-center justify-center gap-1.5 overflow-x-auto max-w-full px-4 no-scrollbar">
              {filteredPhotos.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setLightboxIndex(idx)}
                  className={`w-2 h-2 rounded-full flex-shrink-0 transition-all ${
                    idx === lightboxIndex ? "bg-brand-gold w-4" : "bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Next Slides Navigation */}
          <button
            onClick={handleLightboxNext}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/25 hover:scale-110 active:scale-95 transition-all"
            title="Kanan"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}
