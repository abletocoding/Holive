"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useMemo, useRef } from "react";
import type { Mesh } from "three";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

function SacredMark() {
  const ring = useRef<Mesh>(null);
  const core = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (ring.current) ring.current.rotation.z += delta * 0.15;
    if (core.current) core.current.rotation.y += delta * 0.35;
  });

  const torusArgs = useMemo(() => [1.35, 0.035, 16, 100] as const, []);

  return (
    <Float speed={1.2} rotationIntensity={0.35} floatIntensity={0.6}>
      <group>
        <mesh ref={ring} rotation={[Math.PI / 2.4, 0.2, 0]}>
          <torusGeometry args={torusArgs} />
          <meshStandardMaterial
            color="#e0c35a"
            emissive="#b8922a"
            emissiveIntensity={0.45}
            metalness={0.7}
            roughness={0.25}
          />
        </mesh>
        <mesh ref={core} scale={[0.55, 0.85, 0.55]}>
          <sphereGeometry args={[0.55, 32, 32]} />
          <meshStandardMaterial
            color="#4a1d7a"
            emissive="#9b6dff"
            emissiveIntensity={0.35}
            metalness={0.4}
            roughness={0.4}
          />
        </mesh>
        <mesh position={[0.18, 0.12, 0.42]}>
          <sphereGeometry args={[0.14, 24, 24]} />
          <meshStandardMaterial
            color="#f0d878"
            emissive="#e0c35a"
            emissiveIntensity={0.8}
          />
        </mesh>
      </group>
    </Float>
  );
}

export function HeroScene() {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-end pr-[8%] opacity-40"
      >
        <div className="h-40 w-40 rounded-full border border-[var(--holive-gold)]/50 shadow-[var(--glow-gold)] md:h-56 md:w-56" />
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-80"
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 4.2], fov: 42 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.35} />
        <pointLight position={[3, 2, 4]} intensity={1.2} color="#e0c35a" />
        <pointLight position={[-3, -1, 2]} intensity={0.8} color="#9b6dff" />
        <group position={[1.35, 0.15, 0]}>
          <SacredMark />
        </group>
      </Canvas>
    </div>
  );
}
