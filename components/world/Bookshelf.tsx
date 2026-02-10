import React from 'react';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';

interface BookshelfProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  accentColor?: string;
  bookColors?: string[];
}

/** Modular low-poly bookshelf with procedural mini-books. Replaces PNG backdrop. */
export const Bookshelf: React.FC<BookshelfProps> = ({
  position,
  rotation = [0, 0, 0],
  accentColor = '#00f0ff',
  bookColors = ['#8b2020', '#1a3a5c', '#2d5a1e', '#5c1a5c', '#5a4a20', '#1a4a4a'],
}) => {
  const shelfYPositions = [0.85, 1.65, 2.45, 3.25];

  return (
    <RigidBody type="fixed" position={position} rotation={rotation}>
      <group>
        {/* Main frame */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2, 4, 0.5]} />
          <meshStandardMaterial color="#2a1810" roughness={0.8} metalness={0.3} />
        </mesh>

        {/* Shelf planks */}
        {shelfYPositions.map((y, i) => (
          <mesh key={`shelf-${i}`} position={[0, y - 2, 0]} receiveShadow>
            <boxGeometry args={[1.85, 0.06, 0.48]} />
            <meshStandardMaterial color="#4a3020" roughness={0.9} />
          </mesh>
        ))}

        {/* Mini books on each shelf */}
        {shelfYPositions.slice(0, 3).map((shelfY, si) => (
          <group key={`books-${si}`}>
            {Array.from({ length: 5 + si }, (_, bi) => {
              const w = 0.08 + Math.random() * 0.06;
              const h = 0.35 + Math.random() * 0.25;
              const x = -0.7 + bi * 0.3 + (Math.random() - 0.5) * 0.05;
              const color = bookColors[(si * 3 + bi) % bookColors.length];
              return (
                <mesh key={`book-${si}-${bi}`} position={[x, shelfY - 2 + h / 2 + 0.04, 0]} castShadow>
                  <boxGeometry args={[w, h, 0.2]} />
                  <meshStandardMaterial color={color} roughness={0.85} />
                </mesh>
              );
            })}
          </group>
        ))}

        {/* Decorative rune strip */}
        <mesh position={[0, 0, 0.26]}>
          <boxGeometry args={[0.08, 3.6, 0.01]} />
          <meshStandardMaterial
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={3}
          />
        </mesh>

        {/* Side trim */}
        {[-1.0, 1.0].map((x) => (
          <mesh key={`trim-${x}`} position={[x, 0, 0.26]}>
            <boxGeometry args={[0.03, 4, 0.01]} />
            <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={1} transparent opacity={0.3} />
          </mesh>
        ))}
      </group>
    </RigidBody>
  );
};
