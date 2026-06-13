import React, { useState } from 'react';
import { usePanoramaStore } from '../../store/usePanoramaStore';
import { Bug, Copy, Check } from 'lucide-react';

export const DebugPanel: React.FC = () => {
  const isDebugMode = usePanoramaStore(state => state.isDebugMode);
  const setIsDebugMode = usePanoramaStore(state => state.setIsDebugMode);
  const draggedHotspotId = usePanoramaStore(state => state.draggedHotspotId);
  const hotspotOverrides = usePanoramaStore(state => state.hotspotOverrides);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // Generates a JSON snippet of all currently overridden hotspots
    const output = Object.entries(hotspotOverrides).map(([id, pos]) => {
      return `id: '${id}', position: [${pos[0].toFixed(2)}, ${pos[1].toFixed(2)}, ${pos[2].toFixed(2)}]`;
    }).join('\n');
    
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed bottom-6 left-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {/* Toggle Button */}
      <button
        onClick={() => setIsDebugMode(!isDebugMode)}
        className={`w-12 h-12 rounded-full shadow-xl flex items-center justify-center transition-all pointer-events-auto active:scale-95 border-2 ${
          isDebugMode 
            ? 'bg-rose-500 text-white border-white/50 shadow-rose-500/50' 
            : 'bg-white/80 backdrop-blur-md text-gray-700 border-transparent hover:bg-white'
        }`}
        title="Toggle Debug Mode"
      >
        <Bug size={24} />
      </button>

      {/* Panel */}
      {isDebugMode && (
        <div className="bg-gray-900/90 backdrop-blur-md border border-white/20 p-4 rounded-xl text-white shadow-2xl w-72 pointer-events-auto">
          <h4 className="font-bold text-accent mb-2 flex items-center gap-2">
            <Bug size={16} /> Debug Mode Active
          </h4>
          <p className="text-xs text-gray-300 mb-4">
            Nhấn giữ bất kỳ hotspot nào và kéo để di chuyển. Tọa độ sẽ được cập nhật liên tục bên dưới.
          </p>

          <div className="bg-black/50 rounded-lg p-3 max-h-40 overflow-y-auto custom-scrollbar font-mono text-[10px] text-green-400 mb-3 border border-white/5">
            {Object.keys(hotspotOverrides).length === 0 ? (
              <span className="text-gray-500">Chưa có hotspot nào được thay đổi. Kéo một hotspot để xem.</span>
            ) : (
              Object.entries(hotspotOverrides).map(([id, pos]) => (
                <div key={id} className={`py-1 ${draggedHotspotId === id ? 'text-white font-bold' : ''}`}>
                  {id}: <span className="text-blue-300">[{pos[0].toFixed(2)}, {pos[1].toFixed(2)}, {pos[2].toFixed(2)}]</span>
                </div>
              ))
            )}
          </div>

          <button
            onClick={handleCopy}
            disabled={Object.keys(hotspotOverrides).length === 0}
            className="w-full bg-accent hover:bg-accent/80 disabled:bg-gray-700 disabled:text-gray-500 text-white py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-colors active:scale-95"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Đã Copy!' : 'Copy Tọa Độ Mới'}
          </button>
        </div>
      )}
    </div>
  );
};
