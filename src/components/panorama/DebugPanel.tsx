import React, { useState } from 'react';
import { usePanoramaStore } from '../../store/usePanoramaStore';
import { Bug, Copy, Check, PenLine, Undo, XCircle, CheckCircle2 } from 'lucide-react';
import { mockScenes } from '../../data/mock';

export const DebugPanel: React.FC = () => {
  const isDebugMode = usePanoramaStore(state => state.isDebugMode);
  const setIsDebugMode = usePanoramaStore(state => state.setIsDebugMode);
  const draggedHotspotId = usePanoramaStore(state => state.draggedHotspotId);
  const hotspotOverrides = usePanoramaStore(state => state.hotspotOverrides);
  const isDrawingLine = usePanoramaStore(state => state.isDrawingLine);
  const setIsDrawingLine = usePanoramaStore(state => state.setIsDrawingLine);
  const currentLinePoints = usePanoramaStore(state => state.currentLinePoints);
  const undoLastPoint = usePanoramaStore(state => state.undoLastPoint);
  const clearCurrentLine = usePanoramaStore(state => state.clearCurrentLine);
  const finishLine = usePanoramaStore(state => state.finishLine);
  const currentSceneId = usePanoramaStore(state => state.currentSceneId);
  const linesOverrides = usePanoramaStore(state => state.linesOverrides);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    let hotspotOutput = '';
    let lineOutput = '';
    let modelsOutput = '';
    
    // Generates a JSON snippet of all currently overridden hotspots
    if (Object.keys(hotspotOverrides).length > 0) {
      hotspotOutput += '--- HOTSPOTS ---\n';
      hotspotOutput += Object.entries(hotspotOverrides).map(([id, pos]) => {
        return `id: '${id}', position: [${pos[0].toFixed(2)}, ${pos[1].toFixed(2)}, ${pos[2].toFixed(2)}]`;
      }).join('\n');
      hotspotOutput += '\n\n';
    }

    // Generates JSON for lines
    const lineOverrides = usePanoramaStore.getState().lineOverrides;
    const mockLinesForScene = mockScenes.find(s => s.id === currentSceneId)?.lines || [];
    
    const allLines = [...mockLinesForScene, ...(linesOverrides[currentSceneId] || [])];
    
    // Include the currently drawing line if it has enough points
    if (currentLinePoints.length > 1) {
      allLines.push({
        id: `line-${Date.now()}`,
        points: currentLinePoints,
        color: '#00e5ff',
        dashed: true,
        animated: true
      });
    }

    if (allLines.length > 0) {
      lineOutput += '--- LINES ---\n';
      lineOutput += JSON.stringify(allLines.map(line => {
        const pointsToUse = lineOverrides[line.id] || line.points;
        return {
          id: line.id,
          points: pointsToUse.map(p => [Number(p[0].toFixed(2)), Number(p[1].toFixed(2)), Number(p[2].toFixed(2))]),
          color: line.color,
          dashed: line.dashed,
          animated: line.animated,
          label: line.label
        };
      }), null, 2);
      lineOutput += '\n\n';
    }

    // Generates JSON for models
    const modelOverrides = usePanoramaStore.getState().modelOverrides;
    const mockModelsForScene = mockScenes.find(s => s.id === currentSceneId)?.models || [];
    
    if (mockModelsForScene.length > 0 || Object.keys(modelOverrides).some(k => k.startsWith(currentSceneId + '_'))) {
      modelsOutput += '--- MODELS ---\n';
      const modelsData = mockModelsForScene.map(model => {
        const override = modelOverrides[`${currentSceneId}_${model.id}`];
        return {
          id: model.id,
          url: model.url,
          position: override?.position || model.position,
          rotation: override?.rotation || model.rotation,
          scale: override?.scale || model.scale
        };
      });
      modelsOutput += JSON.stringify(modelsData, (_key, value) => {
        if (typeof value === 'number') return Number(value.toFixed(4));
        return value;
      }, 2);
      modelsOutput += '\n\n';
    }
    
    let floorplanOutput = '';
    const floorplan = usePanoramaStore.getState().floorplanTransform;
    if (floorplan) {
      floorplanOutput = `\n\n// Toạ độ Mặt Bằng\nfloorplanTransform: {\n  position: [${floorplan.position.map(n => n.toFixed(2)).join(', ')}],\n  rotation: [${floorplan.rotation.map(n => n.toFixed(2)).join(', ')}],\n  scale: [${floorplan.scale.map(n => n.toFixed(2)).join(', ')}]\n}`;
    }

    const textToCopy = `// Toạ độ mới (Copy vào mock.ts, xoá các khoảng trắng dư thừa)\n\n${hotspotOutput}${lineOutput}${modelsOutput}${floorplanOutput}`;
    
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed bottom-6 left-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {/* Toggle Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setIsDebugMode(!isDebugMode)}
          className={`w-12 h-12 rounded-full shadow-xl flex items-center justify-center transition-all pointer-events-auto active:scale-95 border-2 ${
            isDebugMode && !isDrawingLine
              ? 'bg-rose-500 text-white border-white/50 shadow-rose-500/50' 
              : 'bg-white/80 backdrop-blur-md text-gray-700 border-transparent hover:bg-white'
          }`}
          title="Toggle Debug Mode"
        >
          <Bug size={24} />
        </button>

        {isDebugMode && (
          <button
            onClick={() => setIsDrawingLine(!isDrawingLine)}
            className={`w-12 h-12 rounded-full shadow-xl flex items-center justify-center transition-all pointer-events-auto active:scale-95 border-2 ${
              isDrawingLine 
                ? 'bg-yellow-500 text-white border-white/50 shadow-yellow-500/50' 
                : 'bg-white/80 backdrop-blur-md text-gray-700 border-transparent hover:bg-white'
            }`}
            title="Toggle Line Drawing Mode"
          >
            <PenLine size={24} />
          </button>
        )}
      </div>

      {/* Panel */}
      {isDebugMode && (
        <div className="bg-gray-900/90 backdrop-blur-md border border-white/20 p-4 rounded-xl text-white shadow-2xl w-72 pointer-events-auto flex flex-col gap-3">
          <h4 className="font-bold text-accent flex items-center gap-2">
            {isDrawingLine ? <><PenLine size={16} /> Draw Line Mode</> : <><Bug size={16} /> Debug Mode Active</>}
          </h4>
          <p className="text-xs text-gray-300">
            {isDrawingLine 
              ? 'Click vào bầu trời/mặt đất để vẽ điểm. Các điểm sẽ nối lại thành đường line.'
              : 'Nhấn giữ bất kỳ hotspot nào và kéo để di chuyển. Tọa độ sẽ được cập nhật liên tục bên dưới.'}
          </p>

          {isDrawingLine && (
            <div className="bg-black/50 rounded-lg p-2 flex justify-between items-center text-xs">
              <span>Points: {currentLinePoints.length}</span>
              <div className="flex gap-2">
                <button onClick={undoLastPoint} disabled={currentLinePoints.length === 0} className="p-1 hover:text-white text-gray-400 disabled:opacity-30"><Undo size={14} /></button>
                <button onClick={clearCurrentLine} disabled={currentLinePoints.length === 0} className="p-1 hover:text-red-400 text-red-500/50 disabled:opacity-30"><XCircle size={14} /></button>
                <button onClick={() => finishLine(currentSceneId, `line-${Date.now()}`)} disabled={currentLinePoints.length < 2} className="p-1 hover:text-green-400 text-green-500/50 disabled:opacity-30"><CheckCircle2 size={14} /></button>
              </div>
            </div>
          )}

          {!isDrawingLine && (
            <div className="bg-black/50 rounded-lg p-3 max-h-40 overflow-y-auto custom-scrollbar font-mono text-[10px] text-green-400 border border-white/5">
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
          )}

          <button
            onClick={handleCopy}
            disabled={Object.keys(hotspotOverrides).length === 0 && (!linesOverrides[currentSceneId] || linesOverrides[currentSceneId].length === 0) && currentLinePoints.length < 2 && Object.keys(usePanoramaStore.getState().modelOverrides).length === 0 && !usePanoramaStore.getState().floorplanTransform}
            className="w-full bg-accent hover:bg-accent/80 disabled:bg-gray-700 disabled:text-gray-500 text-white py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-colors active:scale-95 mt-1"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Đã Copy!' : 'Copy Tọa Độ Mới'}
          </button>
        </div>
      )}
    </div>
  );
};
