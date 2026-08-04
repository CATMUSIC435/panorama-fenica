import React from 'react';

export const CompassBar: React.FC = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-6 bg-[#C7D7E8]/80 backdrop-blur-md z-[50] overflow-hidden pointer-events-none shadow-sm">
      {/* Red Center Line */}
      <div className="absolute top-0 left-1/2 w-[1.5px] h-full bg-red-600 shadow-[0_0_5px_rgba(220,38,38,0.5)] z-20 transform -translate-x-1/2"></div>
      
      {/* Moving Scale */}
      <div className="absolute top-0 left-1/2 h-full w-0 will-change-transform" id="compass-slider-inner">
        {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map(i => {
           const labels = ['ĐÔNG', 'NAM', 'TÂY', 'BẮC'];
           const label = labels[((i % 4) + 4) % 4];
           return (
             <div 
               key={i}
               className="absolute top-0 h-full flex flex-col items-center justify-end pb-[1px]"
               style={{ left: `${i * 360}px`, transform: 'translateX(-50%)', width: '360px' }}
             >
               <div className="text-[11px] font-extrabold text-[#0C2B4A] tracking-[0.2em] leading-none mb-0.5">{label}</div>
               {/* Major Tick */}
               <div className="absolute bottom-0 w-[1.5px] h-[8px] bg-[#0C2B4A]"></div>
               
               {/* Minor Ticks */}
               <div className="absolute bottom-0 left-0 w-full h-full">
                  {[60, 120, 240, 300, 360].map(pos => (
                    <div 
                      key={pos} 
                      className="absolute bottom-0 w-[1px] bg-[#0C2B4A]/70"
                      style={{ 
                        left: `${pos}px`, 
                        height: pos === 360 ? '5px' : '3px',
                        transform: 'translateX(-50%)'
                      }}
                    ></div>
                  ))}
               </div>
             </div>
           )
        })}
      </div>
    </div>
  );
};
