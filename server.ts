import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GalleryPhoto } from "./src/types.ts"; // or use custom local types in server context

const app = express();
const PORT = 3000;

// Resolve paths for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure directories exist
const uploadsDir = path.join(process.cwd(), "uploads");
const dataDir = path.join(process.cwd(), "data");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "gallery_photos.json");

// Define 8 Seed Photos (2 per category)
const seedPhotos: GalleryPhoto[] = [
  {
    id: "seed-1",
    filename: "kemeja-batik-premium.jpg",
    description: "Kemeja Batik Premium - Jahitan halus furing katun hero dengan pola simetris rapi.",
    category: "pria",
    is_featured: true,
    is_active: true,
    created_at: new Date("2026-05-20").toISOString(),
    url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1000&auto=format&fit=crop&q=80"
  },
  {
    id: "seed-2",
    filename: "jas-pengantin-custom.jpg",
    description: "Jas Pengantin Custom - Set berkelas lengkap dengan vest, tailoring presisi pas badan.",
    category: "pria",
    is_featured: false,
    is_active: true,
    created_at: new Date("2026-05-21").toISOString(),
    url: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1000&auto=format&fit=crop&q=80"
  },
  {
    id: "seed-3",
    filename: "gaun-kebaya-modern.jpg",
    description: "Gaun Kebaya Modern - Perpaduan brokat prada premium dengan payet berkilau mewah.",
    category: "wanita",
    is_featured: true,
    is_active: true,
    created_at: new Date("2026-05-19").toISOString(),
    url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1000&auto=format&fit=crop&q=80"
  },
  {
    id: "seed-4",
    filename: "gamis-syari-anggun.jpg",
    description: "Gamis Syari Anggun - Desain anggun bahan ceruty armany premium dua layer yang jatuh anggun.",
    category: "wanita",
    is_featured: false,
    is_active: true,
    created_at: new Date("2026-05-18").toISOString(),
    url: "https://images.unsplash.com/photo-1549064492-661ffb578a4d?w=1000&auto=format&fit=crop&q=80"
  },
  {
    id: "seed-5",
    filename: "pashmina-silk-luxury.jpg",
    description: "Pashmina Silk Luxury - Koleksi hijab premium mulus berkilau, adem dan sangat mudah dibentuk.",
    category: "jilbab",
    is_featured: true,
    is_active: true,
    created_at: new Date("2026-05-17").toISOString(),
    url: "https://images.unsplash.com/photo-1609172765481-30926e2a5b4a?w=1000&auto=format&fit=crop&q=80"
  },
  {
    id: "seed-6",
    filename: "hijab-segiempat-voal.jpg",
    description: "Hijab Segiempat Voal - Motif cetak eksklusif, tegak di dahi dan nyaman untuk harian.",
    category: "jilbab",
    is_featured: false,
    is_active: true,
    created_at: new Date("2026-05-16").toISOString(),
    url: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=1000&auto=format&fit=crop&q=80"
  },
  {
    id: "seed-7",
    filename: "mesin-jahit-singer.jpg",
    description: "Mesin Jahit Singer - Layanan jahit didukung peralatan digital presisi super rapi.",
    category: "peralatan",
    is_featured: false,
    is_active: true,
    created_at: new Date("2026-05-15").toISOString(),
    url: "https://images.unsplash.com/photo-1528570188406-29a679346f36?w=1000&auto=format&fit=crop&q=80"
  },
  {
    id: "seed-8",
    filename: "benang-jahit-premium.jpg",
    description: "Benang Jahit Premium - Bahan baku benang berkualitas tinggi yang kuat dan tidak mudah luntur.",
    category: "peralatan",
    is_featured: false,
    is_active: true,
    created_at: new Date("2026-05-14").toISOString(),
    url: "https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=1000&auto=format&fit=crop&q=80"
  }
];

// Load Database Helper
function readDatabase(): GalleryPhoto[] {
  try {
    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, JSON.stringify(seedPhotos, null, 2), "utf8");
      return seedPhotos;
    }
    const raw = fs.readFileSync(dbPath, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to read gallery photos database:", err);
    return seedPhotos;
  }
}

// Write Database Helper
function writeDatabase(data: GalleryPhoto[]): boolean {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("Failed to write gallery photos database:", err);
    return false;
  }
}

// Setup Middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Static serving for local uploads
app.use("/uploads", express.static(uploadsDir));

// --- API ROUTES FIRST ---

/**
 * GET /api/gallery
 * Returns list of photos based on filters: category, featured
 */
