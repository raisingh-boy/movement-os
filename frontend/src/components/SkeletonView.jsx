import React, { useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

const CONNECTIONS = [
  [11, 12], [11, 13], [13, 15], [12, 14], [14, 16], // Upper body
  [11, 23], [12, 24], [23, 24], // Torso
  [23, 25], [25, 27], [27, 31], [24, 26], [26, 28], [28, 32] // Lower body
];

function Skeleton({ frameData, comData, trajectory }) {
  const points = useMemo(() => {
    if (!frameData) return [];
    return frameData.map(lm => new THREE.Vector3((lm.x - 0.5) * 4, (0.5 - lm.y) * 4, -lm.z * 4));
  }, [frameData]);

  const lineGeometry = useMemo(() => {
    if (!frameData) return new THREE.BufferGeometry();
    const vertices = [];
    CONNECTIONS.forEach(([i, j]) => {
      const p1 = frameData[i];
      const p2 = frameData[j];
      if (p1 && p2) {
        vertices.push((p1.x - 0.5) * 4, (0.5 - p1.y) * 4, -p1.z * 4);
        vertices.push((p2.x - 0.5) * 4, (0.5 - p2.y) * 4, -p2.z * 4);
      }
    });
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    return geometry;
  }, [frameData]);

  const trajectoryGeometry = useMemo(() => {
    if (!trajectory) return new THREE.BufferGeometry();
    const vertices = [];
    trajectory.forEach(p => {
      if (p) vertices.push((p.x - 0.5) * 4, (0.5 - p.y) * 4, -p.z * 4);
    });
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    return geometry;
  }, [trajectory]);

  return (
    <group>
      {/* Skeleton Joints */}
      {points.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshBasicMaterial color={i < 11 ? "#4facfe" : "#f093fb"} />
        </mesh>
      ))}
      {/* Skeleton Bones */}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color="white" linewidth={2} />
      </lineSegments>
      {/* Center of Mass */}
      {comData && (
        <mesh position={[(comData.x - 0.5) * 4, (0.5 - comData.y) * 4, -comData.z * 4]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshBasicMaterial color="yellow" />
        </mesh>
      )}
      {/* Motion Trail (Trajectory) */}
      <line geometry={trajectoryGeometry}>
        <lineBasicMaterial color="#ffff00" transparent opacity={0.4} />
      </line>
    </group>
  );
}

export default function SkeletonView({ frameData, comData, trajectory }) {
  return (
    <div style={{ width: '100%', height: '550px', background: 'radial-gradient(circle, #222 0%, #000 100%)' }}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[5, 0, 0]} />
        <OrbitControls />
        <ambientLight intensity={1.0} />
        <pointLight position={[10, 10, 10]} />
        <Skeleton frameData={frameData} comData={comData} trajectory={trajectory} />
        <gridHelper args={[20, 20, 0x444444, 0x222222]} rotation={[Math.PI / 2, 0, 0]} />
      </Canvas>
    </div>
  );
}
