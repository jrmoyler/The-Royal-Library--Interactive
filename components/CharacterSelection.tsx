
import React, { useState } from 'react';
import { useGameStore } from '../store';

// Asset Mapping to the provided concept images
const ASSETS = {
  BACKGROUND: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=2000', // Image 2/11 Style
  MAGE: 'https://images.unsplash.com/photo-1635322966219-b75ed372eb01?auto=format&fit=crop&q=80&w=800', // Image 5 Style
  SCOUT: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800', // Image 9 Style
  GUARDIAN: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800', // Image 6/10 Style
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
  { id: 'mage', name: 'TECHNO MAGE', description: 'ARCHIVAL CASTER: Mastery over raw data streams and encrypted energy pulses.', image: ASSETS.MAGE },
  { id: 'scout', name: 'VOID SCOUT', description: 'INFILTRATION UNIT: High mobility specialist with dual neural daggers for core extraction.', image: ASSETS.SCOUT },
  { id: 'guardian', name: 'CORE GUARD', description: 'HEAVY SENTINEL: Maximum shielding for high-risk archival restoration missions.', image: ASSETS.GUARDIAN },
];

interface CharacterSelectionProps {
  onStart: () => void;
}

export const CharacterSelection: React.FC<CharacterSelectionProps> = ({ onStart }) => {
  const { playerColor, setPlayerColor, playerAvatar, setPlayerAvatar } = useGameStore();
  const selectedAvatar = AVATARS.find(a => a.id === playerAvatar) || AVATARS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-mono overflow-hidden">
      {/* Dynamic Cinematic Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url(${ASSETS.BACKGROUND})`, filter: 'brightness(0.2) blur(8px) contrast(1.2)' }}
      />
      <div className="absolute inset-0 bg-black/40" />

      <div className="max-w-6xl w-full grid md:grid-cols-12 gap-0 border border-tech-cyan/20 bg-tech-slate/90 backdrop-blur-2xl shadow-[0_0_150px_rgba(0,0,0,0.9)] relative overflow-hidden rounded-sm">
        
        {/* Left: HD Character Preview Window */}
        <div className="md:col-span-6 relative border-r border-tech-cyan/10 bg-black/60 flex items-center justify-center p-0 group overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.15)_0%,transparent_80%)]" />
          
          {/* Scanning lines effect overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_4px,3px_100%]" />

          <img 
            key={selectedAvatar.id}
            src={selectedAvatar.image} 
            alt={selectedAvatar.name}
            className="h-[85%] w-auto object-contain drop-shadow-[0_0_60px_rgba(0,240,255,0.2)] animate-glitch-float"
          />
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-10">
             <div className="flex items-center gap-4 mb-2">
                <div className="w-1 h-6 bg-tech-cyan shadow-[0_0_10px_#00f0ff]" />
                <h2 className="text-white text-2xl font-bold tracking-[0.25em] uppercase">{selectedAvatar.name}</h2>
             </div>
             <p className="text-[11px] text-gray-400 uppercase tracking-widest leading-relaxed max-w-sm">{selectedAvatar.description}</p>
          </div>

          {/* Corner decoration */}
          <div className="absolute top-4 right-4 flex flex-col items-end opacity-40">
            <span className="text-[8px] text-tech-cyan">NODE_X_042</span>
            <div className="w-24 h-[1px] bg-tech-cyan/30 mt-1" />
          </div>
        </div>

        {/* Right: Configuration Panel */}
        <div className="md:col-span-6 p-12 flex flex-col justify-between">
          <header className="mb-12">
            <div className="flex items-center justify-between">
              <h1 className="text-tech-cyan text-4xl font-black tracking-[0.4em] italic drop-shadow-[0_0_10px_rgba(0,240,255,0.3)]">
                SYNC_NODE
              </h1>
              <div className="text-[9px] text-gray-500 border border-gray-800 px-2 py-1">ALPHA_0.9</div>
            </div>
            <div className="h-[2px] w-full bg-gradient-to-r from-tech-cyan/60 to-transparent mt-4" />
          </header>

          <div className="space-y-12">
            {/* Class Selection Grid */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white text-xs font-bold tracking-[0.3em] uppercase opacity-80 underline underline-offset-8 decoration-tech-cyan/40">SELECT_FREQUENCY</h3>
                <span className="text-[9px] text-tech-cyan/60 font-mono">ENCRYPTED_SIGNAL_STRENGTH: 98%</span>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() => setPlayerAvatar(avatar.id)}
                    className={`
                      group flex items-center justify-between p-4 border transition-all duration-300 relative overflow-hidden
                      ${playerAvatar === avatar.id 
                        ? 'border-tech-cyan bg-tech-cyan/10 text-tech-cyan shadow-[0_0_20px_rgba(0,240,255,0.1)]' 
                        : 'border-white/10 bg-white/5 text-gray-500 hover:border-white/30 hover:text-gray-300'}
                    `}
                  >
                    <span className="text-xs font-bold tracking-[0.2em]">{avatar.name}</span>
                    <span className="text-[9px] opacity-40">{avatar.id.toUpperCase()}_LINK_STABLE</span>
                    {playerAvatar === avatar.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-tech-cyan shadow-[0_0_10px_#00f0ff]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Neural Color Spectrum */}
            <div>
              <h3 className="text-white text-xs font-bold tracking-[0.3em] mb-6 uppercase opacity-80 underline underline-offset-8 decoration-tech-cyan/40">ENERGY_SPECTRUM</h3>
              <div className="grid grid-cols-6 gap-4">
                {COLORS.map((color) => (
                  <button
                    key={color.hex}
                    onClick={() => setPlayerColor(color.hex)}
                    className={`
                      aspect-square border-2 transition-all duration-300 relative group
                      ${playerColor === color.hex ? 'border-white scale-110 shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'border-white/10 hover:border-white/30'}
                    `}
                  >
                    <div className="absolute inset-1" style={{ backgroundColor: color.hex }} />
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-16 space-y-4">
            <button
              onClick={onStart}
              className="w-full py-6 bg-tech-cyan hover:bg-white text-black font-black tracking-[0.8em] transition-all transform hover:-translate-y-1 active:translate-y-0 relative overflow-hidden group shadow-[0_0_30px_rgba(0,240,255,0.2)] rounded-sm"
            >
              <span className="relative z-10 text-sm">INITIALIZE_NEURAL_LINK</span>
              <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            </button>
            <p className="text-[9px] text-gray-500 text-center tracking-[0.2em] uppercase opacity-40">Connecting to archival cloud node... Please remain still.</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes glitch-float {
          0%, 100% { transform: translateY(0) scale(1); filter: brightness(1) contrast(1); }
          33% { transform: translateY(-15px) scale(1.01); filter: brightness(1.1) contrast(1.1); }
          66% { transform: translateY(-5px) scale(0.99); filter: brightness(0.9) contrast(0.9); }
        }
        .animate-glitch-float { animation: glitch-float 8s ease-in-out infinite; }
      `}</style>
    </div>
  );
};
