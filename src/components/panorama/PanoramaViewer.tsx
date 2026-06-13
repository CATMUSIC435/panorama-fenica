import React, { Suspense, useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useTexture, AdaptiveDpr, AdaptiveEvents, Html } from '@react-three/drei';
import * as THREE from 'three';
import { usePanoramaStore } from '../../store/usePanoramaStore';
import { motion, AnimatePresence } from 'framer-motion';
import { mockScenes } from '../../data/mock';
import { HotspotNode } from './HotspotNode';
import { ErrorBoundary } from '../ErrorBoundary';
import { mapData } from '../../data/mock';
import { playClick } from '../../utils/sound';
import { useUIStore } from '../../store/useUIStore';

const FloorPlanNadir = () => {
  const texture = useTexture('./assets/images/plans/mau-mat-bang-tang-03.png');
  const openModal = useUIStore(state => state.openModal);
  const setPreselectedUnitId = useUIStore(state => state.setPreselectedUnitId);
  
  useMemo(() => {
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
    }
  }, [texture]);
  
  // Calculate aspect ratio correctly. Texture image is guaranteed to be loaded here due to Suspense.
  const imgW = texture.image?.width || 8000;
  const imgH = texture.image?.height || 4000;

  // Tinh chỉnh lại kích thước để khớp hoàn hảo với cảnh nền bên dưới
  // GIẢM số này xuống nếu các nút bấm bị văng ra xa so với tòa nhà (ví dụ 130, 125)
  // TĂNG số này lên nếu các nút bấm bị tụm lại ở giữa
  const planeW = 118;
  const planeH = planeW * (imgH / imgW) * 1.24;

  return (
    <group position={[8, -100, 8]} rotation={[-Math.PI / 2, 0, -Math.PI / 2.02]}>
      {/* Tấm mặt bằng chính (Đã bị ẩn theo yêu cầu, chỉ giữ lại các nút ghim) */}
      <mesh visible={false}>
        <planeGeometry args={[planeW, planeH]} />
        <meshBasicMaterial map={texture} transparent={true} opacity={1} depthWrite={false} />
      </mesh>
      
      {/* Các điểm ghim (pins) */}
      {mapData.map(pin => {
         const x = (pin.x / imgW) * planeW - (planeW / 2);
         const y = -(pin.y / imgH) * planeH + (planeH / 2);
         
         return (
           <Html key={pin.id} position={[x, y, 0]} center>
             <div 
               className="pointer-events-auto w-5 h-5 md:w-6 md:h-6 bg-white text-primary border border-primary/20 rounded-full flex items-center justify-center text-[8px] md:text-[10px] font-bold shadow-lg hover:scale-125 transition-transform cursor-pointer hover:bg-accent hover:text-white"
               onPointerDown={(e) => {
                 e.stopPropagation();
                 playClick();
                 setPreselectedUnitId(pin.id);
                 openModal('floorplan');
               }}
               onClick={(e) => {
                 e.stopPropagation();
               }}
               title={`Căn hộ ${pin.id}`}
             >
               {pin.id.split('-')[1]}
             </div>
           </Html>
         );
      })}
    </group>
  );
};

