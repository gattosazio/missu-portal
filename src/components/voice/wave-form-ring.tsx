"use client";

import React, { useEffect, useRef } from "react";

type WaveformRingProps = {
  className?: string;
  /** 0..1 amplitude. If omitted, it idles softly. */
  intensity?: number;
  /** Size of the core circle relative to min(w,h). */
  coreRadiusRatio?: number; // default 0.30
  /** Ring thickness in px. */
  ringThickness?: number; // default 3
};

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

export default function WaveformRing({
  className,
  intensity,
  coreRadiusRatio = 0.30,
  ringThickness = 3,
}: WaveformRingProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let w = 1;
    let h = 1;
    let dpr = 1;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      w = Math.max(1, Math.floor(rect.width));
      h = Math.max(1, Math.floor(rect.height));

      // keep perf stable
      dpr = Math.min(1.5, window.devicePixelRatio || 1);

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement ?? canvas);
    resize();

    let t0 = performance.now();
    let smooth = 0;

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - t0) / 1000);
      t0 = now;

      const idle = 0.10 + 0.06 * Math.sin(now * 0.0012) + 0.03 * Math.sin(now * 0.0007 + 1.3);
      const target = clamp01(typeof intensity === "number" ? intensity : idle);

      // smooth so the ring feels “alive”, not twitchy
      smooth = smooth + (target - smooth) * (1 - Math.pow(0.001, dt));

      ctx.clearRect(0, 0, w, h);

      const cx = w * 0.5;
      const cy = h * 0.5;
      const rCore = Math.min(w, h) * coreRadiusRatio;

      // plain white core circle (no eye)
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, rCore, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(148,163,184,0.55)";
      ctx.stroke();
      ctx.restore();

      // ring around the edge
      const points = 120;
      const amp = 4 + 18 * smooth;
      const rRing = rCore + 16;

      // gradient stroke
      let stroke: CanvasGradient | string = "rgba(56,189,248,0.9)";
      const anyCtx = ctx as any;
      if (typeof anyCtx.createConicGradient === "function") {
        const g = anyCtx.createConicGradient(now * 0.00025, cx, cy);
        g.addColorStop(0.0, "rgba(34,211,238,0.95)"); // neon blue
        g.addColorStop(0.35, "rgba(59,130,246,0.95)"); // blue
        g.addColorStop(0.65, "rgba(139,92,246,0.95)"); // purple
        g.addColorStop(0.82, "rgba(236,72,153,0.92)"); // pink
        g.addColorStop(1.0, "rgba(251,146,60,0.88)"); // orange
        stroke = g;
      } else {
        const g = ctx.createLinearGradient(cx - rRing, cy - rRing, cx + rRing, cy + rRing);
        g.addColorStop(0, "rgba(34,211,238,0.95)");
        g.addColorStop(0.45, "rgba(59,130,246,0.95)");
        g.addColorStop(0.78, "rgba(236,72,153,0.92)");
        g.addColorStop(1, "rgba(251,146,60,0.88)");
        stroke = g;
      }

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.lineWidth = ringThickness;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.strokeStyle = stroke;

      // cheap glow
      ctx.shadowBlur = 12;
      ctx.shadowColor = "rgba(99,102,241,0.22)";

      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const a = (i / points) * Math.PI * 2;

        // very cheap organic wobble (no noise)
        const wobble =
          Math.sin(a * 3 + now * 0.0022) * 0.6 +
          Math.sin(a * 7 - now * 0.0017) * 0.28 +
          Math.sin(a * 11 + now * 0.0011) * 0.18;

        const r = rRing + wobble * amp;
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      ro.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [intensity, coreRadiusRatio, ringThickness]);

  return (
    <div className={className}>
      <div className="relative h-[260px] w-full overflow-hidden rounded-[28px]">
        <canvas ref={canvasRef} className="absolute inset-0" />
      </div>
    </div>
  );
}
