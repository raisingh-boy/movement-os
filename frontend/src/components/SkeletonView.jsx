import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

const CONNECTIONS = [
  [11, 12], [11, 13], [13, 15], [12, 14], [14, 16], // Upper body
  [11, 23], [12, 24], [23, 24], // Torso
  [23, 25], [25, 27], [27, 31], [24, 26], [26, 28], [28, 32] // Lower body
];

function Skeleton({ frameData }) {
  const pointsRef = useRef();
  const linesRef = useRef();

  const points = useMemo(() => {
    if (!frameData) return [];
    // Scale and center the dummy skeleton for visibility
    return frameData.map(lm => new THREE.Vector3((lm.x - 0.5) * 2, (0.5 - lm.y) * 2, -lm.z * 2));
  }, [frameData]);

  const lineGeometry = useMemo(() => {
    if (!frameData) return new THREE.BufferGeometry();
    const vertices = [];
    CONNECTIONS.forEach(([i, j]) => {
      const p1 = frameData[i];
      const p2 = frameData[j];
      if (p1 && p2) {
        vertices.push((p1.x - 0.5) * 2, (0.5 - p1.y) * 2, -p1.z * 2);
        vertices.push((p2.x - 0.5) * 2, (0.5 - p2.y) * 2, -p2.z * 2);
      }
    });
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    return geometry;
  }, [frameData]);

  return (
    <group>
      {points.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.02, 16, 16]} />
          <meshBasicMaterial color="red" />
        </mesh>
      ))}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color="white" />
      </lineSegments>
    </group>
  );
}

export default function SkeletonView({ frameData }) {
  return (
    <div style={{ width: '100%', height: '500px', background: '#111' }} className="skeleton-canvas">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <OrbitControls />
        <ambientLight intensity={1.0} />
        <pointLight position={[10, 10, 10]} />
        <Skeleton frameData={frameData} />
        <gridHelper args={[10, 10]} rotation={[Math.PI / 2, 0, 0]} />
      </Canvas>
    </div>
  );
}
