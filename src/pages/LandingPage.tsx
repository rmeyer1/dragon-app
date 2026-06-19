import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { motion, useReducedMotion } from 'framer-motion';
import * as THREE from 'three';
import { ArrowUpRight } from 'lucide-react';

type SignalMode = 'engineer' | 'product' | 'investor';

interface SignalModeConfig {
  id: SignalMode;
  label: string;
  accent: string;
  secondary: string;
  hot: string;
  energy: string[];
  glow: string;
  surface: string;
}

const signalModes: SignalModeConfig[] = [
  {
    id: 'engineer',
    label: 'Engineer',
    accent: '#22c55e',
    secondary: '#5eead4',
    hot: '#ecfeff',
    energy: ['#22c55e', '#5eead4', '#a7f3d0', '#38bdf8'],
    glow: 'rgba(34, 197, 94, 0.42)',
    surface: '#020806',
  },
  {
    id: 'product',
    label: 'Product',
    accent: '#f97316',
    secondary: '#a855f7',
    hot: '#fff7ed',
    energy: ['#f97316', '#fb923c', '#f472b6', '#a855f7'],
    glow: 'rgba(249, 115, 22, 0.42)',
    surface: '#0c0502',
  },
  {
    id: 'investor',
    label: 'Investor',
    accent: '#2563eb',
    secondary: '#d946ef',
    hot: '#7dd3fc',
    energy: ['#2563eb', '#38bdf8', '#a855f7', '#fb923c'],
    glow: 'rgba(37, 99, 235, 0.42)',
    surface: '#020511',
  },
];

const hasWebGLSupport = () => {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  } catch {
    return false;
  }
};

const nextSignalMode = (mode: SignalMode): SignalMode => {
  const index = signalModes.findIndex((item) => item.id === mode);
  return signalModes[(index + 1) % signalModes.length].id;
};

const orbSpecs = [
  { radius: 0.56, position: [-1.7, 0.8, 0], velocity: [0.72, 0.48, 0.28], role: 'accent' },
  { radius: 0.42, position: [1.5, 0.68, -0.4], velocity: [-0.54, 0.5, 0.36], role: 'secondary' },
  { radius: 0.68, position: [0.25, -0.2, 0.25], velocity: [0.4, -0.66, -0.3], role: 'accent' },
  { radius: 0.32, position: [-0.6, -0.95, -0.2], velocity: [-0.62, 0.42, 0.34], role: 'secondary' },
  { radius: 0.46, position: [2.0, -0.72, 0.12], velocity: [-0.46, -0.56, -0.26], role: 'accent' },
  { radius: 0.28, position: [-2.05, -0.42, -0.3], velocity: [0.5, -0.4, 0.3], role: 'secondary' },
] as const;

const sparkOffsets = [
  [-0.42, 0.18, 0.12],
  [0.34, -0.2, 0.2],
  [0.1, 0.42, -0.18],
  [-0.18, -0.36, -0.1],
  [0.44, 0.12, -0.22],
] as const;

