
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, RapierRigidBody, CapsuleCollider } from '@react-three/rapier';
import { useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';
import { myPlayer } from 'playroomkit';
import { useGameStore } from '../store';

const SPEED = 5;
const RUN_MULTIPLIER = 1.8;
const JUMP_FORCE = 5;

// Tech Mage Base Colors
const C_ARMOR = "#1e293b"; 
const C_SKIN = "#d4aa7d"; 
const C_CLOAK_OUT = "#0f172a"; 

export const Player: React.FC = () => {
  const body = useRef<RapierRigidBody>(null);
  const visualGroup = useRef<THREE.Group>(null);
  const modelInternalGroup = useRef<THREE.Group>(null);
  const capeRef = useRef<THREE.Group>(null);
  const accessoryRef = useRef<THREE.Group>(null);
  
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const { energy, decreaseEnergy, regenerateEnergy, isMultiplayerReady, playerColor, playerAvatar } = useGameStore();

  const C_ACCENT = playerColor;

  useFrame((state, delta) => {
    if (!body.current) return;

    const { forward, backward, left, right, jump, run } = getKeys();
    const velocity = body.current.linvel();
    const translation = body.current.translation();

    const direction = new THREE.Vector3();
    if (forward) direction.z -= 1;
    if (backward) direction.z += 1;
    if (left) direction.x -= 1;
    if (right) direction.x += 1;
    direction.normalize();

    const isMoving = direction.length() > 0;
    const isSprinting = run && isMoving && energy > 0;
    let currentSpeed = SPEED;
    
    if (isSprinting) {
      currentSpeed *= RUN_MULTIPLIER;
      decreaseEnergy(0.5);
    } else {
      const regenRate = isMoving ? 0.25 : 0.1; 
      regenerateEnergy(regenRate);
    }

    const targetVelocityX = direction.x * currentSpeed;
    const targetVelocityZ = direction.z * currentSpeed;
    const currentLerp = isMoving ? 15 : 8;
    const newVelX = THREE.MathUtils.lerp(velocity.x, targetVelocityX, 1 - Math.exp(-currentLerp * delta));
    const newVelZ = THREE.MathUtils.lerp(velocity.z, targetVelocityZ, 1 - Math.exp(-currentLerp * delta));

    body.current.setLinvel({ x: newVelX, y: velocity.y, z: newVelZ }, true);

    if (jump && Math.abs(velocity.y) < 0.1) {
       body.current.applyImpulse({ x: 0, y: JUMP_FORCE, z: 0 }, true);
    }

    if (visualGroup.current && modelInternalGroup.current) {
      const time = state.clock.getElapsedTime();

      if (isMoving) {
        const targetRotation = Math.atan2(direction.x, direction.z);
        const currentRotation = visualGroup.current.rotation.y;
        let diff = targetRotation - currentRotation;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        visualGroup.current.rotation.y += diff * 0.15;
      }

      const bobFreq = isSprinting ? 14 : 9;
      const bobAmp = isSprinting ? 0.08 : 0.04;
      const bobY = isMoving ? Math.sin(time * bobFreq) * bobAmp : Math.sin(time * 2) * 0.01;
      visualGroup.current.position.y = bobY;

      const targetLeanForward = isMoving ? (isSprinting ? 0.25 : 0.12) : 0;
      modelInternalGroup.current.rotation.x = THREE.MathUtils.lerp(modelInternalGroup.current.rotation.x, targetLeanForward, 0.1);
      
      // Accessory Animation (Unique per Avatar)
      if (accessoryRef.current) {
        if (playerAvatar === 'mage') {
            // Staff sway
            const swayFreq = isSprinting ? 12 : 7;
            const swayAmp = isSprinting ? 0.15 : 0.05;
            accessoryRef.current.rotation.z = Math.sin(time * swayFreq) * swayAmp;
            accessoryRef.current.position.y = Math.cos(time * swayFreq * 0.5) * 0.02;
        } else if (playerAvatar === 'scout') {
            // Drones orbiting
            accessoryRef.current.rotation.y = time * 2;
            accessoryRef.current.position.y = 0.5 + Math.sin(time * 3) * 0.1;
        } else if (playerAvatar === 'guardian') {
            // Heavy thrusters pulse
            accessoryRef.current.scale.setScalar(1 + Math.sin(time * 10) * 0.02);
        }
      }

      if (capeRef.current) {
        const targetCapeAngle = isMoving ? (isSprinting ? 0.8 : 0.4) : 0.05;
        capeRef.current.rotation.x = THREE.MathUtils.lerp(capeRef.current.rotation.x, targetCapeAngle, 0.08);
      }
    }

    const cameraOffset = new THREE.Vector3(0, 5, 8);
    const targetPos = new THREE.Vector3(translation.x, translation.y, translation.z);
    state.camera.position.lerp(targetPos.clone().add(cameraOffset), 0.1);
    state.camera.lookAt(targetPos);

    if (isMultiplayerReady) {
      try {
        const player = myPlayer();
        player.setState('pos', { x: translation.x, y: translation.y, z: translation.z });
        if (visualGroup.current) {
           player.setState('rot', { 
             x: visualGroup.current.rotation.x, 
             y: visualGroup.current.rotation.y, 
             z: visualGroup.current.rotation.z 
           });
        }
      } catch (e) {}
    }
  });

  return (
    <RigidBody ref={body} colliders={false} enabledRotations={[false, false, false]} position={[0, 5, 0]} name="local-player" friction={0}>
      <CapsuleCollider args={[0.5, 0.5]} position={[0, 1, 0]} />
      
      <group ref={visualGroup}>
        <group ref={modelInternalGroup} position={[0, 0, 0]}>
            {/* Shared Head */}
            <group position={[0, 1.6, 0]}>
                <mesh castShadow>
                    <sphereGeometry args={[0.18, 16, 16]} />
                    <meshStandardMaterial color={C_SKIN} /> 
                </mesh>
                <mesh position={[0, 0.1, 0]}>
                    <sphereGeometry args={[0.19, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
                    <meshStandardMaterial color="#111" />
                </mesh>
                <mesh position={[0, 0.02, 0.14]}>
                    <boxGeometry args={[0.22, 0.06, 0.05]} />
                    <meshStandardMaterial color={C_ACCENT} emissive={C_ACCENT} emissiveIntensity={4} />
                </mesh>
            </group>

            {/* Avatar Specific Visuals */}
            {playerAvatar === 'mage' && (
                <MageVisuals color={C_ACCENT} accessoryRef={accessoryRef} capeRef={capeRef} />
            )}
            {playerAvatar === 'scout' && (
                <ScoutVisuals color={C_ACCENT} accessoryRef={accessoryRef} capeRef={capeRef} />
            )}
            {playerAvatar === 'guardian' && (
                <GuardianVisuals color={C_ACCENT} accessoryRef={accessoryRef} capeRef={capeRef} />
            )}
        </group>
      </group>
    </RigidBody>
  );
};

const MageVisuals = ({ color, accessoryRef, capeRef }: any) => (
  <>
    <mesh position={[0, 1, 0]} castShadow>
        <capsuleGeometry args={[0.25, 0.7, 12, 12]} />
        <meshStandardMaterial color={C_ARMOR} metalness={0.7} roughness={0.3} />
    </mesh>
    <mesh position={[0, 1.2, 0.22]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.05, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={5} />
    </mesh>
    <group ref={capeRef} position={[0, 1.4, -0.2]}>
        <mesh position={[0, -0.7, 0]} castShadow>
            <boxGeometry args={[0.8, 1.4, 0.02]} />
            <meshStandardMaterial color={C_CLOAK_OUT} transparent opacity={0.9} />
        </mesh>
    </group>
    <group ref={accessoryRef} position={[0.5, 0.8, 0.3]}>
        <mesh castShadow position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 2.4]} />
            <meshStandardMaterial color="#444" metalness={1} roughness={0.1} />
        </mesh>
        <group position={[0, 1.6, 0]}>
            <mesh position={[0, 0, 0.04]}>
                <planeGeometry args={[0.08, 0.3]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={10} />
            </mesh>
            <pointLight intensity={2} color={color} distance={4} />
        </group>
    </group>
  </>
);

const ScoutVisuals = ({ color, accessoryRef, capeRef }: any) => (
  <>
    <mesh position={[0, 1, 0]} castShadow>
        <capsuleGeometry args={[0.2, 0.8, 12, 12]} />
        <meshStandardMaterial color="#0f172a" />
    </mesh>
    {/* Split Wings */}
    <group ref={capeRef} position={[0, 1.4, -0.15]}>
        <mesh position={[-0.25, -0.6, 0]} rotation={[0, -0.2, 0]} castShadow>
            <boxGeometry args={[0.3, 1.2, 0.02]} />
            <meshStandardMaterial color={color} transparent opacity={0.6} />
        </mesh>
        <mesh position={[0.25, -0.6, 0]} rotation={[0, 0.2, 0]} castShadow>
            <boxGeometry args={[0.3, 1.2, 0.02]} />
            <meshStandardMaterial color={color} transparent opacity={0.6} />
        </mesh>
    </group>
    {/* Orbiting Drones */}
    <group ref={accessoryRef}>
        {[0, Math.PI * 0.66, Math.PI * 1.33].map((angle, i) => (
            <mesh key={i} position={[Math.cos(angle) * 0.6, 1.2, Math.sin(angle) * 0.6]}>
                <boxGeometry args={[0.1, 0.1, 0.1]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} />
            </mesh>
        ))}
    </group>
  </>
);

const GuardianVisuals = ({ color, accessoryRef, capeRef }: any) => (
  <>
    <mesh position={[0, 1, 0]} castShadow>
        <boxGeometry args={[0.6, 0.9, 0.5]} />
        <meshStandardMaterial color={C_ARMOR} metalness={0.9} roughness={0.1} />
    </mesh>
    <mesh position={[-0.35, 1.4, 0]} castShadow>
        <boxGeometry args={[0.3, 0.2, 0.3]} />
        <meshStandardMaterial color={C_ARMOR} />
    </mesh>
    <mesh position={[0.35, 1.4, 0]} castShadow>
        <boxGeometry args={[0.3, 0.2, 0.3]} />
        <meshStandardMaterial color={C_ARMOR} />
    </mesh>
    {/* Heavy Thruster Pack */}
    <group ref={accessoryRef} position={[0, 1.1, -0.3]}>
        <mesh castShadow>
            <boxGeometry args={[0.4, 0.6, 0.2]} />
            <meshStandardMaterial color="#111" />
        </mesh>
        <mesh position={[0, -0.3, 0]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={5} />
        </mesh>
        <pointLight intensity={2} color={color} distance={3} />
    </group>
  </>
);

export const GhostPlayer: React.FC<{ player: any }> = ({ player }) => {
  const meshRef = useRef<THREE.Group>(null);
  const color = player.getState('color') || player.getProfile()?.color?.hex || '#ffffff';
  const avatar = player.getState('avatar') || 'mage';

  useFrame(() => {
    if (!meshRef.current) return;
    const pos = player.getState('pos');
    const rot = player.getState('rot');
    if (pos) meshRef.current.position.set(pos.x, pos.y, pos.z);
    if (rot) meshRef.current.rotation.set(rot.x, rot.y, rot.z);
  });

  return (
    <group ref={meshRef}>
      <mesh position={[0, 1, 0]}>
        <capsuleGeometry args={[0.3, 1, 8, 8]} />
        <meshStandardMaterial color={color} transparent opacity={0.2} wireframe />
      </mesh>
      {/* Small class indicator */}
      <mesh position={[0, 1.8, 0]}>
          <boxGeometry args={[0.05, 0.05, 0.05]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
      </mesh>
    </group>
  );
};
