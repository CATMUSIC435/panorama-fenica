import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Eye } from 'lucide-react';
import { galleryImages } from '../../data/images';
import { useTranslation } from 'react-i18next';
import { playClick, playPop } from '../../utils/sound';
import { GalleryCarousel } from '../gallery/GalleryCarousel';

type TabType = 'all' | 'perspective' | 'sample_1pn' | 'sample_2pn';

export const GalleryModal: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const tabs = [
    { id: 'all', label: t('gallery.tab_all') },
    { id: 'perspective', label: t('gallery.tab_perspective') },
    { id: 'sample_1pn', label: t('gallery.tab_sample_1pn') },
    { id: 'sample_2pn', label: t('gallery.tab_sample_2pn') },
  ] as const;

  const getDisplayImages = () => {
    switch (activeTab) {
      case 'perspective': return galleryImages.perspective;
      case 'sample_1pn': return galleryImages.sample_1pn;
      case 'sample_2pn': return galleryImages.sample_2pn;
      case 'all':
      default:
        return [
          ...galleryImages.perspective,
          ...galleryImages.sample_1pn,
          ...galleryImages.sample_2pn
        ];
    }
  };

  const displayImages = getDisplayImages();

  const handleNext = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % displayImages.length);
    }
  };

  const handlePrev = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex - 1 + displayImages.length) % displayImages.length);
    }
  };

  return (
    <>
      <Modal title={t('gallery.title')} maxWidth="max-w-6xl">
        <div className="flex flex-col gap-6 min-h-[600px]">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-1 md:gap-2 p-1.5 bg-[#F1F3F5] rounded-full w-fit shadow-inner">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    playClick();
                    setActiveTab(tab.id as TabType);
                    setSelectedImageIndex(null);
                  }}
                  className={`relative px-6 py-2 md:px-8 md:py-2.5 rounded-full font-bold text-[13px] md:text-[15px] transition-all duration-300 ${
                    isActive 
                    ? 'text-white bg-[#007bff] border-[1.5px] border-black shadow-sm' 
                    : 'text-[#3A4556] hover:text-black hover:bg-black/5 border-[1.5px] border-transparent'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayImages.map((imgPath, index) => (
              <div 
                key={index} 
                onClick={() => { playPop(); setSelectedImageIndex(index); }}
                className="relative group aspect-[4/3] overflow-hidden rounded-[2rem] cursor-pointer glass-card glass-card-hover border-white/20 active:scale-[0.98]"
              >
                <img 
                  src={imgPath}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center">
                  <button className="w-11 h-11 rounded-full bg-accent flex items-center justify-center text-white group-hover:scale-110 transition-all duration-300 shadow-[0_4px_12px_rgba(0,122,255,0.4)]">
                    <Eye size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      <GalleryCarousel 
        selectedImageIndex={selectedImageIndex}
        displayImages={displayImages}
        onClose={() => setSelectedImageIndex(null)}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </>
  );
};