app.get("/api/gallery", (req, res) => {
  try {
    const photos = readDatabase();
    const { category, featured, admin } = req.query;

    let filtered = photos;

    // Admin endpoint accesses ALL photos (both active and inactive)
    // Public endpoint only accesses ACTIVE photos
    if (admin !== "1") {
      filtered = filtered.filter(p => p.is_active);
    }

    if (category && category !== "all") {
      filtered = filtered.filter(p => p.category === category);
    }

    if (featured === "1") {
      filtered = filtered.filter(p => p.is_featured);
    }

    // Sort by created_at descending
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    res.json({
      status: "success",
      data: filtered
    });
  } catch (err: any) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

/**
 * GET /api/stats
 * Statistics summary for Admin Dashboard
 */
app.get("/api/stats", (req, res) => {
  try {
    const photos = readDatabase();
    
    const byCategory = {
      pria: 0,
      wanita: 0,
      jilbab: 0,
      peralatan: 0
    };

    photos.forEach(p => {
      if (p.category in byCategory) {
        byCategory[p.category]++;
      }
    });

    res.json({
      status: "success",
      data: {
        total: photos.length,
        featured: photos.filter(p => p.is_featured).length,
        active: photos.filter(p => p.is_active).length,
        byCategory
      }
    });
  } catch (err: any) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

/**
 * POST /api/gallery/upload
 * Handles base64 photo uploads securely
 */
app.post("/api/gallery/upload", (req, res) => {
  try {
    const { filename, description, category, is_featured, is_active, base64Data } = req.body;

    if (!filename || !category || !base64Data) {
      return res.status(400).json({ status: "error", message: "Missing required parameters: filename, category, or base64Data" });
    }

    // Validate category
    const validCategories = ["pria", "wanita", "jilbab", "peralatan"];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ status: "error", message: "Invalid category. Must be one of pria, wanita, jilbab, atau peralatan" });
    }

    // Create unique filename to prevent duplicates
    const uniqueId = Date.now().toString() + "-" + Math.round(Math.random() * 1E9);
    const sanitizedFilename = uniqueId + "_" + filename.replace(/[^a-zA-Z0-9.\-_]/g, "");
    const fileExtension = path.extname(sanitizedFilename).toLowerCase();

    // Validate extension
    const allowedExtensions = [".jpg", ".jpeg", ".png"];
    if (!allowedExtensions.includes(fileExtension)) {
      return res.status(400).json({ status: "error", message: "Only .jpg, .jpeg, and .png are allowed" });
    }

    // Strip header if base64 contains typing prefix (e.g., data:image/png;base64,)
    const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(cleanBase64, "base64");

    // Validate size (max 2MB)
    const MAX_SIZE = 2 * 1024 * 1024; // 2MB
    if (buffer.length > MAX_SIZE) {
      return res.status(400).json({ status: "error", message: "Image files must be under 2MB." });
    }

    // Write file to filesystem
    const targetPath = path.join(uploadsDir, sanitizedFilename);
    fs.writeFileSync(targetPath, buffer);

    // Save record in database
    const photos = readDatabase();
    const newPhoto: GalleryPhoto = {
      id: "photo-" + uniqueId,
      filename: sanitizedFilename,
      description: description || "",
      category: category as any,
      is_featured: !!is_featured,
      is_active: is_active === undefined ? true : !!is_active,
      created_at: new Date().toISOString(),
      url: `/uploads/${sanitizedFilename}`
    };

    photos.push(newPhoto);
    writeDatabase(photos);

    res.json({
      status: "success",
      message: "Photo uploaded successfully",
      data: newPhoto
    });
  } catch (err: any) {
    console.error("Upload handler error:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
});

/**
 * POST /api/gallery/delete
 * Deletes photos from the database and deletes local files if present
 */
app.post("/api/gallery/delete", (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ status: "error", message: "Missing required photo ID to delete" });
    }

    let photos = readDatabase();
    const targetIdx = photos.findIndex(p => p.id === id);

    if (targetIdx === -1) {
      return res.status(404).json({ status: "error", message: "Photo not found" });
    }

    const photoToDelete = photos[targetIdx];

    // Delete local photo file if it exists (skip seed images with external web URLs)
    if (photoToDelete.url.startsWith("/uploads/")) {
      const filePath = path.join(uploadsDir, photoToDelete.filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.error("Error unlinking file:", filePath, err);
        }
      }
    }

    // Remove from array and save database
    photos.splice(targetIdx, 1);
    writeDatabase(photos);

    res.json({
      status: "success",
      message: "Photo deleted and removed successfully"
    });
  } catch (err: any) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

/**
 * POST /api/gallery/toggle
 * Toggles is_active status of a photo
 */
app.post("/api/gallery/toggle", (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ status: "error", message: "Missing ID parameter" });
    }

    const photos = readDatabase();
    const photo = photos.find(p => p.id === id);

    if (!photo) {
      return res.status(404).json({ status: "error", message: "Photo not found" });
    }

    photo.is_active = !photo.is_active;
    writeDatabase(photos);

    res.json({
      status: "success",
      message: `Photo visibility toggled to ${photo.is_active ? "Active" : "Inactive"}`,
      data: photo
    });
  } catch (err: any) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

/**
 * POST /api/gallery/toggle-featured
 * Toggles is_featured status of a photo
 */
app.post("/api/gallery/toggle-featured", (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ status: "error", message: "Missing ID parameter" });
    }

    const photos = readDatabase();
    const photo = photos.find(p => p.id === id);

    if (!photo) {
      return res.status(404).json({ status: "error", message: "Photo not found" });
    }

    photo.is_featured = !photo.is_featured;
    writeDatabase(photos);

    res.json({
      status: "success",
      message: `Photo featured toggled to ${photo.is_featured ? "Featured" : "Regular"}`,
      data: photo
    });
  } catch (err: any) {
    res.status(500).json({ status: "error", message: err.message });
  }
});


// Serve robots.txt blocking search engine indexing of admin path
app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.send("User-agent: *\nDisallow: /admin-khasya-2026/");
});


// Configure Vite for development mode, or static serving for production mode
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT MODE with Vite Middleware");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION MODE serving static dist built assets");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

