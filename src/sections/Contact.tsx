import { useEffect, useMemo, useRef, useState } from "react";
import Section from "../components/Section";
import Reveal from "../components/Reveal";

const EMAIL = "ktran@s5tech.co";
const LOCATION = "Ho Chi Minh City, Vietnam";

type Channel = {
  idx: string;
  title: string;
  desc: string;
  href: string;
  meta: string;
};

const CHANNELS: Channel[] = [
  {
    idx: "01",
    title: "Email",
    desc: "Best for project inquiries, detailed discussions, and opportunities.",
    href: `mailto:${EMAIL}?subject=Hello%20Kane`,
    meta: EMAIL,
  },
  {
    idx: "02",
    title: "GitHub",
    desc: "Code, experiments, and technical notes.",
    href: "https://github.com/nerkartran297",
    meta: "github.com",
  },
  {
    idx: "03",
    title: "LinkedIn",
    desc: "Professional profile and work history.",
    href: "https://www.linkedin.com/in/nerkar297/",
    meta: "linkedin.com",
  },
];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function easeInOutQuad(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export default function Contact() {
  const [active, setActive] = useState(0);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const wheelLockRef = useRef(false);

  const snapTimerRef = useRef<number | null>(null);
  const animRef = useRef<number | null>(null);

  const maxIdx = useMemo(() => CHANNELS.length - 1, []);

  // Geometry constants so spine + nodes never misalign
  const SPINE_X = 24; // px from viewport left
  const NODE_SIZE = 24; // px
  const NODE_RADIUS = NODE_SIZE / 2;
  const CONTENT_LEFT_PAD = 52; // px (space for node + gap)
  const ITEM_TOP = 28; // px, similar to "top-7"

  const cancelAnim = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    animRef.current = null;
  };

  const animateScrollTo = (el: HTMLElement, to: number, duration = 200) => {
    cancelAnim();

    const start = el.scrollTop;
    const change = to - start;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      el.scrollTop = start + change * easeInOutQuad(t);
      if (t < 1) animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
  };

  const snapToActive = (index: number) => {
    const vp = viewportRef.current;
    if (!vp) return;

    const item = vp.querySelector<HTMLElement>(`[data-channel="${index}"]`);
    if (!item) return;

    const vpCenter = vp.scrollTop + vp.clientHeight / 2;
    const itemCenter = item.offsetTop + item.offsetHeight / 2;
    const target = vp.scrollTop + (itemCenter - vpCenter);

    animateScrollTo(vp, target, 450); // 👈 tăng 700–850 nếu muốn “cinematic” hơn
  };

  // Snap when active changes
  useEffect(() => {
    snapToActive(active);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // Wheel → move active by ±1, then snap to center
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      cancelAnim(); // stop current animation on new input

      if (wheelLockRef.current) return;
      wheelLockRef.current = true;

      const dir = Math.sign(e.deltaY);
      setActive((prev) => clamp(prev + dir, 0, maxIdx));

      window.setTimeout(() => {
        wheelLockRef.current = false;
      }, 200);
    };

    vp.addEventListener("wheel", onWheel, { passive: false });
    return () => vp.removeEventListener("wheel", onWheel);
  }, [maxIdx]);

  // If user scrolls (trackpad / touch), magnet to nearest centered item when they stop
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;

    const onScroll = () => {
      if (snapTimerRef.current) window.clearTimeout(snapTimerRef.current);

      snapTimerRef.current = window.setTimeout(() => {
        const items = Array.from(
          vp.querySelectorAll<HTMLElement>("[data-channel]")
        );
        if (!items.length) return;

        const vpCenter = vp.scrollTop + vp.clientHeight / 2;

        let best = 0;
        let bestDist = Infinity;

        items.forEach((el, idx) => {
          const c = el.offsetTop + el.offsetHeight / 2;
          const d = Math.abs(c - vpCenter);
          if (d < bestDist) {
            bestDist = d;
            best = idx;
          }
        });

        setActive(best);
      }, 140);
    };

    vp.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      vp.removeEventListener("scroll", onScroll);
      if (snapTimerRef.current) window.clearTimeout(snapTimerRef.current);
    };
  }, []);

  // Keyboard navigation when viewport focused
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((p) => clamp(p + 1, 0, maxIdx));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((p) => clamp(p - 1, 0, maxIdx));
      }
    };

    vp.addEventListener("keydown", onKey);
    return () => vp.removeEventListener("keydown", onKey);
  }, [maxIdx]);

  // Cleanup animation on unmount
  useEffect(() => {
    return () => cancelAnim();
  }, []);

  return (
    <Section id="contact">
      {/* Header */}
      <div className="max-w-3xl">
        <Reveal>
          <div className="label mb-6">OPEN CHANNEL</div>
        </Reveal>

        <Reveal delayMs={80}>
          <h2 className="title-serif text-4xl md:text-5xl leading-tight">
            Reach out.
            <br />
            I’m listening.
          </h2>
        </Reveal>

        <Reveal delayMs={140}>
          <p className="muted mt-6 max-w-xl leading-relaxed">
            Feel free to contact me through the channels below.
          </p>
        </Reveal>
      </div>

      {/* Layout */}
      <div className="mt-16 relative grid gap-8 md:grid-cols-12">
        {/* ✅ Vertical divider between columns (desktop only) */}
        <div
          className="pointer-events-none absolute hidden md:block w-px"
          style={{
            left: "36.6%",
            top: -120,
            bottom: -120,
            background:
              "linear-gradient(to bottom, transparent, rgba(255,255,255,0.14) 12%, rgba(255,255,255,0.08) 88%, transparent)",
          }}
        />

        {/* LEFT: sticky SIGNAL */}
        <div className="md:col-span-4">
          <div className="sticky top-28">
            <Reveal>
              <div className="card p-6 md:p-7">
                <div className="label mb-4">SIGNAL</div>

                <div className="text-sm text-white/70 leading-relaxed">
                  Location
                  <div className="mt-2 text-white/85">{LOCATION}</div>
                </div>

                <div className="mt-6 text-sm text-white/70 leading-relaxed">
                  Role
                  <div className="mt-2 text-white/85">Frontend Developer</div>
                </div>

                <div className="mt-6 text-sm text-white/70 leading-relaxed">
                  Active channel
                  <div className="mt-2 text-white/85">
                    {CHANNELS[active]?.title}
                  </div>
                </div>
                {/* 
                <div className="mt-6 text-xs text-white/45">
                  Tip: Hover right side, use wheel. (↑/↓ also works)
                </div> */}
              </div>
            </Reveal>
          </div>
        </div>

        {/* RIGHT: masked viewport (NO big container card) */}
        <div className="md:col-span-8">
          <Reveal delayMs={120}>
            <div className="relative">
              {/* viewport */}
              <div
                ref={viewportRef}
                tabIndex={0}
                className={[
                  "relative h-[420px] md:h-[460px]",
                  "overflow-y-auto no-scrollbar",
                  "mask-feather-y",
                  "outline-none focus:ring-1 focus:ring-white/15",
                ].join(" ")}
              >
                {/* spine (inside right panel) */}
                <div
                  className="pointer-events-none absolute top-[-240px] bottom-[-240px] w-px bg-white/10"
                  style={{ left: SPINE_X }}
                />

                {/* top padding so first item can be centered */}
                <div className="h-[60px]" />

                <div className="space-y-10 pr-2">
                  {CHANNELS.map((c, i) => (
                    <a
                      key={c.idx}
                      href={c.href}
                      target={c.href.startsWith("http") ? "_blank" : undefined}
                      rel={c.href.startsWith("http") ? "noreferrer" : undefined}
                      className="group block"
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      data-channel={i}
                    >
                      <div
                        className="relative"
                        style={{ paddingLeft: CONTENT_LEFT_PAD }}
                      >
                        {/* node aligned with spine */}
                        <div
                          className="absolute"
                          style={{ left: SPINE_X - NODE_RADIUS, top: ITEM_TOP }}
                        >
                          <div className="relative">
                            <div
                              className={[
                                "h-6 w-6 rounded-full border hairline transition",
                                i === active ? "bg-white/15" : "bg-white/5",
                              ].join(" ")}
                            />
                            <div
                              className={[
                                "pointer-events-none absolute inset-0 rounded-full ring-1 transition",
                                i === active ? "ring-white/25" : "ring-white/0",
                              ].join(" ")}
                            />
                          </div>
                        </div>

                        {/* channel card */}
                        <div
                          className={[
                            "card p-7 md:p-8 transition-transform duration-300",
                            i === active
                              ? "bg-white/8 -translate-y-0.5"
                              : "group-hover:bg-white/8 group-hover:-translate-y-0.5",
                          ].join(" ")}
                        >
                          <div className="flex items-start justify-between gap-6">
                            <div>
                              <div className="label mb-2">{c.idx}</div>
                              <h3 className="text-xl font-semibold">
                                {c.title}
                              </h3>
                              <p className="muted mt-3 leading-relaxed">
                                {c.desc}
                              </p>
                            </div>

                            <div className="text-right">
                              <div className="text-xs text-white/45">
                                Channel
                              </div>
                              <div className="mt-2 text-sm text-white/80 group-hover:text-white transition">
                                {c.meta} →
                              </div>
                            </div>
                          </div>

                          <div className="mt-6 h-px w-full bg-white/10" />
                          <div className="mt-4 text-sm text-white/60 group-hover:text-white transition">
                            Open {c.title} →
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>

                {/* bottom padding so last item can be centered */}
                <div className="h-[160px]" />
              </div>

              {/* counter */}
              <div className="pointer-events-none absolute right-0 bottom-0 text-xs text-white/45">
                {active + 1}/{CHANNELS.length}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
