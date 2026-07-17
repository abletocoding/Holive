"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import { useTranslations } from "next-intl";
import * as THREE from "three";
import type { Group } from "three";
import { ExperimentFile } from "@/components/experiments/ExperimentFile";
import { ExpCanvas } from "@/components/experiments/r3f/ExpCanvas";

function CrystalOlive({ shattered }: { shattered: boolean }) {
  const group = useRef<Group>(null);
  const shards = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        dir: new THREE.Vector3(
          Math.sin(i * 1.7),
          Math.cos(i * 0.9),
          Math.sin(i * 2.3),
        ).normalize(),
        rot: new THREE.Vector3(Math.random(), Math.random(), Math.random()),
        scale: 0.18 + Math.random() * 0.22,
      })),
    [],
  );
  const burst = useRef(0);

  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.35;
    burst.current = THREE.MathUtils.lerp(burst.current, shattered ? 1 : 0, 0.08);
  });

  return (
    <group ref={group}>
      <mesh scale={[0.7, 1.05, 0.7]} visible={burst.current < 0.55}>
        <sphereGeometry args={[1, 32, 32]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={0.6}
          chromaticAberration={0.25}
          anisotropy={0.2}
          distortion={0.15}
          distortionScale={0.3}
          temporalDistortion={0.1}
          color="#6B3DB8"
          attenuationColor="#C9A84C"
          attenuationDistance={1.2}
        />
      </mesh>
      {shards.map((s) => (
        <mesh
          key={s.id}
          position={[
            s.dir.x * burst.current * 2.2,
            s.dir.y * burst.current * 2.2,
            s.dir.z * burst.current * 2.2,
          ]}
          rotation={[s.rot.x * burst.current * 4, s.rot.y * burst.current * 4, 0]}
          scale={s.scale}
        >
          <tetrahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={s.id % 2 ? "#C9A84C" : "#6B3DB8"}
            metalness={0.7}
            roughness={0.15}
            emissive={s.id % 2 ? "#C9A84C" : "#330072"}
            emissiveIntensity={0.35}
            transparent
            opacity={0.25 + burst.current * 0.75}
          />
        </mesh>
      ))}
      <mesh>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#C9A84C" emissive="#C9A84C" emissiveIntensity={1.2} />
      </mesh>
    </group>
  );
}

/** EXP-004 — Crystal olive relic that shatters and reforms. */
export function ExpCrystalReliquary() {
  const t = useTranslations("Experiments.files.crystal");
  const [shattered, setShattered] = useState(false);

  return (
    <ExperimentFile
      id="exp-crystal"
      code="EXP-004"
      status={t("status")}
      title={t("title")}
      summary={t("summary")}
      refran={t("refran")}
    >
      <ExpCanvas
        bloom
        hint={t("hint")}
        onPointerDown={() => setShattered((s) => !s)}
      >
        <CrystalOlive shattered={shattered} />
      </ExpCanvas>
    </ExperimentFile>
  );
}
