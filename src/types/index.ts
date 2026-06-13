export interface ProjectInfo {
  name: string;
  slogan: string;
  location: string;
  scale: string;
  totalUnits: number;
  blocks: number;
  handover: string;
  legal: string;
  investor: string;
}

export interface Hotspot {
  id: string;
  type: 'scene' | 'info' | 'unit' | 'gallery' | 'video' | 'contact';
  position: [number, number, number]; // [x, y, z] in 3D space
  targetSceneId?: string; // For 'scene' type
  title?: string;
  description?: string;
  unitCode?: string; // For 'unit' type
  lineHeight?: number; // Custom line height in pixels to avoid overlap
}

export interface Scene {
  id: string;
  name: string;
  image: string; // URL to equirectangular image
  hotspots: Hotspot[];
}

export interface Unit {
  code: string;
  type: string;
  area?: number;
  builtUpArea?: number;
  carpetArea?: number;
  direction: string;
  view: string;
  status: 'available' | 'booking' | 'sold' | 'locked';
  price: string;
  polygon: string; // SVG path data
  room3dImage?: string; // Explicit mapping for 3D room image
}

export interface Floor {
  id: string;
  name: string;
  image: string; // URL to floor plan image
  units: Unit[];
  isUpdating?: boolean;
}

export interface Block {
  id: string;
  name: string;
  floors: Floor[];
}

export interface NewsItem {
  id: string;
  category: string;
  date: string;
  title: string;
  excerpt: string;
  image: string;
}

export interface MapMarker {
  id: string;
  category: 'school' | 'hospital' | 'mall' | 'metro' | 'park' | 'road';
  coordinates: [number, number]; // [longitude, latitude]
  title: string;
  distance: string;
}
