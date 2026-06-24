import React, { Suspense, useRef, useState, useEffect, useMemo, useTransition } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useTexture, AdaptiveDpr, AdaptiveEvents, Html } from '@react-three/drei';
import * as THREE from 'three';
import { usePanoramaStore } from '../../store/usePanoramaStore';
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

  const [prevImage, setPrevImage] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState(image);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  if (image !== currentImage) {
    setPrevImage(currentImage);
    setCurrentImage(image);
  }

  // Cực kỳ quan trọng: Đặt lại opacity bằng 0 trong useLayoutEffect (chạy đồng bộ khi frame mới bắt đầu vẽ).
  // Tuyệt đối không set opacity trong thân hàm (Render Phase) vì useTransition sẽ tạo ra một frame render tạm (WIP).
  // Việc sửa đổi trực tiếp ref trong render tạm sẽ làm cho ảnh hiện tại bị tàng hình ngay lập tức, gây ra chớp đen màn hình!
  React.useLayoutEffect(() => {
    if (materialRef.current) {
      materialRef.current.opacity = 0;
    }
    // Khởi tạo góc xoay nhẹ để tạo hiệu ứng "Camera xoay mờ xuất hiện"
    if (meshRef.current) {
      meshRef.current.rotation.y = -0.5; // Xoay khoảng 28 độ
    }
  }, [currentImage]);

  const currentTex = useTexture(currentImage);
  const prevTex = useTexture(prevImage || currentImage);

  useMemo(() => {
    [currentTex, prevTex].forEach(t => {
      // Chỉ gán và update nếu chưa được cấu hình, tránh GPU update lại mỗi lần chuyển cảnh gây khựng 1s
      if (t && t.anisotropy !== 16) {
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = 16; // Tăng độ nét tối đa
        t.minFilter = THREE.LinearMipmapLinearFilter;
        t.magFilter = THREE.LinearFilter;
        t.generateMipmaps = true;
        t.needsUpdate = true;
      }
    });
  }, [currentTex, prevTex]);

  useFrame((_, delta) => {
    const safeDelta = Math.min(delta, 0.1);
    
    if (materialRef.current && materialRef.current.opacity < 1) {
      // Tốc độ crossfade (giới hạn an toàn delta để nếu bị lag nhẹ cũng không bị nhảy khung hình mất hiệu ứng)
      materialRef.current.opacity += safeDelta * 1.5; // Dùng cộng tuyến tính cho mượt thay vì lerp
      if (materialRef.current.opacity > 1) materialRef.current.opacity = 1;
    }

    if (meshRef.current && Math.abs(meshRef.current.rotation.y) > 0.001) {
      // Hiệu ứng xoay mượt (lerp) về 0
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0, safeDelta * 4);
    }
  });

  return (
    <group
      onPointerMove={isDebugMode ? handlePointerMove : undefined}
      onPointerUp={isDebugMode ? handlePointerUp : undefined}
      onPointerOut={isDebugMode ? handlePointerUp : undefined}
    >
      {/* Background Sphere (Ảnh cũ) */}
      <mesh renderOrder={-101} scale={[-1, 1, 1]} visible={!!prevImage}>
        <sphereGeometry args={[500, 128, 128]} />
        <meshBasicMaterial 
          map={prevTex || currentTex} 
          side={THREE.BackSide} 
          depthWrite={false}
          toneMapped={false}
          color={[1.1, 1.1, 1.1]} 
        />
      </mesh>

      {/* Foreground Sphere (Ảnh mới - Fading in & Spinning) */}
      <mesh ref={meshRef} renderOrder={-100} scale={[-1, 1, 1]}>
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
      controlsRef.current.update();
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
      rotateSpeed={-0.5}
      autoRotate={autoRotate}
      autoRotateSpeed={0.5}
      minPolarAngle={0} 
      maxPolarAngle={Math.PI}
      makeDefault
      enabled={!draggedHotspotId}
    />
  );
};

const PreloadMesh = ({ url }: { url: string }) => {
  const tex = useTexture(url);
  const { gl } = useThree();
  
  useEffect(() => {
    if (tex && tex.anisotropy !== 16) {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 16;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = true;
      tex.needsUpdate = true;
      gl.initTexture(tex);
    }
  }, [gl, tex]);
  
  return (
    <mesh visible={false}>
      <planeGeometry args={[0.1, 0.1]} />
      <meshBasicMaterial map={tex} />
    </mesh>
  );
};

const GPUPreloader = () => {
  const [start, setStart] = useState(false);
  
  useEffect(() => {
    const t = setTimeout(() => setStart(true), 1500);
    return () => clearTimeout(t);
  }, []);

  if (!start) return null;

  return (
    <Suspense fallback={null}>
      <group visible={false}>
        {mockScenes.map((scene, i) => {
          if (i === 0) return null; // Bỏ qua ảnh đầu
          return <PreloadMesh key={scene.id} url={scene.image} />
        })}
      </group>
    </Suspense>
  );
};

const PanoramaScene = () => {
  const currentSceneId = usePanoramaStore(state => state.currentSceneId);
  const [deferredSceneId, setDeferredSceneId] = useState(currentSceneId);
  const [isPending, startTransition] = useTransition();
  const [showHotspots, setShowHotspots] = useState(false);

  useEffect(() => {
    if (currentSceneId !== deferredSceneId) {
      setShowHotspots(false);
      // Sử dụng startTransition để báo cho React biết đây là một cập nhật ngầm.
      // Nếu useTexture(newScene) bị suspend (chưa load kịp), React sẽ không fallback ra Suspense gốc làm đen màn hình,
      // mà vẫn tiếp tục giữ nguyên giao diện cảnh cũ hiện tại cho đến khi ảnh mới load xong rồi mới commit!
      startTransition(() => {
        setDeferredSceneId(currentSceneId);
      });
    }
  }, [currentSceneId, deferredSceneId]);

  useEffect(() => {
    if (!isPending && currentSceneId === deferredSceneId) {
      const timer = setTimeout(() => setShowHotspots(true), 300);
      return () => clearTimeout(timer);
    }
  }, [isPending, currentSceneId, deferredSceneId]);

  const currentScene = mockScenes.find((s) => s.id === deferredSceneId) || mockScenes[0];

  return (
    <>
      <PanoramaSphere image={currentScene.image} />
      
      {/* Sa bàn mặt bằng 3D đặt ở dưới chân - Chỉ hiện ở cảnh đầu tiên */}
      {currentScene.id === 'scene-1' && <FloorPlanNadir />}
      
      {showHotspots && currentScene.hotspots && [...currentScene.hotspots]
        .sort((a, b) => a.position[1] - b.position[1]) // Sort by Y ascending to fix line overlaps via DOM order
        .map((hotspot) => (
        <HotspotNode key={hotspot.id} hotspot={hotspot} />
      ))}
      
      <Controls />
      <GPUPreloader />
    </>
  );
};

export const PanoramaViewer: React.FC = () => {
  const setAutoRotate = usePanoramaStore(state => state.setAutoRotate);
  
  return (
    <div className="absolute inset-0 w-full h-full z-0 bg-gray-950 cursor-grab active:cursor-grabbing">      <ErrorBoundary>
        <Canvas 
          camera={{ position: [0, 0, 0.1], fov: 75 }} 
          gl={{ powerPreference: 'high-performance', antialias: false }}
          dpr={[1, 2]}
          onPointerDown={() => setAutoRotate(false)}
        >
          <Suspense fallback={null}>
            <PanoramaScene />
          </Suspense>

          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
        </Canvas>
      </ErrorBoundary>
    </div>
  );
};

