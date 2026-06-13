import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useTranslation } from 'react-i18next';
import { playClick } from '../../utils/sound';
import { ChevronLeft, ChevronRight, PlayCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VIDEO_IDS = [
  'oq1kr1-mFIo',
  'YK90MfeXkvA',
  'Ei7SBKtUbl8',
  'YGxvWwaIdN8'
];

export const VideoModal: React.FC = () => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleNext = () => {
    playClick();
    setIsPlaying(false);
    setActiveIndex((prev) => (prev + 1) % VIDEO_IDS.length);
  };

  const handlePrev = () => {
    playClick();
    setIsPlaying(false);
    setActiveIndex((prev) => (prev - 1 + VIDEO_IDS.length) % VIDEO_IDS.length);
  };

  const activeVideoId = VIDEO_IDS[activeIndex];

  return (
    <Modal title={t('menu.video')} maxWidth="max-w-6xl">
      <div className="flex flex-col min-h-[75vh] gap-6 relative">
        {/* Main Video Carousel Area */}
        <div className="flex-1 relative overflow-hidden flex flex-col items-center justify-center bg-gray-900/90 backdrop-blur-md rounded-2xl border border-white/20 shadow-[inset_0_4px_24px_rgba(0,0,0,0.4)]">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeVideoId + (isPlaying ? '-playing' : '-thumb')}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full absolute inset-0 flex items-center justify-center"
            >
              {isPlaying ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&rel=0`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="w-full h-full object-cover"
                ></iframe>
              ) : (
                <div className="w-full h-full relative group cursor-pointer" onClick={() => { playClick(); setIsPlaying(true); }}>
                  <img
                    src={`https://img.youtube.com/vi/${activeVideoId}/maxresdefault.jpg`}
                    alt="Video Thumbnail"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-accent/90 text-white rounded-full p-3 md:p-6 shadow-[0_0_30px_rgba(var(--tw-colors-accent),0.6)] backdrop-blur-md"
                    >
                      <PlayCircle className="w-12 h-12 md:w-20 md:h-20" />
                    </motion.div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-14 md:h-14 bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-xl"
          >
            <ChevronLeft className="w-5 h-5 md:w-8 md:h-8" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-14 md:h-14 bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-xl"
          >
            <ChevronRight className="w-5 h-5 md:w-8 md:h-8" />
          </button>
        </div>

        {/* Thumbnail Strip */}
        <div className="glass-card p-3 rounded-2xl">
          <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-2">
            {VIDEO_IDS.map((id, index) => (
              <button
                key={id}
                onClick={() => {
                  playClick();
                  setIsPlaying(false);
                  setActiveIndex(index);
                }}
                className={`relative flex-shrink-0 w-32 md:w-40 aspect-video rounded-xl overflow-hidden border-2 transition-all duration-300 active:scale-95 ${
                  activeIndex === index ? 'border-accent shadow-[0_0_15px_rgba(var(--tw-colors-accent),0.4)]' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={`https://img.youtube.com/vi/${id}/mqdefault.jpg`}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {activeIndex === index && (
                  <div className="absolute inset-0 bg-accent/20 flex items-center justify-center">
                    <PlayCircle size={24} className="text-white drop-shadow-md" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
