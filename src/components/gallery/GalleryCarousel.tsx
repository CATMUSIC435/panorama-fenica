import React, { useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { playClick } from '../../utils/sound';

interface GalleryCarouselProps {
  selectedImageIndex: number | null;
  displayImages: string[];
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const GalleryCarousel: React.FC<GalleryCarouselProps> = ({
  selectedImageIndex,
  displayImages,
  onClose,
  onNext,
  onPrev
}) => {
  // Keyboard Navigation
  useEffect(() => {
    if (selectedImageIndex === null) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, onClose, onNext, onPrev]);

  return (
    <AnimatePresence>
      {selectedImageIndex !== null && (
        <motion.div 
          key="gallery-fullscreen-carousel"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-2xl"
        >
          {/* Top Bar */}
          <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-center z-20 bg-gradient-to-b from-black/50 to-transparent">
            <span className="text-white/80 font-bold tracking-widest text-sm glass-panel !bg-white/10 !border-white/10 !text-white px-4 py-1.5 rounded-full">
              {selectedImageIndex + 1} / {displayImages.length}
            </span>
            <button 
              onClick={() => { playClick(); onClose(); }}
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all border border-white/20 hover:scale-105 active:scale-90"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation Buttons */}
          <button 
            onClick={(e) => { e.stopPropagation(); playClick(); onPrev(); }}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all border border-white/20 z-20 hover:scale-105 active:scale-90"
          >
            <ChevronLeft size={32} />
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); playClick(); onNext(); }}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all border border-white/20 z-20 hover:scale-105 active:scale-90"
          >
            <ChevronRight size={32} />
          </button>

          {/* Main Image Container */}
          <div className="w-full h-full p-12 flex items-center justify-center" onClick={onClose}>
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedImageIndex}
                src={displayImages[selectedImageIndex]}
                alt="Fullscreen view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className="max-w-full max-h-full object-contain drop-shadow-2xl rounded-xl z-10"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
              />
            </AnimatePresence>
          </div>
          
        </motion.div>
      )}
    </AnimatePresence>
  );
};
