import React from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { usePanoramaStore } from '../../store/usePanoramaStore';
import { playClick } from '../../utils/sound';
import { Hotspot } from '../../types';

interface HotspotNodeProps {
  hotspot: Hotspot;
}

export const HotspotNode: React.FC<HotspotNodeProps> = React.memo(({ hotspot }) => {
  const setCurrentSceneId = usePanoramaStore(state => state.setCurrentSceneId);
  const isDebugMode = usePanoramaStore(state => state.isDebugMode);
  const setDraggedHotspotId = usePanoramaStore(state => state.setDraggedHotspotId);
  const hotspotOverrides = usePanoramaStore(state => state.hotspotOverrides);

  const currentPos = hotspotOverrides[hotspot.id] || hotspot.position;
  const positionVector = new THREE.Vector3(...currentPos);

  const handleClick = (e: React.MouseEvent) => {
    if (isDebugMode) return;
    e.stopPropagation();
    playClick();
    if (hotspot.type === 'scene' && hotspot.targetSceneId) {
      setCurrentSceneId(hotspot.targetSceneId);
    }
  };

  const handlePointerDown = (e: any) => {
    if (isDebugMode) {
      e.stopPropagation();
      setDraggedHotspotId(hotspot.id);
    }
  };

  return (
    <>
      <Html 
        position={positionVector} 
        center
        zIndexRange={[0, 0]}
      >
        <div 
          role="button"
          tabIndex={0}
          className={`group relative flex items-center justify-center ${isDebugMode ? 'pointer-events-none' : 'cursor-pointer pointer-events-auto'} outline-none focus-visible:ring-2 focus-visible:ring-white rounded-full`}
          onClick={handleClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleClick(e as any);
            }
          }}
        >
          {/* Pulsing Dot */}
          <div className="absolute flex items-center justify-center z-10">
            <div className="absolute w-2 h-2 md:w-3 md:h-3 2xl:w-5 2xl:h-5 bg-white/40 rounded-full animate-ping"></div>
            <div className="absolute w-1.5 h-1.5 md:w-2 md:h-2 2xl:w-3 2xl:h-3 bg-white/60 rounded-full animate-pulse"></div>
            <div className="w-[3px] h-[3px] md:w-1 md:h-1 2xl:w-2 2xl:h-2 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,1)] relative transition-transform duration-300 group-hover:scale-150"></div>
          </div>

          {/* Vertical Line */}
          <div 
            className="absolute bottom-0 w-[1px] md:w-[1.5px] bg-gradient-to-t from-white/80 to-transparent transition-all duration-300 group-hover:scale-y-110 origin-bottom"
            style={{ height: hotspot.lineHeight ? `${hotspot.lineHeight}px` : '48px', marginBottom: '2px' }}
          ></div>

          {/* Label (Positioned at the top of the line) */}
          {hotspot.title && (
            <div 
              className="absolute bottom-full bg-[#0A2540] text-white border border-white/20 rounded-full px-1.5 py-0.5 md:px-2 md:py-0.5 2xl:px-3 2xl:py-1.5 flex flex-col items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.5)] transform transition-transform duration-300 group-hover:scale-110 whitespace-nowrap z-20 pointer-events-none"
              style={{ marginBottom: hotspot.lineHeight ? `${hotspot.lineHeight + 4}px` : '52px' }}
            >
              <span className="text-[6px] md:text-[7px] 2xl:text-[10px] font-bold uppercase tracking-wider">{hotspot.title}</span>
              {hotspot.description && (
                <span className="text-[5px] md:text-[6px] 2xl:text-[8px] font-medium text-white/80 mt-0.5">{hotspot.description}</span>
              )}
            </div>
          )}
        </div>
      </Html>
    
    {/* Hit target for 3D raycasting in debug mode */}
    {isDebugMode && (
      <mesh 
        position={positionVector} 
        onPointerDown={handlePointerDown}
      >
        <sphereGeometry args={[8, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    )}
    </>
  );
});
