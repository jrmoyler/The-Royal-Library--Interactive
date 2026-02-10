
import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, useTexture } from '@react-three/drei';
import { CuboidCollider, RigidBody, RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { BookData } from '../types';
import { useGameStore } from '../store';

// High-fidelity book texture mapping the uploaded asset (Image 4/8 style)
const BOOK_TEXTURE_URL = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800'; 

interface BookArtifactProps {
  data: BookData;
}

export const BookArtifact: React.FC<BookArtifactProps> = ({ data }) => {
  const [hovered, setHovered] = useState(false);
  const [inRange, setInRange] = useState(false);
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const visualGroupRef = useRef<THREE.Group>(null);
  
  const { discoverBook, setActiveBook, activeBookId } = useGameStore();
  const isActive = activeBookId === data.id;

  const texture = useTexture(BOOK_TEXTURE_URL);

  const materials = useMemo(() => {
    const accent = new THREE.Color(data.color);
    return {
      cover: new THREE.MeshStandardMaterial({
        map: texture,
        color: "#4a3b2a", // Leathery base
        roughness: 0.8,
        metalness: 0.2,
      }),
      gem: new THREE.MeshStandardMaterial({
        color: data.color,
        emissive: data.color,
        emissiveIntensity: 5,
        transparent: true,
        opacity: 0.9,
      }),
      metal: new THREE.MeshStandardMaterial({
        color: "#888",
        metalness: 1,
        roughness: 0.1,
      })
    };
  }, [data.color, texture]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Animate Gem Pulse
    const pulse = (hovered || isActive) ? 10 + Math.sin(time * 15) * 5 : 4 + Math.sin(time * 3) * 1.5;
    materials.gem.emissiveIntensity = THREE.MathUtils.lerp(materials.gem.emissiveIntensity, pulse, 0.1);

    if (visualGroupRef.current) {
        if (hovered || isActive) {
            visualGroupRef.current.rotation.y += 0.06;
            visualGroupRef.current.position.y = Math.sin(time * 6) * 0.15;
            visualGroupRef.current.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1);
        } else {
            visualGroupRef.current.rotation.y = THREE.MathUtils.lerp(visualGroupRef.current.rotation.y, 0, 0.05);
            visualGroupRef.current.position.y = THREE.MathUtils.lerp(visualGroupRef.current.position.y, 0, 0.05);
            visualGroupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
        }
    }
  });

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (inRange && e.code === 'KeyE') {
        discoverBook(data.id);
        setActiveBook(isActive ? null : data.id);
      }
    };
    if (inRange) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inRange, isActive, data.id, discoverBook, setActiveBook]);

  return (
    <group position={data.position}>
      <Float speed={2.5} rotationIntensity={0.4} floatIntensity={0.6}>
        <RigidBody ref={rigidBodyRef} type="fixed" colliders={false}>
           <group ref={visualGroupRef}>
              {/* Main Volume */}
              <mesh castShadow material={materials.cover}>
                <boxGeometry args={[0.7, 1.0, 0.22]} />
              </mesh>
              
              {/* Ornate Gem Inset (Image 4 Style) */}
              <mesh position={[0, 0, 0.12]}>
                <octahedronGeometry args={[0.15]} />
                <meshStandardMaterial {...materials.gem} />
              </mesh>
              
              {/* Corner Guards */}
              {[[-0.35, 0.5], [0.35, 0.5], [-0.35, -0.5], [0.35, -0.5]].map(([x, y], i) => (
                <mesh key={i} position={[x as number, y as number, 0]} material={materials.metal}>
                    <boxGeometry args={[0.12, 0.12, 0.25]} />
                </mesh>
              ))}

              {/* Page Block */}
              <mesh position={[0.02, 0, 0]}>
                 <boxGeometry args={[0.65, 0.94, 0.2]} />
                 <meshStandardMaterial color="#fdf2d9" roughness={1} />
              </mesh>
           </group>

          <CuboidCollider 
            args={[2, 2, 2]} 
            sensor 
            onIntersectionEnter={(p) => p.other.rigidBodyObject?.name === 'local-player' && setInRange(true)}
            onIntersectionExit={(p) => {
               if (p.other.rigidBodyObject?.name === 'local-player') {
                  setInRange(false);
                  if (isActive) setActiveBook(null);
               }
            }}
          />
        </RigidBody>
      </Float>

      <Text 
        position={[0, 1.4, 0]} 
        fontSize={0.12} 
        color={inRange ? "white" : "#444"} 
        anchorX="center" 
        font="https://fonts.gstatic.com/s/pressstart2p/v15/e3t4Cs98K-m-S-hyH17yXGwWpA.ttf"
      >
        {inRange ? `NODE_SYNC: ${data.title.toUpperCase()}\n[E] TO READ` : ""}
      </Text>
    </group>
  );
};
