
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

// Hotlinked asset for the Castle Start screen
const START_SCREEN_IMG = 'https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?auto=format&fit=crop&q=80&w=2000'; // Placeholder for Image 3

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
    <div className="relative w-full h-full bg-black overflow-hidden select-none">
      {!gameStarted ? (
        <>
          {!showSync ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center font-mono cursor-pointer" onClick={() => setShowSync(true)}>
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] scale-110 hover:scale-100"
                style={{ backgroundImage: `url(${START_SCREEN_IMG})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80" />
              <div className="absolute inset-0 bg-blue-900/10 mix-blend-overlay" />
              
              <div className="relative z-10 text-center px-4">
                <h1 className="text-white text-7xl md:text-9xl font-bold tracking-[0.5em] mb-4 uppercase drop-shadow-[0_0_30px_rgba(0,240,255,0.8)] italic">
                  AETHERIA
                </h1>
                <p className="text-tech-cyan text-sm tracking-[1em] mb-32 opacity-80 ml-[1em]">ARCHIVAL_PROTOCOL_0.9.1</p>
                
                <div className="animate-pulse">
                  <span className="text-tech-cyan text-2xl tracking-[0.6em] font-bold drop-shadow-[0_0_10px_#00f0ff] uppercase">
                    PRESS START TO INITIALIZE
                  </span>
                </div>
              </div>
              
              <div className="absolute bottom-12 flex gap-12 text-[9px] text-gray-500 tracking-[0.3em] uppercase opacity-60">
                <span>SECURE_LINK: STABLE</span>
                <span>MULTIPLAYER: ENABLED</span>
                <span>VERSION: ALPHA_BUILD</span>
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
