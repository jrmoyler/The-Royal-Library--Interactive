
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

const App: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const { setMultiplayerReady, playerColor, playerAvatar } = useGameStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStart = async () => {
    try {
      await insertCoin({ skipLobby: true }); 
      // Sync the selected color and avatar to Playroom profile
      const player = myPlayer();
      if (player) {
        player.setState('color', playerColor, true);
        player.setState('avatar', playerAvatar, true);
        player.setState('profileColor', playerColor, true);
      }
      setMultiplayerReady(true);
      setGameStarted(true);
    } catch (error) {
      console.error("Failed to initialize Playroom:", error);
      // Fallback for local development
      setGameStarted(true);
    }
  };

  if (!mounted) return null;

  return (
    <div className="relative w-full h-full bg-tech-slate overflow-hidden">
      {!gameStarted ? (
        <CharacterSelection onStart={handleStart} />
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
