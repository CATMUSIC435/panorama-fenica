import { create } from 'zustand';

export type ModalType = 'none' | 'overview' | 'floorplan' | 'gallery' | 'map' | 'news' | 'leadform' | 'analytics' | 'video' | 'ultis';

interface UIState {
  activeModal: ModalType;
  isGalleryLightboxOpen: boolean;
  activeGalleryImageIndex: number;
  openModal: (modal: ModalType) => void;
  closeModal: () => void;
  openGalleryLightbox: (index: number) => void;
  closeGalleryLightbox: () => void;
  preselectedUnitId: string | null;
  setPreselectedUnitId: (id: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeModal: 'none',
  isGalleryLightboxOpen: false,
  activeGalleryImageIndex: 0,
  preselectedUnitId: null,
  setPreselectedUnitId: (id) => set({ preselectedUnitId: id }),
  openModal: (modal) => set({ activeModal: modal }),
  closeModal: () => set({ activeModal: 'none', preselectedUnitId: null }),
  openGalleryLightbox: (index) => set({ isGalleryLightboxOpen: true, activeGalleryImageIndex: index }),
  closeGalleryLightbox: () => set({ isGalleryLightboxOpen: false }),
}));
