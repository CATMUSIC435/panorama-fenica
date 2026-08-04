import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { PanoramaLine } from '../../types';
import { usePanoramaStore } from '../../store/usePanoramaStore';

interface PanoramaLineNodeProps {
  line: PanoramaLine;
}

const TaperedTube = React.memo(({ curve, tubularSegments, radius, color, opacity, renderOrder }: any) => {
  const geomRef = useRef<THREE.TubeGeometry>(null);
  
  React.useLayoutEffect(() => {
    if (!geomRef.current) return;
    const geom = geomRef.current;
    const posAttribute = geom.attributes.position;
    const radialSegments = 32;
    
    for (let i = 0; i <= tubularSegments; i++) {
      const t = i / tubularSegments;
      
      // Taper over the first and last 10%
      let taper = 1.0;
      const taperLen = 0.1; 
      if (t < taperLen) {
        taper = t / taperLen;
      } else if (t > 1.0 - taperLen) {
        taper = (1.0 - t) / taperLen;
      }
      
      // Smooth taper (ease-in-out)
      taper = taper * taper * (3 - 2 * taper);
      taper = Math.max(0.001, taper);

      const center = curve.getPointAt(t);
      
      for (let j = 0; j <= radialSegments; j++) {
        const vertexIndex = i * (radialSegments + 1) + j;
        const v = new THREE.Vector3().fromBufferAttribute(posAttribute, vertexIndex);
        v.sub(center).multiplyScalar(taper).add(center);
        posAttribute.setXYZ(vertexIndex, v.x, v.y, v.z);
      }
    }
    posAttribute.needsUpdate = true;
    geom.computeVertexNormals();
  }, [curve, tubularSegments, radius]);

  return (
    <mesh renderOrder={renderOrder}>
      <tubeGeometry ref={geomRef} args={[curve, tubularSegments, radius, 32, false]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  );
});

export const PanoramaLineNode: React.FC<PanoramaLineNodeProps> = React.memo(({ line }) => {
  const cometsRef = useRef<THREE.Group[]>([]);
  const isDebugMode = usePanoramaStore(state => state.isDebugMode);
  const setDraggedLinePoint = usePanoramaStore(state => state.setDraggedLinePoint);
  const deleteLinePoint = usePanoramaStore(state => state.deleteLinePoint);
  const lineOverrides = usePanoramaStore(state => state.lineOverrides);

  const actualPoints = lineOverrides[line.id] || line.points;

  const curve = useMemo(() => {
    if (actualPoints.length < 2) return null;

    let pts = actualPoints.map(p => new THREE.Vector3(...p));
    
    // Lọc bỏ các điểm click quá sát nhau (nhiễu)
    const cleanPts: THREE.Vector3[] = [];
    for (const p of pts) {
      if (cleanPts.length === 0 || cleanPts[cleanPts.length - 1].distanceTo(p) > 1.0) {
        cleanPts.push(p);
      }
    }

    if (cleanPts.length < 2) return null;

    return new THREE.CatmullRomCurve3(cleanPts, false, 'centripetal', 0.5);
  }, [actualPoints]);

  const tubularSegments = useMemo(() => {
    return line.points.length * 20; // Tăng số lượng segment để ống tròn mượt hơn
  }, [line.points.length]);

  const labelData = useMemo(() => {
    if (!line.label || !curve) return null;
    
    const t = 0.65; // Nhích chữ qua bên phải một chút thay vì 0.5 ở giữa đường
    const position = curve.getPointAt(t);
    // Kéo chữ nhô lên bề mặt đường một chút xíu để không bị chìm
    const textPosition = position.clone().multiplyScalar(0.99); 
    
    const tangent = curve.getTangentAt(t).normalize();
    const z = position.clone().normalize().negate(); // Trục Z hướng về camera (tâm)
    let x = tangent.clone(); // Trục X dọc theo đường
    let y = z.clone().cross(x).normalize(); // Trục Y vuông góc
    
    // Nếu chữ bị lộn ngược (Y hướng xuống), lật lại trục X và Y
    if (y.y < 0) {
      x.negate();
      y.negate();
    }
    
    // Đẩy chữ nhích lên một chút theo phương thẳng đứng của chữ để nó "đứng trên" bề mặt đường
    textPosition.add(y.clone().multiplyScalar(0.4));
    
    const matrix = new THREE.Matrix4().makeBasis(x, y, z);
    const quaternion = new THREE.Quaternion().setFromRotationMatrix(matrix);
    
    return { position: textPosition, quaternion };
  }, [curve, line.label]);

  const numComets = 6; // Number of continuous pulses

  useFrame((state) => {
    if (line.animated && curve) {
      const time = state.clock.elapsedTime * 0.05; // Speed of the running lights
      cometsRef.current.forEach((comet, i) => {
        if (!comet) return;
        const offset = i / numComets;
        const t = (time + offset) % 1;
        const pos = curve.getPointAt(t);
        comet.position.copy(pos);
        
        // Orient the comet to face the direction of travel
        const nextT = (t + 0.005) % 1;
        const nextPos = curve.getPointAt(nextT);
        comet.lookAt(nextPos);
      });
    }
  });

  if (!curve) return null;

  const color = line.color || '#0088ff';

  return (
    <group scale={[3, 3, 3]}>
      {/* 1. Permanent Glow - Vầng sáng nền (Tube 3D hoàn hảo, scale đúng khi zoom) */}
      <TaperedTube curve={curve} tubularSegments={tubularSegments} radius={0.75} color={color} opacity={0.3} renderOrder={99} />
      
      <TaperedTube curve={curve} tubularSegments={tubularSegments} radius={0.3} color={color} opacity={0.6} renderOrder={100} />

      {/* 2. Base Solid Core - Lõi trắng liền (Tube 3D mảnh) */}
      <TaperedTube curve={curve} tubularSegments={tubularSegments} radius={0.09} color="#ffffff" opacity={0.9} renderOrder={101} />

      {/* 3. Running Flash - Các vệt sáng chớp chạy dọc đường (3D Capsules) */}
      {line.animated && [...Array(numComets)].map((_, i) => (
        <group key={i} ref={(el) => (cometsRef.current[i] = el as THREE.Group)}>
          {/* Lõi tia chớp */}
          <mesh rotation={[Math.PI / 2, 0, 0]} renderOrder={105}>
            <capsuleGeometry args={[0.15, 1.5, 16, 32]} />
            <meshBasicMaterial color="#ffffff" depthWrite={false} />
          </mesh>
          {/* Vầng sáng bao quanh tia chớp */}
          <mesh rotation={[Math.PI / 2, 0, 0]} renderOrder={104}>
            <capsuleGeometry args={[0.27, 1.5, 16, 32]} />
            <meshBasicMaterial color={color} transparent opacity={0.8} depthWrite={false} blending={THREE.AdditiveBlending} />
          </mesh>
        </group>
      ))}

      {/* 5. 3D Label Text (Nếu có) */}
      {labelData && line.label && (
        <Text
          position={labelData.position}
          quaternion={labelData.quaternion}
          fontSize={2.5}
          color="#ffffff"
          outlineWidth={0.08}
          outlineColor="#000000"
          anchorX="center"
          anchorY="bottom"
          renderOrder={110}
          fontWeight="bold"
          letterSpacing={0.1}
        >
          {line.label}
        </Text>
      )}

      {/* 6. Draggable Control Points cho chế độ Debug */}
      {isDebugMode && actualPoints.map((p, i) => (
        <mesh
          key={`ctrl-${i}`}
          position={new THREE.Vector3(...p)}
          onPointerDown={(e) => {
            e.stopPropagation();
            if (e.target && (e.target as any).releasePointerCapture) {
              (e.target as any).releasePointerCapture(e.pointerId);
            }
            setDraggedLinePoint({ lineId: line.id, pointIndex: i });
          }}
          onClick={(e) => e.stopPropagation()}
          onContextMenu={(e) => {
            e.stopPropagation();
            if (line.id === 'current-drawing-line') {
              deleteLinePoint(line.id, i, []); // originalPoints handles itself in store
            } else {
              deleteLinePoint(line.id, i, line.points);
            }
          }}
          renderOrder={200}
        >
          <sphereGeometry args={[1.5, 16, 16]} />
          <meshBasicMaterial color="#ff0000" depthTest={false} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
});
