
import React, { useRef, useMemo } from 'react';
import { useFrame, extend, ThreeElement, ThreeElements } from '@react-three/fiber';
import { RigidBody, RapierRigidBody, CapsuleCollider } from '@react-three/rapier';
import { useKeyboardControls, shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { myPlayer } from 'playroomkit';
import { useGameStore } from '../store';

const TechShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color('#00f0ff'),
    uOpacity: 1.0,
    uGlowIntensity: 1.5,
  },
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
  `
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uGlowIntensity;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  void main() {
    float scanline = sin(vUv.y * 150.0 - uTime * 10.0) * 0.1 + 0.9;
    float grid = step(0.98, fract(vUv.x * 25.0)) + step(0.98, fract(vUv.y * 25.0));
    vec3 viewDir = normalize(vViewPosition);
    float fresnel = pow(1.0 - dot(vNormal, viewDir), 2.5);
    vec3 finalColor = uColor * (scanline + grid * 0.5 + fresnel * 2.5) * uGlowIntensity;
    gl_FragColor = vec4(finalColor, uOpacity);
  }
  `
);

extend({ TechShaderMaterial });
const TechShaderMaterialTag = 'techShaderMaterial' as any;

const C_ARMOR = "#11151c"; 
const C_SKIN = "#d29d7c"; 

export const Player: React.FC = () => {
  const body = useRef<RapierRigidBody>(null);
  const visualGroup = useRef<THREE.Group>(null);
  const capeRef = useRef<THREE.Group>(null);
  const weaponRef = useRef<THREE.Group>(null);
  const techMaterialRef = useRef<any>(null);
  
  const [, getKeys] = useKeyboardControls();
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
    const speed = isSprinting ? 9.5 : 5.5;
    
    if (isSprinting) decreaseEnergy(0.8);
    else regenerateEnergy(isMoving ? 0.3 : 0.7);

    const targetVelX = direction.x * speed;
    const targetVelZ = direction.z * speed;
    body.current.setLinvel({ 
        x: THREE.MathUtils.lerp(velocity.x, targetVelX, 1 - Math.exp(-15 * delta)), 
        y: velocity.y, 
        z: THREE.MathUtils.lerp(velocity.z, targetVelZ, 1 - Math.exp(-15 * delta)) 
    }, true);

    if (jump && Math.abs(velocity.y) < 0.1) body.current.applyImpulse({ x: 0, y: 5.5, z: 0 }, true);

    const time = state.clock.getElapsedTime();
    if (techMaterialRef.current) techMaterialRef.current.uTime = time;

    if (visualGroup.current) {
      if (isMoving) {
        const targetRot = Math.atan2(direction.x, direction.z);
        let diff = targetRot - visualGroup.current.rotation.y;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        visualGroup.current.rotation.y += diff * 0.2;
      }
      visualGroup.current.position.y = isMoving ? Math.sin(time * (isSprinting ? 14 : 9)) * 0.06 : Math.sin(time * 2) * 0.01;

      if (weaponRef.current) {
        const weaponAnim = Math.sin(time * 4) * 0.05;
        weaponRef.current.position.y += weaponAnim * 0.1;
      }
      if (capeRef.current) {
        capeRef.current.rotation.x = THREE.MathUtils.lerp(capeRef.current.rotation.x, isMoving ? (isSprinting ? 1.2 : 0.7) : 0.1, 0.1);
      }
    }

    state.camera.position.lerp(new THREE.Vector3(translation.x, translation.y + 5, translation.z + 8), 0.1);
    state.camera.lookAt(translation.x, translation.y, translation.z);

    if (isMultiplayerReady) {
      try {
        const p = myPlayer();
        p.setState('pos', { x: translation.x, y: translation.y, z: translation.z });
        if (visualGroup.current) p.setState('rot', { y: visualGroup.current.rotation.y });
      } catch (e) {}
    }
  });

  return (
    <RigidBody ref={body} colliders={false} enabledRotations={[false, false, false]} position={[0, 5, 0]} name="local-player" friction={0}>
      <CapsuleCollider args={[0.5, 0.5]} position={[0, 1, 0]} />
      <group ref={visualGroup}>
          {/* Detailed Hooded Body (Common Aesthetic) */}
          <group position={[0, 1.6, 0]}>
              <mesh castShadow>
                  <sphereGeometry args={[0.22, 16, 16]} />
                  <meshStandardMaterial color={C_SKIN} /> 
              </mesh>
              <mesh position={[0, 0.06, 0]}>
                  <sphereGeometry args={[0.26, 16, 16, 0, Math.PI * 2, 0, Math.PI / 1.4]} />
                  <meshStandardMaterial color="#080c14" metalness={0.9} roughness={0.1} />
              </mesh>
              <mesh position={[0, 0.02, 0.16]}>
                  <boxGeometry args={[0.28, 0.08, 0.04]} />
                  <TechShaderMaterialTag ref={techMaterialRef} uColor={C_ACCENT} transparent uGlowIntensity={4} />
              </mesh>
          </group>

          {playerAvatar === 'mage' && <MageModel color={C_ACCENT} weaponRef={weaponRef} capeRef={capeRef} />}
          {playerAvatar === 'scout' && <ScoutModel color={C_ACCENT} weaponRef={weaponRef} capeRef={capeRef} />}
          {playerAvatar === 'guardian' && <GuardianModel color={C_ACCENT} weaponRef={weaponRef} capeRef={capeRef} />}
      </group>
    </RigidBody>
  );
};

