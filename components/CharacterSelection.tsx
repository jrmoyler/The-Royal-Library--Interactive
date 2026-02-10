
import React, { useState } from 'react';
import { useGameStore } from '../store';

// Asset Mapping based on the provided images
const ASSETS = {
  // Image 11/2 style: Library interior with central light pillar
  BACKGROUND: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=2000', 
  // Image 1/5 style: Techno-Mage with Staff
  MAGE: 'https://images.unsplash.com/photo-1635322966219-b75ed372eb01?auto=format&fit=crop&q=80&w=800', 
  // Image 9 style: Void Scout with Hood/Daggers
  SCOUT: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800', 
  // Image 6/10 style: Core Guard with Heavy Plate/Sword
  GUARDIAN: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800', 
};

const COLORS = [
  { name: 'TECH CYAN', hex: '#00f0ff' },
  { name: 'NEURAL PINK', hex: '#ff0055' },
  { name: 'VOID PURPLE', hex: '#764abc' },
  { name: 'ENERGY GOLD', hex: '#ffaa00' },
  { name: 'ACID GREEN', hex: '#ccff00' },
  { name: 'PLASMA RED', hex: '#ff3333' },
];

const AVATARS = [
  { id: 'mage', name: 'TECHNO MAGE', description: 'Data-stream archivist specialized in energetic archival manipulation.', image: ASSETS.MAGE },
  { id: 'scout', name: 'VOID SCOUT', description: 'Deep-layer infiltrator optimized for rapid retrieval and stealth archival.', image: ASSETS.SCOUT },
  { id: 'guardian', name: 'CORE GUARD', description: 'Sentinel of the Aetheria. Maximum neural shielding for heavy sector defense.', image: ASSETS.GUARDIAN },
];

interface CharacterSelectionProps {
  onStart: () => void;
}

