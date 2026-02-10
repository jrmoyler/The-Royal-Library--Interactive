
import React, { useEffect, useState } from 'react';
import { KeyboardControls } from '@react-three/drei';
import { insertCoin, myPlayer } from 'playroomkit';
import { Scene } from './components/Scene';
import { HUD } from './components/HUD';
import { CharacterSelection } from './components/CharacterSelection';
import { useGameStore } from './store';

const keyboardMap = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  { name: 'jump', keys: ['Space'] },
  { name: 'run', keys: ['Shift'] },
];

const START_SCREEN_IMG = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=2000'; // Placeholder for Image 3

const App: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [showSync, setShowSync] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const { setMultiplayerReady, playerColor, playerAvatar } = useGameStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStart = async () => {
    try {
      await insertCoin({ skipLobby: true }); 
      const player = myPlayer();
      if (player) {
        player.setState('color', playerColor, true);
        player.setState('avatar', playerAvatar, true);
        player.setState('profileColor', playerColor, true);
      }
      setMultiplayerReady(true);
      setGameStarted(true);
    } catch (error) {
      setGameStarted(true);
    }
  };

  if (!mounted) return null;

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {!gameStarted ? (
        <>
          {!showSync ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${START_SCREEN_IMG})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              
              <div className="relative z-10 text-center px-4">
                <h1 className="text-white text-6xl md:text-8xl font-bold tracking-[0.4em] mb-4 uppercase drop-shadow-[0_0_20px_rgba(0,240,255,0.6)]">
                  AETHERIA
                </h1>
                <p className="text-tech-cyan text-sm tracking-[0.8em] mb-24 opacity-80">ARCHIVAL_PROTOCOL_V.4.2</p>
                
                <button 
                  onClick={() => setShowSync(true)}
                  className="group relative px-12 py-4 border border-tech-cyan/40 hover:border-tech-cyan transition-all"
                >
                  <span className="text-tech-cyan text-xl tracking-[0.4em] group-hover:text-white transition-colors">PRESS START</span>
                  <div className="absolute inset-0 bg-tech-cyan/5 group-hover:bg-tech-cyan/20 animate-pulse" />
                </button>
              </div>
              
              <div className="absolute bottom-8 text-[10px] text-gray-500 tracking-widest uppercase opacity-40">
                P2P_ENCRYPTED_SESSION // MULTIPLAYER_READY
              </div>
            </div>
          ) : (
            <CharacterSelection onStart={handleStart} />
          )}
        </>
      ) : (
        <KeyboardControls map={keyboardMap}>
          <Scene />
          <HUD />
        </KeyboardControls>
      )}
    </div>
  );
};

export default App;
