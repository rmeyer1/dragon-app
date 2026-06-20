import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { motion, useReducedMotion } from 'framer-motion';
import * as THREE from 'three';
import { ArrowUpRight } from 'lucide-react';

const hasWebGLSupport = () => {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  } catch {
    return false;
  }
};

type OrbConfig = {
  id: string;
  basePosition: [number, number, number];
  scale: number;
  drift: [number, number, number];
  speed: number;
  phase: number;
};

const orbConfigs: OrbConfig[] = [
  { id: 'primary', basePosition: [1.34, 0.2, 0], scale: 1.28, drift: [0.46, 0.28, 0.42], speed: 0.74, phase: 0 },
  { id: 'upper-left', basePosition: [-1.05, 0.92, -0.7], scale: 0.62, drift: [0.38, 0.24, 0.34], speed: 0.9, phase: 1.8 },
  { id: 'lower-right', basePosition: [2.32, -1.18, 0.52], scale: 0.48, drift: [0.32, 0.2, 0.3], speed: 1.05, phase: 3.4 },
  { id: 'lower-center', basePosition: [-0.26, -1.18, 0.28], scale: 0.42, drift: [0.3, 0.18, 0.28], speed: 0.86, phase: 4.7 },
];

const sparks = Array.from({ length: 30 }, (_, index) => {
  const angle = (index / 30) * Math.PI * 2;
  const radius = 0.72 + (index % 5) * 0.07;

  return {
    id: index,
    position: [
      Math.cos(angle) * radius,
      Math.sin(angle * 1.7) * 0.22,
      Math.sin(angle) * radius * 0.58,
    ] as const,
    size: index % 4 === 0 ? 0.014 : 0.009,
    color: index % 5 === 0 ? '#fed7aa' : index % 2 === 0 ? '#67e8f9' : '#f0abfc',
  };
});

const orbVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  uniform float uTime;
  uniform float uPulse;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec3 displaced = position + normal * (sin((uv.y * 18.0) + uTime * 1.9) * 0.025 * uPulse);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const orbFragmentShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  uniform float uTime;
  uniform vec3 uAqua;
  uniform vec3 uViolet;
  uniform vec3 uFlame;

  void main() {
    vec2 center = vUv - 0.5;
    float angle = atan(center.y, center.x);
    float radius = length(center);
    float swirl = sin(angle * 6.0 + radius * 20.0 - uTime * 2.35);
    float counter = sin(angle * -4.0 + radius * 26.0 + uTime * 1.55);
    float veins = smoothstep(0.55, 0.96, max(swirl, counter));
    float rim = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0))), 1.55);
    vec3 color = mix(uViolet, uAqua, smoothstep(-0.25, 0.85, swirl));
    color = mix(color, uFlame, smoothstep(0.62, 1.0, counter) * 0.72);
    float alpha = 0.16 + veins * 0.5 + rim * 0.35;
    gl_FragColor = vec4(color, alpha);
  }
