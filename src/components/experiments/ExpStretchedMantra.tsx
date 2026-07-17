"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { useTranslations } from "next-intl";
import * as THREE from "three";
import type { Group } from "three";
import { ExperimentFile } from "@/components/experiments/ExperimentFile";
import { ExpCanvas } from "@/components/experiments/r3f/ExpCanvas";
import { useInViewCanvas } from "@/components/experiments/r3f/useInViewCanvas";

function StretchMantras({ velocity, lines }: { velocity: number; lines: string[] }) {
  const group = useRef<Group>(null);

  useFrame((_, dt) => {
    if (!group.current) return;
    group.current.rotation.y += dt * 0.12;
    const stretch = 1 + Math.min(2.8, Math.abs(velocity) * 8);
    group.current.scale.set(1 / Math.sqrt(stretch), stretch, 1);
  });

  return (
    <group ref={group}>
      {lines.map((line, i) => (
        <Text
          key={line + i}
          position={[0, 1.2 - i * 0.55, 0]}
          fontSize={0.32}
          color={i % 2 ? "#C9A84C" : "#FAFAF8"}
          anchorX="center"
          anchorY="middle"
          maxWidth={6}
        >
          {line}
        </Text>
      ))}
      <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0, -0.4]}>
        <torusGeometry args={[1.8, 0.01, 8, 64]} />
        <meshBasicMaterial color="#6B3DB8" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

/** EXP-007 — Scroll-velocity spaghettified mantras. */
export function ExpStretchedMantra() {
  const t = useTranslations("Experiments.files.stretch");
  const lines = [t("l1"), t("l2"), t("l3"), t("l4"), t("l5")];
  const { ref, inView } = useInViewCanvas();
  const [velocity, setVelocity] = useState(0);
  const lastY = useRef(0);
  const lastT = useRef(0);

  useEffect(() => {
    if (!inView) return;
    lastY.current = window.scrollY;
    lastT.current = performance.now();
    const onScroll = () => {
      const now = performance.now();
      const dy = window.scrollY - lastY.current;
      const dt = Math.max(16, now - lastT.current);
      setVelocity(THREE.MathUtils.lerp(velocity, dy / dt, 0.35));
      lastY.current = window.scrollY;
      lastT.current = now;
    };
    const damp = window.setInterval(() => {
      setVelocity((v) => v * 0.9);
    }, 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearInterval(damp);
    };
  }, [inView, velocity]);

  return (
    <ExperimentFile
      id="exp-stretch"
      code="EXP-007"
      status={t("status")}
      title={t("title")}
      summary={t("summary")}
      refran={t("refran")}
    >
      <div ref={ref}>
        <ExpCanvas bloom hint={t("hint")}>
          <StretchMantras velocity={velocity} lines={lines} />
        </ExpCanvas>
      </div>
    </ExperimentFile>
  );
}