const PanoramaSphere = React.memo(({ image }: { image: string }) => {
  const isDebugMode = usePanoramaStore(state => state.isDebugMode);
  const draggedHotspotId = usePanoramaStore(state => state.draggedHotspotId);
  const setDraggedHotspotId = usePanoramaStore(state => state.setDraggedHotspotId);
  const updateHotspotPosition = usePanoramaStore(state => state.updateHotspotPosition);
  
  const [prevImage, setPrevImage] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState(image);
  
  if (image !== currentImage) {
    setPrevImage(currentImage);
    setCurrentImage(image);
  }

  const currentTex = useTexture(currentImage);
  const prevTex = useTexture(prevImage || currentImage);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  const handlePointerMove = (e: any) => {
    if (isDebugMode && draggedHotspotId) {
      e.stopPropagation();
      const dir = new THREE.Vector3(e.point.x, e.point.y, e.point.z).normalize();
      const currentSceneId = usePanoramaStore.getState().currentSceneId;
      const currentPos = usePanoramaStore.getState().hotspotOverrides[draggedHotspotId] 
        || mockScenes.find(s => s.id === currentSceneId)?.hotspots?.find(h => h.id === draggedHotspotId)?.position 
        || [0, 0, 0];
      const radius = new THREE.Vector3(...currentPos).length() || 50;
      updateHotspotPosition(draggedHotspotId, [dir.x * radius, dir.y * radius, dir.z * radius]);
    }
  };

  const handlePointerUp = () => {
    if (isDebugMode && draggedHotspotId) {
      setDraggedHotspotId(null);
    }
  };

  useMemo(() => {
    [currentTex, prevTex].forEach(t => {
      if (t) {
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = 16; // Tăng độ nét tối đa
        t.minFilter = THREE.LinearMipmapLinearFilter;
        t.magFilter = THREE.LinearFilter;
        t.generateMipmaps = true;
        t.needsUpdate = true;
      }
    });
  }, [currentTex, prevTex]);

  // Đặt lại opacity = 0 ngay trước khi trình duyệt vẽ frame đầu tiên của ảnh mới
  React.useLayoutEffect(() => {
    if (materialRef.current) {
      materialRef.current.opacity = 0;
    }
  }, [currentImage]);

  useFrame((_, delta) => {
    if (materialRef.current) {
      if (materialRef.current.opacity < 1) {
        // Tốc độ crossfade (delta * 2 = 0.5s)
        materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, 1, delta * 2);
      }
    }
  });

  return (
    <group
      onPointerMove={isDebugMode ? handlePointerMove : undefined}
      onPointerUp={isDebugMode ? handlePointerUp : undefined}
      onPointerOut={isDebugMode ? handlePointerUp : undefined}
    >
      {/* Background Sphere (Ảnh cũ) */}
      {prevImage && (
        <mesh renderOrder={-101} scale={[-1, 1, 1]}>
          <sphereGeometry args={[500, 128, 128]} />
          <meshBasicMaterial 
            map={prevTex} 
            side={THREE.BackSide} 
            depthWrite={false}
            toneMapped={false}
            color={[1.1, 1.1, 1.1]} 
          />
        </mesh>
      )}

      {/* Foreground Sphere (Ảnh mới - Fading in) */}
      <mesh renderOrder={-100} scale={[-1, 1, 1]}>
        <sphereGeometry args={[500, 128, 128]} />
        <meshBasicMaterial 
          ref={materialRef}
          map={currentTex} 
          side={THREE.BackSide} 
          transparent={true}
          opacity={0}
          depthWrite={false}
          toneMapped={false}
          color={[1.1, 1.1, 1.1]} 
        />
      </mesh>
    </group>
  );
});

// Preload the first scene texture to make initial load appear instant
if (mockScenes.length > 0) {
  useTexture.preload(mockScenes[0].image);
}

const Controls = () => {
  const controlsRef = useRef<any>();
  const autoRotate = usePanoramaStore(state => state.autoRotate);
  const draggedHotspotId = usePanoramaStore(state => state.draggedHotspotId);
  const { camera, gl } = useThree();
  const targetFov = useRef((camera as THREE.PerspectiveCamera).fov);

  useEffect(() => {
    const canvas = gl.domElement;
    let initialDistance = 0;
    let initialFov = 0;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetFov.current += e.deltaY * 0.05;
      targetFov.current = Math.max(30, Math.min(110, targetFov.current));
    };

    const getDistance = (touches: TouchList) => {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        initialDistance = getDistance(e.touches);
        initialFov = targetFov.current;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const currentDistance = getDistance(e.touches);
        const distanceDelta = initialDistance - currentDistance;
        targetFov.current = initialFov + distanceDelta * 0.2;
        targetFov.current = Math.max(30, Math.min(110, targetFov.current));
      }
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    return () => {
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
    };
  }, [camera, gl]);

  useFrame(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
      controlsRef.current.autoRotateSpeed = 0.5;
    }
    const perspectiveCamera = camera as THREE.PerspectiveCamera;
    if (Math.abs(perspectiveCamera.fov - targetFov.current) > 0.01) {
      perspectiveCamera.fov += (targetFov.current - perspectiveCamera.fov) * 0.1;
      perspectiveCamera.updateProjectionMatrix();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={false}
      enablePan={false}
      enableDamping={true}
      dampingFactor={0.05}
      rotateSpeed={-0.6}
      minPolarAngle={0} 
      maxPolarAngle={Math.PI} 
      enabled={!draggedHotspotId}
    />
  );
};

