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
  { label: 'Profile', href: '/profile' },
  { label: 'LinkedIn', href: profileSummary.linkedinUrl, external: true },
  { label: 'GitHub', href: profileSummary.githubUrl, external: true },
];

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);

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
  const positions = new Float32Array(3000);

  for (let index = 0; index < positions.length; index += 3) {
    const seed = index + 1;
    const x = (((seed * 37) % 1000) / 1000) * 9.2 - 4.6;
    const y = (((seed * 71) % 1000) / 1000) * 5.4 - 2.7;
    const z = -2.2 - (((seed * 131) % 1000) / 1000) * 4.6;

    positions[index] = x;
    positions[index + 1] = y;
    positions[index + 2] = z;
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
      <pointsMaterial color="#f0fbff" opacity={0.96} size={0.034} sizeAttenuation transparent />
    </points>
  );
};

const Meteor = ({ reducedMotion }: { reducedMotion: boolean }) => {
  const meteorRef = useRef<THREE.Group>(null);
  const scheduleRef = useRef({
    duration: 2.35,
    endY: 0.95,
    nextStart: 0,
    rotation: -0.38,
    startY: 2.45,
  });

  useFrame(({ clock }) => {
    if (!meteorRef.current) return;

    const elapsed = clock.elapsedTime;
    const schedule = scheduleRef.current;

    if (reducedMotion) {
      meteorRef.current.position.set(-2.4, 1.9, 0.28);
      meteorRef.current.rotation.z = -0.36;
      meteorRef.current.visible = true;
    } else {
      if (schedule.nextStart === 0) {
        schedule.nextStart = elapsed + randomBetween(0.25, 0.9);
      }

      if (elapsed < schedule.nextStart) {
        meteorRef.current.visible = false;
        return;
      }

      const cycle = (elapsed - schedule.nextStart) / schedule.duration;

      if (cycle >= 1) {
        schedule.duration = randomBetween(1.85, 2.75);
        schedule.endY = randomBetween(0.74, 1.18);
        schedule.nextStart = elapsed + randomBetween(4.8, 12);
        schedule.rotation = randomBetween(-0.43, -0.31);
        schedule.startY = randomBetween(2.32, 2.72);
        meteorRef.current.visible = false;
        return;
      }

      const easedCycle = THREE.MathUtils.smoothstep(cycle, 0, 1);
      const x = THREE.MathUtils.lerp(-3.8, 0.92, easedCycle);
      const y = THREE.MathUtils.lerp(schedule.startY, schedule.endY, easedCycle);
      const z = THREE.MathUtils.lerp(0.12, 0.5, easedCycle);
      const opacity = 0.32 + Math.sin(Math.PI * cycle) * 0.68;

      meteorRef.current.position.set(x, y, z);
      meteorRef.current.rotation.z = schedule.rotation;
      meteorRef.current.visible = opacity > 0.08;
    }

    const opacity = reducedMotion
      ? 0.54
      : 0.32 + Math.sin(Math.PI * ((elapsed - schedule.nextStart) / schedule.duration)) * 0.68;

    meteorRef.current.traverse((child) => {
      const material = (child as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined;
      const materials = Array.isArray(material) ? material : material ? [material] : [];

      materials.forEach((entry) => {
        if ('opacity' in entry) {
          const baseOpacity =
            typeof entry.userData.baseOpacity === 'number' ? entry.userData.baseOpacity : 1;

          entry.opacity = baseOpacity * opacity;
        }
      });
    });
  });

  return (
    <group ref={meteorRef}>
      <mesh position={[0.14, 0, 0]}>
        <icosahedronGeometry args={[0.088, 1]} />
        <meshBasicMaterial
          blending={THREE.AdditiveBlending}
          color="#fff7ed"
          depthTest={false}
          depthWrite={false}
          opacity={0}
          transparent
          userData={{ baseOpacity: 1 }}
        />
      </mesh>
      <mesh position={[0.12, 0, 0]} scale={[1.7, 1.7, 1.7]}>
        <sphereGeometry args={[0.092, 18, 18]} />
        <meshBasicMaterial
          blending={THREE.AdditiveBlending}
          color="#fef3c7"
          depthTest={false}
          depthWrite={false}
          opacity={0}
          transparent
          userData={{ baseOpacity: 0.22 }}
        />
      </mesh>
      <mesh position={[-0.34, 0.01, 0]} scale={[1.12, 0.075, 0.075]}>
        <sphereGeometry args={[1, 24, 8]} />
        <meshBasicMaterial
          blending={THREE.AdditiveBlending}
          color="#fbbf24"
          depthTest={false}
          depthWrite={false}
          opacity={0}
          transparent
          userData={{ baseOpacity: 0.38 }}
        />
      </mesh>
      <mesh position={[-0.86, -0.01, 0]} scale={[1.38, 0.048, 0.048]}>
        <sphereGeometry args={[1, 24, 8]} />
        <meshBasicMaterial
          blending={THREE.AdditiveBlending}
          color="#67e8f9"
          depthTest={false}
          depthWrite={false}
          opacity={0}
          transparent
          userData={{ baseOpacity: 0.3 }}
        />
      </mesh>
      {[
        [-0.24, 0.05, 0, 0.038, '#fff7ed', 0.78],
        [-0.45, -0.04, 0.01, 0.032, '#fbbf24', 0.62],
        [-0.68, 0.045, -0.01, 0.027, '#fde68a', 0.5],
        [-0.96, -0.02, 0, 0.022, '#67e8f9', 0.38],
        [-1.26, 0.03, 0.01, 0.017, '#bae6fd', 0.3],
      ].map(([x, y, z, size, color, baseOpacity]) => (
        <mesh key={`${x}-${y}`} position={[x as number, y as number, z as number]}>
          <sphereGeometry args={[size as number, 12, 12]} />
          <meshBasicMaterial
            blending={THREE.AdditiveBlending}
            color={color as string}
            depthTest={false}
            depthWrite={false}
            opacity={0}
            transparent
            userData={{ baseOpacity }}
          />
        </mesh>
      ))}
    </group>
  );
};

const SpaceScene = ({ reducedMotion }: { reducedMotion: boolean }) => (
  <>
    <ambientLight intensity={0.08} />
    <directionalLight color="#f8fbff" intensity={3.1} position={[-4, 2.4, 4.4]} />
    <pointLight color="#67e8f9" distance={9} intensity={0.9} position={[2.2, 1.1, 2]} />
    <StarField reducedMotion={reducedMotion} />
    <Meteor reducedMotion={reducedMotion} />
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

type MeteorPass = {
  duration: number;
  endY: number;
  id: number;
  rotation: number;
  startedAt: number;
  startY: number;
};

const MeteorOverlay = ({ reducedMotion }: { reducedMotion: boolean }) => {
  const [pass, setPass] = useState<MeteorPass | null>(null);
  const meteorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return undefined;

    let timeoutId: number;

    const queuePass = (wait: number) => {
      timeoutId = window.setTimeout(() => {
        const duration = randomBetween(7.2, 9.5);

        setPass({
          duration,
          endY: randomBetween(26, 42),
          id: Date.now(),
          rotation: randomBetween(-18, -12),
          startedAt: Date.now(),
          startY: randomBetween(12, 25),
        });

        queuePass(duration * 1000 + randomBetween(4800, 12000));
      }, wait);
    };

    queuePass(randomBetween(80, 420));

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (!pass) return undefined;

    let frameId = 0;

    const tick = () => {
      const nextProgress = Math.min((Date.now() - pass.startedAt) / (pass.duration * 1000), 1);
      const easedProgress = THREE.MathUtils.smoothstep(nextProgress, 0, 1);
      const opacity =
        nextProgress < 0.14
          ? nextProgress / 0.14
          : nextProgress < 0.72
            ? THREE.MathUtils.lerp(1, 0.76, (nextProgress - 0.14) / 0.58)
            : THREE.MathUtils.lerp(0.76, 0, (nextProgress - 0.72) / 0.28);
      const x = THREE.MathUtils.lerp(-20, 42, easedProgress);
      const y = THREE.MathUtils.lerp(pass.startY, pass.endY, easedProgress);

      if (meteorRef.current) {
        meteorRef.current.style.opacity = String(opacity);
        meteorRef.current.style.transform = `translate3d(${x}vw, ${y}vh, 0) rotate(${pass.rotation}deg)`;
      }

      if (nextProgress < 1) {
        frameId = window.requestAnimationFrame(tick);
      } else if (meteorRef.current) {
        meteorRef.current.style.opacity = '0';
      }
    };

    frameId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [pass]);

  if (!pass) return null;

  return (
    <div
      key={pass.id}
      ref={meteorRef}
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 z-10 h-20 w-72 origin-right"
      style={{
        opacity: 0,
        transform: `translate3d(-20vw, ${pass.startY}vh, 0) rotate(${pass.rotation}deg)`,
      }}
    >
      <span className="absolute right-2 top-1/2 size-5 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#fff7ed_0%,#fbbf24_34%,rgba(251,191,36,0.32)_58%,transparent_74%)] blur-[0.5px]" />
      <span className="absolute right-0 top-1/2 size-12 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,247,237,0.42),rgba(125,211,252,0.16)_42%,transparent_68%)] blur-sm" />
      <span className="absolute right-8 top-1/2 h-3 w-56 -translate-y-1/2 rounded-full bg-gradient-to-l from-amber-200/70 via-cyan-200/28 to-transparent blur-md" />
      <span className="absolute right-10 top-[42%] h-1.5 w-40 rounded-full bg-gradient-to-l from-white/62 via-amber-200/20 to-transparent blur-[2px]" />
      <span className="absolute right-20 top-[36%] size-1.5 rounded-full bg-amber-100/80" />
      <span className="absolute right-28 top-[58%] size-1 rounded-full bg-cyan-100/70" />
      <span className="absolute right-44 top-[46%] size-1 rounded-full bg-white/55" />
    </div>
  );
};

const LandingPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: -80, y: -80 });
  const prefersReducedMotion = useReducedMotion();

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
        <MeteorOverlay reducedMotion={Boolean(prefersReducedMotion)} />

        <motion.header
          animate={{ opacity: 1, y: 0 }}
          className="absolute left-5 top-6 z-20 md:left-10 md:top-8"
          initial={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <Link
            className="rounded-sm text-base font-black uppercase tracking-[0.22em] text-white transition hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-4 focus-visible:ring-offset-[#020611] md:text-lg"
            to="/profile"
          >
            Rob Meyer
          </Link>
        </motion.header>

        <motion.nav
          animate={{ opacity: 1, y: 0 }}
          aria-label="Landing navigation"
          className="absolute inset-0 z-20 hidden items-end px-10 pb-8 md:flex"
          initial={{ opacity: 0, y: 16 }}
          transition={{ delay: 0.22, duration: 0.55, ease: 'easeOut' }}
        >
          <div className="ml-auto grid w-full max-w-[660px] grid-cols-3 items-center gap-7">
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
