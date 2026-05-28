import { useEffect, useState } from "react";

const links = [
  { href: "#about", label: "About" },
  { href: "#program", label: "Program" },
  { href: "#faculty", label: "Faculty" },
  { href: "#research", label: "Research" },
  { href: "#venue", label: "Venue" },
  { href: "#pricing", label: "Registration" },
  { href: "#jaipur", label: "Jaipur" },
];

export function Nav({
  cartCount = 0,
  onOpenCart,
}: {
  cartCount?: number;
  onOpenCart?: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass py-3" : "py-6 bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 flex items-center justify-between gap-4">
        <a href="#top" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-full border border-[var(--gold)]/60 flex items-center justify-center text-[var(--gold)] font-display text-sm group-hover:bg-[var(--gold)]/10 transition">
            ✦
          </div>
          <div className="leading-tight">
            <div className="font-display text-sm tracking-[0.3em] text-[var(--ivory)]">
              I.C.O.R.E
            </div>
            <div className="text-[10px] tracking-[0.3em] text-[var(--gold)]">JAIPUR · 2026</div>
          </div>
        </a>
        <div className="hidden lg:flex items-center gap-8 flex-1 justify-center">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-xs uppercase tracking-[0.25em] text-[var(--ivory)] hover:text-[var(--gold)] transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenCart}
            aria-label="Open cart"
            className="hidden sm:inline-flex items-center justify-center rounded-full border border-[var(--gold)]/40 bg-[var(--burgundy-deep)]/80 p-3 text-[var(--gold)] transition-all hover:bg-[var(--gold)]/10"
          >
            <span className="text-base">🛒</span>
            <span className="sr-only">Cart</span>
            <span className="ml-2 inline-flex h-6 min-w-[24px] items-center justify-center rounded-full bg-[var(--gold)] text-[var(--burgundy-deep)] text-xs font-semibold">
              {cartCount}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            className="inline-flex lg:hidden items-center justify-center rounded-full border border-[var(--gold)]/40 bg-[var(--burgundy-deep)]/80 px-3 py-2 text-[var(--gold)] transition-all hover:bg-[var(--gold)]/10"
          >
            <span className="text-sm uppercase tracking-[0.2em]">{mobileOpen ? "Close" : "Menu"}</span>
          </button>
          <a
            href="#pricing"
            className="text-xs uppercase tracking-[0.25em] px-5 py-3 border border-[var(--gold)]/60 text-[var(--gold)] hover:bg-[var(--gold)] hover:text-[var(--burgundy-deep)] transition-all duration-300"
          >
            Register →
          </a>
        </div>
      </div>
      {mobileOpen && (
        <div className="mx-auto mt-4 max-w-7xl px-6 lg:hidden">
          <div className="rounded-2xl border border-[var(--gold)]/20 bg-[var(--burgundy-deep)]/95 p-4 shadow-luxe">
            <div className="grid grid-cols-2 gap-2">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={closeMobileMenu}
                  className="rounded-lg border border-[var(--gold)]/15 px-3 py-2 text-center text-[11px] uppercase tracking-[0.2em] text-[var(--ivory)] transition-colors hover:border-[var(--gold)]/50 hover:text-[var(--gold)]"
                >
                  {l.label}
                </a>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                closeMobileMenu();
                onOpenCart?.();
              }}
              className="mt-3 inline-flex w-full items-center justify-center rounded-lg border border-[var(--gold)]/40 bg-[var(--burgundy)]/60 px-3 py-2 text-xs uppercase tracking-[0.25em] text-[var(--gold)] hover:bg-[var(--gold)]/10"
            >
              Cart ({cartCount})
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
