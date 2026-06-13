import React from 'react';
import { motion } from 'framer-motion';
import { useUIStore } from '../../store/useUIStore';
import { X } from 'lucide-react';
import { playClick } from '../../utils/sound';

interface ModalProps {
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({ title, children, maxWidth = 'max-w-6xl' }) => {
  const { closeModal } = useUIStore();

  const handleClose = () => {
    playClick();
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-8 pointer-events-none">
      {/* Light overlay for the background */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 glass-overlay pointer-events-auto"
        onClick={handleClose}
      />
      
      <motion.div 
        layout
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30 
        }}
        className={`relative w-[95vw] ${maxWidth} 2xl:max-w-[85vw] max-h-[96vh] md:max-h-[90vh] glass-panel rounded-2xl md:rounded-[2.5rem] overflow-hidden flex flex-col pointer-events-auto shadow-2xl`}
      >
        {title && (
          <div className="flex justify-between items-center px-3 py-2 md:px-5 md:py-3 border-b border-black/5 bg-gradient-to-r from-black/5 to-transparent relative overflow-hidden shrink-0">
            <div className="absolute top-0 left-0 w-1/2 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
            <h3 className="text-sm md:text-xl font-bold text-primary tracking-tight relative z-10 pl-1">{title}</h3>
            <button 
              onClick={handleClose}
              className="p-1 md:p-2 text-primary hover:text-primary hover:bg-white/60 bg-white/40 border border-white/50 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all duration-300 relative z-10 backdrop-blur-md active:scale-90"
            >
              <X size={16} className="md:w-4 md:h-4" />
            </button>
          </div>
        )}
        
        {!title && (
          <button 
            onClick={handleClose}
            className="absolute top-2 right-2 md:top-6 md:right-6 z-10 p-1.5 md:p-2.5 text-primary bg-white/50 border border-white/60 hover:bg-white/80 rounded-full transition-all duration-300 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.05)] active:scale-90"
          >
            <X size={16} className="md:w-5 md:h-5" />
          </button>
        )}

        <div className="overflow-y-auto px-2 py-2 md:px-8 md:py-5 flex-1 custom-scrollbar">
          {children}
        </div>
      </motion.div>
    </div>
  );
};