`;

const useGlowTexture = () =>
  useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d');

    if (context) {
      const gradient = context.createRadialGradient(128, 128, 6, 128, 128, 128);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.18, 'rgba(244,114,250,0.78)');
      gradient.addColorStop(0.48, 'rgba(34,211,238,0.38)');
      gradient.addColorStop(1, 'rgba(34,211,238,0)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, 256, 256);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

const EnergyOrb = ({ config, reducedMotion }: { config: OrbConfig; reducedMotion: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);
  const shellRef = useRef<THREE.ShaderMaterial>(null);
  const ribbonRef = useRef<THREE.Group>(null);
  const glowTexture = useGlowTexture();
  const shaderArgs = useMemo<THREE.ShaderMaterialParameters>(
    () => ({
      uniforms: {
        uTime: { value: config.phase },
        uPulse: { value: config.scale },
        uAqua: { value: new THREE.Color('#35e6ff') },
        uViolet: { value: new THREE.Color('#a855f7') },
        uFlame: { value: new THREE.Color('#fb923c') },
      },
      vertexShader: orbVertexShader,
      fragmentShader: orbFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
    [config.phase, config.scale],
  );

  useFrame(({ clock, pointer }) => {
    const elapsed = clock.elapsedTime;
    const motion = reducedMotion ? 0 : elapsed * config.speed + config.phase;

    if (groupRef.current) {
      const x = config.basePosition[0] + Math.sin(motion * 0.72) * config.drift[0] + pointer.x * 0.1;
      const y = config.basePosition[1] + Math.sin(motion * 1.12 + 0.7) * config.drift[1] + pointer.y * 0.08;
      const z = config.basePosition[2] + Math.cos(motion * 0.82) * config.drift[2];
      groupRef.current.position.set(x, y, z);
      groupRef.current.rotation.x = Math.sin(motion * 0.42) * 0.2;
      groupRef.current.rotation.y = motion * 0.42;
      groupRef.current.rotation.z = Math.cos(motion * 0.36) * 0.14;
      groupRef.current.scale.setScalar(config.scale * (1 + Math.sin(motion * 1.7) * 0.028));
    }

    if (shellRef.current) {
      shellRef.current.uniforms.uTime.value = elapsed + config.phase;
    }

    if (ribbonRef.current) {
      ribbonRef.current.rotation.x = motion * 0.34;
      ribbonRef.current.rotation.y = -motion * 0.48;
    }
  });

  return (
    <group ref={groupRef}>
      <sprite scale={[2.95, 2.95, 1]}>
        <spriteMaterial map={glowTexture} color="#8b5cf6" blending={THREE.AdditiveBlending} depthWrite={false} transparent opacity={0.56} />
      </sprite>

      <mesh>
        <sphereGeometry args={[0.58, 64, 64]} />
        <meshPhysicalMaterial
          color="#dffcff"
          emissive="#22d3ee"
          emissiveIntensity={0.28}
          metalness={0}
          opacity={0.12}
          roughness={0.02}
          transmission={0.72}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[0.62, 96, 96]} />
        <shaderMaterial ref={shellRef} args={[shaderArgs]} />
      </mesh>

      <sprite scale={[0.86, 0.86, 1]}>
        <spriteMaterial map={glowTexture} color="#fff7ed" blending={THREE.AdditiveBlending} depthWrite={false} transparent opacity={0.82} />
      </sprite>

      <mesh scale={[0.11, 0.11, 0.11]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#fff7ed" blending={THREE.AdditiveBlending} transparent opacity={0.92} depthWrite={false} />
      </mesh>

      <group ref={ribbonRef} scale={[0.9, 0.9, 0.9]}>
        <mesh rotation={[Math.PI / 2.2, 0.2, 0.25]}>
          <torusKnotGeometry args={[0.43, 0.007, 220, 10, 2, 5]} />
          <meshBasicMaterial color="#38bdf8" blending={THREE.AdditiveBlending} transparent opacity={0.42} depthWrite={false} />
        </mesh>
        <mesh rotation={[Math.PI / 2.75, Math.PI / 3, -0.28]}>
          <torusKnotGeometry args={[0.45, 0.006, 220, 10, 3, 4]} />
          <meshBasicMaterial color="#e879f9" blending={THREE.AdditiveBlending} transparent opacity={0.36} depthWrite={false} />
        </mesh>
        <mesh rotation={[Math.PI / 1.75, -Math.PI / 5, 0.18]}>
          <torusGeometry args={[0.54, 0.006, 12, 180]} />
          <meshBasicMaterial color="#fb923c" blending={THREE.AdditiveBlending} transparent opacity={0.34} depthWrite={false} />
        </mesh>
      </group>

      <group>
        {sparks.map((spark) => (
          <mesh key={`${config.id}-${spark.id}`} position={spark.position}>
            <sphereGeometry args={[spark.size, 10, 10]} />
            <meshBasicMaterial color={spark.color} blending={THREE.AdditiveBlending} transparent opacity={0.86} depthWrite={false} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

const OrbField = ({ reducedMotion }: { reducedMotion: boolean }) => {
  const rootRef = useRef<THREE.Group>(null);

  useFrame(({ clock, pointer }) => {
    if (!rootRef.current) return;
    const elapsed = reducedMotion ? 0 : clock.elapsedTime;
    rootRef.current.rotation.x = -0.1 + pointer.y * 0.08;
    rootRef.current.rotation.y = Math.sin(elapsed * 0.12) * 0.08 + pointer.x * 0.12;
  });

  return (
    <group ref={rootRef}>
      <pointLight color="#38bdf8" intensity={7.8} distance={8} position={[-1.8, 1.6, 2.3]} />
      <pointLight color="#e879f9" intensity={7} distance={7} position={[2.2, 0.2, 2.1]} />
      <pointLight color="#fb923c" intensity={4.4} distance={6} position={[0.8, -1.8, 1.9]} />
      {orbConfigs.map((config) => (
        <EnergyOrb key={config.id} config={config} reducedMotion={reducedMotion} />
      ))}
    </group>
  );
};

const FallbackCore = () => (
  <div className="absolute inset-0 grid place-items-center bg-[#050b0c]">
    <div className="relative h-[74vmin] w-[74vmin]">
      <div className="absolute inset-[4%] rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="absolute inset-[11%] rounded-full border border-cyan-200/40 shadow-[0_0_120px_rgba(34,211,238,0.38)]" />
      <div className="absolute inset-[23%] rounded-full border border-fuchsia-300/40 shadow-[0_0_90px_rgba(217,70,239,0.32)]" />
      <div className="absolute inset-[38%] rounded-full bg-orange-200/40 blur-xl" />
    </div>
  </div>
);

const LandingScene = () => {
  const prefersReducedMotion = useReducedMotion();
  const [supportsWebGL, setSupportsWebGL] = useState(false);

  useEffect(() => {
    setSupportsWebGL(hasWebGLSupport());
  }, []);

  if (!supportsWebGL || prefersReducedMotion) {
    return <FallbackCore />;
  }

  return (
    <Canvas camera={{ position: [0, 0, 6.4], fov: 44 }} dpr={[1, 1.7]} gl={{ antialias: true, alpha: false }}>
      <Suspense fallback={null}>
        <color attach="background" args={['#03050a']} />
        <fog attach="fog" args={['#03050a', 5.6, 11]} />
        <ambientLight intensity={0.2} />
        <directionalLight position={[2.4, 3.8, 4.2]} intensity={0.7} />
        <OrbField reducedMotion={Boolean(prefersReducedMotion)} />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
};

const LandingPage = () => {
  return (
    <div className="min-h-screen overflow-hidden bg-[#03050a] text-white">
      <section id="intro" className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0">
          <LandingScene />
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_68%_45%,rgba(217,70,239,0.12),transparent_30%),radial-gradient(circle_at_76%_18%,rgba(34,211,238,0.11),transparent_26%),linear-gradient(90deg,rgba(3,5,10,0.88)_0%,rgba(3,5,10,0.38)_45%,rgba(3,5,10,0.08)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[48vh] bg-gradient-to-t from-[#03050a] via-[#03050a]/72 to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-end px-5 pb-12 pt-28 md:px-8 md:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex w-full flex-col gap-5 sm:w-auto"
          >
            <p className="text-sm font-black uppercase tracking-[0.32em] text-teal-200">Rob Meyer</p>
            <Link
              to="/profile"
              className="inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-black uppercase tracking-[0.14em] text-slate-950 shadow-[0_0_38px_rgba(34,211,238,0.28)] transition hover:bg-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#03050a]"
            >
              Enter portfolio
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
