import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
// @ts-ignore
import { MapComponent } from './MapComponent';
import { playClick } from '../../utils/sound';

export const MapModal: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'mapbox' | 'svg'>('mapbox');

  return (
    <Modal title={t('map.title')} maxWidth="max-w-7xl">
      <div className="flex flex-col gap-4 h-full min-h-[60vh] md:min-h-[75vh]">
        {/* Tabs Control */}
        <div className="flex justify-center mb-2">
          <div className="glass-panel p-1 rounded-xl flex gap-1 shadow-sm">
            <button
              onClick={() => { playClick(); setActiveTab('mapbox'); }}
              className={`px-6 py-2 rounded-lg font-bold text-sm transition-all duration-300 active:scale-95 ${
                activeTab === 'mapbox' 
                  ? 'bg-accent text-white shadow-md' 
                  : 'text-secondary hover:text-primary hover:bg-white/50'
              }`}
            >
              Mapbox 3D
            </button>
            <button
              onClick={() => { playClick(); setActiveTab('svg'); }}
              className={`px-6 py-2 rounded-lg font-bold text-sm transition-all duration-300 active:scale-95 ${
                activeTab === 'svg' 
                  ? 'bg-accent text-white shadow-md' 
                  : 'text-secondary hover:text-primary hover:bg-white/50'
              }`}
            >
              Bản đồ Animation (SVG)
            </button>
          </div>
        </div>

        <div className="glass-card rounded-[2rem] overflow-hidden flex-1 relative p-0 border border-white/20 shadow-[inset_0_4px_24px_rgba(0,0,0,0.4)] bg-gray-900/90 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {activeTab === 'mapbox' ? (
              <motion.div
                key="mapbox"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
              >
                <MapComponent />
              </motion.div>
            ) : (
              <motion.div 
                key="svg"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full h-full relative flex items-center justify-center overflow-auto custom-scrollbar p-4 md:p-8"
              >
                {/* Decorative Glowing Backdrop */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[2rem] flex items-center justify-center">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-3/4 h-3/4 bg-accent/10 rounded-full blur-[80px]"
                  />
                </div>

                {/* Sweeping Light Ray Effect */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[2rem]">
                  <motion.div 
                    animate={{ 
                      x: ['-200%', '300%'],
                      opacity: [0, 0.5, 0]
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity,
                      ease: "linear",
                      repeatDelay: 1
                    }}
                    className="w-1/3 h-[150%] bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[30deg] -translate-y-1/4"
                  />
                </div>

                <div className="relative w-full h-full min-w-[800px] lg:min-w-full flex items-center justify-center group">
                  {/* The SVG Object with internal CSS animations */}
                  <object 
                    data="./assets/map-animated-clean.svg" 
                    type="image/svg+xml"
                    className="w-full h-full object-contain relative z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-700"
                    aria-label="Interactive Project Map"
                  >
                    <img src="./assets/map-animated-clean.svg" alt="Project Map" className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]" />
                  </object>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Modal>
  );
};
