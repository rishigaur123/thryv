import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type * as THREE from "three";

// Strictly grey palette — no whites, all muted greys
const COLORS = [
  "#6e6e6e", // mid-dark grey
  "#7a7a7a", // slate grey
  "#888888", // dark grey
  "#909090", // medium grey
  "#9e9e9e", // neutral grey
  "#acacac", // muted grey
  "#b8b8b8", // cool grey
  "#c0c0c0", // silver grey
  "#c8c8c8", // soft silver
  "#d0d0d0", // light grey
  "#7f7f7f", // balanced grey
  "#858585", // charcoal mid
  "#959595", // stone grey
  "#a8a8a8", // warm grey
  "#bcbcbc", // pale grey
];

// Seeded random helpers so positions are stable across renders
function seededRandom(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function randomInRange(min: number, max: number, seed: number) {
  return min + seededRandom(seed) * (max - min);
}

// Shared material props — low roughness + high metalness = crisp light reflection
const MAT = { roughness: 0.15, metalness: 0.85 };

/* ─────────────────────────────────────────────
   Individual object components
───────────────────────────────────────────── */

interface ObjectProps {
  position: [number, number, number];
  color: string;
  rx: number;
  ry: number;
  rz: number;
  floatSpeed: number;
  phase: number;
}

function Dumbbell({
  position,
  color,
  rx,
  ry,
  rz,
  floatSpeed,
  phase,
}: ObjectProps) {
  const ref = useRef<THREE.Group>(null);
  const baseY = position[1];
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.x += rx;
    ref.current.rotation.y += ry;
    ref.current.rotation.z += rz;
    ref.current.position.y =
      baseY + Math.sin(clock.elapsedTime * floatSpeed + phase) * 0.28;
  });
  return (
    <group ref={ref} position={position} scale={0.5}>
      {/* left weight */}
      <mesh position={[-0.077, 0, 0]}>
        <sphereGeometry args={[0.044, 12, 12]} />
        <meshStandardMaterial
          color={color}
          {...MAT}
          emissive={color}
          emissiveIntensity={0.6}
        />
      </mesh>
      {/* right weight */}
      <mesh position={[0.077, 0, 0]}>
        <sphereGeometry args={[0.044, 12, 12]} />
        <meshStandardMaterial
          color={color}
          {...MAT}
          emissive={color}
          emissiveIntensity={0.6}
        />
      </mesh>
      {/* bar */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.015, 0.015, 0.138, 10]} />
        <meshStandardMaterial
          color={color}
          {...MAT}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}

function SipperBottle({
  position,
  color,
  rx,
  ry,
  rz,
  floatSpeed,
  phase,
}: ObjectProps) {
  const ref = useRef<THREE.Group>(null);
  const baseY = position[1];
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.x += rx;
    ref.current.rotation.y += ry;
    ref.current.rotation.z += rz;
    ref.current.position.y =
      baseY + Math.sin(clock.elapsedTime * floatSpeed + phase) * 0.28;
  });
  return (
    <group ref={ref} position={position} scale={0.5}>
      {/* body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.033, 0.028, 0.154, 12]} />
        <meshStandardMaterial
          color={color}
          {...MAT}
          emissive={color}
          emissiveIntensity={0.6}
        />
      </mesh>
      {/* cap */}
      <mesh position={[0, 0.099, 0]}>
        <cylinderGeometry args={[0.017, 0.017, 0.039, 10]} />
        <meshStandardMaterial
          color={color}
          {...MAT}
          emissive={color}
          emissiveIntensity={0.6}
        />
      </mesh>
    </group>
  );
}

function RunningShoe({
  position,
  color,
  rx,
  ry,
  rz,
  floatSpeed,
  phase,
}: ObjectProps) {
  const ref = useRef<THREE.Group>(null);
  const baseY = position[1];
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.x += rx;
    ref.current.rotation.y += ry;
    ref.current.rotation.z += rz;
    ref.current.position.y =
      baseY + Math.sin(clock.elapsedTime * floatSpeed + phase) * 0.28;
  });
  return (
    <group ref={ref} position={position} scale={0.5}>
      {/* sole */}
      <mesh position={[0, -0.025, 0]}>
        <boxGeometry args={[0.143, 0.05, 0.061]} />
        <meshStandardMaterial
          color={color}
          {...MAT}
          emissive={color}
          emissiveIntensity={0.55}
        />
      </mesh>
      {/* upper */}
      <mesh position={[0.014, 0.022, 0]}>
        <boxGeometry args={[0.116, 0.05, 0.055]} />
        <meshStandardMaterial
          color={color}
          {...MAT}
          emissive={color}
          emissiveIntensity={0.55}
        />
      </mesh>
    </group>
  );
}

