
import React, { useState } from 'react';
import { useGameStore } from '../store';

// Asset Mapping
const ASSETS = {
  BACKGROUND: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=2000', // Placeholder for Image 2
  MAGE: 'https://images.unsplash.com/photo-1635322966219-b75ed372eb01?auto=format&fit=crop&q=80&w=800', // Placeholder for Image 5
  SCOUT: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800', // Placeholder for Image 9
  GUARDIAN: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800', // Placeholder for Image 10
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
  { id: 'mage', name: 'TECHNO MAGE', description: 'Master of data streams. Equipped with a pulse staff.', image: ASSETS.MAGE },
  { id: 'scout', name: 'VOID SCOUT', description: 'Agile explorer. Integrated with dual energy daggers.', image: ASSETS.SCOUT },
  { id: 'guardian', name: 'CORE GUARD', description: 'Sturdy sentinel. Heavy armor for deep-layer archives.', image: ASSETS.GUARDIAN },
];

interface CharacterSelectionProps {
  onStart: () => void;
}

export const CharacterSelection: React.FC<CharacterSelectionProps> = ({ onStart }) => {
  const { playerColor, setPlayerColor, playerAvatar, setPlayerAvatar } = useGameStore();
  const selectedAvatar = AVATARS.find(a => a.id === playerAvatar) || AVATARS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-mono overflow-hidden">
      {/* Cinematic Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105"
        style={{ backgroundImage: `url(${ASSETS.BACKGROUND})`, filter: 'brightness(0.3) blur(4px)' }}
      />

      <div className="max-w-5xl w-full grid md:grid-cols-12 gap-0 border border-tech-cyan/30 bg-tech-slate/80 backdrop-blur-xl shadow-[0_0_100px_rgba(0,0,0,0.8)] relative overflow-hidden">
        
        {/* Left: Character Preview */}
        <div className="md:col-span-5 relative border-r border-tech-cyan/10 bg-black/40 flex items-center justify-center p-8 group">
          <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.2)_0%,transparent_70%)]" />
          </div>
          
          <img 
            src={selectedAvatar.image} 
            alt={selectedAvatar.name}
            className="h-full w-auto object-contain drop-shadow-[0_0_30px_rgba(0,240,255,0.3)] animate-float"
          />
          
          <div className="absolute bottom-8 left-8 right-8 bg-black/60 backdrop-blur-md p-4 border-l-2 border-tech-cyan">
             <h2 className="text-tech-cyan text-lg font-bold tracking-[0.2em]">{selectedAvatar.name}</h2>
             <p className="text-[10px] text-gray-400 uppercase mt-1">{selectedAvatar.description}</p>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="md:col-span-7 p-10 flex flex-col justify-between">
          <header className="mb-8">
            <h1 className="text-tech-cyan text-3xl font-bold tracking-[0.3em] mb-2 uppercase italic">
              AETHERIA_SYNC
            </h1>
            <div className="h-0.5 w-24 bg-tech-cyan opacity-50 mb-4" />
            <p className="text-gray-500 text-[9px] tracking-widest uppercase">Select class frequency and synchronize neural link</p>
          </header>

          <div className="space-y-10">
            {/* Class Selection */}
            <div>
              <h3 className="text-white text-[10px] font-bold tracking-[0.2em] mb-4 uppercase opacity-60">Neural_Class_Index</h3>
              <div className="grid grid-cols-3 gap-2">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() => setPlayerAvatar(avatar.id)}
                    className={`
                      py-3 px-2 border transition-all duration-300 text-[10px] font-bold tracking-tighter
                      ${playerAvatar === avatar.id 
                        ? 'border-tech-cyan bg-tech-cyan/10 text-tech-cyan' 
                        : 'border-white/10 bg-white/5 text-gray-500 hover:border-white/30'}
                    `}
                  >
                    {avatar.name.split(' ')[1]}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="text-white text-[10px] font-bold tracking-[0.2em] mb-4 uppercase opacity-60">Energy_Spectrum</h3>
              <div className="grid grid-cols-6 gap-3">
                {COLORS.map((color) => (
                  <button
                    key={color.hex}
                    onClick={() => setPlayerColor(color.hex)}
                    className={`
                      aspect-square border-2 transition-all duration-300 p-1
                      ${playerColor === color.hex ? 'border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'border-transparent hover:border-white/20'}
                    `}
                  >
                    <div className="w-full h-full" style={{ backgroundColor: color.hex }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Status Panel */}
            <div className="p-4 bg-black/40 border border-tech-cyan/10 text-[9px] font-mono text-gray-500 uppercase leading-relaxed">
               <span className="text-tech-cyan">LINK STATUS:</span> READY<br/>
               <span className="text-tech-cyan">NODE:</span> ARC-LIBRARY-07<br/>
               <span className="text-tech-cyan">LATENCY:</span> 14ms
            </div>
          </div>

          <button
            onClick={onStart}
            className="mt-12 w-full py-5 bg-tech-cyan hover:bg-white text-black font-bold tracking-[0.6em] transition-all transform hover:-translate-y-1 active:translate-y-0 relative overflow-hidden group"
          >
            <span className="relative z-10">INITIALIZE_CONNECTION</span>
            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </button>
        </div>

        {/* Decorative corner lines */}
        <div className="absolute top-0 left-0 w-12 h-12 border-t border-l border-tech-cyan/40" />
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b border-r border-tech-cyan/40" />
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-10px) scale(1.02); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
      `}</style>
    </div>
  );
};
