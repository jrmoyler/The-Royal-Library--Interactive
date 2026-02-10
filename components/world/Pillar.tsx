import React from 'react';
import * as THREE from 'three';

interface PillarProps {
  position: [number, number, number];
  height?: number;
  accentColor?: string;
}

/** Modular low-poly pillar with energy conduit. */
export const Pillar: React.FC<PillarProps> = ({
  position,
  height = 8,
  accentColor = '#00f0ff',
}) => {
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.5, 2]} />
        <meshStandardMaterial color="#1a2130" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Column (octagonal low-poly) */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 0.7, height, 8]} />
        <meshStandardMaterial color="#1a2130" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Capital */}
      <mesh position={[0, height - 0.2, 0]} castShadow>
        <boxGeometry args={[1.8, 0.4, 1.8]} />
        <meshStandardMaterial color="#1a2130" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Energy conduit strips */}
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, i) => (
        <mesh
          key={i}
          position={[
            Math.sin(angle) * 0.65,
            height / 2,
            Math.cos(angle) * 0.65,
          ]}
          rotation={[0, angle, 0]}
        >
          <boxGeometry args={[0.06, height - 1, 0.01]} />
          <meshStandardMaterial
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={8}
          />
        </mesh>
      ))}

      {/* Glow light at top */}
      <pointLight
        position={[0, height, 0]}
        intensity={2}
        color={accentColor}
        distance={6}
        decay={2}
      />
    </group>
  );
};
