"use client";

import { useEffect, useRef } from "react";

// PS3/PSP XMB ribbon, ported from the Y1 "XMB Graphite" theme (y1-themes/xmb_graphite.py):
// three offset sine lines with a soft glow on a dark gradient, drifting slowly.
const WAVES: [number, number][] = [[0, 0.92], [12, 0.63], [24, 0.4]]; // [offset, alpha]

export default function XmbWave() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = innerWidth * dpr;
      c.height = innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t: number) => {
      const w = innerWidth, h = innerHeight;
      const s = w / 480; // scale the Y1 theme's 480px-wide numbers to the screen
      const phase = t / 9000;
      ctx.clearRect(0, 0, w, h);
      const path = (k: number) => {
        ctx.beginPath();
        for (let x = 0; x <= w; x += 6) {
          const y = h * 0.66 + k * s * 0.6 + 24 * s * 0.6 * Math.sin(x / (72 * s) + k / 10 + phase * (1 + k / 40));
          if (x) ctx.lineTo(x, y);
          else ctx.moveTo(x, y);
        }
      };
      for (const [k, a] of WAVES) {
        path(k);
        ctx.strokeStyle = `rgba(220,225,240,${a / 3})`;
        ctx.lineWidth = 18 * s * 0.6;
        ctx.filter = `blur(${9 * s * 0.6}px)`;
        ctx.stroke();
        ctx.filter = "blur(1px)";
        ctx.strokeStyle = `rgba(235,235,240,${a})`;
        ctx.lineWidth = Math.max(1.5, 2.5 * s * 0.6);
        ctx.stroke();
      }
      ctx.filter = "none";
      if (!still) raf = requestAnimationFrame(draw);
    };

    size();
    raf = requestAnimationFrame(draw);
    const onResize = () => { size(); if (still) draw(0); };
    addEventListener("resize", onResize);
    return () => (cancelAnimationFrame(raf), removeEventListener("resize", onResize));
  }, []);

  return (
    <div aria-hidden className="fixed inset-0 -z-10 bg-gradient-to-b from-[#1e1e20] to-[#060607]">
      <canvas ref={ref} className="absolute inset-0 w-full h-full opacity-60" />
    </div>
  );
}
