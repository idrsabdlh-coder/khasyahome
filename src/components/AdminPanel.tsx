import React, { useState, useEffect } from "react";
import { 
  PlusCircle, 
  Trash2, 
  Eye, 
  EyeOff, 
  Star, 
  AlertCircle, 
  CheckCircle2, 
  ShieldAlert, 
  BarChart4, 
  Sparkles, 
  Shirt, 
  Scissors, 
  BookOpen, 
  Lock
} from "lucide-react";
import { GalleryPhoto, PhotoCategory, StatsInfo } from "../types.ts";

export default function AdminPanel() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [stats, setStats] = useState<StatsInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [filename, setFilename] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<PhotoCategory>("pria");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [base64Data, setBase64Data] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  // Alert system feedback
  const [errorText, setErrorText] = useState("");
  const [successText, setSuccessText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Default admin secret password conforming to folder /admin-khasya-2026/
  const ADMIN_SECRET = "admin2026";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_SECRET) {
      setIsAuthorized(true);
      setPasswordError("");
      // Store authorization in session storage so refresh is convenient
      sessionStorage.setItem("khasya_admin_auth", "true");
    } else {
      setPasswordError("Kata sandi salah. Silakan coba lagi.");
    }
  };

  useEffect(() => {
    const cachedAuth = sessionStorage.getItem("khasya_admin_auth");
    if (cachedAuth === "true") {
      setIsAuthorized(true);
    }
  }, []);

  const loadAdminData = async () => {
    if (!isAuthorized) return;
    try {
      setLoading(true);
      // Fetch stats
      const statsRes = await fetch("/api/stats");
      const statsJson = await statsRes.json();
      if (statsJson.status === "success") {
        setStats(statsJson.data);
      }

      // Fetch ALL photos (both active and inactive) for admin control
      const galleryRes = await fetch("/api/gallery?admin=1");
      const galleryJson = await galleryRes.json();
      if (galleryJson.status === "success") {
        setPhotos(galleryJson.data);
      }
    } catch (err: any) {
      console.error("Error loaded admin panel contents:", err);
      setErrorText("Gagal memuat data dari server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [isAuthorized]);

  // Handle local file reading for pre-upload previews
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorText("");
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 2MB)
    const MAX_SIZE = 2 * 1024 * 1024; // 2MB
    if (file.size > MAX_SIZE) {
      setErrorText("Kritikal: Ukuran file foto melebihi batas maksimal 2MB.");
      setPreviewUrl("");
      setBase64Data("");
      return;
    }

    // Validate types
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      setErrorText("Kritikal: Jenis file tidak diizinkan. Gunakan format JPG, JPEG, atau PNG.");
      setPreviewUrl("");
      setBase64Data("");
      return;
    }

    setFilename(file.name);

    // Read to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setBase64Data(base64);
      setPreviewUrl(base64);
    };
    reader.readAsDataURL(file);
  };

  // Form submission upload operation
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText("");
    setSuccessText("");

    if (!base64Data || !filename) {
      setErrorText("Silakan pilih file foto terlebih dahulu.");
      return;
    }

    if (description.length > 255) {
      setErrorText("Deskripsi maksimal 255 karakter.");
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch("/api/gallery/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          filename,
          description,
          category,
          is_featured: isFeatured,
          is_active: isActive,
          base64Data
        })
      });

      const json = await response.json();
      if (json.status === "success") {
        setSuccessText("Sukses: Foto berhasil diunggah ke asisten katalog produk!");
        // Reset form inputs
        setDescription("");
        setBase64Data("");
        setPreviewUrl("");
        setFilename("");
        setIsFeatured(false);
        setIsActive(true);
        
        // Reset input element visually
        const fileInput = document.getElementById("file-picker") as HTMLInputElement;
        if (fileInput) fileInput.value = "";

        // Reload lists
        loadAdminData();
      } else {
        setErrorText(json.message || "Gagal mengunggah foto.");
      }
    } catch (err: any) {
      setErrorText("Kesalahan jaringan: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete handler
  const handleDeletePhoto = async (id: string) => {
    const isConfirmed = window.confirm("Yakin ingin menghapus foto ini?");
    if (!isConfirmed) return;

    try {
      const response = await fetch("/api/gallery/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id })
      });

      const json = await response.json();
      if (json.status === "success") {
        setSuccessText("Foto berhasil didelete secara permanen.");
        loadAdminData();
      } else {
        setErrorText(json.message);
      }
    } catch (err: any) {
      setErrorText("Kesalahan jaringan: " + err.message);
    }
  };

  // Active toggler
  const handleToggleActive = async (id: string) => {
    try {
      const response = await fetch("/api/gallery/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id })
      });

      const json = await response.json();
      if (json.status === "success") {
        loadAdminData();
      }
    } catch (err: any) {
      setErrorText("Kesalahan jaringan: " + err.message);
    }
  };

  // Featured toggler
  const handleToggleFeatured = async (id: string) => {
    try {
      const response = await fetch("/api/gallery/toggle-featured", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id })
      });

      const json = await response.json();
      if (json.status === "success") {
        loadAdminData();
      }
    } catch (err: any) {
      setErrorText("Kesalahan jaringan: " + err.message);
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "pria": return "Baju Pria";
      case "wanita": return "Baju Wanita";
      case "jilbab": return "Jilbab";
      case "peralatan": return "Peralatan Jahit";
      default: return cat;
    }
  };


  if (!isAuthorized) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center bg-gray-50 px-4 py-20 font-sans">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="flex flex-col items-center text-center space-y-4 mb-6">
            <div className="p-4 bg-brand-gold/10 text-brand-gold rounded-full">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-gray-800">
              Khasya_Home Admin Panel
            </h2>
            <p className="text-sm text-gray-500">
              Gerbang aman pengelolaan katalog digital. Silakan masukkan kata sandi akses admin rahasia.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Kata Sandi Admin
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-brand-black text-sm focus:bg-white focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
              />
              <p className="text-[10px] text-gray-400 mt-1">Petunjuk: Sandi default adalah <code className="font-mono bg-gray-100 px-1 py-0.5 rounded text-gray-600">{ADMIN_SECRET}</code></p>
            </div>

            {passwordError && (
              <div className="p-3.5 bg-red-50 text-red-600 text-xs font-medium rounded-xl flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-brand-black hover:bg-neutral-800 text-white font-bold text-sm py-3.5 rounded-xl transition-colors cursor-pointer shadow-md"
            >
              Masuk Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      
      {/* Admin Dashboard header info row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 mb-10 border-b border-gray-100">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#E0E0E0] bg-neutral-900 px-3 py-1 rounded-full">
            Admin Area (Rahasia)
          </span>
          <h2 className="font-serif text-3xl font-bold mt-2 text-brand-black tracking-tight">
            Khasya_Home Control Panel
          </h2>
          <p className="text-gray-500 text-xs mt-1 leading-relaxed">
            Kelola foto unggulan, perbarui ketersediaan, serta lakukan pemeliharaan file katalog di server Cloud.
          </p>
        </div>

        <button
          onClick={() => {
            setIsAuthorized(false);
            sessionStorage.removeItem("khasya_admin_auth");
          }}
          className="text-xs font-bold border border-red-200 text-red-600 bg-red-50 hover:bg-red-100/70 px-4 py-2 rounded-lg transition-colors cursor-pointer"
        >
          Keluar Sesi Admin
        </button>
      </div>

      {/* STATS ANALYTICS BAR */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-brand-gold/10 text-brand-gold rounded-xl">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Total Foto</span>
              <strong className="text-2xl text-gray-900 font-mono tracking-tight">{stats.total}</strong>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-[#25D366]/10 text-[#128C7E] rounded-xl">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Aktif Publik</span>
              <strong className="text-2xl text-gray-900 font-mono tracking-tight">{stats.active}</strong>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Unggulan</span>
              <strong className="text-2xl text-gray-900 font-mono tracking-tight">{stats.featured}</strong>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
              <BarChart4 className="w-5 h-5" />
            </div>
            <div className="flex-grow min-w-0">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Breakdown</span>
              <span className="text-[10px] text-gray-500 font-mono block leading-snug truncate">
                P:{stats.byCategory.pria} | W:{stats.byCategory.wanita} | J:{stats.byCategory.jilbab} | E:{stats.byCategory.peralatan}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ALERTS FEEDBACK */}
      {errorText && (
        <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
          <span>{errorText}</span>
        </div>
      )}

      {successText && (
        <div className="mb-8 p-4 bg-green-50 border border-green-100 text-green-700 rounded-xl text-sm flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-green-500 mt-0.5" />
          <span>{successText}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: UPLOAD NEW PHOTO FORM */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-serif text-xl font-bold text-gray-800 tracking-tight flex items-center gap-2 mb-6">
            <PlusCircle className="w-5 h-5 text-brand-gold" />
            <span>Upload Foto Baru</span>
          </h3>

          <form onSubmit={handleUploadSubmit} className="space-y-5">
            {/* FILE PICKER */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                File Gambar (Maks 2MB, JPG/PNG)
              </label>
              <input
                id="file-picker"
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handleFileChange}
                required
                className="w-full text-xs text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-neutral-700 hover:file:bg-gray-200 cursor-pointer"
              />
            </div>

            {/* PREVIEW CONTAINER */}
            {previewUrl && (
              <div className="aspect-video relative rounded-xl overflow-hidden bg-gray-50 border border-gray-200">
                <img
                  src={previewUrl}
                  alt="Dynamic preview to upload"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 right-2 text-[10px] font-bold uppercase bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-white font-mono">
                  Pratinjau Foto
                </span>
              </div>
            )}

            {/* CATEGORY SELECTOR */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Kategori Busana / Layanan
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PhotoCategory)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              >
                <option value="pria">Baju Pria</option>
                <option value="wanita">Baju Wanita</option>
                <option value="jilbab">Jilbab / Hijab</option>
                <option value="peralatan">Peralatan Jahit</option>
              </select>
            </div>

            {/* DESCRIPTION FIELD */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Deskripsi Foto (Maks 255 Karakter)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Misal: Gamis syar'i modern bahan ceruty premium sleting depan jahitan lipit rapi, dll..."
                rows={4}
                required
                maxLength={255}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              />
              <span className="text-[10px] text-gray-400 font-mono block text-right mt-1">
                {description.length}/255 karakter
              </span>
            </div>

            {/* CHECKBOX FLAGS */}
            <div className="space-y-2.5 pt-1">
              {/* FEATURED CAROUSEL TOGGLE */}
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4.5 h-4.5 accent-brand-gold rounded border-gray-300"
                />
                <span className="text-xs text-gray-600 font-medium select-none">
                  Unggulkan di Carousel Utama (Featured)
                </span>
              </label>

              {/* VISIBILITY TOGGLE */}
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4.5 h-4.5 accent-[#25D366] rounded border-gray-300"
                />
                <span className="text-xs text-gray-600 font-medium select-none">
                  Terbitkan Langsung ke Publik (Aktif)
                </span>
              </label>
            </div>

            {/* ACTION SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={submitting}
              className={`w-full bg-brand-gold hover:bg-[#b0913c] text-neutral-900 hover:text-black font-bold py-3.5 px-4 rounded-xl shadow-md transition-all flex justify-center items-center gap-2 cursor-pointer ${
                submitting ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              <span>{submitting ? "Mengunggah..." : "Upload Foto Katalog"}</span>
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: MANAGE / DELETE GALLERY PHOTOS */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <h3 className="font-serif text-xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
            <Scissors className="w-5 h-5 text-gray-400" />
            <span>Kelola Arsip Foto ({photos.length})</span>
          </h3>

          {loading ? (
            <div className="text-center py-10 text-gray-400 text-sm">Mengunduh arsip foto...</div>
          ) : photos.length === 0 ? (
            <p className="text-gray-400 text-xs text-center py-10">Belum ada foto yang terdaftar dalam database.</p>
          ) : (
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 no-scrollbar">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="flex items-start sm:items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100/50 transition-colors gap-3"
                >
                  {/* Thumbnail & Description block */}
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <img
                      src={photo.url}
                      alt={photo.description}
                      className="w-16 h-16 rounded-lg object-cover bg-white"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <span className="inline-block text-[9px] font-bold uppercase tracking-wider bg-gray-200 text-gray-600 px-2 py-0.5 rounded mr-1.5">
                        {getCategoryLabel(photo.category)}
                      </span>
                      {photo.is_featured && (
                        <span className="inline-flex items-center text-[9px] font-bold uppercase tracking-wider bg-yellow-100 text-amber-700 px-2 py-0.5 rounded">
                          <Star className="w-2.5 h-2.5 fill-current mr-0.5" />
                          Featured
                        </span>
                      )}
                      
                      <p className="text-xs text-gray-700 mt-1.5 font-medium font-sans leading-normal line-clamp-2">
                        {photo.description || "Foto Tanpa Deskripsi"}
                      </p>
                      <span className="text-[9px] text-gray-400 font-mono mt-1 block">
                        ID: #{photo.id}
                      </span>
                    </div>
                  </div>

                  {/* Settings togglers & deletor buttons */}
                  <div className="flex items-center space-x-2 flex-shrink-0 self-center">
                    
                    {/* Toggle visibility active button */}
                    <button
                      onClick={() => handleToggleActive(photo.id)}
                      className={`p-2 rounded-lg border transition-colors ${
                        photo.is_active
                          ? "bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
                          : "bg-gray-100 text-gray-400 border-gray-200 hover:bg-gray-200"
                      }`}
                      title={photo.is_active ? "Nonaktifkan Foto ini" : "Aktifkan Foto ini"}
                    >
                      {photo.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                    {/* Toggle featured button */}
                    <button
                      onClick={() => handleToggleFeatured(photo.id)}
                      className={`p-2 rounded-lg border transition-colors ${
                        photo.is_featured
                          ? "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100"
                          : "bg-gray-150 text-gray-400 border-gray-200 hover:bg-gray-250"
                      }`}
                      title={photo.is_featured ? "Hapus dari Unggulan" : "Unggulkan di Slide"}
                    >
                      <Star className={`w-4 h-4 ${photo.is_featured ? "fill-current" : ""}`} />
                    </button>

                    {/* Delete handler button */}
                    <button
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="p-2 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors"
                      title="Hapus Permanen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
