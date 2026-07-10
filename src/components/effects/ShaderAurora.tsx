"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type Props = {
  className?: string;
};

/**
 * Shader-like aurora gradient — scroll-linked purple/gold WebGL plane.
 * Falls back to CSS mesh gradient when WebGL unavailable or reduced-motion.
 */
export function ShaderAurora({ className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const vs = `
      attribute vec2 a;
      void main(){ gl_Position = vec4(a,0.,1.); }
    `;
    const fs = `
      precision mediump float;
      uniform float u_t;
      uniform vec2 u_res;
      uniform float u_scroll;
      void main(){
        vec2 uv = gl_FragCoord.xy / u_res;
        uv.x *= u_res.x / u_res.y;
        float t = u_t * 0.15 + u_scroll * 0.4;
        float n = sin(uv.x*3.2+t)*cos(uv.y*2.8-t*0.7);
        n += sin((uv.x+uv.y)*4.1 - t*1.2)*0.5;
        vec3 purple = vec3(0.20, 0.0, 0.45);
        vec3 gold = vec3(0.79, 0.66, 0.30);
        vec3 black = vec3(0.04, 0.02, 0.08);
        float m = smoothstep(-0.4, 0.6, n);
        vec3 col = mix(black, purple, m);
        col = mix(col, gold, smoothstep(0.35, 0.95, n) * 0.55);
        float vig = smoothstep(1.2, 0.2, length(uv - vec2(0.55, 0.45)));
        gl_FragColor = vec4(col, 0.55 + vig * 0.25);
      }
    `;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uT = gl.getUniformLocation(prog, "u_t");
    const uRes = gl.getUniformLocation(prog, "u_res");
    const uScroll = gl.getUniformLocation(prog, "u_scroll");

    let raf = 0;
    let scroll = 0;
    const start = performance.now();
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    const resize = () => {
      const parent = canvas.parentElement;
      const w = parent?.clientWidth || 600;
      const h = parent?.clientHeight || 400;
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.75);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scroll = max > 0 ? window.scrollY / max : 0;
    };

    resize();
    onScroll();

    const tick = () => {
      const t = (performance.now() - start) / 1000;
      gl.uniform1f(uT, t);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uScroll, scroll);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduced]);

  if (reduced) {
    return (
      <div
        aria-hidden
        className={`absolute inset-0 ${className}`}
        style={{
          background:
            "linear-gradient(135deg, #1a003d 0%, #0a0612 40%, #2a1a08 70%, #330072 100%)",
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
