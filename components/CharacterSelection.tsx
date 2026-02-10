
import React from 'react';
import { useGameStore } from '../store';

const COLORS = [
  { name: 'TECH CYAN', hex: '#00f0ff' },
  { name: 'NEURAL PINK', hex: '#ff0055' },
  { name: 'VOID PURPLE', hex: '#764abc' },
  { name: 'ENERGY GOLD', hex: '#ffaa00' },
  { name: 'ACID GREEN', hex: '#ccff00' },
  { name: 'PLASMA RED', hex: '#ff3333' },
];

const AVATARS = [
  { id: 'mage', name: 'TECH MAGE', description: 'Master of data streams. Equipped with a pulse staff.' },
  { id: 'scout', name: 'VOID SCOUT', description: 'Agile explorer. Integrated with reconnaissance drones.' },
  { id: 'guardian', name: 'CORE GUARD', description: 'Sturdy sentinel. Heavy armor for deep-layer archives.' },
];

interface CharacterSelectionProps {
  onStart: () => void;
}

export const CharacterSelection: React.FC<CharacterSelectionProps> = ({ onStart }) => {
  const { playerColor, setPlayerColor, playerAvatar, setPlayerAvatar } = useGameStore();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 font-mono overflow-y-auto">
      <div className="max-w-2xl w-full border border-tech-cyan/20 bg-tech-slate/90 p-10 shadow-[0_0_80px_rgba(0,240,255,0.05)] relative overflow-hidden">
        
        {/* Decorative corner lines */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-tech-cyan/40" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-tech-cyan/40" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-tech-cyan/40" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-tech-cyan/40" />

        <header className="mb-10 text-center">
          <h1 className="text-tech-cyan text-4xl font-bold tracking-[0.4em] mb-4 uppercase drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">
            AETHERIA_SYNC
          </h1>
          <div className="h-0.5 w-32 bg-tech-cyan mx-auto mb-4 opacity-30" />
          <p className="text-gray-400 text-[10px] tracking-widest uppercase">Select class and frequency to initialize neural link</p>
        </header>

        <div className="grid md:grid-cols-2 gap-12 mb-12">
          {/* Avatar Selection Column */}
          <div>
            <h3 className="text-white text-xs font-bold tracking-[0.2em] mb-6 border-b border-white/10 pb-2 uppercase">Neural_Class</h3>
            <div className="space-y-3">
              {AVATARS.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => setPlayerAvatar(avatar.id)}
                  className={`
                    w-full text-left p-4 border transition-all duration-300 relative group
                    ${playerAvatar === avatar.id 
                      ? 'border-tech-cyan bg-tech-cyan/5 shadow-[0_0_15px_rgba(0,240,255,0.1)]' 
                      : 'border-white/5 bg-white/2 hover:border-white/20 hover:bg-white/5'}
                  `}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-xs font-bold tracking-widest ${playerAvatar === avatar.id ? 'text-tech-cyan' : 'text-gray-400'}`}>
                      {avatar.name}
                    </span>
                    {playerAvatar === avatar.id && (
                      <div className="w-1.5 h-1.5 bg-tech-cyan rounded-full animate-pulse" />
                    )}
                  </div>
                  <p className="text-[9px] leading-relaxed text-gray-500 uppercase tracking-tighter">
                    {avatar.description}
                  </p>
                  {playerAvatar === avatar.id && (
                    <div className="absolute inset-y-0 left-0 w-1 bg-tech-cyan" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection Column */}
          <div>
            <h3 className="text-white text-xs font-bold tracking-[0.2em] mb-6 border-b border-white/10 pb-2 uppercase">Sync_Frequency</h3>
            <div className="grid grid-cols-3 gap-3">
              {COLORS.map((color) => (
                <button
                  key={color.hex}
                  onClick={() => setPlayerColor(color.hex)}
                  className={`
                    aspect-square border transition-all duration-300 flex flex-col items-center justify-center gap-2
                    ${playerColor === color.hex 
                      ? 'border-white bg-white/10' 
                      : 'border-white/5 bg-white/2 hover:border-white/20'}
                  `}
                >
                  <div 
                    className="w-6 h-6 rounded-full"
                    style={{ 
                        backgroundColor: color.hex,
                        boxShadow: playerColor === color.hex ? `0 0 20px ${color.hex}` : 'none'
                    }}
                  />
                  <span className={`text-[8px] font-bold tracking-tighter ${playerColor === color.hex ? 'text-white' : 'text-gray-600'}`}>
                    {color.name.split(' ')[1]}
                  </span>
                </button>
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-black/40 border border-white/5 text-[9px] text-gray-400 uppercase leading-normal">
              <span className="text-tech-cyan font-bold block mb-1">Terminal Status:</span>
              Hardware Check... OK<br/>
              Neural Latency... 12ms<br/>
              Identity Verified... [USER_ID: 0x892]
            </div>
          </div>
        </div>

        <button
          onClick={onStart}
          className="w-full py-5 bg-tech-cyan/10 hover:bg-tech-cyan/20 border border-tech-cyan text-tech-cyan font-bold tracking-[0.5em] transition-all hover:shadow-[0_0_40px_rgba(0,240,255,0.15)] group relative overflow-hidden"
        >
          <span className="relative z-10">INITIALIZE_CONNECTION</span>
          <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-tech-cyan/20 to-transparent" />
        </button>

        <footer className="mt-8 text-[9px] text-center text-gray-700 uppercase tracking-[0.3em]">
          Encrypted P2P Session // Aetheria protocol v4.2.0 // Node: SG-7
        </footer>
      </div>
    </div>
  );
};
