"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { useTranslations } from "next-intl";
import type { Group } from "three";
import { ExperimentFile } from "@/components/experiments/ExperimentFile";
import { ExpCanvas } from "@/components/experiments/r3f/ExpCanvas";
import { useInViewCanvas } from "@/components/experiments/r3f/useInViewCanvas";

function TubeScene({ scroll }: { scroll: number }) {
  const group = useRef<Group>(null);
  const cards = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        i,
        label: `EXP-${String(100 + i).slice(-3)}`,
        angle: (i / 14) * Math.PI * 2,
      })),
    [],
  );

  useFrame((_, dt) => {
    if (!group.current) return;
    group.current.rotation.y += dt * 0.15 + scroll * 0.002;
    group.current.rotation.x = -0.25 + scroll * 0.15;
  });

  return (
    <group ref={group}>
      {cards.map((c) => {
        const r = 2.1;
        const x = Math.cos(c.angle) * r;
        const z = Math.sin(c.angle) * r;
        return (
          <group key={c.i} position={[x, ((c.i % 5) - 2) * 0.45, z]} rotation={[0, -c.angle + Math.PI / 2, 0]}>
            <mesh>
              <planeGeometry args={[1.1, 0.7]} />
              <meshStandardMaterial
                color={c.i % 2 ? "#1a003d" : "#101820"}
                emissive={c.i % 3 === 0 ? "#C9A84C" : "#330072"}
                emissiveIntensity={0.25}
                metalness={0.3}
                roughness={0.55}
              side={2 /* DoubleSide */}
            />
          </mesh>
          <Text
            position={[0, 0.05, 0.02]}
            fontSize={0.14}
            color="#C9A84C"
            anchorX="center"
            anchorY="middle"
            font={undefined}
          >
            {c.label}
          </Text>
            <Text
              position={[0, -0.16, 0.02]}
              fontSize={0.07}
              color="#FAFAF8"
              anchorX="center"
              anchorY="middle"
            >
              CLASSIFIED
            </Text>
          </group>
        );
      })}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[2.05, 2.05, 4.5, 48, 1, true]} />
        <meshStandardMaterial color="#330072" transparent opacity={0.12} side={2} wireframe />
      </mesh>
    </group>
  );
}

/** EXP-003 — Infinite classified dossier tube. */
export function ExpDossierTube() {
  const t = useTranslations("Experiments.files.tube");
  const { ref, inView } = useInViewCanvas();
  const [scroll, setScroll] = useState(0);

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
      id="exp-tube"
      code="EXP-003"
      status={t("status")}
      title={t("title")}
      summary={t("summary")}
      refran={t("refran")}
    >
      <div ref={ref}>
        <ExpCanvas bloom camera={{ position: [0, 0, 5.2], fov: 50 }} hint={t("hint")}>
          <TubeScene scroll={scroll} />
        </ExpCanvas>
      </div>
    </ExperimentFile>
  );
}
