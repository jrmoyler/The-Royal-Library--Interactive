
import React, { Suspense } from 'react';
import { Canvas, ThreeElements } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { Environment, Stars, Loader, Float } from '@react-three/drei';
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
  const { isMultiplayerReady, xp, level, energy } = useGameStore();

  return (
    <>
      <Canvas 
        shadows 
        gl={{ antialias: true, shadowMapType: THREE.PCFSoftShadowMap }}
        camera={{ position: [0, 5, 10], fov: 45 }}
      >
        <Suspense fallback={null}>
            <color attach="background" args={['#020408']} />
            <fog attach="fog" args={['#020408', 5, 30]} />
            
            <Environment preset="night" background={false} />
            <ambientLight intensity={0.1} />
            <pointLight position={[10, 10, 10]} intensity={2} color="#00f0ff" castShadow />

            <Physics gravity={[0, -12, 0]}>
                <Level />
                <Player />
                {isMultiplayerReady && players.map((player) => (
                   <GhostPlayer key={player.id} player={player} />
                ))}
                {BOOKS.map((book) => (
                    <BookArtifact key={book.id} data={book} />
                ))}
            </Physics>

            <Stars radius={100} depth={50} count={2000} factor={4} saturation={0.5} fade speed={1} />

            <EffectComposer enableNormalPass multisampling={4}>
                <SSAO samples={11} radius={1.5} intensity={10} luminanceInfluence={0.5} color={new THREE.Color("#000000")} />
                <Bloom luminanceThreshold={0.8} mipmapBlur intensity={1.2} radius={0.5} />
                <Vignette darkness={1.2} offset={0.2} />
            </EffectComposer>
        </Suspense>
      </Canvas>
      <Loader />

      {/* Local Player Stats Overlay - Modern Gamified UI */}
      <div className="fixed bottom-32 left-8 pointer-events-none select-none z-50 flex flex-col gap-4 font-mono">
        <div className="flex items-end gap-3">
          <div className="bg-black/60 border-l-4 border-tech-cyan p-4 backdrop-blur-md">
            <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">ARCHIVIST_RANK</div>
            <div className="text-3xl font-black text-white italic tracking-tighter">LVL_{level}</div>
          </div>
          <div className="bg-black/40 p-2 border border-white/5 backdrop-blur-sm">
            <div className="text-[8px] text-gray-400 uppercase tracking-widest">XP_TOTAL</div>
            <div className="text-xs text-tech-cyan font-bold">{xp.toLocaleString()}</div>
          </div>
        </div>

        <div className="w-64 h-1 bg-white/5 relative overflow-hidden">
          <div 
            className="h-full bg-tech-cyan shadow-[0_0_10px_#00f0ff] transition-all duration-700"
            style={{ width: `${(xp % 500) / 5}%` }}
          />
        </div>
        
        <div className="flex items-center gap-2">
           <div className={`w-2 h-2 rounded-full ${energy > 20 ? 'bg-tech-cyan animate-pulse' : 'bg-red-500 shadow-[0_0_10px_red]'}`} />
           <span className="text-[10px] text-white/40 uppercase tracking-[0.3em]">Neural_Sync_Active</span>
        </div>
      </div>
    </>
  );
};
