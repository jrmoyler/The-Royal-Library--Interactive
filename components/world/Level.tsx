
import React from 'react';
import { RigidBody } from '@react-three/rapier';
import { Box, useTexture, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const INTERIOR_URL = 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=2000'; // Image 11 Isometric style

export const Level: React.FC = () => {
  const texture = useTexture(INTERIOR_URL);
  
  return (
    <group dispose={null}>
      {/* Heavy Industrial Floor */}
      <RigidBody type="fixed" friction={1.5}>
        <Box args={[80, 1, 80]} position={[0, -0.5, 0]} receiveShadow>
          <meshStandardMaterial color="#0a0e17" roughness={0.2} metalness={0.9} />
        </Box>
        {/* Floor Circuit Pattern (Simulated with planes) */}
        {[ -20, 0, 20 ].map(z => (
          <mesh key={z} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, z]}>
            <planeGeometry args={[80, 0.1]} />
            <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={5} transparent opacity={0.2} />
          </mesh>
        ))}
      </RigidBody>

      {/* Atmospheric Isometric Backdrop Planes */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i * Math.PI) / 2;
        return (
          <mesh key={i} position={[Math.sin(angle) * 35, 15, Math.cos(angle) * 35]} rotation={[0, angle + Math.PI, 0]}>
            <planeGeometry args={[80, 40]} />
            <meshBasicMaterial map={texture} transparent opacity={0.15} color="#001533" />
          </mesh>
        );
      })}

      {/* THE CENTRAL DATA CORE - Energy Fountain (Image 2/7/11 style) */}
      <group position={[0, 0, 0]}>
         {/* Main Beam */}
         <mesh position={[0, 15, 0]}>
            <cylinderGeometry args={[2, 2, 30, 32, 1, true]} />
            <meshStandardMaterial 
              color="#00f0ff" 
              emissive="#00f0ff" 
              emissiveIntensity={15} 
              transparent 
              opacity={0.1}
              side={THREE.DoubleSide}
            />
         </mesh>
         {/* Core White Streak */}
         <mesh position={[0, 15, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 30, 8]} />
            <meshStandardMaterial color="#fff" emissive="#00f0ff" emissiveIntensity={25} />
         </mesh>
         
         {/* Distorted Energy Base */}
         <mesh position={[0, 1, 0]}>
            <sphereGeometry args={[2, 32, 32]} />
            <MeshDistortMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={10} speed={4} distort={0.4} />
         </mesh>

         {/* Energy Rings */}
         {[1, 2, 3].map(i => (
           <mesh key={i} position={[0, i * 4, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[3 + i * 0.5, 0.05, 16, 100]} />
              <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={10} />
           </mesh>
         ))}

         <pointLight position={[0, 10, 0]} intensity={10} color="#00f0ff" distance={30} decay={2} />
      </group>

      {/* Structural Ruined Pillars with Glow */}
      <RigidBody type="fixed">
        <group>
            {[ -15, 15 ].map((x) => (
                [ -15, 15 ].map((z) => (
                    <group key={`${x}-${z}`} position={[x, 6, z]}>
                        <Box args={[3, 12, 3]} castShadow receiveShadow>
                            <meshStandardMaterial color="#1a2130" metalness={0.8} />
                        </Box>
                        {/* Glowing Vertical Circuit Strip */}
                        <mesh position={[0, 0, 1.55]}>
                            <planeGeometry args={[0.4, 10]} />
                            <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={10} />
                        </mesh>
                    </group>
                ))
            ))}
        </group>
      </RigidBody>
    </group>
  );
};