// Added GhostPlayer to represent other players in the multiplayer session
export const GhostPlayer: React.FC<{ player: any }> = ({ player }) => {
  const visualGroup = useRef<THREE.Group>(null);
  const capeRef = useRef<THREE.Group>(null);
  const weaponRef = useRef<THREE.Group>(null);
  const techMaterialRef = useRef<any>(null);

  // Skip rendering the local player ghost as they are already handled by the main Player component
  if (player.isLocal()) return null;

  const pos = player.getState('pos') || { x: 0, y: 0, z: 0 };
  const rot = player.getState('rot') || { y: 0 };
  const color = player.getState('color') || '#00f0ff';
  const avatar = player.getState('avatar') || 'mage';
  const C_ACCENT = useMemo(() => new THREE.Color(color), [color]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (techMaterialRef.current) techMaterialRef.current.uTime = time;
    if (visualGroup.current) {
        visualGroup.current.position.y = Math.sin(time * 2) * 0.05;
        if (weaponRef.current) {
          weaponRef.current.position.y += Math.sin(time * 4) * 0.005;
        }
    }
  });

  return (
    <group position={[pos.x, pos.y, pos.z]}>
      <group ref={visualGroup} rotation-y={rot.y}>
          <group position={[0, 1.6, 0]}>
              <mesh castShadow>
                  <sphereGeometry args={[0.22, 16, 16]} />
                  <meshStandardMaterial color={C_SKIN} /> 
              </mesh>
              <mesh position={[0, 0.06, 0]}>
                  <sphereGeometry args={[0.26, 16, 16, 0, Math.PI * 2, 0, Math.PI / 1.4]} />
                  <meshStandardMaterial color="#080c14" metalness={0.9} roughness={0.1} />
              </mesh>
              <mesh position={[0, 0.02, 0.16]}>
                  <boxGeometry args={[0.28, 0.08, 0.04]} />
                  <TechShaderMaterialTag ref={techMaterialRef} uColor={C_ACCENT} transparent uGlowIntensity={4} />
              </mesh>
          </group>

          {avatar === 'mage' && <MageModel color={C_ACCENT} weaponRef={weaponRef} capeRef={capeRef} />}
          {avatar === 'scout' && <ScoutModel color={C_ACCENT} weaponRef={weaponRef} capeRef={capeRef} />}
          {avatar === 'guardian' && <GuardianModel color={C_ACCENT} weaponRef={weaponRef} capeRef={capeRef} />}
      </group>
    </group>
  );
};

const MageModel = ({ color, weaponRef, capeRef }: any) => (
  <>
    <mesh position={[0, 0.8, 0]} castShadow>
        <capsuleGeometry args={[0.28, 0.8, 12, 12]} />
        <meshStandardMaterial color={C_ARMOR} />
    </mesh>
    <group ref={capeRef} position={[0, 1.4, -0.25]}>
        <mesh position={[0, -0.85, 0]} castShadow>
            <boxGeometry args={[0.9, 1.7, 0.01]} />
            <TechShaderMaterialTag uColor={color} transparent uOpacity={0.3} uGlowIntensity={1.5} />
        </mesh>
    </group>
    <group ref={weaponRef} position={[0.7, 1.1, 0.4]}>
        <mesh castShadow>
            <cylinderGeometry args={[0.025, 0.025, 2.8]} />
            <meshStandardMaterial color="#111" metalness={1} />
        </mesh>
        <mesh position={[0, 1.5, 0]}>
            <octahedronGeometry args={[0.15]} />
            <TechShaderMaterialTag uColor={color} transparent uGlowIntensity={10} />
        </mesh>
    </group>
  </>
);

const ScoutModel = ({ color, weaponRef, capeRef }: any) => (
  <>
    <mesh position={[0, 0.85, 0]} castShadow>
        <capsuleGeometry args={[0.22, 0.9, 12, 12]} />
        <meshStandardMaterial color="#050a14" metalness={0.8} />
    </mesh>
    <group ref={capeRef} position={[0, 1.4, -0.15]}>
        <mesh position={[0, -0.7, 0]} castShadow>
            <boxGeometry args={[0.6, 1.3, 0.01]} />
            <TechShaderMaterialTag uColor={color} transparent uOpacity={0.7} />
        </mesh>
    </group>
    <group ref={weaponRef}>
        {[ -0.5, 0.5 ].map((x, i) => (
            <mesh key={i} position={[x, 0.9, 0.35]} rotation={[Math.PI / 2, 0, 0]}>
                <boxGeometry args={[0.04, 0.5, 0.02]} />
                <TechShaderMaterialTag uColor={color} transparent uGlowIntensity={8} />
            </mesh>
        ))}
    </group>
  </>
);

const GuardianModel = ({ color, weaponRef, capeRef }: any) => (
  <>
    <mesh position={[0, 0.9, 0]} castShadow>
        <boxGeometry args={[0.65, 1.2, 0.55]} />
        <meshStandardMaterial color="#1a2130" metalness={1} roughness={0.05} />
    </mesh>
    <group ref={capeRef} position={[0, 1.4, -0.32]}>
        <mesh position={[0, -0.9, 0]} castShadow>
            <boxGeometry args={[1.1, 1.8, 0.05]} />
            <meshStandardMaterial color="#080808" />
        </mesh>
    </group>
    <group ref={weaponRef} position={[0.7, 1.0, 0.4]}>
        <mesh castShadow rotation={[0, 0, 0.05]}>
            <boxGeometry args={[0.18, 2.0, 0.06]} />
            <TechShaderMaterialTag uColor={color} transparent uGlowIntensity={4} />
        </mesh>
        <mesh position={[0, -1.1, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.7]} />
            <meshStandardMaterial color="#444" />
        </mesh>
    </group>
  </>
);
