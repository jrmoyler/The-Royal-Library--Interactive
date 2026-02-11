
import React from 'react';
import { RigidBody } from '@react-three/rapier';
import { Box, useTexture, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const INTERIOR_URL = 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=2000';

export const Level: React.FC = () => {
  const texture = useTexture(INTERIOR_URL);
  
  return (
    <group dispose={null}>
      {/* Robust Industrial Floor - Increased thickness to prevent glitch-through */}
      <RigidBody type="fixed" friction={1} name="floor">
        <Box args={[120, 5, 120]} position={[0, -2.5, 0]} receiveShadow>
          <meshStandardMaterial color="#05070a" roughness={0.4} metalness={0.6} />
        </Box>
        {/* Floor Circuit Grid */}
        {[ -40, -20, 0, 20, 40 ].map(z => (
          <mesh key={'z'+z} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, z]}>
            <planeGeometry args={[120, 0.05]} />
            <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={8} transparent opacity={0.3} />
          </mesh>
        ))}
        {[ -40, -20, 0, 20, 40 ].map(x => (
          <mesh key={'x'+x} rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[x, 0.02, 0]}>
            <planeGeometry args={[120, 0.05]} />
            <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={8} transparent opacity={0.3} />
          </mesh>
        ))}
      </RigidBody>

      {/* Atmospheric World Planes */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i * Math.PI) / 2;
        return (
          <mesh key={i} position={[Math.sin(angle) * 55, 15, Math.cos(angle) * 55]} rotation={[0, angle + Math.PI, 0]}>
            <planeGeometry args={[120, 60]} />
            <meshBasicMaterial map={texture} transparent opacity={0.1} color="#001a33" />
          </mesh>
        );
      })}

      {/* CENTRAL ARCHIVAL CORE */}
      <group position={[0, 0, 0]}>
         <mesh position={[0, 20, 0]}>
            <cylinderGeometry args={[2.5, 2.5, 40, 32, 1, true]} />
            <meshStandardMaterial 
              color="#00f0ff" 
              emissive="#00f0ff" 
              emissiveIntensity={20} 
              transparent 
              opacity={0.05}
              side={THREE.DoubleSide}
            />
         </mesh>
         <mesh position={[0, 20, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 40, 8]} />
            <meshStandardMaterial color="#fff" emissive="#00f0ff" emissiveIntensity={30} />
         </mesh>
         <mesh position={[0, 1.5, 0]}>
            <sphereGeometry args={[2.5, 32, 32]} />
            <MeshDistortMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={12} speed={3} distort={0.5} />
         </mesh>
         <pointLight position={[0, 15, 0]} intensity={15} color="#00f0ff" distance={50} decay={2} />
      </group>

      {/* Structural Pillars */}
      <RigidBody type="fixed">
        <group>
            {[ -25, 25 ].map((x) => (
                [ -25, 25 ].map((z) => (
                    <group key={`${x}-${z}`} position={[x, 8, z]}>
                        <Box args={[4, 16, 4]} castShadow receiveShadow>
                            <meshStandardMaterial color="#0f141f" metalness={0.9} />
                        </Box>
                        <mesh position={[0, 0, 2.05]}>
                            <planeGeometry args={[0.5, 14]} />
                            <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={15} />
                        </mesh>
                    </group>
                ))
            ))}
        </group>
      </RigidBody>
    </group>
  );
};
