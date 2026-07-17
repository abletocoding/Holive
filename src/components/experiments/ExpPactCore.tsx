"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Trail } from "@react-three/drei";
import { useTranslations } from "next-intl";
import type { Group, Mesh } from "three";
import * as THREE from "three";
import { ExperimentFile } from "@/components/experiments/ExperimentFile";
import { ExpCanvas } from "@/components/experiments/r3f/ExpCanvas";

function PactCore({ gravity }: { gravity: [number, number] }) {
  const core = useRef<Mesh>(null);
  const rings = useRef<Group>(null);
  const orbA = useRef<Mesh>(null);
  const orbB = useRef<Mesh>(null);
  const orbC = useRef<Mesh>(null);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    if (core.current) {
      core.current.rotation.y += dt * 0.5;
      const pulse = 1 + Math.sin(t * 2.5) * 0.06;
      core.current.scale.setScalar(pulse);
    }
    if (rings.current) {
      rings.current.rotation.x = gravity[1] * 0.8 + t * 0.2;
      rings.current.rotation.z = gravity[0] * 0.8 + t * 0.15;
      rings.current.rotation.y += dt * 0.35;
    }
    const gx = gravity[0] * 0.6;
    const gy = gravity[1] * 0.6;
    if (orbA.current) {
      orbA.current.position.set(Math.cos(t * 1.2) * 1.8 + gx, Math.sin(t * 0.9) * 0.4 + gy, Math.sin(t * 1.2) * 1.8);
    }
    if (orbB.current) {
      orbB.current.position.set(Math.cos(t * 0.8 + 2) * 2.1 + gx, Math.cos(t * 1.1) * 0.6 + gy, Math.sin(t * 0.8 + 2) * 2.1);
    }
    if (orbC.current) {
      orbC.current.position.set(Math.cos(t * 1.5 + 4) * 1.5 + gx, Math.sin(t * 1.4) * 0.9 + gy, Math.sin(t * 1.5 + 4) * 1.5);
    }
  });

  return (
    <group>
      <mesh ref={core}>
        <icosahedronGeometry args={[0.7, 1]} />
        <meshStandardMaterial
          color="#C9A84C"
          emissive="#C9A84C"
          emissiveIntensity={1.1}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>
      <group ref={rings}>
        {[1.4, 1.85, 2.3].map((r, i) => (
          <mesh key={r} rotation={[Math.PI / 2 + i * 0.4, i * 0.5, 0]}>
            <torusGeometry args={[r, 0.025, 10, 64]} />
            <meshStandardMaterial
              color={i % 2 ? "#6B3DB8" : "#C9A84C"}
              emissive={i % 2 ? "#330072" : "#C9A84C"}
              emissiveIntensity={0.5}
            />
          </mesh>
        ))}
      </group>
      <Trail width={0.35} length={6} color={new THREE.Color("#C9A84C")} attenuation={(w) => w}>
        <mesh ref={orbA}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshBasicMaterial color="#C9A84C" />
        </mesh>
      </Trail>
      <Trail width={0.28} length={5} color={new THREE.Color("#9b6dff")} attenuation={(w) => w}>
        <mesh ref={orbB}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshBasicMaterial color="#9b6dff" />
        </mesh>
      </Trail>
      <Trail width={0.22} length={4} color={new THREE.Color("#FAFAF8")} attenuation={(w) => w}>
        <mesh ref={orbC}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshBasicMaterial color="#FAFAF8" />
        </mesh>
      </Trail>
    </group>
  );
}

/** EXP-009 — Pact core with multi-axis rings + trails; drag twists gravity. */
export function ExpPactCore() {
  const t = useTranslations("Experiments.files.pact");
  const [gravity, setGravity] = useState<[number, number]>([0, 0]);

  return (
    <ExperimentFile
      id="exp-pact"
      code="EXP-009"
      status={t("status")}
      title={t("title")}
      summary={t("summary")}
      refran={t("refran")}
    >
      <ExpCanvas bloom hint={t("hint")} onPointerMove={(x, y) => setGravity([x, y])}>
        <PactCore gravity={gravity} />
      </ExpCanvas>
    </ExperimentFile>
  );
}
