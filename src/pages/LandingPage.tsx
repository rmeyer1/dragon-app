import { Suspense, useEffect, useRef, useState } from 'react';
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

const orbitParticles = Array.from({ length: 56 }, (_, index) => {
  const angle = (index / 56) * Math.PI * 2;
  const band = index % 3;
  const radius = band === 0 ? 1.72 : band === 1 ? 2.08 : 2.42;
  const y = Math.sin(angle * 2.4) * (band === 2 ? 0.32 : 0.22);

  return {
    id: index,
    position: [Math.cos(angle) * radius, y, Math.sin(angle) * radius * 0.42] as const,
    size: band === 1 ? 0.032 : 0.024,
    color: band === 0 ? '#5eead4' : band === 1 ? '#f8fafc' : '#f97316',
  };
});

const SignalCore = ({ reducedMotion }: { reducedMotion: boolean }) => {
  const rootRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const particleRef = useRef<THREE.Group>(null);

  useFrame(({ clock, pointer }) => {
    const elapsed = clock.elapsedTime;

    if (rootRef.current) {
      rootRef.current.rotation.x = -0.14 + pointer.y * 0.08;
      rootRef.current.rotation.y = elapsed * 0.18 + pointer.x * 0.14;
    }

    if (coreRef.current && !reducedMotion) {
      coreRef.current.rotation.x = elapsed * 0.34;
      coreRef.current.rotation.y = elapsed * 0.46;
      const pulse = 1 + Math.sin(elapsed * 1.4) * 0.025;
      coreRef.current.scale.setScalar(pulse);
    }

    if (particleRef.current && !reducedMotion) {
      particleRef.current.rotation.y = -elapsed * 0.42;
      particleRef.current.rotation.z = Math.sin(elapsed * 0.45) * 0.08;
    }
  });

  return (
    <group ref={rootRef} position={[0.9, 0.05, 0]} scale={1.08}>
      <pointLight color="#5eead4" intensity={7} distance={7} position={[-1.9, 1.2, 2.2]} />
      <pointLight color="#f97316" intensity={4.2} distance={6} position={[2.2, -1.2, 2.4]} />
      <pointLight color="#a855f7" intensity={3.6} distance={6} position={[0.2, 1.8, -1.4]} />

      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.78, 2]} />
        <meshPhysicalMaterial
          color="#dffdf8"
          emissive="#5eead4"
          emissiveIntensity={0.55}
          metalness={0.05}
          opacity={0.68}
          roughness={0.05}
          transmission={0.42}
          transparent
        />
      </mesh>

      <mesh rotation={[Math.PI / 2.15, 0, 0]}>
        <torusGeometry args={[1.45, 0.014, 14, 180]} />
        <meshBasicMaterial color="#5eead4" transparent opacity={0.58} />
      </mesh>
      <mesh rotation={[Math.PI / 2.9, Math.PI / 5, Math.PI / 7]}>
        <torusGeometry args={[1.9, 0.01, 12, 180]} />
        <meshBasicMaterial color="#f8fafc" transparent opacity={0.34} />
      </mesh>
      <mesh rotation={[Math.PI / 1.7, -Math.PI / 4, Math.PI / 9]}>
        <torusGeometry args={[2.32, 0.009, 12, 180]} />
        <meshBasicMaterial color="#f97316" transparent opacity={0.4} />
      </mesh>
      <mesh rotation={[Math.PI / 2, Math.PI / 2.85, 0]}>
        <torusKnotGeometry args={[1.62, 0.008, 220, 12, 2, 3]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.28} />
      </mesh>

      <group ref={particleRef}>
        {orbitParticles.map((particle) => (
          <mesh key={particle.id} position={particle.position}>
            <sphereGeometry args={[particle.size, 12, 12]} />
            <meshBasicMaterial color={particle.color} transparent opacity={0.82} />
          </mesh>
        ))}
      </group>

      <mesh position={[0, 0, -0.08]} scale={[1.22, 1.22, 1.22]}>
        <sphereGeometry args={[2.72, 48, 48]} />
        <meshBasicMaterial color="#5eead4" wireframe transparent opacity={0.045} />
      </mesh>
    </group>
  );
};

const FallbackCore = () => (
  <div className="absolute inset-0 grid place-items-center bg-[#050b0c]">
    <div className="relative h-[70vmin] w-[70vmin]">
      <div className="absolute inset-0 rounded-full border border-teal-200/30 shadow-[0_0_110px_rgba(45,212,191,0.28)]" />
      <div className="absolute inset-[16%] rounded-full border border-orange-200/30" />
      <div className="absolute inset-[34%] rounded-full bg-teal-200/20 blur-xl" />
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
    <Canvas camera={{ position: [0, 0, 6.2], fov: 42 }} dpr={[1, 1.7]} gl={{ antialias: true, alpha: false }}>
      <Suspense fallback={null}>
        <color attach="background" args={['#050b0c']} />
        <fog attach="fog" args={['#050b0c', 5.8, 11]} />
        <ambientLight intensity={0.28} />
        <directionalLight position={[2.4, 3.8, 4.2]} intensity={1.05} />
        <SignalCore reducedMotion={Boolean(prefersReducedMotion)} />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
};

const LandingPage = () => {
  return (
    <div className="min-h-screen overflow-hidden bg-[#050b0c] text-white">
      <section id="intro" className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0">
          <LandingScene />
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_68%_45%,rgba(45,212,191,0.08),transparent_31%),linear-gradient(90deg,rgba(5,11,12,0.9)_0%,rgba(5,11,12,0.46)_42%,rgba(5,11,12,0.12)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[48vh] bg-gradient-to-t from-[#050b0c] via-[#050b0c]/74 to-transparent" />

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
              className="inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-black uppercase tracking-[0.14em] text-slate-950 transition hover:bg-teal-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050b0c]"
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
