
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';

// Floating Data Fragments Component
export const DataFragments: React.FC = () => {
  const fragmentCount = 30;
  const fragments = useMemo(() => {
    return Array.from({ length: fragmentCount }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 50,
        Math.random() * 15 + 2,
        (Math.random() - 0.5) * 50,
      ] as [number, number, number],
      scale: Math.random() * 0.3 + 0.1,
      rotationSpeed: (Math.random() - 0.5) * 0.5,
      color: ['#00f0ff', '#ff0055', '#764abc', '#ffaa00', '#ccff00'][Math.floor(Math.random() * 5)],
    }));
  }, []);

  return (
    <group>
      {fragments.map((fragment) => (
        <DataFragment key={fragment.id} {...fragment} />
      ))}
    </group>
  );
};

const DataFragment: React.FC<{
  position: [number, number, number];
  scale: number;
  rotationSpeed: number;
  color: string;
}> = ({ position, scale, rotationSpeed, color }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += rotationSpeed * 0.01;
    meshRef.current.position.y += Math.sin(state.clock.elapsedTime + position[0]) * 0.001;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <boxGeometry args={[1, 1, 0.1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={3}
          transparent
          opacity={0.6}
        />
      </mesh>
    </Float>
  );
};

// Holographic Displays Component
export const HolographicDisplays: React.FC = () => {
  const displays = useMemo(() => [
    { position: [-18, 8, -18], rotation: Math.PI / 4, text: 'SECTOR_A' },
    { position: [18, 8, -18], rotation: -Math.PI / 4, text: 'SECTOR_B' },
    { position: [-18, 8, 18], rotation: Math.PI * 0.75, text: 'SECTOR_C' },
    { position: [18, 8, 18], rotation: -Math.PI * 0.75, text: 'SECTOR_D' },
  ], []);

  return (
    <group>
      {displays.map((display, i) => (
        <HolographicDisplay key={i} {...display} />
      ))}
    </group>
  );
};

const HolographicDisplay: React.FC<{
  position: [number, number, number];
  rotation: number;
  text: string;
}> = ({ position, rotation, text }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.5 + 0.5;
    groupRef.current.children.forEach((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        child.material.emissiveIntensity = 2 + pulse * 3;
      }
    });
  });

  return (
    <group ref={groupRef} position={position} rotation-y={rotation}>
      {/* Frame */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3, 4, 0.1]} />
        <meshStandardMaterial
          color="#001a33"
          metalness={1}
          roughness={0.2}
        />
      </mesh>
      {/* Screen */}
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[2.5, 3.5]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={3}
          transparent
          opacity={0.3}
        />
      </mesh>
      {/* Text */}
      <Text
        position={[0, 1.5, 0.08]}
        fontSize={0.3}
        color="#00f0ff"
        anchorX="center"
        font="https://fonts.gstatic.com/s/pressstart2p/v15/e3t4Cs98K-m-S-hyH17yXGwWpA.ttf"
      >
        {text}
      </Text>
      {/* Scanning Lines */}
      {[0, 0.5, 1, 1.5].map((y, i) => (
        <mesh key={i} position={[0, y - 1, 0.07]}>
          <planeGeometry args={[2.5, 0.05]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={10}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
};

// Energy Particles Component
export const EnergyParticles: React.FC = () => {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 1000;

  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const colorOptions = [
      new THREE.Color('#00f0ff'),
      new THREE.Color('#ff0055'),
      new THREE.Color('#764abc'),
    ];

    for (let i = 0; i < particleCount; i++) {
      // Position
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = Math.random() * 25;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;

      // Color
      const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      // Size
      sizes[i] = Math.random() * 0.5 + 0.1;
    }

    return { positions, colors, sizes };
  }, []);

  useFrame((state) => {
    if (!particlesRef.current) return;
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      // Gentle upward float with some randomness
      positions[i * 3 + 1] += 0.01;

      // Reset particles that float too high
      if (positions[i * 3 + 1] > 25) {
        positions[i * 3 + 1] = 0;
      }

      // Add slight horizontal drift
      positions[i * 3] += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.001;
      positions[i * 3 + 2] += Math.cos(state.clock.elapsedTime * 0.5 + i) * 0.001;
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particleCount}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// Dynamic Ambient Lighting
export const DynamicLighting: React.FC = () => {
  const light1Ref = useRef<THREE.PointLight>(null);
  const light2Ref = useRef<THREE.PointLight>(null);
  const light3Ref = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (light1Ref.current) {
      light1Ref.current.intensity = 3 + Math.sin(time * 0.5) * 1.5;
      light1Ref.current.position.x = Math.cos(time * 0.3) * 15;
      light1Ref.current.position.z = Math.sin(time * 0.3) * 15;
    }

    if (light2Ref.current) {
      light2Ref.current.intensity = 2.5 + Math.sin(time * 0.7 + Math.PI) * 1;
      light2Ref.current.position.x = Math.cos(time * 0.4 + Math.PI / 2) * 12;
      light2Ref.current.position.z = Math.sin(time * 0.4 + Math.PI / 2) * 12;
    }

    if (light3Ref.current) {
      light3Ref.current.intensity = 2 + Math.sin(time * 0.6 + Math.PI / 3) * 0.8;
    }
  });

  return (
    <>
      <pointLight
        ref={light1Ref}
        position={[15, 8, 15]}
        color="#00f0ff"
        distance={25}
        decay={2}
        castShadow
      />
      <pointLight
        ref={light2Ref}
        position={[-12, 8, -12]}
        color="#ff0055"
        distance={25}
        decay={2}
      />
      <pointLight
        ref={light3Ref}
        position={[0, 12, 0]}
        color="#764abc"
        distance={30}
        decay={2}
      />
      {/* Rim lighting */}
      <spotLight
        position={[-20, 15, 0]}
        angle={0.6}
        penumbra={0.5}
        intensity={1.5}
        color="#00f0ff"
        castShadow
      />
      <spotLight
        position={[20, 15, 0]}
        angle={0.6}
        penumbra={0.5}
        intensity={1.5}
        color="#ff0055"
        castShadow
      />
    </>
  );
};

// Floor Grid Enhancement
export const FloorGrid: React.FC = () => {
  const gridRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!gridRef.current) return;
    gridRef.current.children.forEach((child, i) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        const pulse = Math.sin(state.clock.elapsedTime * 2 + i * 0.5) * 0.5 + 0.5;
        child.material.emissiveIntensity = 2 + pulse * 3;
      }
    });
  });

  return (
    <group ref={gridRef}>
      {/* Radial grid lines from center */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 25;
        const z = Math.sin(angle) * 25;
        return (
          <mesh
            key={i}
            position={[x / 2, 0.02, z / 2]}
            rotation={[-Math.PI / 2, 0, angle]}
          >
            <planeGeometry args={[0.05, 25]} />
            <meshStandardMaterial
              color="#00f0ff"
              emissive="#00f0ff"
              emissiveIntensity={3}
              transparent
              opacity={0.4}
            />
          </mesh>
        );
      })}

      {/* Concentric circles */}
      {[5, 10, 15, 20].map((radius, i) => (
        <mesh key={`circle-${i}`} position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius - 0.05, radius + 0.05, 64]} />
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={5 - i}
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
};
