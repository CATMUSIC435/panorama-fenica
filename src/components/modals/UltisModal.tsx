import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { playClick } from '../../utils/sound';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Plus, Minus, RotateCcw } from 'lucide-react';

const ultisImages = [
  { id: 'ultis-1', name: 'Mặt bằng tiện ích 1', image: './assets/images/ultis/mau-mat-bang-tien-ich-1.png' },
  { id: 'ultis-2', name: 'Mặt bằng tiện ích 2', image: './assets/images/ultis/mau-mat-bang-tien-ich-2.png' },
];

const ultis1Amenities = [
  'Khuôn viên cảnh quan', 'Lối vào', 'Khu vui chơi trẻ em', 'Yoga', 'Khu thể thao ngoài trời',
  'Lối xuống hầm', 'Vườn hoa', 'Lối lên hầm', 'Sảnh đón Block A', 'Sảnh chờ thang máy',
  'Khu thương mại', 'Phòng SHCĐ', 'Gym', 'Nhà trẻ', 'Sảnh đón Block B'
];

const ultis2Amenities = [
  'Khu thương mại', 'Hồ bơi trẻ em', 'Hồ bơi người lớn', 'Khu ghế nằm',
  'Khu BBQ', 'Phòng thay đồ', 'Khu chiếu phim ngoài trời', 'Vườn thư giãn',
  'Phòng livestream', 'Kid Zone', 'Thư viện', 'Nhà trẻ'
];

export const UltisModal: React.FC = () => {
  const [activeImageId, setActiveImageId] = useState(ultisImages[0].id);
  
  const currentImage = ultisImages.find(img => img.id === activeImageId);

  return (
    <Modal title="Mặt bằng tiện ích" maxWidth="max-w-6xl">
      <div className="flex flex-col min-h-[70vh] gap-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between mb-2">
          <div className="flex flex-wrap items-center gap-1 md:gap-2 p-1.5 bg-[#F1F3F5] rounded-full w-fit shadow-inner">
            {ultisImages.map((img) => {
              const isActive = activeImageId === img.id;
              return (
                <button
                  key={img.id}
                  onClick={() => { playClick(); setActiveImageId(img.id); }}
                  className={`relative px-6 py-2 md:px-8 md:py-2.5 rounded-full font-bold text-[13px] md:text-[15px] transition-all duration-300 ${
                    isActive 
                    ? 'text-white bg-[#007bff] border-[1.5px] border-black shadow-sm' 
                    : 'text-[#3A4556] hover:text-black hover:bg-black/5 border-[1.5px] border-transparent'
                  }`}
                >
                  {img.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Plan Viewer */}
        <div className="flex flex-col md:flex-row gap-6 h-full flex-1">
          {/* Main Image Area */}
          <div className="flex-1 relative overflow-hidden flex flex-col items-center justify-center bg-gray-900/90 backdrop-blur-md rounded-2xl border border-white/20 shadow-[inset_0_4px_24px_rgba(0,0,0,0.4)] p-4 md:p-8">
            {/* Interactive Image */}
            <div className="w-full h-full flex items-center justify-center min-h-[400px]">
               <TransformWrapper
                 initialScale={1}
                 minScale={0.5}
                 maxScale={4}
                 centerOnInit={true}
                 wheel={{ step: 0.1 }}
               >
                 {({ zoomIn, zoomOut, resetTransform }) => (
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
                       <img 
                         src={currentImage?.image} 
                         alt="Utilities Plan" 
                         className="w-full h-full object-contain drop-shadow-2xl cursor-grab active:cursor-grabbing"
                         draggable={false}
                         loading="lazy"
                       />
                     </TransformComponent>
                   </React.Fragment>
                 )}
               </TransformWrapper>
            </div>
          </div>

          {/* Premium Amenities List Sidebar (Compact) */}
          {(activeImageId === 'ultis-1' || activeImageId === 'ultis-2') && (
            <div className="w-full md:w-[350px] lg:w-[460px] flex-shrink-0 flex flex-col bg-gradient-to-b from-gray-900/90 to-black/90 backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden relative">
              {/* Subtle accent glow in background */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px] pointer-events-none"></div>
              
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10 relative z-10">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  Danh mục tiện ích
                </h3>
              </div>

              <div className="overflow-y-auto custom-scrollbar pr-2 flex-1 relative z-10">
                {/* 2-column grid for compactness */}
                <ul className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  {(activeImageId === 'ultis-1' ? ultis1Amenities : ultis2Amenities).map((item, index) => {
                    const actualIndex = activeImageId === 'ultis-1' ? index + 1 : index + 16;
                    return (
                      <li key={index} className="flex items-center gap-3 group cursor-default p-2 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/10 hover:border-accent/30 transition-all duration-300 hover:translate-x-1 hover:shadow-[0_4px_15px_rgba(var(--color-accent),0.15)]">
                        <span className="flex flex-shrink-0 items-center justify-center w-6 h-6 rounded-full bg-gray-800 text-gray-400 font-mono text-[10px] font-bold border border-white/10 group-hover:bg-gradient-to-br group-hover:from-accent group-hover:to-amber-500 group-hover:text-gray-900 group-hover:border-transparent group-hover:scale-110 group-hover:shadow-[0_0_10px_rgba(var(--color-accent),0.5)] transition-all duration-300">
                          {String(actualIndex).padStart(2, '0')}
                        </span>
                        <span className="text-gray-300 font-medium group-hover:text-white transition-colors text-xs xl:text-sm truncate" title={item}>{item}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
