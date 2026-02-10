
import React, { useRef, useMemo } from 'react';
import { useFrame, extend, ThreeElement, ThreeElements } from '@react-three/fiber';
import { RigidBody, RapierRigidBody, CapsuleCollider } from '@react-three/rapier';
import { useKeyboardControls, shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { myPlayer } from 'playroomkit';
import { useGameStore } from '../store';

// --- Custom Tech Shader ---
const TechShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color('#00f0ff'),
    uOpacity: 1.0,
    uGlowIntensity: 1.5,
  },
  // Vertex Shader
  `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
  `,
  // Fragment Shader
  `
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uGlowIntensity;
  
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    float scanline = sin(vUv.y * 120.0 - uTime * 8.0) * 0.15 + 0.85;
    float gridScale = 20.0;
    vec2 gridUv = fract(vUv * gridScale + vec2(0.0, uTime * 0.05));
    float grid = step(0.97, gridUv.x) + step(0.97, gridUv.y);
    float flicker = step(0.99, sin(uTime * 15.0)) * 0.1;
    vec3 color = uColor;
    vec3 viewDir = normalize(vViewPosition);
    float fresnel = pow(1.0 - dot(vNormal, viewDir), 3.0);
    vec3 finalColor = color * (scanline + grid * 0.5 + fresnel * 2.0 + flicker) * uGlowIntensity;
    gl_FragColor = vec4(finalColor, uOpacity);
  }
  `
);

extend({ TechShaderMaterial });
const TechShaderMaterialTag = 'techShaderMaterial' as any;

const SPEED = 5.5;
const RUN_MULTIPLIER = 1.7;
const JUMP_FORCE = 5.5;

const C_ARMOR = "#1a2130"; 
const C_SKIN = "#c69671"; 
const C_CLOAK_OUT = "#0f172a"; 

export const Player: React.FC = () => {
  const body = useRef<RapierRigidBody>(null);
  const visualGroup = useRef<THREE.Group>(null);
  const modelInternalGroup = useRef<THREE.Group>(null);
  const capeRef = useRef<THREE.Group>(null);
  const weaponRef = useRef<THREE.Group>(null);
  
  const techMaterialRef = useRef<any>(null);
  
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const { energy, decreaseEnergy, regenerateEnergy, isMultiplayerReady, playerColor, playerAvatar } = useGameStore();

  const C_ACCENT = useMemo(() => new THREE.Color(playerColor), [playerColor]);

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
      decreaseEnergy(0.6);
    } else {
      regenerateEnergy(isMoving ? 0.3 : 0.6);
    }

    const targetVelocityX = direction.x * currentSpeed;
    const targetVelocityZ = direction.z * currentSpeed;
    const lerpFactor = 1 - Math.exp(-12 * delta);
    body.current.setLinvel({ 
        x: THREE.MathUtils.lerp(velocity.x, targetVelocityX, lerpFactor), 
        y: velocity.y, 
        z: THREE.MathUtils.lerp(velocity.z, targetVelocityZ, lerpFactor) 
    }, true);

    if (jump && Math.abs(velocity.y) < 0.1) {
       body.current.applyImpulse({ x: 0, y: JUMP_FORCE, z: 0 }, true);
    }

    const time = state.clock.getElapsedTime();
    if (techMaterialRef.current) techMaterialRef.current.uTime = time;

    if (visualGroup.current && modelInternalGroup.current) {
      if (isMoving) {
        const targetRotation = Math.atan2(direction.x, direction.z);
        let diff = targetRotation - visualGroup.current.rotation.y;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        visualGroup.current.rotation.y += diff * 0.2;
      }

      const bobY = isMoving ? Math.sin(time * (isSprinting ? 12 : 8)) * 0.05 : Math.sin(time * 2) * 0.01;
      visualGroup.current.position.y = bobY;

      if (weaponRef.current) {
        if (playerAvatar === 'mage') {
            weaponRef.current.rotation.z = Math.sin(time * 4) * 0.1;
        } else if (playerAvatar === 'scout') {
            weaponRef.current.rotation.x = Math.sin(time * 12) * 0.2;
        } else if (playerAvatar === 'guardian') {
            weaponRef.current.rotation.z = Math.sin(time * 2) * 0.05;
        }
      }

      if (capeRef.current) {
        const capeTarget = isMoving ? (isSprinting ? 1.1 : 0.6) : 0.1;
        capeRef.current.rotation.x = THREE.MathUtils.lerp(capeRef.current.rotation.x, capeTarget, 0.1);
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
        if (visualGroup.current) player.setState('rot', { y: visualGroup.current.rotation.y });
      } catch (e) {}
    }
  });

  return (
    <RigidBody ref={body} colliders={false} enabledRotations={[false, false, false]} position={[0, 5, 0]} name="local-player">
      <CapsuleCollider args={[0.5, 0.5]} position={[0, 1, 0]} />
      
      <group ref={visualGroup}>
        <group ref={modelInternalGroup}>
            {/* Hooded Head (Common Style) */}
            <group position={[0, 1.6, 0]}>
                <mesh castShadow>
                    <sphereGeometry args={[0.22, 16, 16]} />
                    <meshStandardMaterial color={C_SKIN} /> 
                </mesh>
                <mesh position={[0, 0.05, 0]}>
                    <sphereGeometry args={[0.24, 16, 16, 0, Math.PI * 2, 0, Math.PI / 1.5]} />
                    <meshStandardMaterial color="#111" metalness={1} roughness={0.1} />
                </mesh>
                <mesh position={[0, 0.02, 0.16]}>
                    <boxGeometry args={[0.25, 0.08, 0.05]} />
                    <TechShaderMaterialTag ref={techMaterialRef} uColor={C_ACCENT} transparent uGlowIntensity={3} />
                </mesh>
            </group>

            {/* Avatar Specific Mesh Logic */}
            {playerAvatar === 'mage' && (
                <MageVisuals color={C_ACCENT} weaponRef={weaponRef} capeRef={capeRef} />
            )}
            {playerAvatar === 'scout' && (
                <ScoutVisuals color={C_ACCENT} weaponRef={weaponRef} capeRef={capeRef} />
            )}
            {playerAvatar === 'guardian' && (
                <GuardianVisuals color={C_ACCENT} weaponRef={weaponRef} capeRef={capeRef} />
            )}
        </group>
      </group>
    </RigidBody>
  );
};

