import React from 'react';
import { useUIStore } from '../../store/useUIStore';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const LeadForm: React.FC = () => {
  const { activeModal, closeModal } = useUIStore();
  const isOpen = activeModal === 'leadform';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 glass-overlay"
            onClick={closeModal}
          />
          
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="relative w-full max-w-md glass-panel rounded-3xl flex flex-col z-10"
          >
            <div className="flex justify-between items-center p-6 border-b border-black/5 bg-gradient-to-r from-black/5 to-transparent relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
              <h3 className="text-xl font-bold text-primary relative z-10">Register Interest</h3>
              <button 
                onClick={closeModal}
                className="p-2 text-secondary hover:text-primary hover:bg-white/50 rounded-full transition-all duration-300 relative z-10 backdrop-blur-md"
              >
                <X size={20} />
              </button>
            </div>
            
            <form 
              className="p-6 md:p-8 space-y-5" 
              onSubmit={(e) => { 
                e.preventDefault(); 
                if (!navigator.onLine) {
                  alert("Không có kết nối Internet. Vui lòng kiểm tra lại mạng và thử lại.");
                  return;
                }
                alert("Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.");
                closeModal(); 
              }}
            >
              <div>
                <label className="block text-xs font-medium text-secondary mb-1.5 uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-white/80 backdrop-blur-md border border-white/50 rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-accent focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-gray-400 shadow-sm"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-secondary mb-1.5 uppercase tracking-wider">Phone Number</label>
                <input 
                  type="tel" 
                  required
                  className="w-full bg-white/80 backdrop-blur-md border border-white/50 rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-accent focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-gray-400 shadow-sm"
                  placeholder="+84 123 456 789"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-secondary mb-1.5 uppercase tracking-wider">Email</label>
                <input 
                  type="email" 
                  className="w-full bg-white/80 backdrop-blur-md border border-white/50 rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-accent focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-gray-400 shadow-sm"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-secondary mb-1.5 uppercase tracking-wider">Interested Unit</label>
                <div className="relative">
                  <select className="w-full bg-white/80 backdrop-blur-md border border-white/50 rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-accent focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none shadow-sm">
                    <option value="1br">1 Bedroom</option>
                    <option value="2br">2 Bedroom</option>
                    <option value="3br">3 Bedroom</option>
                    <option value="penthouse">Penthouse</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-secondary">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-accent text-white rounded-xl py-3 font-semibold bg-accent-hover shadow-md transition-all active:scale-[0.98]">
                  Submit Registration
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
