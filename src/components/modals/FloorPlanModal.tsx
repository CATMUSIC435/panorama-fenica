import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { mockFloors } from '../../data/mock';
import { useTranslation } from 'react-i18next';
import { playClick } from '../../utils/sound';
import { useUIStore } from '../../store/useUIStore';
import { UnitDetailsSidebar } from '../floorplan/UnitDetailsSidebar';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import { Plus, Minus, RotateCcw } from 'lucide-react';

import { mapData } from '../../data/mock';

export const FloorPlanModal: React.FC = () => {
  const { t } = useTranslation();
  const preselectedUnitId = useUIStore(state => state.preselectedUnitId);
  
  const [activeFloorId, setActiveFloorId] = useState(mockFloors[0].id);
  const currentFloorData = mockFloors.find(f => f.id === activeFloorId);
  const units = currentFloorData?.units || [];
  
  const [selectedUnit, setSelectedUnit] = useState(() => {
    if (preselectedUnitId) {
      return units.find(u => u.code === preselectedUnitId) || units[0];
    }
    return units[0];
  });
  const [imgSize, setImgSize] = useState({ w: 8000, h: 4000 }); // Default fallback

  // Sync selected unit when preselectedUnitId changes externally
  useEffect(() => {
    if (preselectedUnitId) {
      const foundUnit = units.find(u => u.code === preselectedUnitId);
      if (foundUnit) {
        setSelectedUnit(foundUnit);
      }
    }
  }, [preselectedUnitId, units]);

  // Update selected unit when floor changes
  useEffect(() => {
    if (!preselectedUnitId && units.length > 0) {
      setSelectedUnit(units[0]);
    }
  }, [activeFloorId]);

  return (
    <Modal title={t('floorplan.title')} maxWidth="max-w-7xl">
      <div className="flex flex-col min-h-[70vh] gap-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between mb-2">
          <div className="flex flex-wrap items-center gap-1 md:gap-2 p-1.5 bg-[#F1F3F5] rounded-full w-fit shadow-inner">
            {mockFloors.map((floor) => {
              const isActive = activeFloorId === floor.id;
              return (
                <button
                  key={floor.id}
                  onClick={() => { playClick(); setActiveFloorId(floor.id); }}
                  className={`relative px-6 py-2 md:px-8 md:py-2.5 rounded-full font-bold text-[13px] md:text-[15px] transition-all duration-300 flex-shrink-0 ${
                    isActive 
                    ? 'text-white bg-[#007bff] border-[1.5px] border-black shadow-sm' 
                    : 'text-[#3A4556] hover:text-black hover:bg-black/5 border-[1.5px] border-transparent'
                  }`}
                >
                  {floor.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Plan Viewer */}
        <div className="flex flex-col md:flex-row gap-6 h-full flex-1">
          {/* Main Floor Plan Area (Always Visible) */}
          <div className="flex-1 relative overflow-hidden flex flex-col items-center justify-center bg-gray-900/90 backdrop-blur-md rounded-2xl border border-white/20 shadow-[inset_0_4px_24px_rgba(0,0,0,0.4)] p-4 md:p-8">
            {/* Interactive Floor Plan Image */}
            <div className="w-full h-full flex items-center justify-center min-h-[400px]">
              <TransformWrapper
                initialScale={1}
                minScale={0.2}
                maxScale={4}
                centerOnInit={true}
                wheel={{ step: 0.1 }}
              >
                {({ zoomIn, zoomOut, resetTransform, state }) => {
                  const currentScale = state?.scale || 1;
                  
                  return (
                  <React.Fragment>
                    <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                      <button onClick={() => { playClick(); zoomIn(); }} className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl border border-white/20 flex items-center justify-center text-white shadow-lg transition-all active:scale-95" title="Phóng to">
                        <Plus className="w-5 h-5" />
                      </button>
                      <button onClick={() => { playClick(); zoomOut(); }} className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl border border-white/20 flex items-center justify-center text-white shadow-lg transition-all active:scale-95" title="Thu nhỏ">
                        <Minus className="w-5 h-5" />
                      </button>
                      <button onClick={() => { playClick(); resetTransform(); }} className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl border border-white/20 flex items-center justify-center text-white shadow-lg transition-all active:scale-95" title="Khôi phục">
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                    <TransformComponent wrapperClass="w-full h-full" contentClass="w-full h-full flex items-center justify-center">
                      <div className="relative inline-block max-w-full max-h-[70vh]">
                        <img 
                          src={currentFloorData?.image} 
                          alt="Floor Plan" 
                          className="max-w-full max-h-[70vh] object-contain drop-shadow-2xl cursor-grab active:cursor-grabbing"
                          draggable={false}
                          loading="lazy"
                          decoding="async"
                          onLoad={(e) => {
                            setImgSize({
                              w: e.currentTarget.naturalWidth || 8000,
                              h: e.currentTarget.naturalHeight || 4000
                            });
                          }}
                        />
                        
                        {/* Render mapData pins only if we have an image size and it's floor-1 */}
                        {imgSize.w > 0 && activeFloorId === 'floor-1' && mapData.map((pin) => {
                          const leftPercent = (pin.x / imgSize.w) * 100;
                          const topPercent = (pin.y / imgSize.h) * 100;
                          const isSelected = selectedUnit?.code === pin.id;
                          
                          return (
                              <button
                                key={pin.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  playClick();
                                  // Fallback if the unit is not found in mock data
                                  const foundUnit = units.find(u => u.code === pin.id) || {
                                    code: pin.id,
                                    type: 'Tiêu chuẩn',
                                    area: Math.floor(Math.random() * 30 + 50),
                                    direction: 'Đông Nam',
                                    view: 'Nội khu',
                                    status: 'available',
                                    price: 'Liên hệ',
                                    polygon: ""
                                  };
                                  // Force any unit type dynamically if not matching
                                  setSelectedUnit(foundUnit);
                                }}
                                className={`absolute w-4 h-4 md:w-5 md:h-5 -ml-2 -mt-2 md:-ml-2.5 md:-mt-2.5 rounded-full flex items-center justify-center text-[6px] md:text-[8px] font-bold shadow-lg transition-colors z-10 group ${
                                  isSelected 
                                    ? 'bg-accent text-white shadow-[0_0_15px_rgba(var(--color-accent),0.8)] z-20' 
                                    : 'bg-white/95 text-primary border border-primary/20 hover:bg-accent hover:text-white'
                                }`}
                                style={{ 
                                  left: `${leftPercent}%`, 
                                  top: `${topPercent}%`,
                                  transform: `scale(${Math.min(1.5, 1 / currentScale)})`
                                }}
                                title={`Căn hộ ${pin.id}`}
                              >
                                <div className="ripple-container"><span></span></div>
                                <span className="animate-number-run pointer-events-none relative z-10">
                                  {pin.id.split('-')[1]}
                                </span>
                              </button>
                          );
                        })}
                      </div>
                    </TransformComponent>
                  </React.Fragment>
                  );
                }}
              </TransformWrapper>
            </div>
          </div>
          
          {/* Sidebar Area */}
          {!currentFloorData?.isUpdating && (
            <UnitDetailsSidebar 
              units={units}
              selectedUnit={selectedUnit}
              onSelectUnit={setSelectedUnit}
              t={t}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};
