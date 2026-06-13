import React, { useState } from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { motion, AnimatePresence } from 'framer-motion';
import { playClick, playPop } from '../../utils/sound';

const MAPBOX_TOKEN = 'pk.eyJ1Ijoiam9obmRvbmc0NzUiLCJhIjoiY204a29zODNmMHIzdDJpc2V6ZDJyNTNqeiJ9.Ax7eylJQEynCUV8UE_LXvQ';

const MAP_STYLES = [
  { id: 'light', name: 'Bản đồ Sáng', url: 'mapbox://styles/mapbox/light-v11' },
  { id: 'dark', name: 'Bản đồ Tối', url: 'mapbox://styles/mapbox/dark-v11' },
  { id: 'streets', name: 'Đường phố', url: 'mapbox://styles/mapbox/streets-v12' },
  { id: 'satellite', name: 'Vệ tinh', url: 'mapbox://styles/mapbox/satellite-streets-v12' }
];

export const MapComponent = () => {
  const [currentStyle, setCurrentStyle] = useState(MAP_STYLES[0].url);
  const [isOpen, setIsOpen] = useState(false);

  const selectedStyle = MAP_STYLES.find(s => s.url === currentStyle);

  return (
    <div className="absolute inset-0 w-full h-full bg-gray-100 flex items-center justify-center">
      <style>{`
        .mapboxgl-ctrl-group {
          transform: scale(0.85);
          transform-origin: bottom right;
        }
      `}</style>
      <Map
        initialViewState={{
          longitude: 106.746850,
          latitude: 10.947328,
          zoom: 16
        }}
        mapStyle={currentStyle}
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
      >
        <NavigationControl position="bottom-right" />
        <Marker longitude={106.746850} latitude={10.947328} anchor="bottom">
          <div className="flex flex-col items-center group cursor-pointer relative">
            <div className="bg-accent p-2 rounded-full shadow-lg shadow-blue-500/40 group-hover:scale-110 transition-transform">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-accent"></div>
            <div className="absolute top-full mt-1 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] font-bold text-sm text-primary whitespace-nowrap border border-white/50 pointer-events-none">
              FENICA
            </div>
          </div>
        </Marker>
      </Map>

      {/* Custom Style Selector Overlay */}
      <div className="absolute top-4 left-4 z-10">
        <div className="relative">
          <button 
            onClick={() => { playClick(); setIsOpen(!isOpen); }}
            className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-2 rounded-lg border border-white/50 shadow-[0_4px_12px_rgba(0,0,0,0.1)] font-bold text-xs text-primary hover:bg-white transition-all active:scale-95"
          >
            <div className="w-2 h-2 rounded-full bg-accent"></div>
            {selectedStyle?.name}
            <svg className={`w-3.5 h-3.5 ml-1 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <AnimatePresence>
            {isOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 mt-2 w-36 bg-white/95 backdrop-blur-xl rounded-lg border border-white/50 shadow-xl overflow-hidden py-1"
              >
                {MAP_STYLES.map(style => (
                  <button
                    key={style.id}
                    onClick={() => {
                      playPop();
                      setCurrentStyle(style.url);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors hover:bg-accent/10 hover:text-accent flex items-center gap-2 active:scale-95 ${
                      currentStyle === style.url ? 'text-accent font-bold bg-accent/5' : 'text-gray-600'
                    }`}
                  >
                    {currentStyle === style.url ? (
                      <svg className="w-3.5 h-3.5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <div className="w-3.5 h-3.5"></div>
                    )}
                    {style.name}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
