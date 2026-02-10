import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { Environment, Stars, Loader } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, SSAO } from '@react-three/postprocessing';
import * as THREE from 'three';
import { Player, GhostPlayer } from './Player';
import { Level } from './world/Level';
import { BookArtifact } from './BookArtifact';
import { useGameStore } from '../store';
import { usePlayersList } from 'playroomkit';
import { BookData } from '../types';

// Using the same mock data for portfolio artifacts
const BOOKS: BookData[] = [
  { id: '1', title: 'Neon Commerce', description: 'Next.js 14 Headless Shopify', position: [-5, 1.5, -5], color: '#00f0ff' },
  { id: '2', title: 'Neural Dashboard', description: 'Real-time AI Analytics', position: [5, 1.5, -5], color: '#ff0055' },
  { id: '3', title: 'Aether State', description: 'Distributed State Mgmt', position: [0, 1.5, 5], color: '#764abc' },
];

export const Scene: React.FC = () => {
  const players = usePlayersList(true);
  const isMultiplayerReady = useGameStore(s => s.isMultiplayerReady);

  return (
    <>
      <Canvas 
        shadows 
        gl={{
          antialias: true,
          shadowMapType: THREE.PCFSoftShadowMap,
        }}
        camera={{ position: [0, 5, 10], fov: 50 }}
      >
        <Suspense fallback={null}>
            {/* Atmospheric Lighting */}
            <color attach="background" args={['#050505']} />
            <fog attach="fog" args={['#050505', 5, 25]} />
            
            {/* Environment & Shadows */}
            <Environment preset="dawn" background={false} />
            <ambientLight intensity={0.2} />

            <Physics gravity={[0, -9.81, 0]}>
                {/* 1. Static Level */}
                <Level />

                {/* 2. Dynamic Player */}
                <Player />
                
                {/* 3. Multiplayer Ghosts */}
                {isMultiplayerReady && players.map((player) => (
                   <GhostPlayer key={player.id} player={player} />
                ))}

                {/* 4. Interactive Artifacts */}
                {BOOKS.map((book) => (
                    <BookArtifact key={book.id} data={book} />
                ))}
            </Physics>

            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            {/* Post Processing for Tech/Neon Glow and Enhanced Depth */}
            <EffectComposer>
                <SSAO 
                  samples={21}
                  radius={1.2}
                  intensity={25}
                  luminanceInfluence={0.5}
                  color={new THREE.Color("#000000")}
                />
                <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} radius={0.6} />
                <Vignette eskil={false} offset={0.1} darkness={1.1} />
            </EffectComposer>
        </Suspense>
      </Canvas>
      <Loader />
    </>
  );
};
