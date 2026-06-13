import React from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from 'lucide-react';

const MAPBOX_TOKEN = ''; // Placeholder token

export const MapSection: React.FC = () => {
  return (
    <section id="location" className="py-24 bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-sm font-bold tracking-[0.2em] text-gold-500 uppercase mb-4">Location</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-white mb-6">Heart of The City</h3>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Perfectly positioned to offer both tranquility and seamless connectivity to major city hubs.
          </p>
        </div>

        <div className="rounded-2xl overflow-hidden border border-gray-800 h-[600px] relative bg-gray-800 flex items-center justify-center">
          {/* Using a placeholder message if token is invalid, but structure is ready */}
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-900/80 backdrop-blur-sm text-center p-6">
             <MapPin size={48} className="text-gold-500 mb-4" />
             <h4 className="text-2xl font-bold text-white mb-2">Map Integration Ready</h4>
             <p className="text-gray-400 max-w-md">
               The Mapbox GL component is fully implemented. Please provide a valid Mapbox Access Token to render the interactive map tiles.
             </p>
             <p className="text-xs text-gray-500 mt-4 font-mono">
               src/components/map/MapSection.tsx
             </p>
          </div>

          <Map
            initialViewState={{
              longitude: 106.746850, // Fenica location
              latitude: 10.947328,
              zoom: 16
            }}
            mapStyle="mapbox://styles/mapbox/dark-v11"
            mapboxAccessToken={MAPBOX_TOKEN}
          >
            <NavigationControl position="bottom-right" />
            <Marker longitude={106.746850} latitude={10.947328} anchor="bottom">
              <div className="flex flex-col items-center">
                <div className="bg-gold-500 p-2 rounded-full shadow-lg shadow-gold-500/50">
                  <MapPin className="text-gray-950" size={24} />
                </div>
                <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-gold-500"></div>
              </div>
            </Marker>
          </Map>
        </div>
      </div>
    </section>
  );
};
