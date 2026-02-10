import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface DataCoreProps {
  position?: [number, number, number];
  accentColor?: string;
}

/** Central energy data core with animated rings. Replaces old energy fountain. */
export const DataCore: React.FC<DataCoreProps> = ({
  position = [0, 0, 0],
  accentColor = '#00f0ff',
}) => {
  const ringsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ringsRef.current) return;
    const t = state.clock.getElapsedTime();
    ringsRef.current.children.forEach((ring, i) => {
      ring.rotation.z = Math.sin(t * 0.5 + i * 1.2) * 0.3;
      ring.rotation.x = Math.PI / 2 + Math.cos(t * 0.3 + i * 0.8) * 0.15;
    });
  });

  return (
    <group position={position}>
      {/* Base platform - octagonal */}
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <cylinderGeometry args={[3, 3.5, 0.3, 8]} />
        <meshStandardMaterial color="#0a0e17" metalness={1} roughness={0.1} />
      </mesh>

      {/* Step ring */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <cylinderGeometry args={[4, 4.2, 0.1, 8]} />
        <meshStandardMaterial color="#0a0e17" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Core orb (distorted) */}
      <mesh position={[0, 2, 0]}>
        <sphereGeometry args={[1.5, 12, 12]} />
        <MeshDistortMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={10}
          speed={4}
          distort={0.4}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Inner core */}
      <mesh position={[0, 2, 0]}>
        <octahedronGeometry args={[0.6]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive={accentColor}
          emissiveIntensity={25}
        />
      </mesh>

      {/* Energy beam */}
      <mesh position={[0, 12, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 20, 8]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive={accentColor}
          emissiveIntensity={20}
        />
      </mesh>

      {/* Outer beam shell */}
      <mesh position={[0, 12, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 20, 16, 1, true]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={8}
          transparent
          opacity={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Animated energy rings */}
      <group ref={ringsRef}>
        {[1, 2, 3, 4].map((i) => (
          <mesh key={i} position={[0, i * 3 + 1, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[2.5 + i * 0.3, 0.04, 8, 32]} />
            <meshStandardMaterial
              color={accentColor}
              emissive={accentColor}
              emissiveIntensity={10}
            />
          </mesh>
        ))}
      </group>

      {/* Ground rune circle */}
      <mesh position={[0, 0.32, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.8, 3, 8]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={5}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Core light */}
      <pointLight position={[0, 4, 0]} intensity={15} color={accentColor} distance={30} decay={2} />
      <pointLight position={[0, 12, 0]} intensity={5} color={accentColor} distance={20} decay={2} />
    </group>
  );
};
