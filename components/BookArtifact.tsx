import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import { CuboidCollider, RigidBody, RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { BookData } from '../types';
import { useGameStore } from '../store';

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

  // Persistent material
  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: data.color,
    emissive: data.color,
    emissiveIntensity: 0.5,
    roughness: 0.2,
    metalness: 0.8,
  }), [data.color]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // 1. Pulsing Emissive Glow Animation
    // Base pulse
    let targetIntensity = 0.5 + Math.sin(time * 2) * 0.2; 
    
    // Intensity boost on hover or active
    if (hovered || isActive) {
      targetIntensity = 2.0 + Math.sin(time * 10) * 0.5; // Faster, brighter pulse
    }

    // Smoothly interpolate current intensity to target
    material.emissiveIntensity = THREE.MathUtils.lerp(material.emissiveIntensity, targetIntensity, 0.1);

    // 2. Rotation on Hover
    if (visualGroupRef.current) {
        if (hovered || isActive) {
            // Spin and tilt when hovered/active
            visualGroupRef.current.rotation.y += 0.05;
            visualGroupRef.current.rotation.x = Math.sin(time * 3) * 0.2;
        } else {
            // Return to neutral rotation
            visualGroupRef.current.rotation.y = THREE.MathUtils.lerp(visualGroupRef.current.rotation.y, 0, 0.1);
            visualGroupRef.current.rotation.x = THREE.MathUtils.lerp(visualGroupRef.current.rotation.x, 0, 0.1);
        }
    }

    if (inRange) {
       // Interaction listener logic kept minimal here
    }
  });

  // Handle interaction
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (inRange && e.code === 'KeyE') {
        discoverBook(data.id);
        setActiveBook(isActive ? null : data.id);
      }
    };

    if (inRange) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inRange, isActive, data.id, discoverBook, setActiveBook]);

  return (
    <group position={data.position}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <RigidBody 
          ref={rigidBodyRef} 
          type="fixed" 
          colliders={false}
        >
           {/* Visual Group for Independent Rotation */}
           <group ref={visualGroupRef}>
              {/* Cover */}
              <mesh
                castShadow
                receiveShadow
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                material={material}
              >
                <boxGeometry args={[0.6, 0.8, 0.15]} />
              </mesh>
              
              {/* Pages Mesh (aesthetic) */}
              <mesh position={[0.02, 0, 0]}>
                 <boxGeometry args={[0.55, 0.76, 0.16]} />
                 <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.1} />
              </mesh>
           </group>

          {/* Sensor for proximity */}
          <CuboidCollider 
            args={[1.5, 1.5, 1.5]} 
            sensor 
            onIntersectionEnter={(payload) => {
              if (payload.other.rigidBodyObject?.name === 'local-player') {
                setInRange(true);
              }
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

      {/* Floating Label */}
      <Text
        position={[0, 1.2, 0]}
        fontSize={0.2}
        color={inRange ? "white" : "gray"}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#000000"
      >
        {inRange ? "PRESS [E]" : ""}
      </Text>
    </group>
  );
};