const MageVisuals = ({ color, weaponRef, capeRef }: any) => (
  <>
    <mesh position={[0, 0.9, 0]} castShadow>
        <capsuleGeometry args={[0.26, 0.8, 12, 12]} />
        <meshStandardMaterial color={C_ARMOR} />
    </mesh>
    <group ref={capeRef} position={[0, 1.4, -0.2]}>
        <mesh position={[0, -0.8, 0]} castShadow>
            <boxGeometry args={[0.8, 1.6, 0.02]} />
            <TechShaderMaterialTag uColor={color} transparent uOpacity={0.4} uGlowIntensity={1} />
        </mesh>
    </group>
    <group ref={weaponRef} position={[0.6, 1.0, 0.4]}>
        {/* Archival Staff */}
        <mesh castShadow>
            <cylinderGeometry args={[0.03, 0.03, 2.5]} />
            <meshStandardMaterial color="#222" metalness={1} />
        </mesh>
        <mesh position={[0, 1.4, 0]}>
            <sphereGeometry args={[0.12, 12, 12]} />
            <TechShaderMaterialTag uColor={color} transparent uGlowIntensity={6} />
        </mesh>
        <pointLight color={color} intensity={2} distance={5} />
    </group>
  </>
);

const ScoutVisuals = ({ color, weaponRef, capeRef }: any) => (
  <>
    <mesh position={[0, 0.9, 0]} castShadow>
        <capsuleGeometry args={[0.2, 0.9, 12, 12]} />
        <meshStandardMaterial color="#0c111c" />
    </mesh>
    <group ref={capeRef} position={[0, 1.4, -0.15]}>
        <mesh position={[0, -0.7, 0]} castShadow>
            <boxGeometry args={[0.6, 1.3, 0.01]} />
            <TechShaderMaterialTag uColor={color} transparent uOpacity={0.8} />
        </mesh>
    </group>
    <group ref={weaponRef}>
        {/* Dual Energy Daggers */}
        {[ -0.5, 0.5 ].map((x, i) => (
            <mesh key={i} position={[x, 0.9, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
                <boxGeometry args={[0.05, 0.4, 0.02]} />
                <TechShaderMaterialTag uColor={color} transparent uGlowIntensity={8} />
            </mesh>
        ))}
    </group>
  </>
);

const GuardianVisuals = ({ color, weaponRef, capeRef }: any) => (
  <>
    <mesh position={[0, 0.9, 0]} castShadow>
        <boxGeometry args={[0.6, 1.1, 0.5]} />
        <meshStandardMaterial color={C_ARMOR} metalness={0.9} roughness={0.1} />
    </mesh>
    <group ref={capeRef} position={[0, 1.4, -0.28]}>
        <mesh position={[0, -0.8, 0]} castShadow>
            <boxGeometry args={[1.0, 1.6, 0.04]} />
            <meshStandardMaterial color="#111" />
        </mesh>
    </group>
    <group ref={weaponRef} position={[0.6, 1.0, 0.4]}>
        {/* Heavy Energy Claymore */}
        <mesh position={[0, 0.2, 0]} castShadow>
            <boxGeometry args={[0.15, 1.8, 0.05]} />
            <TechShaderMaterialTag uColor={color} transparent uGlowIntensity={5} />
        </mesh>
        <mesh position={[0, -0.8, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.6]} />
            <meshStandardMaterial color="#444" />
        </mesh>
    </group>
  </>
);

export const GhostPlayer: React.FC<{ player: any }> = ({ player }) => {
  const meshRef = useRef<THREE.Group>(null);
  const color = player.getState('color') || '#ffffff';
  const avatar = player.getState('avatar') || 'mage';

  useFrame(() => {
    if (!meshRef.current) return;
    const pos = player.getState('pos');
    const rot = player.getState('rot');
    if (pos) meshRef.current.position.set(pos.x, pos.y, pos.z);
    if (rot) meshRef.current.rotation.y = rot.y;
  });

  return (
    <group ref={meshRef}>
      <mesh position={[0, 1, 0]}>
        <capsuleGeometry args={[0.3, 1, 8, 8]} />
        <meshStandardMaterial color={color} transparent opacity={0.3} wireframe />
      </mesh>
      <mesh position={[0, 1.8, 0]}>
          <boxGeometry args={[0.05, 0.05, 0.05]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={5} />
      </mesh>
    </group>
  );
};
