import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useCart } from "@/context/CartProvider";
import { formatCurrency, getOrderSummary } from "@/lib/currency";
import { createPaymentOrder, openRazorpayCheckout, verifyPayment } from "@/lib/razorpay";

const checkoutSchema = z.object({
  name: z.string().min(2, "Enter your full name"),
  phone: z
    .string()
    .min(10, "Enter a valid phone number")
    .regex(/^[0-9+\-\s()]{10,15}$/, "Enter a valid phone number"),
  email: z.string().email("Enter a valid email address"),
  institute: z.string().min(2, "Enter your institute or organization"),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

const inputClass =
  "mt-2 w-full rounded-xl border border-[var(--gold)]/25 bg-[var(--burgundy)]/40 px-4 py-3 text-sm text-[var(--ivory)] placeholder:text-[var(--ivory)]/40 focus:border-[var(--gold)]/60 focus:outline-none focus:ring-1 focus:ring-[var(--gold)]/40";

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const [payError, setPayError] = useState("");
  const [isPaying, setIsPaying] = useState(false);

  const summary = getOrderSummary(items);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
  });

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--background)] px-6 py-24 text-center text-[var(--ivory)]">
        <h1 className="font-display text-4xl">Your cart is empty</h1>
        <p className="mt-4 text-[var(--ivory)]/70">Add a registration tier or add-on before checkout.</p>
        <Link
          to="/#pricing"
          className="mt-8 inline-flex rounded-full bg-[var(--gold)] px-8 py-4 text-xs uppercase tracking-[0.35em] text-[var(--burgundy-deep)]"
        >
          Browse packages
        </Link>
      </div>
    );
  }

  const onSubmit = async (data: CheckoutForm) => {
    setPayError("");
    setIsPaying(true);

    try {
      const order = await createPaymentOrder({
        amount: summary.total,
        currency: "INR",
        customer: data,
        items: items.map((item) => ({
          id: item.id,
          title: item.title,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      await openRazorpayCheckout({
        keyId: order.keyId,
        orderId: order.orderId,
        amount: order.amount,
        currency: order.currency,
        customer: data,
        institute: data.institute,
        onDismiss: () => setIsPaying(false),
        onSuccess: async (payment) => {
          try {
            await verifyPayment(payment);
            clearCart();
            navigate("/payment/success", {
              state: {
                paymentId: payment.razorpay_payment_id,
                email: data.email,
              },
            });
          } catch (err) {
            setPayError(err instanceof Error ? err.message : "Payment verification failed");
            setIsPaying(false);
          }
        },
      });
    } catch (err) {
      setPayError(err instanceof Error ? err.message : "Unable to start payment");
      setIsPaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] px-6 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/"
          className="text-xs uppercase tracking-[0.35em] text-[var(--gold)]/80 hover:text-[var(--gold)]"
        >
          ← Back to ICORE
        </Link>

        <div className="mt-8 text-center">
          <div className="text-xs uppercase tracking-[0.4em] text-[var(--gold)]">Checkout</div>
          <h1 className="mt-4 font-display text-4xl md:text-5xl text-[var(--ivory)]">
            Complete Your Registration
          </h1>
          <p className="mt-4 max-w-2xl mx-auto font-serif italic text-lg text-[var(--ivory)]/70">
            Share your details, then pay securely via Razorpay.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_380px]">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-3xl border border-[var(--gold)]/20 bg-[var(--burgundy)]/25 p-8 md:p-10"
          >
            <h2 className="font-display text-2xl text-[var(--ivory)]">Attendee information</h2>
            <p className="mt-2 text-sm text-[var(--ivory)]/65">
              We use these details for your registration confirmation and invoice.
            </p>

            <div className="mt-8 space-y-6">
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]/90">
                  Full name
                </label>
                <input className={inputClass} placeholder="Dr. Jane Doe" {...register("name")} />
                {errors.name && (
                  <p className="mt-2 text-xs text-red-300">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]/90">
                  Phone number
                </label>
                <input
                  className={inputClass}
                  placeholder="+91 98765 43210"
                  type="tel"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="mt-2 text-xs text-red-300">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]/90">
                  Email address
                </label>
                <input
                  className={inputClass}
                  placeholder="you@institute.edu"
                  type="email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="mt-2 text-xs text-red-300">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]/90">
                  Institute / organization
                </label>
                <input
                  className={inputClass}
                  placeholder="SIAM Institute, Jaipur"
                  {...register("institute")}
                />
                {errors.institute && (
                  <p className="mt-2 text-xs text-red-300">{errors.institute.message}</p>
                )}
              </div>
            </div>

            {payError && (
              <p className="mt-6 rounded-xl border border-red-400/30 bg-red-950/30 px-4 py-3 text-sm text-red-200">
                {payError}
              </p>
            )}

            <button
              type="submit"
              disabled={isPaying}
              className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-[var(--gold)] px-5 py-4 text-xs uppercase tracking-[0.35em] text-[var(--burgundy-deep)] shadow-gold transition hover:bg-[var(--gold-soft)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPaying ? "Opening payment…" : `Pay ${formatCurrency(summary.total)} via Razorpay`}
            </button>
          </form>

          <aside className="h-fit rounded-3xl border border-[var(--gold)]/20 bg-[var(--burgundy-deep)]/80 p-8">
            <h2 className="font-display text-xl text-[var(--ivory)]">Order summary</h2>
            <ul className="mt-6 space-y-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="border-b border-[var(--gold)]/15 pb-4 last:border-0 last:pb-0"
                >
                  <div className="text-[10px] uppercase tracking-[0.28em] text-[var(--gold)]/80">
                    {item.source}
                  </div>
                  <div className="mt-1 font-display text-[var(--ivory)]">{item.title}</div>
                  <div className="mt-1 flex justify-between text-sm text-[var(--ivory)]/70">
                    <span>Qty {item.quantity}</span>
                    <span className="text-[var(--gold)]">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-2 text-sm uppercase tracking-[0.25em] text-[var(--ivory)]/70">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-[var(--gold)]">{formatCurrency(summary.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%)</span>
                <span className="text-[var(--gold)]">{formatCurrency(summary.gst)}</span>
              </div>
              <div className="mt-2 h-px bg-[var(--gold)]/20" />
              <div className="flex justify-between text-[var(--ivory)]">
                <span>Total</span>
                <span className="font-display text-xl text-[var(--gold)]">
                  {formatCurrency(summary.total)}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
