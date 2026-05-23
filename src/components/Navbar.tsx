import React, { useState, useEffect } from "react";
import { Menu, X, MessageCircle } from "lucide-react";

interface NavbarProps {
  isAdminView: boolean;
  setIsAdminView: (val: boolean) => void;
}

export default function Navbar({ isAdminView, setIsAdminView }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsAdminView(false);
    setIsOpen(false);
    
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
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
    <header
      id="app-header"
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled || isAdminView
          ? "bg-white shadow-md py-3 border-b border-gray-100"
          : "bg-white/95 backdrop-blur-md py-4 border-b border-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              setIsAdminView(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center space-x-2"
          >
            <span className="font-serif text-2xl font-bold tracking-tight text-brand-black hover:text-brand-gold transition-colors">
              Khasya<span className="text-brand-gold">_</span>Home
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8 items-center font-sans">
            <a
              href="#beranda"
              onClick={(e) => handleNavClick(e, "beranda")}
              className={`text-sm font-medium transition-colors hover:text-brand-gold ${
                !isAdminView ? "text-brand-black" : "text-gray-500"
              }`}
            >
              Beranda
            </a>
            <a
              href="#galeri"
              onClick={(e) => handleNavClick(e, "galeri")}
              className="text-sm font-medium text-gray-700 hover:text-brand-gold transition-colors"
            >
              Galeri
            </a>
            <a
              href="#kontak"
              onClick={(e) => handleNavClick(e, "kontak")}
              className="text-sm font-medium text-gray-700 hover:text-brand-gold transition-colors"
            >
              Kontak
            </a>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <a
              href="https://wa.me/6282184163987?text=Halo%20Khasya_Home%2C%20saya%20ingin%20bertanya%20tentang%20layanan%20jahit"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm hover:shadow transition-all hover:-translate-y-0.5 duration-200"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>WhatsApp Admin</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-brand-black hover:bg-gray-100 transition-colors"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-6 space-y-3 shadow-inner">
          <a
            href="#beranda"
            onClick={(e) => handleNavClick(e, "beranda")}
            className="block px-3 py-2 rounded-lg text-base font-medium text-brand-black hover:bg-gray-50"
          >
            Beranda
          </a>
          <a
            href="#galeri"
            onClick={(e) => handleNavClick(e, "galeri")}
            className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50"
          >
            Galeri Katalog
          </a>
          <a
            href="#kontak"
            onClick={(e) => handleNavClick(e, "kontak")}
            className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50"
          >
            Kontak & Lokasi
          </a>
          <div className="pt-2">
            <a
              href="https://wa.me/6282184163987?text=Halo%20Khasya_Home%2C%20saya%20ingin%20bertanya%20tentang%20layanan%20jahit"
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-center items-center space-x-2 bg-[#25D366] text-white text-base font-bold py-3 px-4 rounded-xl shadow"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>Hubungi Admin WA</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}