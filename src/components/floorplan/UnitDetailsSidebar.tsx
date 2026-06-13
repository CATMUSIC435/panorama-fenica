import React, { useRef } from 'react';
import { Unit } from '../../types';
import { playClick } from '../../utils/sound';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface UnitDetailsSidebarProps {
  units: Unit[];
  selectedUnit: Unit | undefined;
  onSelectUnit: (unit: Unit) => void;
  t: (key: string) => string;
}

export const UnitDetailsSidebar: React.FC<UnitDetailsSidebarProps> = ({
  units,
  selectedUnit,
  onSelectUnit,
  t
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 150;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full md:w-80 glass-card p-6 rounded-2xl flex-shrink-0 flex flex-col">
      <div className="relative mb-6 group flex items-center">
        {/* Nút lùi */}
        <button 
          onClick={() => { playClick(); scroll('left'); }}
          className="absolute left-0 z-10 w-6 h-6 md:w-8 md:h-8 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-600 hover:text-accent hover:border-accent/30 active:scale-95 transition-all -ml-2 md:-ml-4 opacity-80 hover:opacity-100"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Vùng cuộn */}
        <div 
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto py-1 px-4 md:px-2 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full"
        >
           {units.map((unit) => (
              <button 
                key={unit.code}
                onClick={() => { playClick(); onSelectUnit(unit); }}
                className={`px-3 py-2.5 md:py-1.5 rounded-lg border text-sm font-bold whitespace-nowrap transition-colors active:scale-95 shrink-0 ${
                  selectedUnit?.code === unit.code
                    ? 'bg-accent text-white border-accent'
                    : 'bg-white border-gray-200 text-gray-500 hover:text-primary'
                }`}
              >
                {unit.code}
              </button>
           ))}
        </div>

        {/* Nút tiến */}
        <button 
          onClick={() => { playClick(); scroll('right'); }}
          className="absolute right-0 z-10 w-6 h-6 md:w-8 md:h-8 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-600 hover:text-accent hover:border-accent/30 active:scale-95 transition-all -mr-2 md:-mr-4 opacity-80 hover:opacity-100"
        >
          <ChevronRight size={16} />
        </button>
      </div>


      <h3 className="text-2xl font-bold text-primary mb-6">{t('floorplan.unit')} {selectedUnit?.code}</h3>
      <p className="text-secondary font-medium mb-6 hidden">{selectedUnit?.type}</p>
      
      <div className="flex flex-col gap-3 mb-8 flex-1">
        <div className="bg-white/60 backdrop-blur-sm border border-white p-4 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
          <span className="text-xs text-secondary uppercase font-bold tracking-widest">DT Tim tường</span>
          <span className="text-xl text-accent font-black">
            {selectedUnit?.builtUpArea ? `${selectedUnit.builtUpArea}` : '--'}
            <span className="text-sm font-semibold ml-1 text-accent/80">m²</span>
          </span>
        </div>
        <div className="bg-white/60 backdrop-blur-sm border border-white p-4 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
          <span className="text-xs text-secondary uppercase font-bold tracking-widest">DT Thông thủy</span>
          <span className="text-xl text-accent font-black">
            {selectedUnit?.carpetArea ? `${selectedUnit.carpetArea}` : '--'}
            <span className="text-sm font-semibold ml-1 text-accent/80">m²</span>
          </span>
        </div>

        {/* 3D Room Layout */}
        <div className="mt-2 flex-1 flex flex-col bg-white/50 backdrop-blur-md border border-white p-4 rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)] transition-all duration-300 overflow-hidden">
           <div className="flex items-center justify-between mb-3">
             <h4 className="text-sm font-bold text-primary">Mặt bằng 3D</h4>
             <span className="text-xs font-semibold px-2 py-1 bg-accent/10 text-accent rounded-lg border border-accent/20">
               {selectedUnit?.type || 'Tiêu chuẩn'}
             </span>
           </div>
           <div className="flex-1 flex flex-col">
             <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl p-2 relative group overflow-hidden border border-gray-200/50">
               <img 
                 src={selectedUnit?.room3dImage || './assets/images/room3d/1pn+goc.png'}
                 alt={`3D Layout ${selectedUnit?.code}`} 
                 className="max-w-full max-h-[200px] object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-500 ease-out cursor-pointer"
                 loading="lazy"
               />
             </div>
             <p className="text-center text-[11px] text-gray-500 mt-2 italic font-medium">* Ảnh chỉ mang tính chất tham khảo</p>
           </div>
        </div>
      </div>
    </div>
  );
};
