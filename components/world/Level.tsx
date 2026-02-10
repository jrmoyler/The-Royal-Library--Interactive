import React from 'react';
import { RigidBody } from '@react-three/rapier';
import { Box } from '@react-three/drei';
import * as THREE from 'three';
import { Bookshelf } from './Bookshelf';
import { Pillar } from './Pillar';
import { DataCore } from './DataCore';

export const Level: React.FC = () => {
  return (
    <group dispose={null}>
      {/* ── FLOOR ── */}
      {/* Main solid floor with physics - thick slab to prevent fall-through */}
      <RigidBody type="fixed" friction={1.2} restitution={0.1}>
        <Box args={[80, 2, 80]} position={[0, -1, 0]} receiveShadow>
          <meshStandardMaterial color="#0a0e17" roughness={0.2} metalness={0.9} />
        </Box>
      </RigidBody>

      {/* Floor circuit pattern lines */}
      {[-20, -10, 0, 10, 20].map((z) => (
        <mesh key={`line-z-${z}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, z]}>
          <planeGeometry args={[80, 0.08]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={5} transparent opacity={0.2} />
        </mesh>
      ))}
      {[-20, -10, 0, 10, 20].map((x) => (
        <mesh key={`line-x-${x}`} rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[x, 0.01, 0]}>
          <planeGeometry args={[80, 0.08]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={5} transparent opacity={0.15} />
        </mesh>
      ))}

      {/* ── BOUNDARY WALLS (invisible physics) ── */}
      <RigidBody type="fixed">
        {/* North wall */}
        <Box args={[80, 10, 1]} position={[0, 5, -40]}>
          <meshStandardMaterial transparent opacity={0} />
        </Box>
        {/* South wall */}
        <Box args={[80, 10, 1]} position={[0, 5, 40]}>
          <meshStandardMaterial transparent opacity={0} />
        </Box>
        {/* East wall */}
        <Box args={[1, 10, 80]} position={[40, 5, 0]}>
          <meshStandardMaterial transparent opacity={0} />
        </Box>
        {/* West wall */}
        <Box args={[1, 10, 80]} position={[-40, 5, 0]}>
          <meshStandardMaterial transparent opacity={0} />
        </Box>
      </RigidBody>

      {/* ── CENTRAL DATA CORE (replaces old energy fountain) ── */}
      <DataCore position={[0, 0, 0]} accentColor="#00f0ff" />

      {/* ── MODULAR PILLARS (replace old box pillars) ── */}
      <RigidBody type="fixed">
        <group>
          <Pillar position={[-15, 0, -15]} height={10} accentColor="#00f0ff" />
          <Pillar position={[15, 0, -15]} height={10} accentColor="#ff0055" />
          <Pillar position={[-15, 0, 15]} height={10} accentColor="#764abc" />
          <Pillar position={[15, 0, 15]} height={10} accentColor="#ffaa00" />
        </group>
      </RigidBody>

      {/* ── MODULAR BOOKSHELVES (replace PNG backdrops) ── */}
      {/* North wing */}
      {[-12, -8, -4, 4, 8, 12].map((x, i) => (
        <Bookshelf
          key={`shelf-n-${i}`}
          position={[x, 2, -18]}
          rotation={[0, 0, 0]}
          accentColor={i % 2 === 0 ? '#00f0ff' : '#764abc'}
        />
      ))}

      {/* East wing */}
      {[-12, -6, 0, 6, 12].map((z, i) => (
        <Bookshelf
          key={`shelf-e-${i}`}
          position={[20, 2, z]}
          rotation={[0, -Math.PI / 2, 0]}
          accentColor={i % 2 === 0 ? '#ff0055' : '#ffaa00'}
        />
      ))}

      {/* West wing */}
      {[-12, -6, 0, 6, 12].map((z, i) => (
        <Bookshelf
          key={`shelf-w-${i}`}
          position={[-20, 2, z]}
          rotation={[0, Math.PI / 2, 0]}
          accentColor={i % 2 === 0 ? '#00f0ff' : '#ccff00'}
        />
      ))}

      {/* South alcove shelves */}
      {[-8, -4, 4, 8].map((x, i) => (
        <Bookshelf
          key={`shelf-s-${i}`}
          position={[x, 2, 18]}
          rotation={[0, Math.PI, 0]}
          accentColor="#ffaa00"
        />
      ))}

      {/* ── READING ALCOVES (low-poly lecterns near book positions) ── */}
      {[
        [-8, 0, -8],
        [8, 0, -8],
        [0, 0, 8],
      ].map(([x, y, z], i) => (
        <RigidBody key={`lectern-${i}`} type="fixed" position={[x, y, z]}>
          <group>
            {/* Pedestal */}
            <mesh position={[0, 0.5, 0]} castShadow>
              <cylinderGeometry args={[0.15, 0.3, 1.0, 6]} />
              <meshStandardMaterial color="#3a2515" roughness={0.8} />
            </mesh>
            {/* Top surface */}
            <mesh position={[0, 1.05, 0]} rotation={[-0.3, 0, 0]} castShadow>
              <boxGeometry args={[0.8, 0.06, 0.6]} />
              <meshStandardMaterial color="#5a4030" roughness={0.7} />
            </mesh>
            {/* Base */}
            <mesh position={[0, 0.05, 0]}>
              <cylinderGeometry args={[0.4, 0.4, 0.1, 6]} />
              <meshStandardMaterial color="#3a2515" roughness={0.8} />
            </mesh>
          </group>
        </RigidBody>
      ))}

      {/* ── AMBIENT FLOOR LIGHTS ── */}
      {[
        [-10, 0.1, -10],
        [10, 0.1, -10],
        [-10, 0.1, 10],
        [10, 0.1, 10],
        [0, 0.1, -15],
        [0, 0.1, 15],
        [-15, 0.1, 0],
        [15, 0.1, 0],
      ].map(([x, y, z], i) => (
        <pointLight
          key={`floor-light-${i}`}
          position={[x, y + 0.5, z]}
          intensity={1}
          color="#00f0ff"
          distance={8}
          decay={2}
        />
      ))}

      {/* ── ATMOSPHERIC ELEMENTS ── */}
      {/* Ceiling plane (high up, subtle) */}
      <mesh position={[0, 20, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#050810" side={THREE.DoubleSide} />
      </mesh>

      {/* Ambient lighting */}
      <ambientLight intensity={0.05} />
      <pointLight position={[10, 15, 10]} intensity={3} color="#00f0ff" castShadow />
      <pointLight position={[-10, 15, -10]} intensity={2} color="#764abc" />
    </group>
  );
};
