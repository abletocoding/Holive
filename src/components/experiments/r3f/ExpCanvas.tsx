"use client";

import type { ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Vector2 } from "three";
import { useInViewCanvas } from "@/components/experiments/r3f/useInViewCanvas";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type Props = {
  children: ReactNode;
  className?: string;
  camera?: { position?: [number, number, number]; fov?: number };
  bloom?: boolean;
  aberration?: number;
  fallback?: ReactNode;
  hint?: string;
  onPointerMove?: (nx: number, ny: number) => void;
  onPointerDown?: () => void;
  continuous?: boolean;
};

function PostFX({ bloom, aberration }: { bloom?: boolean; aberration?: number }) {
  const hasBloom = Boolean(bloom);
  const hasAberration = Boolean(aberration && aberration > 0);
  if (!hasBloom && !hasAberration) return null;

  return (
    <EffectComposer multisampling={0}>
      {hasBloom ? (
        <Bloom luminanceThreshold={0.35} intensity={0.85} mipmapBlur />
      ) : (
        <Bloom luminanceThreshold={1} intensity={0} />
      )}
      {hasAberration ? (
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new Vector2(aberration! * 0.0025, aberration! * 0.0025)}
          radialModulation={false}
          modulationOffset={0}
        />
      ) : (
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new Vector2(0, 0)}
          radialModulation={false}
          modulationOffset={0}
        />
      )}
    </EffectComposer>
  );
}

/** Lazy R3F stage for Holive experiment dossiers. Unmounts off-screen. */
export function ExpCanvas({
  children,
  className = "",
  camera = { position: [0, 0, 4.2], fov: 42 },
  bloom,
  aberration,
  fallback,
  hint,
  onPointerMove,
  onPointerDown,
  continuous = true,
}: Props) {
  const { ref, inView } = useInViewCanvas();
  const reduced = usePrefersReducedMotion();

  return (
    <div
      ref={ref}
      className={`relative aspect-[16/10] w-full overflow-hidden rounded-sm border border-[var(--border)] bg-[#05040a] ${className}`}
      onPointerMove={(e) => {
        if (!onPointerMove) return;
        const r = e.currentTarget.getBoundingClientRect();
        onPointerMove(
          ((e.clientX - r.left) / Math.max(1, r.width)) * 2 - 1,
          -(((e.clientY - r.top) / Math.max(1, r.height)) * 2 - 1),
        );
      }}
      onPointerDown={onPointerDown}
    >
      {reduced || !inView ? (
        fallback ?? (
          <div className="flex h-full min-h-[16rem] items-center justify-center bg-[radial-gradient(circle_at_center,#1a003d,#05040a)]">
            <span className="font-display text-2xl tracking-[0.3em] text-[var(--holive-gold)]">
              HOLIVE
            </span>
          </div>
        )
      ) : (
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: camera.position ?? [0, 0, 4.2], fov: camera.fov ?? 42 }}
          gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
          frameloop={continuous ? "always" : "demand"}
          style={{ width: "100%", height: "100%" }}
        >
          <color attach="background" args={["#05040a"]} />
          <ambientLight intensity={0.4} />
          <pointLight position={[4, 3, 5]} intensity={1.15} color="#e0c35a" />
          <pointLight position={[-4, -2, 3]} intensity={0.9} color="#9b6dff" />
          {children}
          <PostFX bloom={bloom} aberration={aberration} />
        </Canvas>
      )}
      {hint ? (
        <p className="pointer-events-none absolute bottom-3 left-3 z-10 font-mono-code text-[0.6rem] uppercase tracking-[0.22em] text-[var(--holive-gold)]">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
