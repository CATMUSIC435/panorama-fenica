import React from 'react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950 z-[999]">
      <div className="relative flex items-center justify-center mb-8">
        <div className="w-20 h-20 border-4 border-white/10 border-t-accent rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-bold text-accent text-xs tracking-widest uppercase animate-pulse">Fenica</span>
        </div>
      </div>
      <div className="text-white/80 font-medium tracking-widest text-sm uppercase flex items-center gap-2">
        Đang khởi tạo không gian 3D
        <span className="flex gap-1">
          <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
          <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
          <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
        </span>
      </div>
    </div>
  );
};
