export type PhotoCategory = 'pria' | 'wanita' | 'jilbab' | 'peralatan';

export interface GalleryPhoto {
  id: string;
  filename: string;
  description: string;
  category: PhotoCategory;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  url: string; // Dynamic path or full URL
}

export interface StatsInfo {
  total: number;
  featured: number;
  byCategory: Record<PhotoCategory, number>;
}
