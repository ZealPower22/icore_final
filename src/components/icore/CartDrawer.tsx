import { motion } from "framer-motion";

type CartItem = {
  id: string;
  title: string;
  label: string;
  price: number;
  quantity: number;
  source: string;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function CartDrawer({
  open,
  items,
  onClose,
  onRemove,
}: {
  open: boolean;
  items: CartItem[];
  onClose: () => void;
  onRemove: (id: string) => void;
}) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <motion.aside
      initial={{ x: "100%" }}
      animate={{ x: open ? "0%" : "100%" }}
      transition={{ type: "spring", stiffness: 280, damping: 32 }}
      className="fixed top-0 right-0 z-50 h-full w-full sm:w-[420px] border-l border-[var(--gold)]/10 bg-[var(--burgundy-deep)]/95 backdrop-blur-xl shadow-luxe"
    >
      <div className="flex h-full flex-col px-6 py-6 text-[var(--ivory)]">
        <div className="flex items-center justify-between gap-4 border-b border-[var(--gold)]/15 pb-4">
          <div>
            <div className="text-xs uppercase tracking-[0.4em] text-[var(--gold)]/80">Cart</div>
            <h2 className="mt-3 text-2xl font-display text-[var(--ivory)]">Your reservation basket</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-sm uppercase tracking-[0.3em] text-[var(--gold)]/80 hover:text-[var(--gold)] transition"
          >
            Close
          </button>
        </div>

        <div className="mt-6 flex-1 space-y-4 overflow-y-auto pr-2">
          {items.length === 0 ? (
            <div className="rounded-3xl border border-[var(--gold)]/15 bg-[var(--burgundy)]/30 p-8 text-center text-sm text-[var(--ivory)]/70">
              No reservations yet. Tap Reserve to add a package or add-on.
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="rounded-3xl border border-[var(--gold)]/15 bg-[var(--burgundy)]/30 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm uppercase tracking-[0.3em] text-[var(--gold)]/80">{item.source}</div>
                    <div className="mt-2 font-display text-lg text-[var(--ivory)]">{item.title}</div>
                    <div className="mt-2 text-sm text-[var(--ivory)]/70">{item.label}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-lg text-[var(--gold)]">{formatCurrency(item.price)}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.3em] text-[var(--ivory)]/70">Qty {item.quantity}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  className="mt-4 text-xs uppercase tracking-[0.35em] text-[var(--gold)]/80 hover:text-[var(--gold)]"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 rounded-3xl border border-[var(--gold)]/15 bg-[var(--burgundy)]/20 p-6">
          <div className="flex items-center justify-between text-sm uppercase tracking-[0.3em] text-[var(--ivory)]/70">
            <span>Subtotal</span>
            <span className="font-display text-lg text-[var(--gold)]">{formatCurrency(total)}</span>
          </div>
          <p className="mt-3 text-xs text-[var(--ivory)]/60 leading-relaxed">
            Your reservation totals update instantly. Proceed when you are ready to pay.
          </p>
          <a
            href="https://vijay-portfolio-53wi.vercel.app/?utm_source=chatgpt.com"
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[var(--gold)] px-5 py-4 text-xs uppercase tracking-[0.35em] text-[var(--burgundy-deep)] shadow-gold transition hover:bg-[var(--gold-soft)]"
          >
            Proceed to Payment
          </a>
        </div>
      </div>
    </motion.aside>
  );
}
