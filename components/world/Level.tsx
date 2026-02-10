import React from 'react';
import { RigidBody } from '@react-three/rapier';
import { Box } from '@react-three/drei';

export const Level: React.FC = () => {
  // NOTE: If you have the 'library.glb' file, uncomment the following lines and remove the procedural code below.
  // const { scene } = useGLTF('/models/library.glb');
  
  return (
    <group dispose={null}>
      {/* 
        Procedural "Greybox" Level 
        Used as a fallback since the GLB asset was not found.
      */}
      
      {/* Floor */}
      <RigidBody type="fixed" friction={1}>
        <Box args={[50, 1, 50]} position={[0, -0.5, 0]} receiveShadow>
          <meshStandardMaterial color="#1e293b" />
        </Box>
      </RigidBody>

      {/* Pillars / Walls */}
      <RigidBody type="fixed">
        <group>
            {/* North Wall */}
            <Box args={[50, 10, 2]} position={[0, 5, -24]} receiveShadow castShadow>
                <meshStandardMaterial color="#334155" />
            </Box>
            {/* South Wall */}
            <Box args={[50, 10, 2]} position={[0, 5, 24]} receiveShadow castShadow>
                <meshStandardMaterial color="#334155" />
            </Box>
            {/* East Wall */}
            <Box args={[2, 10, 50]} position={[24, 5, 0]} receiveShadow castShadow>
                <meshStandardMaterial color="#334155" />
            </Box>
            {/* West Wall */}
            <Box args={[2, 10, 50]} position={[-24, 5, 0]} receiveShadow castShadow>
                <meshStandardMaterial color="#334155" />
            </Box>

            {/* Central Pillars */}
            <Box args={[2, 8, 2]} position={[-10, 4, -10]} castShadow receiveShadow>
                <meshStandardMaterial color="#475569" />
            </Box>
            <Box args={[2, 8, 2]} position={[10, 4, -10]} castShadow receiveShadow>
                <meshStandardMaterial color="#475569" />
            </Box>
            <Box args={[2, 8, 2]} position={[-10, 4, 10]} castShadow receiveShadow>
                <meshStandardMaterial color="#475569" />
            </Box>
            <Box args={[2, 8, 2]} position={[10, 4, 10]} castShadow receiveShadow>
                <meshStandardMaterial color="#475569" />
            </Box>
        </group>
      </RigidBody>
    </group>
  );
};
