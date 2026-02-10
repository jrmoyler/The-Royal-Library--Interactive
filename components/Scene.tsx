
import React, { Suspense } from 'react';
import { Canvas, ThreeElements } from '@react-three/fiber';
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
  const { isMultiplayerReady, xp, level, energy, playerAvatar, playerColor } = useGameStore();

  return (
    <>
      <Canvas 
        shadows 
        gl={{ antialias: true, shadowMapType: THREE.PCFSoftShadowMap }}
        camera={{ position: [0, 5, 12], fov: 45 }}
      >
        <Suspense fallback={null}>
            <color attach="background" args={['#020408']} />
            <fog attach="fog" args={['#020408', 5, 35]} />
            
            <Environment preset="night" background={false} />
            <ambientLight intensity={0.1} />
            <pointLight position={[10, 10, 10]} intensity={3} color="#00f0ff" castShadow />

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

            <Stars radius={100} depth={50} count={3000} factor={4} saturation={0.5} fade speed={0.5} />

            <EffectComposer enableNormalPass multisampling={4}>
                <SSAO samples={16} radius={2} intensity={15} luminanceInfluence={0.6} color={new THREE.Color("#000000")} />
                <Bloom luminanceThreshold={0.9} mipmapBlur intensity={1.5} radius={0.4} />
                <Vignette darkness={1.1} offset={0.3} />
            </EffectComposer>
        </Suspense>
      </Canvas>
      <Loader />

      {/* --- PLAYER STATISTICS OVERLAY --- */}
      <div className="fixed bottom-12 left-12 pointer-events-none select-none z-50 flex flex-col gap-6 font-mono w-80">
        
        {/* Profile Card Style (Matching Image 1/5 character frame) */}
        <div className="flex items-start gap-4">
          <div className="relative">
            {/* Class Icon / Avatar Placeholder */}
            <div className="w-16 h-16 bg-tech-slate/80 border-2 border-tech-cyan/40 backdrop-blur-xl flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-tech-cyan/5 animate-pulse" />
               <div className="w-10 h-10 border border-tech-cyan/20 rotate-45" />
               <span className="absolute text-[8px] text-tech-cyan/60 top-1 left-1">NODE_ID</span>
            </div>
            {/* Level Badge */}
            <div className="absolute -bottom-2 -right-2 bg-tech-cyan text-black px-2 py-0.5 text-[10px] font-black italic shadow-[0_0_15px_#00f0ff]">
              LVL_{level}
            </div>
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-white text-lg font-black tracking-widest italic">{playerAvatar.toUpperCase()}</span>
              <span className="text-[9px] text-tech-cyan/60 tracking-[0.2em]">CONNECTED</span>
            </div>
            <div className="h-0.5 w-full bg-tech-cyan/20 relative">
               <div className="absolute inset-0 bg-tech-cyan shadow-[0_0_10px_#00f0ff]" style={{ width: '100%' }} />
            </div>
            <div className="flex justify-between text-[9px] text-gray-500 uppercase">
              <span>Sync_Stability</span>
              <span>98.4%</span>
            </div>
          </div>
        </div>

        {/* Vital Stats Group */}
        <div className="space-y-4 bg-black/40 p-4 border border-white/5 backdrop-blur-md">
           {/* Energy / Suit Integrity */}
           <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] tracking-[0.2em] font-bold">
                 <span className="text-gray-400">NEURAL_SYNC</span>
                 <span className={energy < 25 ? 'text-red-500 animate-pulse' : 'text-tech-cyan'}>{Math.round(energy)}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 relative overflow-hidden">
                 <div 
                   className={`h-full transition-all duration-300 ${energy < 25 ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-tech-cyan shadow-[0_0_10px_#00f0ff]'}`}
                   style={{ width: `${energy}%` }}
                 />
              </div>
           </div>

           {/* XP Progress */}
           <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] tracking-[0.2em] font-bold">
                 <span className="text-gray-400">ARCHIVAL_XP</span>
                 <span className="text-white">{xp % 500} / 500</span>
              </div>
              <div className="h-1 w-full bg-white/5 relative">
                 <div 
                   className="h-full bg-white/60 transition-all duration-1000"
                   style={{ width: `${(xp % 500) / 5}%` }}
                 />
              </div>
           </div>
        </div>

        {/* Decorative System Log */}
        <div className="text-[8px] text-tech-cyan/30 uppercase tracking-[0.4em] leading-relaxed">
           SCANNING_CELL_X_42...<br/>
           FRAGMENT_SYNC_STABLE<br/>
           AETHERIA_LINK_0.9.1
        </div>
      </div>
    </>
  );
};