function GymBag({
  position,
  color,
  rx,
  ry,
  rz,
  floatSpeed,
  phase,
}: ObjectProps) {
  const ref = useRef<THREE.Group>(null);
  const baseY = position[1];
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.x += rx;
    ref.current.rotation.y += ry;
    ref.current.rotation.z += rz;
    ref.current.position.y =
      baseY + Math.sin(clock.elapsedTime * floatSpeed + phase) * 0.28;
  });
  return (
    <group ref={ref} position={position} scale={0.5}>
      {/* cylinder lying on its side */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.055, 0.055, 0.121, 14]} />
        <meshStandardMaterial
          color={color}
          {...MAT}
          emissive={color}
          emissiveIntensity={0.6}
        />
      </mesh>
    </group>
  );
}

function SkippingRope({
  position,
  color,
  rx,
  ry,
  rz,
  floatSpeed,
  phase,
}: ObjectProps) {
  const ref = useRef<THREE.Group>(null);
  const baseY = position[1];
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.x += rx;
    ref.current.rotation.y += ry;
    ref.current.rotation.z += rz;
    ref.current.position.y =
      baseY + Math.sin(clock.elapsedTime * floatSpeed + phase) * 0.28;
  });
  return (
    <group ref={ref} position={position} scale={0.5}>
      <mesh>
        <torusGeometry args={[0.066, 0.015, 10, 28]} />
        <meshStandardMaterial
          color={color}
          {...MAT}
          emissive={color}
          emissiveIntensity={0.65}
        />
      </mesh>
    </group>
  );
}

function Kettlebell({
  position,
  color,
  rx,
  ry,
  rz,
  floatSpeed,
  phase,
}: ObjectProps) {
  const ref = useRef<THREE.Group>(null);
  const baseY = position[1];
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.x += rx;
    ref.current.rotation.y += ry;
    ref.current.rotation.z += rz;
    ref.current.position.y =
      baseY + Math.sin(clock.elapsedTime * floatSpeed + phase) * 0.28;
  });
  return (
    <group ref={ref} position={position} scale={0.5}>
      {/* body */}
      <mesh position={[0, -0.011, 0]}>
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshStandardMaterial
          color={color}
          {...MAT}
          emissive={color}
          emissiveIntensity={0.6}
        />
      </mesh>
      {/* handle */}
      <mesh position={[0, 0.055, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.039, 0.012, 8, 18]} />
        <meshStandardMaterial
          color={color}
          {...MAT}
          emissive={color}
          emissiveIntensity={0.6}
        />
      </mesh>
    </group>
  );
}

function YogaMatRoll({
  position,
  color,
  rx,
  ry,
  rz,
  floatSpeed,
  phase,
}: ObjectProps) {
  const ref = useRef<THREE.Group>(null);
  const baseY = position[1];
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.x += rx;
    ref.current.rotation.y += ry;
    ref.current.rotation.z += rz;
    ref.current.position.y =
      baseY + Math.sin(clock.elapsedTime * floatSpeed + phase) * 0.28;
  });
  return (
    <group ref={ref} position={position} scale={0.5}>
      <mesh>
        <cylinderGeometry args={[0.033, 0.033, 0.176, 12]} />
        <meshStandardMaterial
          color={color}
          {...MAT}
          emissive={color}
          emissiveIntensity={0.6}
        />
      </mesh>
    </group>
  );
}

function ResistanceBand({
  position,
  color,
  rx,
  ry,
  rz,
  floatSpeed,
  phase,
}: ObjectProps) {
  const ref = useRef<THREE.Group>(null);
  const baseY = position[1];
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.x += rx;
    ref.current.rotation.y += ry;
    ref.current.rotation.z += rz;
    ref.current.position.y =
      baseY + Math.sin(clock.elapsedTime * floatSpeed + phase) * 0.28;
  });
  return (
    <group ref={ref} position={position} scale={0.5}>
      <mesh>
        <torusGeometry args={[0.055, 0.009, 8, 24]} />
        <meshStandardMaterial
          color={color}
          {...MAT}
          emissive={color}
          emissiveIntensity={0.7}
        />
      </mesh>
    </group>
  );
}

function ShakerCup({
  position,
  color,
  rx,
  ry,
  rz,
  floatSpeed,
  phase,
}: ObjectProps) {
  const ref = useRef<THREE.Group>(null);
  const baseY = position[1];
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.x += rx;
    ref.current.rotation.y += ry;
    ref.current.rotation.z += rz;
    ref.current.position.y =
      baseY + Math.sin(clock.elapsedTime * floatSpeed + phase) * 0.28;
  });
  return (
    <group ref={ref} position={position} scale={0.5}>
      <mesh>
        <cylinderGeometry args={[0.03, 0.039, 0.138, 12]} />
        <meshStandardMaterial
          color={color}
          {...MAT}
          emissive={color}
          emissiveIntensity={0.6}
        />
      </mesh>
    </group>
  );
}

