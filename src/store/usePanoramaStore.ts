import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Hotspot } from '../types';

interface PanoramaState {
  currentSceneId: string;
  selectedHotspot: Hotspot | null;
  autoRotate: boolean;
  isDebugMode: boolean;
  draggedHotspotId: string | null;
  hotspotOverrides: Record<string, number[]>;
  setCurrentSceneId: (id: string) => void;
  setSelectedHotspot: (hotspot: Hotspot | null) => void;
  setAutoRotate: (auto: boolean) => void;
  setIsDebugMode: (debug: boolean) => void;
  setDraggedHotspotId: (id: string | null) => void;
  updateHotspotPosition: (id: string, position: number[]) => void;
}

export const usePanoramaStore = create<PanoramaState>()(
  persist(
    (set) => ({
      currentSceneId: 'scene-1',
      selectedHotspot: null,
      autoRotate: true,
      isDebugMode: false,
      draggedHotspotId: null,
      hotspotOverrides: {},
      setCurrentSceneId: (id) => set({ currentSceneId: id, selectedHotspot: null }),
      setSelectedHotspot: (hotspot) => set({ selectedHotspot: hotspot }),
      setAutoRotate: (auto) => set({ autoRotate: auto }),
      setIsDebugMode: (debug) => set({ isDebugMode: debug }),
      setDraggedHotspotId: (id) => set({ draggedHotspotId: id }),
      updateHotspotPosition: (id, position) => set((state) => ({
        hotspotOverrides: { ...state.hotspotOverrides, [id]: position }
      })),
    }),
    {
      name: 'panorama-storage',
      partialize: (state) => ({ autoRotate: state.autoRotate }),
    }
  )
);
