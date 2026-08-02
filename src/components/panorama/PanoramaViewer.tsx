import React, { Suspense, useRef, useState, useEffect, useMemo, useTransition } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useTexture, AdaptiveDpr, AdaptiveEvents, Html, TransformControls, useGLTF } from '@react-three/drei';
import { useControls } from 'leva';
import * as THREE from 'three';
import { usePanoramaStore } from '../../store/usePanoramaStore';
import { mockScenes } from '../../data/mock';
import { HotspotNode } from './HotspotNode';
import { PanoramaLineNode } from './PanoramaLineNode';
import { PanoramaModelNode } from './PanoramaModelNode';
import { ErrorBoundary } from '../ErrorBoundary';
import { mapData } from '../../data/mock';
import { playClick } from '../../utils/sound';
import { useUIStore } from '../../store/useUIStore';

const FloorPlanNadir = () => {
  const texture = useTexture('./assets/images/plans/mau-mat-bang-tang-03.png');
  const openModal = useUIStore(state => state.openModal);
  const setPreselectedUnitId = useUIStore(state => state.setPreselectedUnitId);
  
  const isDebugMode = usePanoramaStore(state => state.isDebugMode);
  const floorplanTransform = usePanoramaStore(state => state.floorplanTransform);
  const updateFloorplanTransform = usePanoramaStore(state => state.updateFloorplanTransform);

  const [groupObj, setGroupObj] = useState<THREE.Group | null>(null);
  
  // Keep track of the initial values so Leva doesn't reset on re-renders
  const [initialTransform] = useState(() => {
    return floorplanTransform || {
      position: [8, -60, -2] as [number, number, number],
      rotation: [-Math.PI / 2, 0, -Math.PI / 2.02] as [number, number, number],
      scale: [1.1, 0.9, 1] as [number, number, number]
    };
  });

  const transform = floorplanTransform || initialTransform;

  // Render Leva controls only in debug mode
  const [{ mode, posX, posY, posZ, rotX, rotY, rotZ, sclX, sclY, sclZ }, setLeva] = useControls('Chỉnh Toạ Độ Mặt Bằng', () => ({
    mode: { options: ['translate', 'rotate', 'scale'], value: 'translate' },
    posX: { value: initialTransform.position[0], step: 0.5 },
    posY: { value: initialTransform.position[1], step: 0.5 },
    posZ: { value: initialTransform.position[2], step: 0.5 },
    rotX: { value: THREE.MathUtils.radToDeg(initialTransform.rotation[0]), step: 1, label: 'rotX (deg)' },
    rotY: { value: THREE.MathUtils.radToDeg(initialTransform.rotation[1]), step: 1, label: 'rotY (deg)' },
    rotZ: { value: THREE.MathUtils.radToDeg(initialTransform.rotation[2]), step: 1, label: 'rotZ (deg)' },
    sclX: { value: initialTransform.scale[0], step: 0.05 },
    sclY: { value: initialTransform.scale[1], step: 0.05 },
    sclZ: { value: initialTransform.scale[2], step: 0.05 },
  }), [isDebugMode]);

  // Sync Leva -> Three.js and Store
  useEffect(() => {
    if (isDebugMode && groupObj) {
      const rx = THREE.MathUtils.degToRad(rotX);
      const ry = THREE.MathUtils.degToRad(rotY);
      const rz = THREE.MathUtils.degToRad(rotZ);
      
      groupObj.position.set(posX, posY, posZ);
      groupObj.rotation.set(rx, ry, rz);
      groupObj.scale.set(sclX, sclY, sclZ);
      
      updateFloorplanTransform({
        position: [posX, posY, posZ],
        rotation: [rx, ry, rz],
        scale: [sclX, sclY, sclZ]
      });
    }
  }, [posX, posY, posZ, rotX, rotY, rotZ, sclX, sclY, sclZ, isDebugMode, groupObj]);

  const handleTransformChange = (e: any) => {
    if (e?.target?.object) {
      const obj = e.target.object;
      const newPos = [obj.position.x, obj.position.y, obj.position.z];
      const newRot = [obj.rotation.x, obj.rotation.y, obj.rotation.z];
      const newScl = [obj.scale.x, obj.scale.y, obj.scale.z];
      
      updateFloorplanTransform({ position: newPos as any, rotation: newRot as any, scale: newScl as any });
      
      setLeva({
        posX: newPos[0], posY: newPos[1], posZ: newPos[2],
        rotX: THREE.MathUtils.radToDeg(newRot[0]), 
        rotY: THREE.MathUtils.radToDeg(newRot[1]), 
        rotZ: THREE.MathUtils.radToDeg(newRot[2]),
        sclX: newScl[0], sclY: newScl[1], sclZ: newScl[2],
      });
    }
  };
  
  useMemo(() => {
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
    }
  }, [texture]);
  
  const imgW = texture.image?.width || 8000;
  const imgH = texture.image?.height || 4000;
  const planeW = 118;
  const planeH = planeW * (imgH / imgW) * 1.24;

  const content = (
    <group 
      ref={setGroupObj}
      position={transform.position} 
      rotation={transform.rotation} 
      scale={transform.scale}
    >
      {/* Tấm mặt bằng chính */}
      <mesh visible={true} renderOrder={1000}>
        <planeGeometry args={[planeW, planeH]} />
        <meshBasicMaterial map={texture} transparent={true} opacity={1.0} depthTest={false} depthWrite={false} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      
      {/* Các điểm ghim (pins) */}
      {mapData.map(pin => {
         const x = (pin.x / imgW) * planeW - (planeW / 2);
         const y = -(pin.y / imgH) * planeH + (planeH / 2);
         
         return (
           <Html key={pin.id} position={[x, y, 0]} center>
             <div 
               className="pointer-events-auto w-5 h-5 md:w-6 md:h-6 bg-white text-primary border border-primary/20 rounded-full flex items-center justify-center text-[8px] md:text-[10px] font-bold shadow-lg hover:scale-125 transition-transform cursor-pointer hover:bg-accent hover:text-white will-change-transform"
               onPointerDown={(e) => {
                 e.stopPropagation();
                 if (!isDebugMode) {
                   playClick();
                   setPreselectedUnitId(pin.id);
                   openModal('floorplan');
                 }
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

  return (
    <>
      {isDebugMode && groupObj && (
        <TransformControls 
          object={groupObj as any}
          mode={mode as any} 
          size={2}
          onObjectChange={handleTransformChange}
        />
      )}
      {content}
    </>
  );
};

const PanoramaSphere = React.memo(({ image }: { image: string }) => {
  const isDebugMode = usePanoramaStore(state => state.isDebugMode);
  const draggedHotspotId = usePanoramaStore(state => state.draggedHotspotId);
  const setDraggedHotspotId = usePanoramaStore(state => state.setDraggedHotspotId);
  const updateHotspotPosition = usePanoramaStore(state => state.updateHotspotPosition);
  const draggedLinePoint = usePanoramaStore(state => state.draggedLinePoint);
  const setDraggedLinePoint = usePanoramaStore(state => state.setDraggedLinePoint);
  const updateLinePointPosition = usePanoramaStore(state => state.updateLinePointPosition);
  const isDrawingLine = usePanoramaStore(state => state.isDrawingLine);
  const addPointToLine = usePanoramaStore(state => state.addPointToLine);

  const handleClick = (e: any) => {
    if (isDrawingLine) {
      // Don't stop propagation so other things can still work if needed, 
      // but R3F onClick only triggers if the user didn't drag the mouse.
      e.stopPropagation();
      const dir = new THREE.Vector3(e.point.x, e.point.y, e.point.z).normalize();
      const radius = 50; // Place points at the same radius as hotspots
      addPointToLine([dir.x * radius, dir.y * radius, dir.z * radius]);
    }
  };

  const handlePointerMove = (e: any) => {
    if (isDebugMode) {
      if (draggedHotspotId) {
        e.stopPropagation();
        const dir = new THREE.Vector3(e.point.x, e.point.y, e.point.z).normalize();
        const currentSceneId = usePanoramaStore.getState().currentSceneId;
        const currentPos = usePanoramaStore.getState().hotspotOverrides[draggedHotspotId] 
          || mockScenes.find(s => s.id === currentSceneId)?.hotspots?.find(h => h.id === draggedHotspotId)?.position 
          || [0, 0, 0];
        const radius = new THREE.Vector3(...currentPos).length() || 50;
        updateHotspotPosition(draggedHotspotId, [dir.x * radius, dir.y * radius, dir.z * radius]);
      } else if (draggedLinePoint) {
        e.stopPropagation();
        const dir = new THREE.Vector3(e.point.x, e.point.y, e.point.z).normalize();
        const lineId = draggedLinePoint.lineId;
        const ptIndex = draggedLinePoint.pointIndex;
        
        const currentSceneId = usePanoramaStore.getState().currentSceneId;
        
        let originalPoints: [number, number, number][] = [];
        if (lineId === 'current-drawing-line') {
          originalPoints = usePanoramaStore.getState().currentLinePoints;
        } else {
          const mockLine = mockScenes.find(s => s.id === currentSceneId)?.lines?.find((l: any) => l.id === lineId);
          const overridenLine = usePanoramaStore.getState().linesOverrides[currentSceneId]?.find((l: any) => l.id === lineId);
          originalPoints = overridenLine?.points || mockLine?.points || [];
        }
        
        const currentPos = usePanoramaStore.getState().lineOverrides[lineId]?.[ptIndex] || originalPoints[ptIndex] || [0, 0, 0];
        const radius = new THREE.Vector3(...currentPos).length() || 50;
        
        updateLinePointPosition(lineId, ptIndex, [dir.x * radius, dir.y * radius, dir.z * radius], originalPoints);
      }
    }
  };

  const handlePointerUp = () => {
    if (isDebugMode) {
      if (usePanoramaStore.getState().draggedHotspotId) setDraggedHotspotId(null);
      if (usePanoramaStore.getState().draggedLinePoint) setDraggedLinePoint(null);
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
      onClick={isDrawingLine ? handleClick : undefined}
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
  const draggedLinePoint = usePanoramaStore(state => state.draggedLinePoint);
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
      enabled={!draggedHotspotId && !draggedLinePoint}
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
  const [currentIndex, setCurrentIndex] = useState(1);
  const [start, setStart] = useState(false);
  
  useEffect(() => {
    // Delay preloading by 5 seconds to ensure initial entrance is completely smooth
    const t = setTimeout(() => setStart(true), 5000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (start && currentIndex < mockScenes.length) {
      // Stagger GPU texture upload every 2 seconds to prevent main thread freeze
      const t = setTimeout(() => setCurrentIndex(prev => prev + 1), 2000);
      return () => clearTimeout(t);
    }
  }, [start, currentIndex]);

  if (!start) return null;

  return (
    <Suspense fallback={null}>
      <group visible={false}>
        {mockScenes.slice(1, currentIndex).map((scene) => (
          <PreloadMesh key={scene.id} url={scene.image} />
        ))}
      </group>
    </Suspense>
  );
};

const PanoramaScene = () => {
  const currentSceneId = usePanoramaStore(state => state.currentSceneId);
  const currentLinePoints = usePanoramaStore(state => state.currentLinePoints);
  const linesOverrides = usePanoramaStore(state => state.linesOverrides);
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
  const sceneLines = currentScene.lines || [];
  const overridenLines = linesOverrides[deferredSceneId] || [];
  const allLines = [...sceneLines, ...overridenLines];

  // Kích hoạt preload cả Texture và GLTF ngay khi render,
  // giúp LoadingManager gom chung tiến trình, tránh bị load 2 nhịp.
  useTexture.preload(currentScene.image);
  useTexture.preload('./assets/images/plans/mau-mat-bang-tang-03.png'); // Tránh khựng lúc hiện floor plan
  if (currentScene.models) {
    currentScene.models.forEach(model => useGLTF.preload(model.url));
  }

  return (
    <>
      <ambientLight intensity={2} />
      <directionalLight position={[100, 200, 50]} intensity={3} castShadow />
      
      <PanoramaSphere image={currentScene.image} />
      
      {/* Sa bàn mặt bằng 3D đặt ở dưới chân - Chỉ hiện ở cảnh đầu tiên */}
      {currentScene.id === 'scene-1' && <FloorPlanNadir />}
      
      {showHotspots && currentScene.hotspots && [...currentScene.hotspots]
        .sort((a, b) => a.position[1] - b.position[1]) // Sort by Y ascending to fix line overlaps via DOM order
        .map((hotspot) => (
        <HotspotNode key={hotspot.id} hotspot={hotspot} />
      ))}

      {showHotspots && allLines.map((line) => (
        <PanoramaLineNode key={line.id} line={line} />
      ))}

      {showHotspots && currentLinePoints.length > 0 && (
        <PanoramaLineNode line={{ id: 'current-drawing-line', points: currentLinePoints, animated: true, dashed: true, color: '#facc15' }} />
      )}
      
      {currentScene.models && currentScene.models.map((model) => (
        <PanoramaModelNode key={model.id} model={model} />
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
          gl={{ powerPreference: 'high-performance', antialias: true }}
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