function Stopwatch({
  position,
  color,
  rx,
  ry,
  rz,
  floatSpeed,
  phase,
}: ObjectProps) {
  const ref = useRef<THREE.Group>(null);
  const baseY = position[1];
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.x += rx;
    ref.current.rotation.y += ry;
    ref.current.rotation.z += rz;
    ref.current.position.y =
      baseY + Math.sin(clock.elapsedTime * floatSpeed + phase) * 0.28;
  });
  return (
    <group ref={ref} position={position} scale={0.5}>
      {/* disk face */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.015, 18]} />
        <meshStandardMaterial
          color={color}
          {...MAT}
          emissive={color}
          emissiveIntensity={0.65}
        />
      </mesh>
      {/* button on top */}
      <mesh position={[0, 0.023, 0]}>
        <boxGeometry args={[0.017, 0.03, 0.014]} />
        <meshStandardMaterial
          color={color}
          {...MAT}
          emissive={color}
          emissiveIntensity={0.65}
        />
      </mesh>
    </group>
  );
}

/* ─────────────────────────────────────────────
   Scene: position/colour/animation config
───────────────────────────────────────────── */

const OBJECT_COMPONENTS = [
  Dumbbell,
  SipperBottle,
  RunningShoe,
  GymBag,
  SkippingRope,
  Kettlebell,
  YogaMatRoll,
  ResistanceBand,
  ShakerCup,
  Stopwatch,
];

// 10 object types, distributed as 8+8+8+8+8+7+7+7+7+7 = 75 total objects

function SceneObjects() {
  const objects = useMemo(() => {
    const result: {
      Component: React.ComponentType<ObjectProps>;
      props: ObjectProps;
      key: string;
    }[] = [];

    let seed = 7; // deterministic seed
    // Distribute 75 objects: 5 types × 8 = 40, 5 types × 7 = 35 → total 75
    const instanceCounts = [8, 8, 8, 8, 8, 7, 7, 7, 7, 7];
    let globalIdx = 0;

    for (let i = 0; i < OBJECT_COMPONENTS.length; i++) {
      const count = instanceCounts[i];
      for (let j = 0; j < count; j++) {
        const idx = globalIdx++;
        seed += 13;

        const x = randomInRange(-7, 7, seed + 1);
        seed += 7;
        const y = randomInRange(-4, 4, seed + 2);
        seed += 11;
        const z = randomInRange(-3, 0.5, seed + 3);
        seed += 5;

        // Slower spin: reduced range from (0.004–0.014) to (0.001–0.004)
        const rx = randomInRange(0.001, 0.004, seed + 4);
        seed += 9;
        const ry = randomInRange(0.001, 0.004, seed + 5);
        seed += 6;
        const rz = randomInRange(0.0005, 0.002, seed + 6);
        seed += 8;

        const floatSpeed = randomInRange(0.4, 0.8, seed + 7);
        seed += 4;
        const phase = randomInRange(0, Math.PI * 2, seed + 8);

        const color = COLORS[idx % COLORS.length];

        result.push({
          Component: OBJECT_COMPONENTS[i],
          props: {
            position: [x, y, z],
            color,
            rx,
            ry,
            rz,
            floatSpeed,
            phase,
          },
          key: `obj-${i}-${j}`,
        });
      }
    }
    return result; // exactly 75 objects
  }, []);

  return (
    <>
      {objects.map(({ Component, props, key }) => (
        <Component key={key} {...props} />
      ))}
    </>
  );
}

/* ─────────────────────────────────────────────
   Main export
───────────────────────────────────────────── */

export default function GymObjectsScene() {
  return (
    <Canvas
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        background: "transparent",
        pointerEvents: "none",
      }}
      camera={{ position: [0, 0, 7], fov: 55 }}
      gl={{ alpha: true }}
    >
      <ambientLight intensity={1.6} />
      <directionalLight position={[5, 5, 5]} intensity={3.0} color="#ffffff" />
      <directionalLight
        position={[-5, -3, 3]}
        intensity={2.0}
        color="#cccccc"
      />
      <pointLight
        position={[0, 0, 4]}
        intensity={4}
        color="#ffffff"
        distance={18}
      />
      <pointLight
        position={[-6, 4, 2]}
        intensity={2.5}
        color="#d8d8d8"
        distance={14}
      />
      <pointLight
        position={[6, -4, 2]}
        intensity={2.5}
        color="#e0e0e0"
        distance={14}
      />
      <SceneObjects />
    </Canvas>
  );
}
