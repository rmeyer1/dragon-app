import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { motion, useReducedMotion } from 'framer-motion';
import * as THREE from 'three';
import { Menu, X } from 'lucide-react';
import { profileSummary } from '@/data/profile';

const hasWebGLSupport = () => {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  } catch {
    return false;
  }
};

type SignalFormConfig = {
  id: string;
  basePosition: [number, number, number];
  colorA: string;
  colorB: string;
  colorC: string;
  drift: [number, number, number];
  phase: number;
  scale: [number, number, number];
  speed: number;
};

const signalForms: SignalFormConfig[] = [
  {
    id: 'core',
    basePosition: [1.08, 0.08, -0.1],
    colorA: '#5ee7ff',
    colorB: '#8b5cf6',
    colorC: '#f59e0b',
    drift: [0.42, 0.22, 0.22],
    phase: 0,
    scale: [2.05, 1.76, 1.16],
    speed: 0.34,
  },
  {
    id: 'left-signal',
    basePosition: [-1.38, 0.72, -0.58],
    colorA: '#14f1d9',
    colorB: '#4f46e5',
    colorC: '#f8fafc',
    drift: [0.28, 0.2, 0.16],
    phase: 1.8,
    scale: [0.86, 0.72, 0.62],
    speed: 0.42,
  },
  {
    id: 'lower-pulse',
    basePosition: [-0.52, -1.3, -0.2],
    colorA: '#22d3ee',
    colorB: '#a855f7',
    colorC: '#f97316',
    drift: [0.24, 0.18, 0.16],
    phase: 3.2,
    scale: [0.72, 0.58, 0.5],
    speed: 0.38,
  },
  {
    id: 'right-node',
    basePosition: [2.5, -1.0, -0.44],
    colorA: '#7dd3fc',
    colorB: '#c084fc',
    colorC: '#facc15',
    drift: [0.26, 0.18, 0.2],
    phase: 4.4,
    scale: [0.7, 0.58, 0.48],
    speed: 0.48,
  },
];

const navItems = [
  { label: 'Work', href: '/profile#projects' },
  { label: 'Systems', href: '/profile#about' },
  { label: 'Profile', href: '/profile' },
  { label: 'Contact', href: '/profile#contact' },
  { label: 'GitHub', href: profileSummary.githubUrl, external: true },
  { label: 'LinkedIn', href: profileSummary.linkedinUrl, external: true },
];

const sparks = Array.from({ length: 44 }, (_, index) => {
  const angle = (index / 44) * Math.PI * 2;
  const radius = 0.86 + (index % 6) * 0.08;

  return {
    id: index,
    color: index % 5 === 0 ? '#fef3c7' : index % 2 === 0 ? '#67e8f9' : '#d8b4fe',
    position: [
      Math.cos(angle) * radius,
      Math.sin(angle * 1.35) * 0.28,
      Math.sin(angle) * radius * 0.54,
    ] as const,
    size: index % 5 === 0 ? 0.016 : 0.01,
  };
});

const signalVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  uniform float uTime;
  uniform float uPulse;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    float wave = sin((uv.y * 11.0) + uTime * 0.9) + cos((uv.x * 14.0) - uTime * 0.7);
    vec3 displaced = position + normal * wave * 0.045 * uPulse;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const signalFragmentShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  uniform float uTime;
  uniform vec3 uA;
  uniform vec3 uB;
  uniform vec3 uC;

  void main() {
    vec2 center = vUv - 0.5;
    float angle = atan(center.y, center.x);
    float radius = length(center);
    float sweep = sin(angle * 3.0 + radius * 18.0 - uTime * 0.82);
    float counter = cos(angle * -5.0 + radius * 13.0 + uTime * 0.56);
    float haze = smoothstep(0.08, 0.7, 1.0 - radius);
    float rim = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0))), 1.2);
    vec3 color = mix(uB, uA, smoothstep(-0.44, 0.78, sweep));
    color = mix(color, uC, smoothstep(0.34, 1.0, counter) * 0.72);
    float alpha = 0.14 + haze * 0.26 + rim * 0.42;
    gl_FragColor = vec4(color, alpha);
  }
