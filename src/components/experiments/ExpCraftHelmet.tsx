"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial } from "@react-three/drei";
import { useTranslations } from "next-intl";
import type { Group } from "three";
import * as THREE from "three";
import { ExperimentFile } from "@/components/experiments/ExperimentFile";
import { ExpCanvas } from "@/components/experiments/r3f/ExpCanvas";
import { useInViewCanvas } from "@/components/experiments/r3f/useInViewCanvas";

function CraftDome({ scroll, speed }: { scroll: number; speed: number }) {
  const group = useRef<Group>(null);

  useFrame((_, dt) => {
    if (!group.current) return;
    group.current.rotation.y += dt * (0.2 + speed * 1.5) + scroll * 0.01;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, scroll * 0.4, 0.05);
  });

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[1.55, 48, 48]} />
        <MeshTransmissionMaterial
          backside
          samples={3}
          thickness={0.45}
          chromaticAberration={0.15 + speed * 0.4}
          color="#4a1d7a"
          attenuationColor="#C9A84C"
          attenuationDistance={1}
          roughness={0.15}
        />
      </mesh>
      <Float speed={1.4} floatIntensity={0.5}>
        <group scale={[0.55, 0.85, 0.55]}>
          <mesh>
            <sphereGeometry args={[0.7, 24, 24]} />
            <meshStandardMaterial color="#330072" emissive="#6B3DB8" emissiveIntensity={0.55} />
          </mesh>
          <mesh position={[0.2, 0.15, 0.55]}>
            <sphereGeometry args={[0.16, 16, 16]} />
            <meshStandardMaterial color="#C9A84C" emissive="#C9A84C" emissiveIntensity={1} />
          </mesh>
        </group>
      </Float>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -1.55, 0]}>
        <cylinderGeometry args={[1.6, 1.7, 0.12, 48]} />
        <meshStandardMaterial color="#101820" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
}

/** EXP-006 — Glass craft helmet with velocity chromatic aberration. */
export function ExpCraftHelmet() {
  const t = useTranslations("Experiments.files.helmet");
  const { ref, inView } = useInViewCanvas();
  const [scroll, setScroll] = useState(0);
  const [speed, setSpeed] = useState(0);
  const last = useRef({ x: 0, y: 0, t: 0 });

  useEffect(() => {
    if (!inView) return;
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setScroll(1 - Math.min(1, Math.max(0, r.top / window.innerHeight)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [inView, ref]);

  return (
    <ExperimentFile
      id="exp-helmet"
      code="EXP-006"
      status={t("status")}
      title={t("title")}
      summary={t("summary")}
      refran={t("refran")}
    >
      <div ref={ref}>
        <ExpCanvas
          bloom
          aberration={0.4 + speed * 2}
          hint={t("hint")}
          onPointerMove={(x, y) => {
            const now = performance.now();
            const dt = Math.max(16, now - last.current.t);
            const vx = Math.abs(x - last.current.x) / (dt / 1000);
            const vy = Math.abs(y - last.current.y) / (dt / 1000);
            setSpeed(Math.min(1.5, Math.hypot(vx, vy) * 0.35));
            last.current = { x, y, t: now };
          }}
        >
          <CraftDome scroll={scroll} speed={speed} />
        </ExpCanvas>
      </div>
    </ExperimentFile>
  );
}
