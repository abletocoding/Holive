"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useTranslations } from "next-intl";
import * as THREE from "three";
import { ExperimentFile } from "@/components/experiments/ExperimentFile";
import { ExpCanvas } from "@/components/experiments/r3f/ExpCanvas";

function OliveGrove({ cursor }: { cursor: [number, number] }) {
  const count = 120;
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const data = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * 8,
        z: (Math.random() - 0.5) * 6,
        h: 0.6 + Math.random() * 1.4,
        phase: Math.random() * Math.PI * 2,
      })),
    [],
  );

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;
    const cx = cursor[0] * 4;
    const cz = -cursor[1] * 3;
    data.forEach((d, i) => {
      const dx = d.x - cx;
      const dz = d.z - cz;
      const dist = Math.hypot(dx, dz);
      const push = Math.max(0, 1.2 - dist) * 0.55;
      const wind = Math.sin(t * 1.5 + d.phase) * 0.12;
      dummy.position.set(d.x + (dx / (dist + 0.1)) * push, d.h * 0.5, d.z + (dz / (dist + 0.1)) * push);
      dummy.rotation.set(wind + push * 0.4, 0, wind * 0.6);
      dummy.scale.set(0.08, d.h, 0.08);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <circleGeometry args={[5.5, 48]} />
        <meshStandardMaterial color="#0a0810" />
      </mesh>
      <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
        <cylinderGeometry args={[1, 1.4, 1, 5]} />
        <meshStandardMaterial color="#4a1d7a" emissive="#330072" emissiveIntensity={0.3} />
      </instancedMesh>
      {data.slice(0, 40).map((d, i) => (
        <mesh key={i} position={[d.x, d.h + 0.15, d.z]} scale={[0.18, 0.28, 0.18]}>
          <sphereGeometry args={[1, 10, 10]} />
          <meshStandardMaterial
            color="#C9A84C"
            emissive="#C9A84C"
            emissiveIntensity={0.35}
            metalness={0.4}
            roughness={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

/** EXP-008 — Procedural Holive olive grove with wind + cursor push. */
export function ExpOliveGrove() {
  const t = useTranslations("Experiments.files.grove");
  const [cursor, setCursor] = useState<[number, number]>([0, 0]);

  return (
    <ExperimentFile
      id="exp-grove"
      code="EXP-008"
      status={t("status")}
      title={t("title")}
      summary={t("summary")}
      refran={t("refran")}
    >
      <ExpCanvas
        bloom
        camera={{ position: [0, 3.2, 6.5], fov: 42 }}
        hint={t("hint")}
        onPointerMove={(x, y) => setCursor([x, y])}
      >
        <OliveGrove cursor={cursor} />
      </ExpCanvas>
    </ExperimentFile>
  );
}