`;

const useGlowTexture = () =>
  useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 384;
    canvas.height = 384;
    const context = canvas.getContext('2d');

    if (context) {
      const gradient = context.createRadialGradient(192, 192, 6, 192, 192, 192);
      gradient.addColorStop(0, 'rgba(255,255,255,0.95)');
      gradient.addColorStop(0.18, 'rgba(103,232,249,0.68)');
      gradient.addColorStop(0.48, 'rgba(168,85,247,0.38)');
      gradient.addColorStop(1, 'rgba(15,23,42,0)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, 384, 384);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

const SignalForm = ({
  config,
  reducedMotion,
}: {
  config: SignalFormConfig;
  reducedMotion: boolean;
}) => {
  const formRef = useRef<THREE.Group>(null);
  const shellRef = useRef<THREE.ShaderMaterial>(null);
  const orbitRef = useRef<THREE.Group>(null);
  const glowTexture = useGlowTexture();
  const shaderArgs = useMemo<THREE.ShaderMaterialParameters>(
    () => ({
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      fragmentShader: signalFragmentShader,
      side: THREE.DoubleSide,
      transparent: true,
      uniforms: {
        uA: { value: new THREE.Color(config.colorA) },
        uB: { value: new THREE.Color(config.colorB) },
        uC: { value: new THREE.Color(config.colorC) },
        uPulse: { value: config.scale[0] },
        uTime: { value: config.phase },
      },
      vertexShader: signalVertexShader,
    }),
    [config.colorA, config.colorB, config.colorC, config.phase, config.scale],
  );

  useFrame(({ clock, pointer }) => {
    const elapsed = clock.elapsedTime;
    const motion = reducedMotion ? config.phase : elapsed * config.speed + config.phase;

    if (formRef.current) {
      formRef.current.position.set(
        config.basePosition[0] + Math.sin(motion * 0.62) * config.drift[0] + pointer.x * 0.12,
        config.basePosition[1] + Math.cos(motion * 0.74) * config.drift[1] + pointer.y * 0.09,
        config.basePosition[2] + Math.sin(motion * 0.42) * config.drift[2],
      );
      formRef.current.rotation.x = Math.sin(motion * 0.3) * 0.18;
      formRef.current.rotation.y = motion * 0.28;
      formRef.current.rotation.z = Math.cos(motion * 0.24) * 0.14;
      formRef.current.scale.set(
        config.scale[0] * (1 + Math.sin(motion * 1.1) * 0.025),
        config.scale[1] * (1 + Math.cos(motion * 0.9) * 0.025),
        config.scale[2],
      );
    }

    if (shellRef.current) {
      shellRef.current.uniforms.uTime.value = elapsed + config.phase;
    }

    if (orbitRef.current) {
      orbitRef.current.rotation.x = motion * 0.18;
      orbitRef.current.rotation.y = -motion * 0.22;
    }
  });

  return (
    <group ref={formRef}>
      <sprite scale={[2.6, 2.6, 1]}>
        <spriteMaterial
          blending={THREE.AdditiveBlending}
          color={config.colorB}
          depthWrite={false}
          map={glowTexture}
          opacity={0.5}
          transparent
        />
      </sprite>

      <mesh>
        <sphereGeometry args={[0.62, 96, 96]} />
        <shaderMaterial ref={shellRef} args={[shaderArgs]} />
      </mesh>

      <mesh scale={[0.18, 0.18, 0.18]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          blending={THREE.AdditiveBlending}
          color="#fff7ed"
          depthWrite={false}
          opacity={0.74}
          transparent
        />
      </mesh>

      <group ref={orbitRef}>
        <mesh rotation={[Math.PI / 2.3, 0.18, 0.16]}>
          <torusKnotGeometry args={[0.56, 0.006, 240, 10, 2, 5]} />
          <meshBasicMaterial
            blending={THREE.AdditiveBlending}
            color={config.colorA}
            depthWrite={false}
            opacity={0.3}
            transparent
          />
        </mesh>
        <mesh rotation={[Math.PI / 2.1, Math.PI / 3, -0.22]}>
          <torusGeometry args={[0.7, 0.005, 12, 200]} />
          <meshBasicMaterial
            blending={THREE.AdditiveBlending}
            color={config.colorC}
            depthWrite={false}
            opacity={0.24}
            transparent
          />
        </mesh>
      </group>

      <group>
        {sparks.map((spark) => (
          <mesh key={`${config.id}-${spark.id}`} position={spark.position}>
            <sphereGeometry args={[spark.size, 10, 10]} />
            <meshBasicMaterial
              blending={THREE.AdditiveBlending}
              color={spark.color}
              depthWrite={false}
              opacity={0.78}
              transparent
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};

const SignalField = ({ reducedMotion }: { reducedMotion: boolean }) => {
  const rootRef = useRef<THREE.Group>(null);

  useFrame(({ clock, pointer }) => {
    if (!rootRef.current) return;

    const elapsed = reducedMotion ? 0 : clock.elapsedTime;
    rootRef.current.rotation.x = -0.08 + pointer.y * 0.08;
    rootRef.current.rotation.y = Math.sin(elapsed * 0.08) * 0.08 + pointer.x * 0.12;
  });

  return (
    <group ref={rootRef}>
      <pointLight color="#67e8f9" distance={10} intensity={8} position={[-2.4, 1.4, 3]} />
      <pointLight color="#a855f7" distance={9} intensity={7} position={[2.4, 0.4, 2.5]} />
      <pointLight color="#f59e0b" distance={7} intensity={4} position={[0.6, -1.8, 2.1]} />
      {signalForms.map((config) => (
        <SignalForm config={config} key={config.id} reducedMotion={reducedMotion} />
      ))}
    </group>
  );
};

const FallbackCore = () => (
  <div className="absolute inset-0 grid place-items-center bg-[#03050a]">
    <div className="relative h-[82vmin] w-[82vmin]">
      <div className="absolute inset-[3%] rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="absolute inset-[18%] rounded-full bg-violet-500/30 blur-3xl" />
      <div className="absolute inset-[36%] rounded-full bg-amber-200/40 blur-2xl" />
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
    <Canvas
      camera={{ fov: 42, position: [0, 0, 6.2] }}
      dpr={[1, 1.7]}
      gl={{ alpha: false, antialias: true }}
    >
      <Suspense fallback={null}>
        <color args={['#03050a']} attach="background" />
        <fog args={['#03050a', 5.4, 11]} attach="fog" />
        <ambientLight intensity={0.18} />
        <directionalLight intensity={0.54} position={[2.8, 3.8, 4.6]} />
        <SignalField reducedMotion={Boolean(prefersReducedMotion)} />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
};

const LandingNavLink = ({
  external,
  href,
  label,
  onClick,
}: {
  external?: boolean;
  href: string;
  label: string;
  onClick?: () => void;
}) => {
  const className =
    'rounded-sm text-sm font-black uppercase tracking-[0.18em] text-white transition hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-4 focus-visible:ring-offset-[#03050a]';

  if (external) {
    return (
      <a className={className} href={href} rel="noreferrer" target="_blank">
        {label}
      </a>
    );
  }

  return (
    <Link className={className} onClick={onClick} to={href}>
      {label}
    </Link>
  );
};

const LandingPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: -80, y: -80 });

  return (
    <div
      className="min-h-screen overflow-hidden bg-[#03050a] text-white"
      onMouseMove={(event) => {
        setCursorPosition({ x: event.clientX, y: event.clientY });
      }}
    >
      <section className="relative h-screen min-h-[640px] overflow-hidden">
        <div className="absolute inset-0">
          <LandingScene />
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_22%,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_64%_54%,rgba(168,85,247,0.18),transparent_34%),linear-gradient(90deg,rgba(3,5,10,0.94)_0%,rgba(3,5,10,0.5)_42%,rgba(3,5,10,0.1)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[44vh] bg-gradient-to-t from-[#03050a] via-[#03050a]/74 to-transparent" />

        <motion.header
          animate={{ opacity: 1, y: 0 }}
          className="absolute inset-x-0 top-0 z-20 flex items-start justify-between px-5 pt-6 md:px-10 md:pt-8"
          initial={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <Link
            className="rounded-sm text-lg font-black uppercase tracking-[0.28em] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-4 focus-visible:ring-offset-[#03050a] md:text-xl"
            to="/profile"
          >
            R0BFOLIO
          </Link>
          <div className="hidden max-w-[260px] text-right text-[11px] font-bold uppercase leading-5 tracking-[0.2em] text-cyan-100/78 md:block">
            Product systems / practical AI / delivery signal
          </div>
        </motion.header>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-none absolute left-5 top-[54%] z-10 max-w-[330px] -translate-y-1/2 drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] md:left-10"
          initial={{ opacity: 0, y: 18 }}
          transition={{ delay: 0.12, duration: 0.65, ease: 'easeOut' }}
        >
          <p className="text-xs font-black uppercase tracking-[0.32em] text-cyan-200/90">
            Rob Meyer
          </p>
          <p className="mt-4 text-3xl font-black uppercase leading-none tracking-normal text-white sm:text-5xl">
            Signal over noise.
          </p>
        </motion.div>

        <motion.nav
          animate={{ opacity: 1, y: 0 }}
          aria-label="Landing navigation"
          className="absolute inset-0 z-20 hidden items-end px-10 pb-8 md:flex"
          initial={{ opacity: 0, y: 16 }}
          transition={{ delay: 0.22, duration: 0.55, ease: 'easeOut' }}
        >
          <div className="grid w-full grid-cols-[auto_repeat(6,minmax(0,1fr))] items-center gap-7">
            <Link
              aria-label="Enter portfolio"
              className="grid size-9 place-items-center rounded-sm text-4xl font-light leading-none text-white transition hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-4 focus-visible:ring-offset-[#03050a]"
              to="/profile"
            >
              +
            </Link>
            {navItems.map((item) => (
              <LandingNavLink
                external={item.external}
                href={item.href}
                key={item.label}
                label={item.label}
              />
            ))}
          </div>
        </motion.nav>

        <div className="absolute inset-0 z-30 flex items-end justify-center pb-6 md:hidden">
          <button
            className="inline-flex h-11 items-center gap-2 rounded-sm px-4 text-sm font-black uppercase tracking-[0.18em] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-4 focus-visible:ring-offset-[#03050a]"
            onClick={() => setMenuOpen(true)}
            type="button"
          >
            <Menu className="h-4 w-4" />
            Menu
          </button>
        </div>

        {menuOpen && (
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 grid place-items-center bg-[#03050a]/94 px-6 backdrop-blur-xl md:hidden"
            initial={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <button
              aria-label="Close menu"
              className="absolute right-5 top-5 grid size-11 place-items-center rounded-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-4 focus-visible:ring-offset-[#03050a]"
              onClick={() => setMenuOpen(false)}
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
            <nav aria-label="Mobile landing navigation" className="grid gap-8 text-center">
              {navItems.map((item) => (
                <LandingNavLink
                  external={item.external}
                  href={item.href}
                  key={item.label}
                  label={item.label}
                  onClick={() => setMenuOpen(false)}
                />
              ))}
            </nav>
          </motion.div>
        )}

        <div
          aria-hidden="true"
          className="pointer-events-none fixed z-40 hidden size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/80 mix-blend-screen md:block"
          style={{ left: cursorPosition.x, top: cursorPosition.y }}
        />
      </section>
    </div>
  );
};

export default LandingPage;
