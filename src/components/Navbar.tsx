import clsx from "clsx";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useActiveSection } from "../hooks/useActiveSection";
import { useTheme } from "../hooks/useTheme";

const SECTIONS = [
  { id: "home", label: "HOME" },
  { id: "about", label: "ABOUT" },
  { id: "projects", label: "PROJECTS" },
  { id: "contact", label: "CONTACT" },
];

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  history.replaceState(null, "", `#${id}`);
}

type Indicator = { x: number; y: number; w: number; h: number };

export default function Navbar() {
  const activeId = useActiveSection(SECTIONS.map((s) => s.id));
  const { isLight, toggleTheme } = useTheme();
  const location = useLocation();
  const isAchievementsPage = location.pathname === "/achievements";

  const navRef = useRef<HTMLElement | null>(null);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicator, setIndicator] = useState<Indicator | null>(null);

  const measure = () => {
    const navEl = navRef.current;
    if (!navEl) return;

    const idx = SECTIONS.findIndex((s) => s.id === activeId);
    const btn = btnRefs.current[idx];
    if (!btn) return;

    const navRect = navEl.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    setIndicator({
      x: btnRect.left - navRect.left,
      y: btnRect.top - navRect.top,
      w: btnRect.width,
      h: btnRect.height,
    });
  };

  // Khi đổi tab: đo lại để pill trượt qua
  useLayoutEffect(() => {
    measure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  // Khi resize / layout đổi: đo lại để pill không lệch
  useEffect(() => {
    const onResize = () => measure();
    window.addEventListener("resize", onResize);

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && navRef.current) {
      ro = new ResizeObserver(() => measure());
      ro.observe(navRef.current);
    }

    return () => {
      window.removeEventListener("resize", onResize);
      ro?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="container-x pt-5">
        <div className="glass flex items-center justify-between rounded-2xl px-5 py-3">
          <button onClick={() => scrollToId("home")} className="text-sm font-semibold tracking-wide">
            <span className="muted2">kane</span>
            <span className="mx-2 text-white/30">/</span>
            <span className="muted">portfolio</span>
          </button>

          {/* Desktop nav */}
          {!isAchievementsPage && (
            <nav ref={navRef} className="relative hidden items-center gap-2 md:flex">
            {/* Nền trắng dạng pill (trượt mượt) */}
            {indicator && (
              <span
                aria-hidden="true"
                className="absolute rounded-full bg-white transition-[transform,width,height] duration-300 ease-out"
                style={{
                  width: indicator.w,
                  height: indicator.h,
                  transform: `translate(${indicator.x}px, ${indicator.y}px)`,
                }}
              />
            )}

            {SECTIONS.map((s, i) => (
              <button
                key={s.id}
                ref={(el) => {
                  btnRefs.current[i] = el;
                }}
                onClick={() => scrollToId(s.id)}
                aria-current={activeId === s.id ? "page" : undefined}
                className={clsx(
                  "relative z-10 rounded-full px-3 py-2 text-xs tracking-[0.24em] transition",
                  activeId === s.id
                    ? "text-black"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                {s.label}
              </button>
            ))}
            </nav>
          )}

          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-xl border hairline p-2.5 text-white/80 hover:bg-white/10 transition-colors"
              aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
            >
              {isLight ? (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              )}
            </button>

            {isAchievementsPage ? (
              <Link
                to="/"
                className="rounded-xl border hairline px-4 py-2 text-xs tracking-[0.24em] text-white/80 hover:bg-white/10"
              >
                BACK HOME
              </Link>
            ) : (
              <>
                <Link
                  to="/achievements"
                  className="rounded-xl border hairline px-4 py-2 text-xs tracking-[0.24em] text-white/80 hover:bg-white/10"
                >
                  ACHIEVEMENTS
                </Link>
                <a
                  href="#contact"
                  className="rounded-xl border hairline px-4 py-2 text-xs tracking-[0.24em] text-white/80 hover:bg-white/10"
                >
                  LET&apos;S TALK
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
