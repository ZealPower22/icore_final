import "@/styles.css";
import { useMemo, useState } from "react";
import { Nav } from "@/components/icore/Nav";
import { CartDrawer } from "@/components/icore/CartDrawer";
import { Hero } from "@/components/icore/Hero";
import {
  Trust,
  CoreStory,
  Principles,
  WhatYouGet,
  Program,
  Faculty,
  MedicalPanel,
  Masterclasses,
  Research,
  Venue,
  Pricing,
  AddOns,
  Jaipur,
  FinalCTA,
  Footer,
} from "@/components/icore/Sections";

type CartItem = {
  id: string;
  title: string;
  label: string;
  price: number;
  quantity: number;
  source: string;
};

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  const handleReserve = (item: Omit<CartItem, "quantity">) => {
    setCart((prev) => {
      const existing = prev.find((entry) => entry.id === item.id);
      if (existing) {
        return prev.map((entry) =>
          entry.id === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setToastMessage(`${item.title} added to cart`);
    window.setTimeout(() => setToastMessage(""), 3000);
  };

  const handleRemoveItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <main className="min-h-screen bg-transparent text-[var(--foreground)]">
      <Nav cartCount={cartCount} onOpenCart={() => setCartOpen(true)} />
      <Hero />
      <Trust />
      <CoreStory />
      <Principles />
      <WhatYouGet />
      <Program />
      <Faculty />
      <MedicalPanel />
      <Masterclasses />
      <Research />
      <Venue />
      <Pricing onReserve={handleReserve} />
      <AddOns onReserve={handleReserve} />
      <Jaipur />
      <FinalCTA />
      <Footer />

      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          aria-label="Open cart"
          className="inline-flex items-center justify-center rounded-full border border-[var(--gold)]/20 bg-[var(--burgundy-deep)]/95 p-3 text-[var(--gold)] shadow-luxe transition hover:bg-[var(--gold)]/20"
        >
          <span className="text-xl">🛒</span>
          <span className="ml-2 inline-flex h-6 min-w-[24px] items-center justify-center rounded-full bg-[var(--gold)] text-[var(--burgundy-deep)] text-xs font-semibold">
            {cartCount}
          </span>
        </button>
        <div className={`w-full max-w-xs overflow-hidden rounded-3xl border border-[var(--gold)]/20 bg-[var(--burgundy-deep)]/95 px-5 py-4 text-sm text-[var(--ivory)] shadow-luxe transition-all duration-300 ${toastMessage ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          {toastMessage}
        </div>
      </div>

      <CartDrawer open={cartOpen} items={cart} onClose={() => setCartOpen(false)} onRemove={handleRemoveItem} />
    </main>
  );
}

export default App;
