
import React from 'react';
import { RigidBody } from '@react-three/rapier';
import { Box, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const INTERIOR_URL = 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=2000'; // Placeholder for Image 11

export const Level: React.FC = () => {
  const texture = useTexture(INTERIOR_URL);
  
  return (
    <group dispose={null}>
      {/* Floor */}
      <RigidBody type="fixed" friction={1}>
        <Box args={[60, 1, 60]} position={[0, -0.5, 0]} receiveShadow>
          <meshStandardMaterial color="#080c14" roughness={0.1} metalness={0.8} />
        </Box>
      </RigidBody>

      {/* Atmospheric Interior Backdrops */}
      <group position={[0, 10, -20]}>
         <mesh>
            <planeGeometry args={[60, 30]} />
            <meshBasicMaterial map={texture} transparent opacity={0.3} side={THREE.DoubleSide} />
         </mesh>
      </group>

      {/* Central Portal / Data Core Beam */}
      <group position={[0, 0, 0]}>
         <mesh position={[0, 10, 0]}>
            <cylinderGeometry args={[2, 2, 20, 32, 1, true]} />
            <meshStandardMaterial 
              color="#00f0ff" 
              emissive="#00f0ff" 
              emissiveIntensity={10} 
              transparent 
              opacity={0.1}
              side={THREE.DoubleSide}
            />
         </mesh>
         <mesh position={[0, 10, 0]}>
            <cylinderGeometry args={[0.5, 0.5, 20, 16]} />
            <meshStandardMaterial color="#fff" emissive="#00f0ff" emissiveIntensity={20} transparent opacity={0.4} />
         </mesh>
         <pointLight position={[0, 5, 0]} intensity={5} color="#00f0ff" distance={20} />
      </group>

      {/* Structured Archways */}
      <RigidBody type="fixed">
        <group>
            {/* Arch Pillars */}
            {[ -12, 12 ].map((x) => (
                <group key={x} position={[x, 5, -15]}>
                    <Box args={[2, 10, 2]} castShadow receiveShadow>
                        <meshStandardMaterial color="#1e293b" />
                    </Box>
                    <mesh position={[0, 0, 1.1]}>
                        <planeGeometry args={[1.5, 9]} />
                        <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2} />
                    </mesh>
                </group>
            ))}
        </group>
      </RigidBody>
    </group>
  );
};
