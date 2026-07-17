"use client";

import { useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useTranslations } from "next-intl";
import * as THREE from "three";
import { ExperimentFile } from "@/components/experiments/ExperimentFile";
import { ExpCanvas } from "@/components/experiments/r3f/ExpCanvas";

const dissolveVert = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vPos;
  void main() {
    vUv = uv;
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const dissolveFrag = /* glsl */ `
  uniform float uDissolve;
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vPos;
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  void main() {
    float n = hash(vUv * 18.0 + uTime * 0.15);
    float edge = smoothstep(uDissolve - 0.08, uDissolve + 0.08, n);
    vec3 purple = vec3(0.2, 0.0, 0.45);
    vec3 gold = vec3(0.79, 0.66, 0.3);
    // seal: concentric rings + pupil
    float d = distance(vUv, vec2(0.5));
    float ring = smoothstep(0.02, 0.0, abs(d - 0.28)) + smoothstep(0.02, 0.0, abs(d - 0.4));
    float pupil = 1.0 - smoothstep(0.08, 0.12, d);
    vec3 seal = mix(purple, gold, ring + pupil);
    // code underneath
    float grid = step(0.92, fract(vUv.x * 28.0)) + step(0.92, fract(vUv.y * 18.0));
    vec3 code = mix(vec3(0.02, 0.05, 0.02), vec3(0.1, 0.85, 0.35), grid * 0.8);
    vec3 col = mix(seal, code, edge);
    float alpha = mix(1.0, 0.85, edge);
    if (n < uDissolve - 0.12) discard;
    gl_FragColor = vec4(col, alpha);
  }
`;

function DissolveSeal({ amount }: { amount: number }) {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uDissolve: { value: 0 },
          uTime: { value: 0 },
        },
        vertexShader: dissolveVert,
        fragmentShader: dissolveFrag,
        transparent: true,
      }),
    [],
  );

  useFrame((_, dt) => {
    mat.uniforms.uTime.value += dt;
    mat.uniforms.uDissolve.value = THREE.MathUtils.lerp(
      mat.uniforms.uDissolve.value,
      amount,
      0.06,
    );
  });

  return (
    <group>
      <mesh>
        <planeGeometry args={[8, 5]} />
        <meshBasicMaterial color="#030806" />
      </mesh>
      <mesh position={[0, 0, 0.05]} material={mat}>
        <circleGeometry args={[1.45, 64]} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.02]}>
        <torusGeometry args={[1.55, 0.03, 8, 64]} />
        <meshStandardMaterial color="#C9A84C" emissive="#C9A84C" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

/** EXP-010 — Holive seal dissolves to reveal living code. */
export function ExpDissolveSeal() {
  const t = useTranslations("Experiments.files.dissolve");
  const [amount, setAmount] = useState(0.15);

  return (
    <ExperimentFile
      id="exp-dissolve"
      code="EXP-010"
      status={t("status")}
      title={t("title")}
      summary={t("summary")}
      refran={t("refran")}
    >
      <ExpCanvas
        bloom
        hint={t("hint")}
        onPointerMove={(x, y) => {
          const d = Math.min(1, Math.hypot(x, y));
          setAmount(0.1 + (1 - d) * 0.85);
        }}
        onPointerDown={() => setAmount((a) => (a > 0.6 ? 0.1 : 0.95))}
      >
        <DissolveSeal amount={amount} />
      </ExpCanvas>
    </ExperimentFile>
  );
}
