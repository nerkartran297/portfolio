import { useEffect, useState } from "react";
import Section from "../components/Section";
import Reveal from "../components/Reveal";
import ProfileFrame from "../components/ProfileFrame";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function Hero() {
  const [parallaxY, setParallaxY] = useState(0);

  useEffect(() => {
    let raf = 0;

    const tick = () => {
      const el = document.getElementById("home");
      if (!el) return;

      const r = el.getBoundingClientRect();
      // r.top: 0 khi section chạm top, âm khi kéo xuống
      // map từ [-vh .. 0] -> [1..0] để tạo cảm giác bay nhẹ
      const t = clamp((-r.top) / window.innerHeight, 0, 1);

      // độ parallax (px) – nhẹ thôi để cinematic
      const y = t * 28; // 0 -> 28px
      setParallaxY(y);

      raf = 0;
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(tick);
    };

    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <Section id="home" className="relative" center>
      <div className="grid gap-10 md:grid-cols-12 md:items-center">
        <div className="md:col-span-6">
          <Reveal>
            <div className="label mb-5">FRONTEND • REACT • TYPESCRIPT</div>
          </Reveal>

          <Reveal delayMs={80}>
            <h1 className="title-serif text-4xl leading-tight md:text-6xl">
              Crafting clean UI
              <br />
              with cinematic motion.
            </h1>
          </Reveal>

          <Reveal delayMs={160}>
            <p className="muted mt-6 max-w-md leading-relaxed">
              Scroll-driven sections, subtle reveals, dark editorial aesthetic inspired by
              generative art.
            </p>
          </Reveal>

          <Reveal delayMs={220}>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#projects"
                className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black"
              >
                View Projects
              </a>
              <a
                href="#contact"
                className="rounded-full border hairline px-6 py-3 text-sm text-white/80 hover:bg-white/10"
              >
                Contact
              </a>
            </div>
          </Reveal>
        </div>

        <div className="md:col-span-6">
          <Reveal delayMs={120}>
            {/* Parallax wrapper */}
            <div
              style={{
                transform: `translateY(${parallaxY}px)`,
              }}
              className="transition-transform duration-200 ease-out"
            >
              {/* abstract “art” placeholder */}
              <ProfileFrame src="/profile.jpg"/>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