export const CharacterSelection: React.FC<CharacterSelectionProps> = ({ onStart }) => {
  const { playerColor, setPlayerColor, playerAvatar, setPlayerAvatar } = useGameStore();
  const selectedAvatar = AVATARS.find(a => a.id === playerAvatar) || AVATARS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-mono overflow-hidden">
      {/* Background with blurred library interior (Image 11 style) */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105"
        style={{ backgroundImage: `url(${ASSETS.BACKGROUND})`, filter: 'brightness(0.15) blur(10px)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

      <div className="max-w-7xl w-full grid md:grid-cols-12 gap-0 border border-tech-cyan/10 bg-tech-slate/90 backdrop-blur-3xl shadow-[0_0_100px_rgba(0,0,0,1)] relative overflow-hidden rounded-lg">
        
        {/* LEFT: Cinematic Character Display (Matching platform view in Image 1) */}
        <div className="md:col-span-7 relative border-r border-tech-cyan/5 bg-black/40 flex items-center justify-center p-12 overflow-hidden">
          {/* Circular Platform Visual (Image 1 style) */}
          <div className="absolute bottom-[-10%] w-[80%] aspect-square bg-tech-cyan/5 rounded-full blur-[80px] opacity-40 animate-pulse" />
          <div className="absolute bottom-[10%] w-[60%] h-[20%] border border-tech-cyan/20 rounded-[100%] scale-y-[0.3] shadow-[0_0_40px_rgba(0,240,255,0.1)]" />
          
          <img 
            key={selectedAvatar.id}
            src={selectedAvatar.image} 
            alt={selectedAvatar.name}
            className="h-[90%] w-auto object-contain drop-shadow-[0_0_80px_rgba(0,240,255,0.25)] animate-float-slow z-10"
          />

          {/* Holographic Labels */}
          <div className="absolute top-12 left-12 flex flex-col gap-1 opacity-60">
            <span className="text-tech-cyan text-[10px] tracking-[0.5em] font-black uppercase">SUBJECT_PREVIEW</span>
            <div className="w-32 h-[1px] bg-tech-cyan/30" />
            <span className="text-white text-[8px] tracking-[0.2em]">NODE_SYNC_STATUS: OPTIMAL</span>
          </div>

          <div className="absolute bottom-12 left-12 right-12 z-20">
             <div className="flex items-center gap-4 mb-3">
                <div className="w-1.5 h-8 bg-tech-cyan shadow-[0_0_15px_#00f0ff]" />
                <h2 className="text-white text-3xl font-black tracking-tighter italic uppercase">{selectedAvatar.name}</h2>
             </div>
             <p className="text-[11px] text-gray-400 uppercase tracking-widest leading-relaxed max-w-sm border-l border-white/10 pl-4">{selectedAvatar.description}</p>
          </div>
        </div>

        {/* RIGHT: Configuration Terminal */}
        <div className="md:col-span-5 p-16 flex flex-col justify-between">
          <header className="mb-12">
            <h1 className="text-tech-cyan text-4xl font-black tracking-[0.3em] italic uppercase drop-shadow-[0_0_10px_rgba(0,240,255,0.4)]">
              INIT_SYNC
            </h1>
            <div className="h-[2px] w-32 bg-tech-cyan mt-4 shadow-[0_0_10px_#00f0ff]" />
          </header>

          <div className="space-y-14">
            {/* Class Selection List */}
            <div>
              <h3 className="text-white text-[11px] font-black tracking-[0.4em] mb-6 uppercase opacity-40">SELECT_ARCHIVE_FREQUENCY</h3>
              <div className="flex flex-col gap-3">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() => setPlayerAvatar(avatar.id)}
                    className={`
                      group relative w-full py-5 px-6 border transition-all duration-500 flex items-center justify-between
                      ${playerAvatar === avatar.id 
                        ? 'border-tech-cyan bg-tech-cyan/5 text-tech-cyan' 
                        : 'border-white/5 bg-white/5 text-gray-600 hover:border-white/20 hover:text-white'}
                    `}
                  >
                    <span className="text-xs font-bold tracking-[0.3em] uppercase">{avatar.name}</span>
                    <span className="text-[9px] opacity-40 font-mono">LINK_0{AVATARS.indexOf(avatar)+1}</span>
                    {playerAvatar === avatar.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-tech-cyan shadow-[0_0_15px_#00f0ff]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Neural Spectrum Selection */}
            <div>
              <h3 className="text-white text-[11px] font-black tracking-[0.4em] mb-6 uppercase opacity-40">CORE_ENERGY_OUTPUT</h3>
              <div className="grid grid-cols-6 gap-5">
                {COLORS.map((color) => (
                  <button
                    key={color.hex}
                    onClick={() => setPlayerColor(color.hex)}
                    className={`
                      aspect-square border-2 transition-all duration-300 relative group
                      ${playerColor === color.hex ? 'border-white scale-125 shadow-[0_0_30px_rgba(255,255,255,0.3)]' : 'border-white/10 hover:border-white/30'}
                    `}
                  >
                    <div className="absolute inset-1" style={{ backgroundColor: color.hex }} />
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-16 space-y-6">
            <button
              onClick={onStart}
              className="w-full py-6 bg-tech-cyan hover:bg-white text-black font-black tracking-[1em] transition-all transform hover:-translate-y-1 active:translate-y-0 relative overflow-hidden group shadow-[0_0_40px_rgba(0,240,255,0.3)]"
            >
              <span className="relative z-10 text-sm">INITIALIZE_LINK</span>
              <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            </button>
            <div className="flex justify-between items-center text-[8px] text-gray-500 tracking-[0.5em] uppercase opacity-40">
               <span>LATENCY: 12ms</span>
               <span>SYNC_NODE: AETHER-07</span>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-tech-cyan/5 -translate-x-4 translate-y-4 pointer-events-none" />
      </div>

      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) scale(1); filter: brightness(1); }
          50% { transform: translateY(-15px) scale(1.02); filter: brightness(1.2); }
        }
        .animate-float-slow { animation: float-slow 10s ease-in-out infinite; }
      `}</style>
    </div>
  );
};
