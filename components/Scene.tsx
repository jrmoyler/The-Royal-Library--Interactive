
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

const BOOKS: BookData[] = [
  { id: '1', title: 'Neon Commerce', description: 'Next.js 14 Headless Shopify', position: [-8, 1.5, -8], color: '#00f0ff' },
  { id: '2', title: 'Neural Dashboard', description: 'Real-time AI Analytics', position: [8, 1.5, -8], color: '#ff0055' },
  { id: '3', title: 'Aether State', description: 'Distributed State Mgmt', position: [0, 1.5, 8], color: '#764abc' },
];

export const Scene: React.FC = () => {
  const players = usePlayersList(true);
  const { isMultiplayerReady } = useGameStore();

  return (
    <>
      <Canvas 
        shadows 
        gl={{ antialias: true, shadowMapType: THREE.PCFSoftShadowMap, alpha: false }}
        camera={{ position: [0, 5, 12], fov: 45 }}
      >
        <Suspense fallback={null}>
            <color attach="background" args={['#010204']} />
            <fog attach="fog" args={['#010204', 15, 45]} />
            <Environment preset="night" background={false} />
            <ambientLight intensity={0.2} />
            
            <Physics gravity={[0, -12, 0]}>
                <Level />
                <Player />
                {isMultiplayerReady && players.map((p) => (
                   <GhostPlayer key={p.id} player={p} />
                ))}
                {BOOKS.map((book) => (
                    <BookArtifact key={book.id} data={book} />
                ))}
            </Physics>

            <Stars radius={100} depth={50} count={3000} factor={4} speed={0.5} />

            <EffectComposer multisampling={4} enableNormalPass>
                <SSAO 
                  samples={16} 
                  radius={0.4} 
                  intensity={15} 
                  luminanceInfluence={0.5} 
                  color={new THREE.Color("#000000")} 
                />
                <Bloom luminanceThreshold={1.0} mipmapBlur intensity={1.2} radius={0.4} />
                <Vignette darkness={1.1} offset={0.3} />
            </EffectComposer>
        </Suspense>
      </Canvas>
      <Loader 
        containerStyles={{ background: '#050505' }}
        innerStyles={{ background: '#111' }}
        barStyles={{ background: '#00f0ff' }}
        dataStyles={{ color: '#00f0ff', fontFamily: 'monospace' }}
      />
    </>
  );
};
