import React, { useState, useEffect, useRef } from 'react';
import { Maximize, Minimize, Music, Music2, RefreshCcw, Globe, MapPinned, X, Settings2 } from 'lucide-react';
import { usePanoramaStore } from '../../store/usePanoramaStore';
import { playClick, playPop } from '../../utils/sound';
import { motion, AnimatePresence } from 'framer-motion';

export const RightToolbar: React.FC = () => {
  const { autoRotate, setAutoRotate } = usePanoramaStore();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Collapsible state
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio object once
  useEffect(() => {
    audioRef.current = new Audio('./assets/musics/ngot-mua-themeo.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4; // Soft background music

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMusic = () => {
    playPop();
    if (audioRef.current) {
      if (isPlayingMusic) {
        audioRef.current.pause();
        setIsPlayingMusic(false);
      } else {
        audioRef.current.play().catch((e) => console.error("Audio play failed:", e));
        setIsPlayingMusic(true);
      }
    }
  };

  const toggleFullscreen = () => {
    playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const toggleAutoRotate = () => {
    playClick();
    setAutoRotate(!autoRotate);
  };

  // Sync fullscreen state with browser API (e.g., when user presses ESC)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Animation variants for the staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05, staggerDirection: -1 }
    },
    exit: {
      opacity: 0,
      transition: { staggerChildren: 0.05, staggerDirection: 1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.5, y: 20 },
    show: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.5, y: 20 }
  };

  return (
    <div className="fixed right-4 bottom-4 md:right-8 md:bottom-8 z-40 flex flex-col items-center gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="flex flex-col gap-3"
          >
            {/* Website Link */}
            <motion.button
              variants={itemVariants}
              onClick={() => { playClick(); window.open('https://fenica.vn', '_blank'); setIsOpen(false); }}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg group relative active:scale-90 glass-panel hover:bg-white/60 text-primary border border-transparent"
              aria-label="Website Fenica"
            >
              <Globe size={16} />
              <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 glass-panel !bg-black/70 !text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap hidden md:block">
                Truy cập Website
              </div>
            </motion.button>

            {/* Google Maps Link */}
            <motion.button
              variants={itemVariants}
              onClick={() => { playClick(); window.open('https://maps.app.goo.gl/ShWcuMTA8fTHxW6F6', '_blank'); setIsOpen(false); }}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg group relative active:scale-90 glass-panel hover:bg-white/60 text-primary border border-transparent"
              aria-label="Google Maps"
            >
              <MapPinned size={16} />
              <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 glass-panel !bg-black/70 !text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap hidden md:block">
                Bản đồ Google Maps
              </div>
            </motion.button>

            {/* Background Music Toggle */}
            <motion.button
              variants={itemVariants}
              onClick={toggleMusic}
              className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg group relative active:scale-90 ${
                isPlayingMusic 
                  ? 'glass-panel !bg-white/80 text-accent border border-accent/30' 
                  : 'glass-panel hover:bg-white/60 text-primary border border-transparent'
              }`}
              aria-label="Toggle Background Music"
            >
              {isPlayingMusic ? <Music size={16} className="animate-pulse" /> : <Music2 size={16} />}
              
              {/* Tooltip */}
              <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 glass-panel !bg-black/70 !text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap hidden md:block">
                {isPlayingMusic ? 'Tắt nhạc nền' : 'Bật nhạc nền'}
              </div>
            </motion.button>

            {/* Auto Rotate Toggle */}
            <motion.button
              variants={itemVariants}
              onClick={toggleAutoRotate}
              className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg group relative active:scale-90 ${
                autoRotate 
                  ? 'glass-panel !bg-white/80 text-accent border border-accent/30' 
                  : 'glass-panel hover:bg-white/60 text-primary border border-transparent'
              }`}
              aria-label="Toggle Auto Rotate"
            >
              <RefreshCcw size={16} className={autoRotate ? "animate-spin-slow" : ""} />
              
              <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 glass-panel !bg-black/70 !text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap hidden md:block">
                {autoRotate ? 'Dừng xoay tự động' : 'Bật xoay tự động'}
              </div>
            </motion.button>

            {/* Fullscreen Toggle */}
            <motion.button
              variants={itemVariants}
              onClick={toggleFullscreen}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg group relative active:scale-90 glass-panel hover:bg-white/60 text-primary border border-transparent"
              aria-label="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
              
              <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 glass-panel !bg-black/70 !text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap hidden md:block">
                {isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Toggle Button */}
      <button
        onClick={() => { playClick(); setIsOpen(!isOpen); }}
        className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl group relative active:scale-90 z-50 ${
          isOpen 
            ? 'glass-panel bg-white/40 text-primary border border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.4)]'
            : 'bg-primary/90 backdrop-blur-md text-white border border-white/20 hover:bg-primary shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
        }`}
        aria-label="Toggle Menu"
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <Settings2 size={20} className={`absolute transition-all duration-300 ${isOpen ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`} />
          <X size={20} className={`absolute transition-all duration-300 ${isOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`} />
        </div>
        
        {/* Tooltip for toggle */}
        {!isOpen && (
          <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-primary/90 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap hidden md:block shadow-lg">
            Công cụ
          </div>
        )}
      </button>
    </div>
  );
};
