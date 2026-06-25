import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
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

const navItems = [
  { label: 'Work', href: '/profile#projects' },
  { label: 'Systems', href: '/profile#about' },
  { label: 'Profile', href: '/profile' },
  { label: 'Contact', href: '/profile#contact' },
  { label: 'GitHub', href: profileSummary.githubUrl, external: true },
  { label: 'LinkedIn', href: profileSummary.linkedinUrl, external: true },
];

const atmosphereVertexShader = `
  varying vec3 vNormal;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const atmosphereFragmentShader = `
  varying vec3 vNormal;

  void main() {
    float intensity = pow(0.72 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.1);
    gl_FragColor = vec4(0.36, 0.86, 1.0, intensity * 0.8);
  }
`;

const makeStarPositions = () => {
  const positions = new Float32Array(900);

  for (let index = 0; index < positions.length; index += 3) {
    const seed = index + 1;
    const radius = 7.5 + ((seed * 19) % 100) / 28;
    const theta = ((seed * 97) % 360) * (Math.PI / 180);
    const phi = Math.acos(2 * (((seed * 53) % 100) / 100) - 1);

    positions[index] = radius * Math.sin(phi) * Math.cos(theta);
    positions[index + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[index + 2] = -Math.abs(radius * Math.cos(phi)) - 1.5;
  }

  return positions;
};

const Earth = ({ reducedMotion }: { reducedMotion: boolean }) => {
  const earthRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  const [earthMap, specularMap, cloudMap] = useLoader(THREE.TextureLoader, [
    '/images/earth_atmos_2048.jpg',
    '/images/earth_specular_2048.jpg',
    '/images/earth_clouds_1024.png',
  ]);
  const isNarrow = viewport.width < 5;
  const earthScale = isNarrow ? 1.28 : 1.55;
  const earthPosition: [number, number, number] = isNarrow ? [0.92, 0.08, 0] : [1.2, 0.04, 0];

  useEffect(() => {
    earthMap.colorSpace = THREE.SRGBColorSpace;
    cloudMap.colorSpace = THREE.SRGBColorSpace;
    earthMap.anisotropy = 8;
    specularMap.anisotropy = 8;
    cloudMap.anisotropy = 8;
  }, [cloudMap, earthMap, specularMap]);

  useFrame(({ clock, pointer }) => {
    const elapsed = clock.elapsedTime;
    const rotation = reducedMotion ? 0.38 : elapsed * 0.08;

    if (earthRef.current) {
      earthRef.current.rotation.y = rotation + pointer.x * 0.035;
      earthRef.current.rotation.x = -0.2 + pointer.y * 0.03;
    }

    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = rotation * 1.18 + 0.18;
    }
  });

  return (
    <group position={earthPosition} scale={earthScale}>
      <group ref={earthRef}>
        <mesh>
          <sphereGeometry args={[1, 128, 128]} />
          <meshPhongMaterial
            map={earthMap}
            shininess={18}
            specular={new THREE.Color('#6dd3ff')}
            specularMap={specularMap}
          />
        </mesh>
        <mesh ref={cloudsRef} scale={1.006}>
          <sphereGeometry args={[1, 96, 96]} />
          <meshLambertMaterial
            alphaMap={cloudMap}
            depthWrite={false}
            map={cloudMap}
            opacity={0.34}
            transparent
          />
        </mesh>
      </group>
      <mesh scale={1.08}>
        <sphereGeometry args={[1, 96, 96]} />
        <shaderMaterial
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          fragmentShader={atmosphereFragmentShader}
          side={THREE.BackSide}
          transparent
          vertexShader={atmosphereVertexShader}
        />
      </mesh>
    </group>
  );
};

const StarField = ({ reducedMotion }: { reducedMotion: boolean }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const positions = useMemo(makeStarPositions, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current || reducedMotion) return;

    pointsRef.current.rotation.y = clock.elapsedTime * 0.006;
    pointsRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.05) * 0.015;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          args={[positions, 3]}
          attach="attributes-position"
          count={positions.length / 3}
        />
      </bufferGeometry>
      <pointsMaterial color="#d8f3ff" opacity={0.72} size={0.018} sizeAttenuation transparent />
    </points>
  );
};

const SpaceScene = ({ reducedMotion }: { reducedMotion: boolean }) => (
  <>
    <ambientLight intensity={0.08} />
    <directionalLight color="#f8fbff" intensity={3.1} position={[-4, 2.4, 4.4]} />
    <pointLight color="#67e8f9" distance={9} intensity={0.9} position={[2.2, 1.1, 2]} />
    <StarField reducedMotion={reducedMotion} />
    <Earth reducedMotion={reducedMotion} />
  </>
);

const FallbackCore = () => (
  <div className="absolute inset-0 overflow-hidden bg-[#020611]">
    <div className="absolute -right-[18vmin] top-[18vh] size-[84vmin] rounded-full bg-[radial-gradient(circle_at_34%_34%,#f8fafc_0%,#7dd3fc_8%,#2563eb_30%,#064e3b_48%,#020617_74%)] shadow-[0_0_90px_rgba(56,189,248,0.35)]" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_42%,rgba(56,189,248,0.16),transparent_34%),linear-gradient(90deg,rgba(2,6,17,0.94),rgba(2,6,17,0.24))]" />
  </div>
);

const LandingScene = () => {
  const prefersReducedMotion = useReducedMotion();
  const [supportsWebGL, setSupportsWebGL] = useState(false);

  useEffect(() => {
    setSupportsWebGL(hasWebGLSupport());
  }, []);

  if (!supportsWebGL) {
    return <FallbackCore />;
  }

  return (
    <Canvas
      camera={{ fov: 42, position: [0, 0, 6.5] }}
      dpr={[1, 1.7]}
      gl={{ alpha: false, antialias: true }}
    >
      <Suspense fallback={null}>
        <color args={['#020611']} attach="background" />
        <fog args={['#020611', 7, 13]} attach="fog" />
        <SpaceScene reducedMotion={Boolean(prefersReducedMotion)} />
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
    'rounded-sm text-sm font-black uppercase tracking-[0.18em] text-white transition hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-4 focus-visible:ring-offset-[#020611]';

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
      className="min-h-screen overflow-hidden bg-[#020611] text-white"
      onMouseMove={(event) => {
        setCursorPosition({ x: event.clientX, y: event.clientY });
      }}
    >
      <section className="relative h-screen min-h-[640px] overflow-hidden">
        <div className="absolute inset-0">
          <LandingScene />
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_74%_38%,rgba(56,189,248,0.16),transparent_30%),radial-gradient(circle_at_78%_64%,rgba(168,85,247,0.09),transparent_30%),linear-gradient(90deg,rgba(2,6,17,0.96)_0%,rgba(2,6,17,0.68)_38%,rgba(2,6,17,0.08)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[44vh] bg-gradient-to-t from-[#020611] via-[#020611]/78 to-transparent" />

        <motion.header
          animate={{ opacity: 1, y: 0 }}
          className="absolute inset-x-0 top-0 z-20 flex items-start justify-between px-5 pt-6 md:px-10 md:pt-8"
          initial={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <Link
            className="rounded-sm text-lg font-black uppercase tracking-[0.28em] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-4 focus-visible:ring-offset-[#020611] md:text-xl"
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
              className="grid size-9 place-items-center rounded-sm text-4xl font-light leading-none text-white transition hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-4 focus-visible:ring-offset-[#020611]"
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
            className="inline-flex h-11 items-center gap-2 rounded-sm px-4 text-sm font-black uppercase tracking-[0.18em] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-4 focus-visible:ring-offset-[#020611]"
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
            className="fixed inset-0 z-50 grid place-items-center bg-[#020611]/94 px-6 backdrop-blur-xl md:hidden"
            initial={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <button
              aria-label="Close menu"
              className="absolute right-5 top-5 grid size-11 place-items-center rounded-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-4 focus-visible:ring-offset-[#020611]"
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
