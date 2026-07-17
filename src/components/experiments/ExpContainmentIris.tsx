"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useTranslations } from "next-intl";
import type { Group, Mesh } from "three";
import { ExperimentFile } from "@/components/experiments/ExperimentFile";
import { ExpCanvas } from "@/components/experiments/r3f/ExpCanvas";

function IrisScene({ open }: { open: number }) {
  const group = useRef<Group>(null);
  const pupil = useRef<Mesh>(null);
  const blades = useMemo(() => Array.from({ length: 12 }, (_, i) => i), []);

  useFrame((_, dt) => {
    if (group.current) group.current.rotation.z += dt * 0.08;
    if (pupil.current) {
      const s = 0.35 + open * 0.85;
      pupil.current.scale.setScalar(s);
    }
  });

  return (
    <group ref={group}>
      {blades.map((i) => {
        const a = (i / blades.length) * Math.PI * 2;
        const r = 1.55 - open * 0.95;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * r * 0.35, Math.sin(a) * r * 0.35, 0]}
            rotation={[0, 0, a + open * 0.6]}
          >
            <boxGeometry args={[0.22, 1.35 - open * 0.4, 0.08]} />
            <meshStandardMaterial
              color={i % 2 ? "#330072" : "#6B3DB8"}
              metalness={0.55}
              roughness={0.35}
              emissive="#330072"
              emissiveIntensity={0.25}
            />
          </mesh>
        );
      })}
      <mesh ref={pupil}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshStandardMaterial
          color="#C9A84C"
          emissive="#C9A84C"
          emissiveIntensity={0.7 + open * 0.5}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.85, 0.04, 12, 64]} />
        <meshStandardMaterial color="#C9A84C" emissive="#C9A84C" emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}

/** EXP-001 — 3D containment iris aperture. */
export function ExpContainmentIris() {
  const t = useTranslations("Experiments.files.iris");
  const [open, setOpen] = useState(0.25);

  return (
    <ExperimentFile
      id="exp-iris"
      code="EXP-001"
      status={t("status")}
      title={t("title")}
      summary={t("summary")}
      refran={t("refran")}
    >
      <ExpCanvas
        bloom
        hint={t("hint")}
        onPointerMove={(nx, ny) => {
          const d = Math.min(1, Math.hypot(nx, ny));
          setOpen(0.15 + (1 - d) * 0.85);
        }}
      >
        <IrisScene open={open} />
      </ExpCanvas>
    </ExperimentFile>
  );
}
