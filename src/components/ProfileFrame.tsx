import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

type Props = {
  /** đường dẫn ảnh trong /public, vd "/profile.jpg" */
  src?: string;
  alt?: string;
  name?: string;
  subtitle?: string;
  className?: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function ProfileFrame({
  src,
  alt = "Profile photo",
  name = "Kane Tran",
  subtitle = "Frontend Developer",
  className,
}: Props) {
  const hasImage = Boolean(src);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [spot, setSpot] = useState({ x: 50, y: 35 });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    let raf = 0;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = ((e.clientX - r.left) / r.width) * 100;
      const py = ((e.clientY - r.top) / r.height) * 100;

      const dx = (px - 50) / 50; // [-1..1]
      const dy = (py - 50) / 50;

      // tilt nhẹ (đừng mạnh quá sẽ "cheap")
      const ry = clamp(dx * 4.5, -5, 5);
      const rx = clamp(-dy * 4.5, -5, 5);

      // throttle bằng RAF
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setSpot({ x: px, y: py });
        setTilt({ rx, ry });
      });
    };

    const onLeave = () => {
      setSpot({ x: 50, y: 35 });
      setTilt({ rx: 0, ry: 0 });
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);

    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      className={clsx(
        "card p-4",
        "transition-transform duration-300 hover:-translate-y-0.5",
        className
      )}
    >
      {/* outer frame */}
      <div
        ref={wrapRef}
        className={clsx(
          "relative aspect-square rounded-2xl border hairline",
          "bg-white/5 overflow-hidden",
          "group"
        )}
        style={{
          transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transition: "transform 180ms ease",
        }}
      >
        {/* inner frame inset */}
        <div className="pointer-events-none absolute inset-2 rounded-xl border hairline opacity-70" />

        {/* corner accents */}
        <div className="pointer-events-none absolute left-3 top-3 h-10 w-10 rounded-xl border border-white/10" />
        <div className="pointer-events-none absolute right-3 bottom-3 h-10 w-10 rounded-xl border border-white/10" />

        {/* dynamic spotlight */}
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background: `radial-gradient(520px 520px at ${spot.x}% ${spot.y}%,
              rgba(74,210,255,0.22),
              rgba(255,87,179,0.12) 35%,
              transparent 62%)`,
          }}
        />

        {/* subtle base wash */}
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(circle at 20% 18%, rgba(54,120,255,0.14), transparent 55%)," +
              "radial-gradient(circle at 88% 80%, rgba(255,138,92,0.10), transparent 60%)",
          }}
        />

        {/* light sweep on hover */}
        <div
          className={clsx(
            "pointer-events-none absolute inset-0 opacity-0",
            "group-hover:opacity-100 transition-opacity duration-300"
          )}
          style={{
            background:
              "linear-gradient(115deg, transparent 10%, rgba(255,255,255,0.14) 45%, transparent 60%)",
            transform: "translateX(-35%)",
            animation: hasImage ? "none" : "none",
          }}
        />
        <div className="pointer-events-none absolute inset-0 translate-x-[-45%] group-hover:translate-x-[45%] transition-transform duration-700 ease-out"
          style={{
            background:
              "linear-gradient(115deg, transparent 15%, rgba(255,255,255,0.12) 48%, transparent 62%)",
            opacity: 0.0,
          }}
        />
        {/* a second sweep that actually moves (opacity handled) */}
        <div className="pointer-events-none rotate-20 absolute inset-[-18%] opacity-0 group-hover:opacity-30 transition-opacity duration-300">
            <div
                className="absolute top-0 bottom-0 left-0 w-[55%] -translate-x-[70%] group-hover:translate-x-[190%] transition-transform duration-700 ease-out"
                style={{
                background:
                    "linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.22) 48%, transparent 100%)",
                filter: "blur(0.2px)",
                mixBlendMode: "overlay",
                // fade 2 đầu beam để không bao giờ lộ mép thô
                maskImage:
                    "linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%)",
                WebkitMaskImage:
                    "linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%)",
                }}
            />
        </div>

        {hasImage ? (
          <>
            {/* image */}
            <img
                src={src}
                alt={alt}
                className="absolute inset-0 z-10 h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]"
                loading="lazy"
            />

            {/* film grain (on top of image) */}
            <div
                className="pointer-events-none absolute inset-0 z-20 opacity-[0.12] mix-blend-overlay"
                style={{
                    backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.42' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='.45'/%3E%3C/svg%3E\")",
                    backgroundSize: "320px 320px",
                }}
            />

            {/* vignette */}
            <div className="pointer-events-none absolute inset-0 z-30 bg-gradient-to-b from-black/35 via-transparent to-black/35" />

            {/* ✅ light sweep on top of image */}
            <div className="pointer-events-none absolute inset-[-18%] z-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div
                    className="absolute top-0 bottom-0 left-0 w-[55%] -translate-x-[70%] group-hover:translate-x-[190%] transition-transform duration-700 ease-out"
                    style={{
                    background:
                        "linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.18) 48%, transparent 100%)",
                    mixBlendMode: "overlay",
                    maskImage:
                        "linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%)",
                    WebkitMaskImage:
                        "linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%)",
                    }}
                />
            </div>

            {/* bottom info */}
            <div className="absolute bottom-3 left-3 right-3 z-50 flex items-center justify-between">
                <div className="text-xs text-white/75">{subtitle}</div>
                <div className="label text-[10px]">PROFILE</div>
            </div>
          </>
        ) : (
          <>
            {/* placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-6">
                <div className="title-serif text-3xl md:text-4xl">{name}</div>
                <div className="mt-2 text-sm text-white/70">{subtitle}</div>
                <div className="mt-6 inline-flex items-center gap-2 rounded-full border hairline bg-white/5 px-4 py-2 text-xs text-white/75">
                  Add photo → /public/profile.jpg
                </div>
              </div>
            </div>

            {/* tiny dots */}
            <div className="pointer-events-none absolute left-6 top-6 h-1.5 w-1.5 rounded-full bg-white/70" />
            <div className="pointer-events-none absolute bottom-7 right-7 h-2 w-2 rounded-full bg-white/40" />
          </>
        )}

        {/* focus ring on hover */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/0 group-hover:ring-white/15 transition-all duration-300" />
      </div>

      {/* footer row */}
      <div className="mt-3 flex items-center justify-between px-1">
        <span className="text-xs text-white/45">
          {hasImage ? "Profile" : "Profile Placeholder"}
        </span>
        <span className="label text-[10px]">01</span>
      </div>
    </div>
  );
}
