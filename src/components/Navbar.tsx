import clsx from "clsx";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useActiveSection } from "../hooks/useActiveSection";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { toggleMode } from "../store/themeSlice";
import { DarkMode, LightMode } from "@mui/icons-material";

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
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const activeId = isHomePage ? useActiveSection(SECTIONS.map((s) => s.id)) : null;

  const navRef = useRef<HTMLElement | null>(null);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicator, setIndicator] = useState<Indicator | null>(null);
  
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.theme.mode);

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
    if (isHomePage) {
      measure();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId, isHomePage]);

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
          <Link to="/" className="text-sm font-semibold tracking-wide">
            <span className="muted2">kane</span>
            <span className="mx-2 text-white/30">/</span>
            <span className="muted">portfolio</span>
          </Link>

          {/* Desktop nav */}
          {isHomePage && (
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
            <button
              onClick={() => dispatch(toggleMode())}
              className="rounded-xl border hairline p-2 text-white/80 hover:bg-white/10 transition"
              aria-label="Toggle theme"
            >
              {mode === "dark" ? (
                <LightMode sx={{ fontSize: 20 }} />
              ) : (
                <DarkMode sx={{ fontSize: 20 }} />
              )}
            </button>
            <Link
              to="/achievements"
              className="rounded-xl border hairline px-4 py-2 text-xs tracking-[0.24em] text-white/80 hover:bg-white/10"
            >
              ACHIEVEMENTS
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
