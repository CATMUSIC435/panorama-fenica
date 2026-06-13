import React, { useState } from 'react';
import { useUIStore } from '../../store/useUIStore';
import { usePanoramaStore } from '../../store/usePanoramaStore';
import { mockScenes } from '../../data/mock';
import { Info, Map, Layers, Image as ImageIcon, Newspaper, RefreshCcw, ChevronDown, Menu, X, PlaySquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { playClick, playPop } from '../../utils/sound';

export const FloatingMenu: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { openModal, activeModal } = useUIStore();
  const { currentSceneId, setCurrentSceneId } = usePanoramaStore();
  const [isMenuOpen, setIsMenuOpen] = useState(() => window.innerWidth > 768);
  const [isSceneMenuOpen, setIsSceneMenuOpen] = useState(false);

  const currentScene = mockScenes.find(s => s.id === currentSceneId);

  const menuItems = [
    { id: 'overview', icon: <Info size={16} />, label: t('menu.overview') },
    { id: 'floorplan', icon: <Layers size={16} />, label: t('menu.floor_plan') },
    { id: 'ultis', icon: <Info size={16} />, label: 'Mặt bằng tiện ích' }, // We'll just hardcode the Vietnamese string or use translation key later
    { id: 'video', icon: <PlaySquare size={16} />, label: t('menu.video') },
    { id: 'gallery', icon: <ImageIcon size={16} />, label: t('menu.gallery') },
    { id: 'map', icon: <Map size={16} />, label: t('menu.map') },
    { id: 'news', icon: <Newspaper size={16} />, label: t('menu.news') },
  ] as const;

  const toggleLanguage = () => {
    playClick();
    i18n.changeLanguage(i18n.language.startsWith('en') ? 'vi' : 'en');
  };

  return (
    <div className="fixed top-4 left-4 md:top-6 md:left-6 z-40 flex flex-col gap-3">
      
      <div className="flex gap-2">
        {/* Toggle Menu Button */}
        <motion.button 
          onClick={() => { playPop(); setIsMenuOpen(!isMenuOpen); }}
          className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 glass-panel hover:bg-white/60 active:scale-95 transition-all self-start rounded-full backdrop-blur-3xl"
        >
          {isMenuOpen ? <X size={16} className="text-primary w-4 h-4 md:w-5 md:h-5" /> : <Menu size={16} className="text-primary w-4 h-4 md:w-5 md:h-5" />}
          <span className="font-bold tracking-widest text-[10px] md:text-xs uppercase text-primary">
            FENICA
          </span>
        </motion.button>

        {/* Language Toggle */}
        <motion.button 
          onClick={toggleLanguage}
          className="flex items-center justify-center px-2 py-2 md:px-3 md:py-2.5 glass-panel hover:bg-white/60 active:scale-95 transition-all self-start rounded-full backdrop-blur-3xl font-bold text-[10px] md:text-xs text-primary uppercase min-w-[36px] md:min-w-[44px]"
        >
          {i18n.language.substring(0, 2)}
        </motion.button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-2 w-[230px] md:w-[260px]"
          >
            {/* Scene Selector */}
            <div className="glass-panel rounded-3xl p-1.5">
              <button 
                onClick={() => { playClick(); setIsSceneMenuOpen(!isSceneMenuOpen); }}
                className="w-full flex items-center justify-between p-1.5 md:p-2 rounded-2xl hover:bg-white/40 transition-colors group active:scale-[0.98]"
              >
                <div className="flex items-center gap-2 md:gap-3 overflow-hidden">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform duration-300 shadow-sm border border-accent/20 shrink-0">
                    <RefreshCcw size={16} className="md:w-5 md:h-5" />
                  </div>
                  <div className="flex flex-col items-start overflow-hidden">
                    <span className="text-[9px] md:text-[10px] font-bold text-secondary uppercase tracking-wider">{t('menu.current_view')}</span>
                    <span className="text-[11px] md:text-sm font-bold text-primary whitespace-nowrap truncate">{t(currentScene?.name || '')}</span>
                  </div>
                </div>
                <ChevronDown size={18} className={`text-secondary shrink-0 transition-transform duration-300 ${isSceneMenuOpen ? 'rotate-180' : ''}`} />
              </button>

                <AnimatePresence>
                  {isSceneMenuOpen && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-1 px-1 pb-1 space-y-1">
                        {mockScenes.map((scene) => (
                          <button
                            key={scene.id}
                            onClick={() => {
                              playClick();
                              setCurrentSceneId(scene.id);
                              setIsSceneMenuOpen(false);
                            }}
                            className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-full transition-all active:scale-95 w-full text-left ${
                              currentSceneId === scene.id
                                ? 'bg-accent-light text-accent'
                                : 'text-primary hover:bg-white/50'
                            }`}
                          >
                          <div className={`w-2 h-2 rounded-full transition-colors ${currentSceneId === scene.id ? 'bg-accent' : 'bg-gray-400'}`} />
                          {t(scene.name)}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Main Features Section */}
            <div className="glass-panel rounded-3xl p-1.5 flex flex-col gap-px">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { playPop(); openModal(item.id); }}
                  className={`flex items-center gap-2 md:gap-3 px-2.5 py-1.5 md:px-3 md:py-2 rounded-full transition-all duration-300 w-full text-left group relative overflow-hidden active:scale-95 ${
                    activeModal === item.id 
                      ? 'bg-white/60 text-primary shadow-sm border border-white/60' 
                      : 'text-primary hover:bg-white/50 hover:shadow-sm border border-transparent'
                  }`}
                >
                  <div className={`flex items-center justify-center transition-transform duration-300 group-hover:scale-110 w-4 h-4 md:w-5 md:h-5 ${activeModal === item.id ? 'text-accent' : 'text-primary'}`}>
                    {item.icon}
                  </div>
                  <span className={`font-medium text-[11px] md:text-sm ${activeModal === item.id ? 'font-semibold text-accent' : ''}`}>{item.label}</span>
                </button>
              ))}
            </div>
            
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