const TexturePreloader = ({ sceneId, onLoaded }: { sceneId: string, onLoaded: () => void }) => {
  const scene = mockScenes.find(s => s.id === sceneId);
  useTexture(scene?.image || mockScenes[0].image);
  
  useEffect(() => {
    onLoaded();
  }, [sceneId, onLoaded]);

  return null;
};

export const PanoramaViewer: React.FC = () => {
  const currentSceneId = usePanoramaStore(state => state.currentSceneId);
  const setAutoRotate = usePanoramaStore(state => state.setAutoRotate);
  
  const [deferredSceneId, setDeferredSceneId] = useState(currentSceneId);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showHotspots, setShowHotspots] = useState(false);

  useEffect(() => {
    if (currentSceneId !== deferredSceneId) {
      setShowHotspots(false);
      setIsTransitioning(true);
    }
  }, [currentSceneId, deferredSceneId]);

  const handleTextureLoaded = React.useCallback(() => {
    if (isTransitioning) {
      setDeferredSceneId(currentSceneId);
      // Giữ blur overlay một khoảnh khắc rất ngắn để che lúc WebGL bắt đầu swap texture
      setTimeout(() => setIsTransitioning(false), 50);
      setTimeout(() => setShowHotspots(true), 300);
    }
  }, [isTransitioning, currentSceneId]);

  // Hiện hotspot khi load lần đầu tiên
  useEffect(() => {
    if (currentSceneId === deferredSceneId && !isTransitioning && !showHotspots) {
      setShowHotspots(true);
    }
  }, [currentSceneId, deferredSceneId, isTransitioning, showHotspots]);

  const currentScene = mockScenes.find((s) => s.id === deferredSceneId) || mockScenes[0];

  return (
    <div className="absolute inset-0 w-full h-full z-0 bg-gray-950 cursor-grab active:cursor-grabbing">
      {/* Smooth Transition Overlay (Màn hình chờ tải dạng kính mờ) */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(40px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0 z-50 pointer-events-none bg-white/5"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-white animate-spin shadow-[0_0_20px_rgba(255,255,255,0.5)]"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ErrorBoundary>
        <Canvas 
          camera={{ position: [0, 0, 0.1], fov: 75 }} 
          gl={{ powerPreference: 'high-performance', antialias: false }}
          dpr={[1, 2]}
          onPointerDown={() => setAutoRotate(false)}
        >
          <Suspense fallback={null}>
            <PanoramaSphere image={currentScene.image} />
            
            {/* Sa bàn mặt bằng 3D đặt ở dưới chân - Chỉ hiện ở cảnh đầu tiên */}
            {currentScene.id === 'scene-1' && <FloorPlanNadir />}
            
            {showHotspots && currentScene.hotspots && [...currentScene.hotspots]
              .sort((a, b) => a.position[1] - b.position[1]) // Sort by Y ascending to fix line overlaps via DOM order
              .map((hotspot) => (
              <HotspotNode key={hotspot.id} hotspot={hotspot} />
            ))}
            
            <Controls />

            {/* Trình tải trước Texture chạy ngầm để không làm đen màn hình */}
            {isTransitioning && currentSceneId !== deferredSceneId && (
              <Suspense fallback={null}>
                <TexturePreloader sceneId={currentSceneId} onLoaded={handleTextureLoaded} />
              </Suspense>
            )}
          </Suspense>

          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
        </Canvas>
      </ErrorBoundary>
    </div>
  );
};