const SignalModulesMesh = ({
  mode,
  reducedMotion,
}: {
  mode: SignalModeConfig;
  reducedMotion: boolean;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const orbRefs = useRef<Array<THREE.Group | null>>([]);
  const positions = useRef(orbSpecs.map((orb) => new THREE.Vector3(...orb.position)));
  const velocities = useRef(orbSpecs.map((orb) => new THREE.Vector3(...orb.velocity)));
  const bounds = { x: 2.35, y: 1.25, z: 0.7 };
  const glowTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;

    const context = canvas.getContext('2d');

    if (context) {
      const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.2, 'rgba(255,255,255,0.72)');
      gradient.addColorStop(0.52, 'rgba(255,255,255,0.22)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, 256, 256);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  useFrame(({ clock, pointer }, delta) => {
    if (!groupRef.current) {
      return;
    }

    groupRef.current.rotation.y = pointer.x * 0.08;
    groupRef.current.rotation.x = -pointer.y * 0.04;

    orbSpecs.forEach((orb, index) => {
      const orbGroup = orbRefs.current[index];

      if (!orbGroup) {
        return;
      }

      if (!reducedMotion) {
        const position = positions.current[index];
        const velocity = velocities.current[index];

        position.addScaledVector(velocity, delta);

        if (Math.abs(position.x) + orb.radius > bounds.x) {
          velocity.x *= -1;
          position.x = Math.sign(position.x) * (bounds.x - orb.radius);
        }

        if (Math.abs(position.y) + orb.radius > bounds.y) {
          velocity.y *= -1;
          position.y = Math.sign(position.y) * (bounds.y - orb.radius);
        }

        if (Math.abs(position.z) + orb.radius > bounds.z) {
          velocity.z *= -1;
          position.z = Math.sign(position.z) * (bounds.z - orb.radius);
        }

        orbGroup.position.copy(position);
      }

      orbGroup.rotation.x = clock.elapsedTime * 0.18 + index;
      orbGroup.rotation.y = clock.elapsedTime * 0.22 + index * 0.4;
    });
  });

  const colorForRole = (role: (typeof orbSpecs)[number]['role']) => {
    if (role === 'accent') return mode.accent;
    if (role === 'secondary') return mode.secondary;
    return mode.accent;
  };

  return (
    <group ref={groupRef}>
      {orbSpecs.map((orb, index) => (
        <group
          key={`${orb.role}-${index}`}
          ref={(orbGroup) => {
            orbRefs.current[index] = orbGroup;
          }}
          position={orb.position}
        >
          <pointLight color={colorForRole(orb.role)} intensity={1.8} distance={orb.radius * 4.2} />
          <sprite scale={[orb.radius * 3.1, orb.radius * 3.1, 1]}>
            <spriteMaterial
              map={glowTexture}
              color={colorForRole(orb.role)}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              opacity={0.48}
              transparent
            />
          </sprite>
          <mesh>
            <sphereGeometry args={[orb.radius, 64, 64]} />
            <meshPhysicalMaterial
              color={colorForRole(orb.role)}
              emissive={colorForRole(orb.role)}
              emissiveIntensity={1.05}
              metalness={0}
              opacity={0.5}
              roughness={0.1}
              transmission={0.28}
              transparent
              depthWrite={false}
            />
          </mesh>
          <mesh>
            <sphereGeometry args={[orb.radius * 0.36, 32, 32]} />
            <meshBasicMaterial
              color={mode.hot}
              blending={THREE.AdditiveBlending}
              opacity={0.54}
              transparent
              depthWrite={false}
            />
          </mesh>
          {sparkOffsets.map(([x, y, z], sparkIndex) => (
            <mesh
              key={`${index}-${sparkIndex}`}
              position={[x * orb.radius, y * orb.radius, z * orb.radius]}
            >
              <sphereGeometry args={[orb.radius * 0.026, 12, 12]} />
              <meshBasicMaterial
                color={sparkIndex % 2 === 0 ? mode.hot : mode.secondary}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                opacity={0.52}
                transparent
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
};

const SignalModules = ({
  mode,
  onCycle,
}: {
  mode: SignalModeConfig;
  onCycle: () => void;
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [supportsWebGL, setSupportsWebGL] = useState(false);

  useEffect(() => {
    setSupportsWebGL(hasWebGLSupport());
  }, []);

  if (!supportsWebGL || prefersReducedMotion) {
    return (
      <button
        type="button"
        onClick={onCycle}
        className="relative flex aspect-[1.55] w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#11141a] shadow-2xl"
        style={{ boxShadow: `0 32px 120px ${mode.glow}` }}
        aria-label={`Current mode: ${mode.label}. Cycle signal mode.`}
      >
        <span className="absolute inset-0 grid place-items-center text-4xl font-black uppercase tracking-[0.18em] text-white/92 md:text-7xl">
          {mode.label}
        </span>
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <span
              key={index}
              className="h-14 w-14 rounded-full border border-white/20 opacity-70 blur-[0.5px]"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${mode.hot}, ${index % 2 === 0 ? mode.accent : mode.secondary} 52%, transparent 74%)`,
                boxShadow: `0 0 28px ${index % 2 === 0 ? mode.accent : mode.secondary}`,
              }}
            />
          ))}
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onCycle}
      className="relative h-[360px] w-full overflow-hidden rounded-2xl border border-black/10 outline-none transition focus-visible:ring-2 focus-visible:ring-white/70 md:h-[510px]"
      style={{ background: mode.surface, boxShadow: `0 30px 110px ${mode.glow}` }}
      aria-label={`Current mode: ${mode.label}. Cycle signal mode.`}
    >
      <Canvas camera={{ position: [0, 0, 5.2], fov: 42 }} dpr={[1, 1.8]}>
        <Suspense fallback={null}>
          <color attach="background" args={[mode.surface]} />
          <ambientLight intensity={0.28} />
          <directionalLight position={[3, 4, 6]} intensity={1.2} />
          <pointLight position={[-3.4, 1.8, 3]} color={mode.accent} intensity={16} distance={8} />
          <pointLight position={[3.2, -1.7, 2.5]} color={mode.secondary} intensity={11} distance={7} />
          <pointLight position={[0, 0, 3]} color={mode.hot} intensity={6} distance={5} />
          <SignalModulesMesh mode={mode} reducedMotion={Boolean(prefersReducedMotion)} />
          <Environment preset="studio" />
        </Suspense>
      </Canvas>
      <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center text-center">
        <span className="block text-4xl font-black uppercase tracking-[0.18em] text-white drop-shadow-[0_4px_28px_rgba(0,0,0,0.65)] md:text-7xl">
          {mode.label}
        </span>
      </div>
    </button>
  );
};

const LandingPage = () => {
  const [signalMode, setSignalMode] = useState<SignalMode>('engineer');

  useEffect(() => {
    const cycleTimer = window.setTimeout(() => {
      setSignalMode((mode) => nextSignalMode(mode));
    }, 5000);

    return () => window.clearTimeout(cycleTimer);
  }, [signalMode]);

  const currentMode = useMemo(
    () => signalModes.find((mode) => mode.id === signalMode) ?? signalModes[0],
    [signalMode],
  );

  return (
    <div className="min-h-screen overflow-hidden bg-[#f2f2ed] text-slate-950">
      <section id="intro" className="relative min-h-screen overflow-hidden px-5 pb-10 pt-24 md:px-8">
        <div
          className="absolute inset-x-0 top-0 h-[52vh] opacity-80"
          style={{
            background: `radial-gradient(circle at 70% 10%, ${currentMode.glow}, transparent 42%)`,
          }}
        />

        <div className="relative mx-auto flex min-h-[calc(100vh-8rem)] max-w-6xl flex-col justify-center gap-8">
          <header className="flex justify-center">
            <Link
              to="/profile"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-slate-950 px-7 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-slate-800"
            >
              Open Profile
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </header>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="relative"
          >
            <SignalModules mode={currentMode} onCycle={() => setSignalMode((mode) => nextSignalMode(mode))} />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
