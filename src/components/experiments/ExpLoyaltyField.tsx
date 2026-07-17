"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useTranslations } from "next-intl";
import * as THREE from "three";
import { ExperimentFile } from "@/components/experiments/ExperimentFile";
import { ExpCanvas } from "@/components/experiments/r3f/ExpCanvas";

function letterPoints(letter: string, ox: number): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  type Stroke = [number, number, number, number];
  const map: Record<string, Stroke[]> = {
    H: [
      [0, -1, 0, 1],
      [1, -1, 1, 1],
      [0, 0, 1, 0],
    ],
    O: [[0.5, -1, 0.5, 1]],
    L: [
      [0, -1, 0, 1],
      [0, -1, 1, -1],
    ],
    I: [[0.5, -1, 0.5, 1]],
    V: [
      [0, 1, 0.5, -1],
      [1, 1, 0.5, -1],
    ],
    E: [
      [0, -1, 0, 1],
      [0, 1, 1, 1],
      [0, 0, 0.8, 0],
      [0, -1, 1, -1],
    ],
  };
  const strokes = map[letter] ?? ([[0, -1, 0, 1]] as Stroke[]);

  for (const [x1, y1, x2, y2] of strokes) {
    for (let i = 0; i <= 10; i++) {
      const t = i / 10;
      pts.push(new THREE.Vector3(ox + (x1 + (x2 - x1) * t) * 0.55, (y1 + (y2 - y1) * t) * 0.7, 0));
    }
  }
  if (letter === "O") {
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      pts.push(new THREE.Vector3(ox + 0.5 + Math.cos(a) * 0.45, Math.sin(a) * 0.7, 0));
    }
  }
  return pts;
}

function LoyaltyField({ cursor }: { cursor: [number, number] }) {
  const points = useMemo(() => {
    const letters = ["H", "O", "L", "I", "V", "E"];
    const all: THREE.Vector3[] = [];
    letters.forEach((L, i) => all.push(...letterPoints(L, (i - 2.5) * 1.05)));
    // extras for density
    for (let i = 0; i < 80; i++) {
      all.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 3.5,
          (Math.random() - 0.5) * 2,
        ),
      );
    }
    return all;
  }, []);

  const positions = useMemo(() => {
    const arr = new Float32Array(points.length * 3);
    points.forEach((p, i) => {
      arr[i * 3] = p.x;
      arr[i * 3 + 1] = p.y;
      arr[i * 3 + 2] = p.z;
    });
    return arr;
  }, [points]);

  const geo = useRef<THREE.BufferGeometry>(null);
  const home = useMemo(() => positions.slice(), [positions]);

  useFrame((state) => {
    const g = geo.current;
    if (!g) return;
    const attr = g.attributes.position as THREE.BufferAttribute;
    const mx = cursor[0] * 2.5;
    const my = cursor[1] * 1.8;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < points.length; i++) {
      const hx = home[i * 3];
      const hy = home[i * 3 + 1];
      const hz = home[i * 3 + 2];
      const dx = hx - mx;
      const dy = hy - my;
      const d2 = dx * dx + dy * dy + 0.2;
      const pull = 0.55 / d2;
      attr.setXYZ(
        i,
        hx + Math.sin(t + i) * 0.03 + dx * pull * 0.15,
        hy + Math.cos(t * 0.8 + i) * 0.03 + dy * pull * 0.15,
        hz + Math.sin(t * 1.2 + i * 0.1) * 0.08,
      );
    }
    attr.needsUpdate = true;
  });

  return (
    <points>
      <bufferGeometry ref={geo}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        color="#C9A84C"
        sizeAttenuation
        transparent
        opacity={0.9}
        depthWrite={false}
      />
    </points>
  );
}

/** EXP-005 — Volumetric loyalty constellation field. */
export function ExpLoyaltyField() {
  const t = useTranslations("Experiments.files.field");
  const [cursor, setCursor] = useState<[number, number]>([0, 0]);

  return (
    <ExperimentFile
      id="exp-field"
      code="EXP-005"
      status={t("status")}
      title={t("title")}
      summary={t("summary")}
      refran={t("refran")}
    >
      <ExpCanvas bloom hint={t("hint")} onPointerMove={(x, y) => setCursor([x, y])}>
        <LoyaltyField cursor={cursor} />
      </ExpCanvas>
    </ExperimentFile>
  );
}
