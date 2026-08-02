import React, { useEffect, useState } from 'react';
import { useGLTF, TransformControls } from '@react-three/drei';
import { useControls } from 'leva';
import * as THREE from 'three';
import { SceneModel } from '../../types';
import { usePanoramaStore } from '../../store/usePanoramaStore';

interface PanoramaModelNodeProps {
  model: SceneModel;
}

const DebugControls: React.FC<{
  initialPosition: [number, number, number];
  initialRotation: [number, number, number];
  initialScale: [number, number, number];
  onUpdate: (transform: { position: [number, number, number], rotation: [number, number, number], scale: [number, number, number] }) => void;
}> = ({ initialPosition, initialRotation, initialScale, onUpdate }) => {
  const values = useControls('Chỉnh Toạ Độ Model (Leva)', {
    position: { value: initialPosition, step: 0.5 },
    rotation: { value: initialRotation, step: 0.05 },
    scale: { value: initialScale, step: 0.1 },
  });

  useEffect(() => {
    onUpdate(values as any);
  }, [values]);

  return null;
};

export const PanoramaModelNode: React.FC<PanoramaModelNodeProps> = ({ model }) => {
  const { scene } = useGLTF(model.url);
  const isDebugMode = usePanoramaStore(state => state.isDebugMode);
  const currentSceneId = usePanoramaStore(state => state.currentSceneId);
  const modelOverrides = usePanoramaStore(state => state.modelOverrides);
  const updateModelTransform = usePanoramaStore(state => state.updateModelTransform);
  
  const overrideId = `${currentSceneId}_${model.id}`;
  const override = modelOverrides[overrideId];
  
  // Keep track of the initial transform for Leva so it doesn't reset when component re-renders
  const [initialTransform] = useState({
    position: override?.position || model.position,
    rotation: override?.rotation || model.rotation,
    scale: override?.scale || model.scale
  });

  const position = override?.position || model.position;
  const rotation = override?.rotation || model.rotation;
  const scale = override?.scale || model.scale;

  const clonedScene = React.useMemo(() => {
    const s = scene.clone();
    s.traverse((child: any) => {
      if (child.isMesh && child.material) {
        // Fix missing angles (backface culling)
        child.material.side = THREE.DoubleSide;
        
        // Ensure transparent materials write to depth buffer to avoid sorting issues with the sphere
        if (child.material.transparent) {
          child.material.depthWrite = true;
        }
        
        // Sometimes gltf models have excessive metalness making them completely black under ambient light
        if (child.material.metalness !== undefined) {
          child.material.metalness = Math.min(child.material.metalness, 0.5);
        }
        
        child.material.needsUpdate = true;
      }
    });
    return s;
  }, [scene]);

  const content = (
    <group position={new THREE.Vector3(...position)} rotation={new THREE.Euler(...rotation)} scale={new THREE.Vector3(...scale)}>
      <primitive object={clonedScene} />
      {isDebugMode && (
        <DebugControls 
          initialPosition={initialTransform.position}
          initialRotation={initialTransform.rotation}
          initialScale={initialTransform.scale}
          onUpdate={(vals) => updateModelTransform(currentSceneId, model.id, vals)}
        />
      )}
    </group>
  );

  if (isDebugMode) {
    return (
      <group>
        <TransformControls 
          mode="translate" 
          size={2}
          onObjectChange={(e: any) => {
            if (e && e.target && e.target.object) {
              const obj = e.target.object;
              updateModelTransform(currentSceneId, model.id, {
                position: [obj.position.x, obj.position.y, obj.position.z],
                rotation: [obj.rotation.x, obj.rotation.y, obj.rotation.z],
                scale: [obj.scale.x, obj.scale.y, obj.scale.z]
              });
            }
          }}
        >
          <group position={new THREE.Vector3(...position)} rotation={new THREE.Euler(...rotation)} scale={new THREE.Vector3(...scale)}>
            <primitive object={clonedScene} />
          </group>
        </TransformControls>
        <DebugControls 
          initialPosition={initialTransform.position}
          initialRotation={initialTransform.rotation}
          initialScale={initialTransform.scale}
          onUpdate={(vals) => updateModelTransform(currentSceneId, model.id, vals)}
        />
      </group>
    );
  }

  return content;
};
