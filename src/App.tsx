import { useState, useEffect } from "react";
import Navbar from "./components/Navbar.tsx";
import Hero from "./components/Hero.tsx";
import GalleryCarousel from "./components/GalleryCarousel.tsx";
import GalleryGrid from "./components/GalleryGrid.tsx";
import LocationAndContact from "./components/LocationAndContact.tsx";
import Footer from "./components/Footer.tsx";
import AdminPanel from "./components/AdminPanel.tsx";

export default function App() {
  const [isAdminView, setIsAdminView] = useState(false);

  // Auto-detect admin URL path (/admin-khasya-2026) for immediate redirection during browser entry
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith("/admin-khasya-2026") || path.includes("/admin")) {
      setIsAdminView(true);
    }
  }, []);

  const handleExploreGallery = () => {
    setIsAdminView(false);
    // Smooth scroll to Gallery Grid Section
    const element = document.getElementById("galeri");
    if (element) {
      const offset = 80; // Navbar offset height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="min-h-screen bg-brand-offwhite text-brand-black selection:bg-brand-gold/30 flex flex-col font-sans">
      {/* Structural Header Navbar Component */}
      <Navbar isAdminView={isAdminView} setIsAdminView={setIsAdminView} />

      {/* Main Page Layout Switcher */}
      <main className="flex-grow">
        {isAdminView ? (
          /* Secure Administrative CMS View */
          <div className="bg-gray-50 min-h-[78vh]">
            <AdminPanel />
          </div>
        ) : (
          /* Stunning Public Facing Showcase Layout */
          <div>
            {/* 1. Hero Spotlight Presentation Section */}
            <Hero onExploreGallery={handleExploreGallery} />

            {/* 2. Interactive Product Catalog Section */}
            <section id="galeri" className="py-20 bg-brand-offwhite max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-gold bg-brand-gold/10 px-3.5 py-1.5 rounded-full">
                  koleksi busana kami
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-4 mb-3 tracking-tight">
                  Katalog Khasya_Home
                </h2>
                <p className="text-gray-500 font-sans text-sm">
                  Pilihlah inspirasi model favorit Anda dari koleksi terbaik kami di bawah ini, lalu klik "Tanya Harga" untuk terhubung ke penawaran jahit kami secara langsung.
                </p>
              </div>

              {/* Slider Spotlight: Slideshow of Featured items */}
              <div className="mb-14">
                <GalleryCarousel />
              </div>

              {/* Categorized Product Grid filter */}
              <GalleryGrid />
            </section>

            {/* 3. Physical Studio Map & Details Contacts */}
            <LocationAndContact />
          </div>
        )}
      </main>

      {/* FOOTER BAR BRAND */}
      <Footer />

      {/* FLOATING ACTION FLOATING WHATSAPP BUTTON */}
      {/* Visible universally, aligned with bottom right, styled pulsing green */}
      <a
        href="https://wa.me/6282184163987"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white p-3.5 sm:p-4 rounded-full shadow-2xl transition-all duration-300 hover:rotate-6 flex items-center justify-center hover:-translate-y-1.5 peer group"
        title="Hubungi Khasya_Home di WhatsApp"
      >
        {/* Pulsing visual radial wave rings */}
        <span className="absolute inset-0 rounded-full bg-[#25D366]/40 -z-10 animate-ping opacity-75" />
        <span className="absolute inset-0 rounded-full bg-[#25D366]/20 -z-10 animate-pulse scale-105" />

        {/* Elegant inline WhatsApp logo path */}
        <svg
          className="w-6 h-6 sm:w-7 sm:h-7 fill-white"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.967C16.48 1.87 14.017.842 11.998.842 6.562.842 2.138 5.211 2.134 10.641c-.002 1.683.451 3.32 1.311 4.755L2.425 21a.348.348 0 0 0 .447.445l5.775-1.891zM17.486 15c-.287-.144-1.695-.838-1.955-.934-.26-.096-.45-.144-.64.144-.19.287-.736.934-.903 1.122-.167.188-.334.212-.62.068-.287-.144-1.21-.446-2.305-1.424-.853-.76-1.428-1.7-1.595-1.987-.167-.287-.018-.442.126-.584.13-.127.287-.335.43-.503.144-.168.19-.288.287-.48.096-.192.048-.36-.024-.504-.072-.144-.64-1.54-.877-2.11-.23-.556-.465-.48-.64-.488-.168-.008-.363-.01-.557-.01-.195 0-.51.073-.777.36-.268.288-1.021 1.001-1.021 2.441 0 1.439 1.047 2.83 1.193 3.023.146.191 2.06 3.146 4.99 4.415.697.302 1.24.483 1.664.618.7.223 1.338.191 1.843.115.563-.084 1.695-.692 1.935-1.36.24-.668.24-1.24.168-1.36-.072-.12-.267-.192-.553-.336z" />
        </svg>

        {/* Small hover text pill inside the group */}
        <span className="absolute right-16 scale-0 bg-neutral-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xl uppercase tracking-wider group-hover:scale-100 transition-all origin-right duration-250 pointer-events-none border border-neutral-800 whitespace-nowrap">
          Ada Pertanyaan?
        </span>
      </a>
    </div>
  );
}
