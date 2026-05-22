import { MapPin, Phone, Instagram, ArrowUpRight, MessageSquare } from "lucide-react";

export default function LocationAndContact() {
  const mapEmbedUrl = "https://maps.google.com/maps?q=Jalan%20Poros%20Blok%20E%20RT.31,%20Geragai,%20Tanjung%20Jabung%20Timur,%20Jambi&t=&z=15&ie=UTF8&iwloc=&output=embed";

  return (
    <section id="kontak" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-gold bg-brand-gold/10 px-3.5 py-1.5 rounded-full">
            Lokasi & Kontak
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-4 mb-3 tracking-tight">
            Temukan Khasya_Home
          </h2>
          <p className="text-gray-500 font-sans text-sm">
            Kunjungi studio jahit kami atau hubungi kami secara virtual untuk konsultasi bahan, ukuran, dan pemesanan.
          </p>
        </div>

        {/* Layout: Responsive grid columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Column Left: Embed Interactive Map (Google Maps) */}
          <div className="lg:col-span-7 bg-[#F5F5F5] rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 h-[380px] lg:h-[450px] relative transition-shadow duration-300">
            <iframe
              src={mapEmbedUrl}
              className="w-full h-full border-none"
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer"
              title="Peta Lokasi Khasya_Home, Geragai Jambi"
            />
          </div>

          {/* Column Right: Contact Details and Links */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <h3 className="font-serif text-2xl font-bold text-brand-black tracking-tight flex items-center gap-2">
                Hubungi Kami
              </h3>
              <p className="text-gray-500 text-sm font-sans">
                Silakan datang langsung atau kirimkan inspirasi rancangan busana Anda melewati saluran kontak komunikasi di bawah ini:
              </p>

              {/* Physical Address Card */}
              <div className="flex gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100/50 transition-colors">
                <div className="p-3 bg-brand-gold/10 rounded-lg text-brand-gold h-fit">
                  <MapPin className="w-5 h-5 flex-shrink-0" />
                </div>
                <div>
                  <h4 className="text-sm font-sans font-bold text-gray-800 uppercase tracking-wide">
                    Alamat Fisik
                  </h4>
                  <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                    Jalan Poros Blok E RT.31, Geragai, Tanjung Jabung Timur, Jambi, Indonesia
                  </p>
                </div>
              </div>

              {/* WhatsApp Card */}
              <a
                href="https://wa.me/6282184163987"
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-[#25D366]/5 group transition-colors cursor-pointer"
              >
                <div className="p-3 bg-[#25D366]/15 rounded-lg text-[#128C7E] h-fit">
                  <Phone className="w-5 h-5 flex-shrink-0" />
                </div>
                <div className="flex-grow">
                  <h4 className="text-sm font-sans font-bold text-gray-800 uppercase tracking-wide flex items-center gap-1">
                    <span>WhatsApp</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#128C7E] transition-colors" />
                  </h4>
                  <p className="text-gray-600 text-sm mt-1 leading-relaxed font-mono font-medium">
                    +62 821-8416-3987
                  </p>
                </div>
              </a>

              {/* Instagram Card */}
              <a
                href="https://instagram.com/rumah.jahit_khasya"
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-pink-50 group transition-colors cursor-pointer"
              >
                <div className="p-3 bg-pink-100 text-pink-600 rounded-lg h-fit">
                  <Instagram className="w-5 h-5 flex-shrink-0" />
                </div>
                <div className="flex-grow">
                  <h4 className="text-sm font-sans font-bold text-gray-800 uppercase tracking-wide flex items-center gap-1">
                    <span>Instagram</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-pink-600 transition-colors" />
                  </h4>
                  <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                    @rumah.jahit_khasya
                  </p>
                </div>
              </a>
            </div>

            {/* Huge primary CTA Button */}
            <div className="pt-4">
              <a
                href="https://wa.me/6282184163987?text=Halo%20Khasya_Home%2C%20saya%20ingin%20bertanya"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex justify-center items-center space-x-2.5 bg-brand-gold hover:bg-[#b0913c] text-neutral-900 hover:text-black font-bold text-base py-4 rounded-xl shadow-lg transition-all hover:-translate-y-0.5"
              >
                <MessageSquare className="w-5 h-5 fill-current" />
                <span>Hubungi via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
