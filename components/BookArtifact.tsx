
import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, useTexture } from '@react-three/drei';
import { CuboidCollider, RigidBody, RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { BookData } from '../types';
import { useGameStore } from '../store';

// Asset: Detailed Book Texture
const BOOK_TEXTURE_URL = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800'; // Placeholder for Image 4/8

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

  // Load texture
  const texture = useTexture(BOOK_TEXTURE_URL);

  const materials = useMemo(() => {
    const emissiveColor = new THREE.Color(data.color);
    return {
      cover: new THREE.MeshStandardMaterial({
        map: texture,
        color: data.color,
        emissive: emissiveColor,
        emissiveIntensity: 0.5,
        roughness: 0.3,
        metalness: 0.7,
      }),
      pages: new THREE.MeshStandardMaterial({
        color: "#fff",
        emissive: "#fff",
        emissiveIntensity: 0.1,
      })
    };
  }, [data.color, texture]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    let targetIntensity = 0.5 + Math.sin(time * 2) * 0.2; 
    
    if (hovered || isActive) {
      targetIntensity = 2.5 + Math.sin(time * 12) * 0.8;
    }
    materials.cover.emissiveIntensity = THREE.MathUtils.lerp(materials.cover.emissiveIntensity, targetIntensity, 0.1);

    if (visualGroupRef.current) {
        if (hovered || isActive) {
            visualGroupRef.current.rotation.y += 0.04;
            visualGroupRef.current.position.y = Math.sin(time * 4) * 0.1;
        } else {
            visualGroupRef.current.rotation.y = THREE.MathUtils.lerp(visualGroupRef.current.rotation.y, 0, 0.05);
            visualGroupRef.current.position.y = THREE.MathUtils.lerp(visualGroupRef.current.position.y, 0, 0.05);
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
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.4}>
        <RigidBody ref={rigidBodyRef} type="fixed" colliders={false}>
           <group ref={visualGroupRef}>
              {/* Textured Book Cover */}
              <mesh castShadow receiveShadow onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)} material={materials.cover}>
                <boxGeometry args={[0.7, 1.0, 0.2]} />
              </mesh>
              
              {/* Glowing Pages Core */}
              <mesh position={[0.02, 0, 0]}>
                 <boxGeometry args={[0.65, 0.96, 0.22]} />
                 <meshStandardMaterial color={data.color} emissive={data.color} emissiveIntensity={2} transparent opacity={0.3} />
              </mesh>
           </group>

          <CuboidCollider 
            args={[1.5, 1.5, 1.5]} 
            sensor 
            onIntersectionEnter={(payload) => {
              if (payload.other.rigidBodyObject?.name === 'local-player') setInRange(true);
            }}
            onIntersectionExit={(payload) => {
              if (payload.other.rigidBodyObject?.name === 'local-player') {
                setInRange(false);
                if (isActive) setActiveBook(null);
              }
            }}
          />
        </RigidBody>
      </Float>

      <Text position={[0, 1.5, 0]} fontSize={0.15} color={inRange ? "white" : "gray"} anchorX="center" outlineWidth={0.01} outlineColor="#000">
        {inRange ? `SYNK: ${data.title}\n[E] TO INTERFACE` : ""}
      </Text>
    </group>
  );
};
