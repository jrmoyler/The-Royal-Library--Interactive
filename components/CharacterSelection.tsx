
import React, { useState } from 'react';
import { useGameStore } from '../store';

const ASSETS = {
  BACKGROUND: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=2000', 
  MAGE: 'https://images.unsplash.com/photo-1635322966219-b75ed372eb01?auto=format&fit=crop&q=80&w=800', 
  SCOUT: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800', 
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
  { id: 'mage', name: 'TECHNO MAGE', description: 'Data-stream archivist specialized in energetic archival manipulation.', image: ASSETS.MAGE, stats: { sync: 95, mobility: 60, shield: 40 } },
  { id: 'scout', name: 'VOID SCOUT', description: 'Deep-layer infiltrator optimized for rapid retrieval and stealth archival.', image: ASSETS.SCOUT, stats: { sync: 45, mobility: 95, shield: 30 } },
  { id: 'guardian', name: 'CORE GUARD', description: 'Sentinel of the Aetheria. Maximum neural shielding for heavy sector defense.', image: ASSETS.GUARDIAN, stats: { sync: 60, mobility: 40, shield: 95 } },
];

interface CharacterSelectionProps {
  onStart: () => void;
}

export const CharacterSelection: React.FC<CharacterSelectionProps> = ({ onStart }) => {
  const { playerColor, setPlayerColor, playerAvatar, setPlayerAvatar } = useGameStore();
  const selectedAvatar = AVATARS.find(a => a.id === playerAvatar) || AVATARS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-mono overflow-hidden bg-black">
      {/* Background with blurred library interior */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105 opacity-30"
        style={{ backgroundImage: `url(${ASSETS.BACKGROUND})`, filter: 'blur(8px)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />

      {/* Main UI Container */}
      <div className="max-w-6xl w-full grid md:grid-cols-12 gap-0 border border-tech-cyan/20 bg-tech-slate/95 backdrop-blur-3xl shadow-[0_0_100px_rgba(0,240,255,0.1)] relative overflow-hidden rounded-sm ring-1 ring-white/5">
        
        {/* Decorative Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-5" style={{ backgroundImage: 'radial-gradient(#00f0ff 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />

        {/* LEFT: Cinematic Character Display */}
        <div className="md:col-span-7 relative border-r border-tech-cyan/10 bg-black/60 flex items-center justify-center p-8 overflow-hidden min-h-[500px]">
          {/* Animated Glow Base */}
          <div className="absolute bottom-[-10%] w-[80%] aspect-square bg-tech-cyan/10 rounded-full blur-[100px] opacity-60 animate-pulse" style={{ backgroundColor: `${playerColor}22` }} />
          
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
            <img 
              key={selectedAvatar.id}
              src={selectedAvatar.image} 
              alt={selectedAvatar.name}
              className="h-[80%] w-auto object-contain drop-shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-float-slow transition-all duration-700 hover:scale-105"
            />
            
            {/* Holographic Stats HUD */}
            <div className="absolute top-8 right-8 text-right space-y-4 opacity-80 hidden lg:block">
              {Object.entries(selectedAvatar.stats).map(([key, val]) => (
                <div key={key} className="space-y-1">
                  <div className="text-[8px] text-gray-500 tracking-widest uppercase">{key}_INDEX</div>
                  <div className="flex gap-1 justify-end">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className={`w-3 h-1 ${i < val/10 ? '' : 'bg-white/5'}`} style={{ backgroundColor: i < val/10 ? playerColor : undefined }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-12 left-12 right-12 z-20">
             <div className="flex items-center gap-3 mb-2">
                <div className="w-1 h-6 shadow-[0_0_15px_currentColor]" style={{ backgroundColor: playerColor, color: playerColor }} />
                <h2 className="text-white text-3xl font-black tracking-tight italic uppercase">{selectedAvatar.name}</h2>
             </div>
             <p className="text-[10px] text-gray-400 uppercase tracking-widest leading-relaxed max-w-sm border-l border-white/10 pl-4">{selectedAvatar.description}</p>
          </div>
        </div>

        {/* RIGHT: Configuration Terminal */}
        <div className="md:col-span-5 p-12 flex flex-col justify-between bg-tech-slate/40">
          <div>
            <header className="mb-10">
              <div className="flex justify-between items-end mb-2">
                <h1 className="text-white text-xl font-black tracking-[0.2em] uppercase">SYSTEM_INITIALIZE</h1>
                <span className="text-[8px] text-tech-cyan animate-pulse">AUTH: GRANTED</span>
              </div>
              <div className="h-[1px] w-full bg-white/10 relative">
                <div className="absolute inset-0 h-full w-1/3 shadow-[0_0_10px_currentColor]" style={{ backgroundColor: playerColor, color: playerColor }} />
              </div>
            </header>

            <div className="space-y-10">
              {/* Class Selection */}
              <div>
                <h3 className="text-gray-500 text-[9px] font-black tracking-[0.4em] mb-4 uppercase">CORE_ARCHIVE_ROLE</h3>
                <div className="grid gap-2">
                  {AVATARS.map((avatar) => (
                    <button
                      key={avatar.id}
                      onClick={() => setPlayerAvatar(avatar.id)}
                      className={`
                        group relative w-full py-4 px-5 border transition-all duration-300 flex items-center justify-between overflow-hidden
                        ${playerAvatar === avatar.id 
                          ? 'border-white/20 bg-white/5 text-white' 
                          : 'border-white/5 bg-transparent text-gray-500 hover:border-white/10 hover:text-gray-300'}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full transition-all duration-300 ${playerAvatar === avatar.id ? 'scale-110 shadow-[0_0_10px_currentColor]' : 'scale-75 opacity-20'}`} style={{ backgroundColor: playerColor, color: playerColor }} />
                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase">{avatar.name}</span>
                      </div>
                      <span className="text-[8px] opacity-40 font-mono">FRQ_{AVATARS.indexOf(avatar)+1}</span>
                      {playerAvatar === avatar.id && (
                        <div className="absolute inset-0 bg-white/5 pointer-events-none" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <h3 className="text-gray-500 text-[9px] font-black tracking-[0.4em] mb-4 uppercase">NEURAL_SPECTRUM</h3>
                <div className="grid grid-cols-6 gap-3">
                  {COLORS.map((color) => (
                    <button
                      key={color.hex}
                      onClick={() => setPlayerColor(color.hex)}
                      className={`
                        aspect-square border transition-all duration-300 relative overflow-hidden
                        ${playerColor === color.hex ? 'border-white scale-110 shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'border-white/5 hover:border-white/20'}
                      `}
                    >
                      <div className="absolute inset-1" style={{ backgroundColor: color.hex }} />
                      {playerColor === color.hex && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-1 h-1 bg-white rounded-full" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 space-y-4">
            <button
              onClick={onStart}
              className="w-full py-5 bg-white hover:bg-tech-cyan text-black font-black tracking-[0.8em] transition-all transform hover:-translate-y-0.5 active:translate-y-0 relative overflow-hidden group uppercase shadow-2xl"
            >
              <span className="relative z-10 text-[11px]">LOAD_FRAGMENTS</span>
              <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-black/10 to-transparent" />
            </button>
            <div className="flex justify-between items-center text-[7px] text-gray-600 tracking-[0.4em] uppercase opacity-60">
               <span>NODES: 1,024 ACTIVE</span>
               <span>LOC: SECTOR_07</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
      `}</style>
    </div>
  );
};
