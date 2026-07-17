"use client";

import { useEffect, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useTranslations } from "next-intl";
import * as THREE from "three";
import { ExperimentFile } from "@/components/experiments/ExperimentFile";
import { ExpCanvas } from "@/components/experiments/r3f/ExpCanvas";
import { useInViewCanvas } from "@/components/experiments/r3f/useInViewCanvas";

const vert = /* glsl */ `
  uniform float uProgress;
  uniform float uTime;
  varying vec3 vColor;
  void main() {
    vec3 p = position;
    float n = sin(p.x * 3.0 + uTime) * cos(p.y * 2.5 + uTime * 0.7);
    p += normal * n * (0.08 + uProgress * 0.35);
    // pull toward olive silhouette (elongated sphere bias)
    p.y *= mix(1.0, 1.35, uProgress);
    p.x *= mix(1.0, 0.72, uProgress);
    vColor = mix(vec3(0.2, 0.0, 0.45), vec3(0.79, 0.66, 0.3), uProgress);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const frag = /* glsl */ `
  varying vec3 vColor;
  void main() {
    gl_FragColor = vec4(vColor, 1.0);
  }
`;

function MorphMesh({ progress }: { progress: number }) {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uProgress: { value: 0 },
          uTime: { value: 0 },
        },
        vertexShader: vert,
        fragmentShader: frag,
        wireframe: true,
      }),
    [],
  );

  useFrame((_, dt) => {
    mat.uniforms.uTime.value += dt;
    mat.uniforms.uProgress.value = THREE.MathUtils.lerp(
      mat.uniforms.uProgress.value,
      progress,
      0.08,
    );
  });

  return (
    <mesh material={mat} rotation={[0.4, 0.2, 0]}>
      <icosahedronGeometry args={[1.35, 2]} />
    </mesh>
  );
}

/** EXP-002 — Icosahedron morphs into olive offering. */
export function ExpIcosahedronOffering() {
  const t = useTranslations("Experiments.files.offering");
  const { ref, inView } = useInViewCanvas();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const p = 1 - Math.min(1, Math.max(0, r.top / (window.innerHeight * 0.85)));
      setProgress(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [inView, ref]);

  return (
    <ExperimentFile
      id="exp-offering"
      code="EXP-002"
      status={t("status")}
      title={t("title")}
      summary={t("summary")}
      refran={t("refran")}
    >
      <div ref={ref}>
        <ExpCanvas bloom hint={t("hint")}>
          <MorphMesh progress={progress} />
        </ExpCanvas>
      </div>
    </ExperimentFile>
  );
}
