import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useCart } from "@/context/CartProvider";
import { formatCurrency, getOrderSummary } from "@/lib/currency";
import { formatCartSummary, submitToGoogleSheet } from "@/lib/googleSheet";

const QR_IMAGE_PATH = "/images/Payment/qrcode.jpeg";

const BANK_DETAILS = {
  bankName: "Central Bank of India",
  accountName: "Ayush Shrivastava",
  accountNumber: "3716159977",
  ifscCode: "CBIN0281915",
} as const;
const attendeeSchema = z.object({
  name: z.string().min(2, "Enter your full name"),
  phone: z
    .string()
    .min(10, "Enter a valid phone number")
    .regex(/^[0-9+\-\s()]{10,15}$/, "Enter a valid phone number"),
  email: z.string().email("Enter a valid email address"),
  qualification: z.string().min(2, "Enter your qualification"),
  implantExperience: z.string().min(1, "Select your implant experience"),
  additionalInfo: z.string().optional(),
});

const paymentSchema = z.object({
  transactionId: z.string().min(4, "Enter your transaction / UTR ID"),
  proofLink: z
    .string()
    .min(10, "Enter your Google Drive link")
    .url("Enter a valid URL")
    .refine(
      (url) =>
        /drive\.google\.com|docs\.google\.com/i.test(url) ||
        /^https?:\/\/.+/i.test(url),
      "Use a Google Drive share link (https://drive.google.com/...)",
    ),
  paymentStatus: z.enum(["success", "failed"], {
    required_error: "Select payment status",
  }),
});

type AttendeeForm = z.infer<typeof attendeeSchema>;
type PaymentForm = z.infer<typeof paymentSchema>;

const inputClass =
  "mt-2 w-full rounded-xl border border-[var(--gold)]/25 bg-[var(--burgundy)]/40 px-4 py-3 text-sm text-[var(--ivory)] placeholder:text-[var(--ivory)]/40 focus:border-[var(--gold)]/60 focus:outline-none focus:ring-1 focus:ring-[var(--gold)]/40";
const selectClass =
  "mt-2 w-full rounded-xl border border-[var(--gold)]/25 bg-[var(--burgundy)]/40 px-4 py-3 text-sm text-[var(--ivory)] focus:border-[var(--gold)]/60 focus:outline-none focus:ring-1 focus:ring-[var(--gold)]/40";

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const [step, setStep] = useState<"details" | "payment">("details");
  const [attendeeData, setAttendeeData] = useState<AttendeeForm | null>(null);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const summary = getOrderSummary(items);

  const attendeeForm = useForm<AttendeeForm>({
    resolver: zodResolver(attendeeSchema),
  });

  const paymentForm = useForm<PaymentForm>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentStatus: "success",
    },
  });

  const paymentStatus = paymentForm.watch("paymentStatus");

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

  const onAttendeeSubmit = (data: AttendeeForm) => {
    setAttendeeData(data);
    setStep("payment");
    setSubmitError("");
  };

  const onPaymentSubmit = async (data: PaymentForm) => {
    if (!attendeeData) {
      setSubmitError("Please complete attendee details first.");
      setStep("details");
      return;
    }

    if (data.paymentStatus !== "success") {
      setSubmitError("Submit is only available when payment status is successful.");
      return;
    }

    setSubmitError("");
    setIsSubmitting(true);

    try {
      const orderId = `ICORE-${Date.now()}`;
      const cartSummary = formatCartSummary(items);

      await submitToGoogleSheet({
        name: attendeeData.name,
        email: attendeeData.email,
        phone: attendeeData.phone,
        qualification: attendeeData.qualification,
        implantExperience: attendeeData.implantExperience,
        additionalInfo: attendeeData.additionalInfo ?? "",
        paymentId: data.transactionId,
        orderId,
        transactionId: data.transactionId,
        paymentStatus: data.paymentStatus,
        subtotal: summary.subtotal,
        gst: summary.gst,
        total: summary.total,
        cartItems: JSON.stringify(
          items.map((item) => ({
            id: item.id,
            title: item.title,
            source: item.source,
            quantity: item.quantity,
            price: item.price,
            lineTotal: item.price * item.quantity,
          })),
        ),
        cartSummary,
        proofLink: data.proofLink.trim(),
        submittedAt: new Date().toISOString(),
      });

      clearCart();
      navigate("/payment/success", {
        state: {
          transactionId: data.transactionId,
          email: attendeeData.email,
        },
      });
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Could not save registration. Please try again or contact support.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmitPayment =
    paymentStatus === "success" &&
    Boolean(paymentForm.watch("transactionId")?.trim()) &&
    Boolean(paymentForm.watch("proofLink")?.trim()) &&
    !isSubmitting;

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
            {step === "details"
              ? "Share your details, then pay using the QR code and submit proof."
              : `Scan the QR and pay ${formatCurrency(summary.total)} (incl. 18% GST), then submit your transaction ID and Drive proof link.`}
          </p>
        </div>

        <div className="mt-8 flex justify-center gap-3">
          <span
            className={`rounded-full px-4 py-1.5 text-[10px] uppercase tracking-[0.25em] ${
              step === "details"
                ? "bg-[var(--gold)] text-[var(--burgundy-deep)]"
                : "border border-[var(--gold)]/30 text-[var(--ivory)]/70"
            }`}
          >
            1 · Details
          </span>
          <span
            className={`rounded-full px-4 py-1.5 text-[10px] uppercase tracking-[0.25em] ${
              step === "payment"
                ? "bg-[var(--gold)] text-[var(--burgundy-deep)]"
                : "border border-[var(--gold)]/30 text-[var(--ivory)]/70"
            }`}
          >
            2 · Payment
          </span>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_380px]">
          {step === "details" ? (
            <form
              onSubmit={attendeeForm.handleSubmit(onAttendeeSubmit)}
              className="rounded-3xl border border-[var(--gold)]/20 bg-[var(--burgundy)]/25 p-8 md:p-10"
            >
              <h2 className="font-display text-2xl text-[var(--ivory)]">Attendee information</h2>
              <p className="mt-2 text-sm text-[var(--ivory)]/65">
                We use these details for your registration confirmation.
              </p>

              <div className="mt-8 space-y-6">
                <div>
                  <label className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]/90">
                    Full name
                  </label>
                  <input
                    className={inputClass}
                    placeholder="Dr. Jane Doe"
                    {...attendeeForm.register("name")}
                  />
                  {attendeeForm.formState.errors.name && (
                    <p className="mt-2 text-xs text-red-300">
                      {attendeeForm.formState.errors.name.message}
                    </p>
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
                    {...attendeeForm.register("phone")}
                  />
                  {attendeeForm.formState.errors.phone && (
                    <p className="mt-2 text-xs text-red-300">
                      {attendeeForm.formState.errors.phone.message}
                    </p>
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
                    {...attendeeForm.register("email")}
                  />
                  {attendeeForm.formState.errors.email && (
                    <p className="mt-2 text-xs text-red-300">
                      {attendeeForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]/90">
                    Qualification
                  </label>
                  <select
                    className={selectClass}
                    defaultValue=""
                    {...attendeeForm.register("qualification")}
                  >
                    <option value="" disabled style={{ color: "#111827", backgroundColor: "#ffffff" }}>
                      Select qualification
                    </option>
                    <option value="BDS" style={{ color: "#111827", backgroundColor: "#ffffff" }}>
                      BDS
                    </option>
                    <option value="MDS" style={{ color: "#111827", backgroundColor: "#ffffff" }}>
                      MDS
                    </option>
                    <option
                      value="BDS + Diploma"
                      style={{ color: "#111827", backgroundColor: "#ffffff" }}
                    >
                      BDS + Diploma
                    </option>
                    <option value="Other" style={{ color: "#111827", backgroundColor: "#ffffff" }}>
                      Other
                    </option>
                  </select>
                  {attendeeForm.formState.errors.qualification && (
                    <p className="mt-2 text-xs text-red-300">
                      {attendeeForm.formState.errors.qualification.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]/90">
                    Implant experience
                  </label>
                  <select
                    className={selectClass}
                    defaultValue=""
                    {...attendeeForm.register("implantExperience")}
                  >
                    <option value="" disabled style={{ color: "#111827", backgroundColor: "#ffffff" }}>
                      Select experience level
                    </option>
                    <option value="Beginner" style={{ color: "#111827", backgroundColor: "#ffffff" }}>
                      Beginner
                    </option>
                    <option
                      value="Intermediate"
                      style={{ color: "#111827", backgroundColor: "#ffffff" }}
                    >
                      Intermediate
                    </option>
                    <option value="Advanced" style={{ color: "#111827", backgroundColor: "#ffffff" }}>
                      Advanced
                    </option>
                  </select>
                  {attendeeForm.formState.errors.implantExperience && (
                    <p className="mt-2 text-xs text-red-300">
                      {attendeeForm.formState.errors.implantExperience.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]/90">
                    Additional information
                  </label>
                  <textarea
                    className={`${inputClass} min-h-28 resize-y`}
                    placeholder="Anything you'd like us to know before registration."
                    {...attendeeForm.register("additionalInfo")}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-[var(--gold)] px-5 py-4 text-xs uppercase tracking-[0.35em] text-[var(--burgundy-deep)] shadow-gold transition hover:bg-[var(--gold-soft)]"
              >
                Continue to payment →
              </button>
            </form>
          ) : (
            <form
              onSubmit={paymentForm.handleSubmit(onPaymentSubmit)}
              className="rounded-3xl border border-[var(--gold)]/20 bg-[var(--burgundy)]/25 p-8 md:p-10"
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-display text-2xl text-[var(--ivory)]">Payment</h2>
                <button
                  type="button"
                  onClick={() => setStep("details")}
                  className="text-xs uppercase tracking-[0.25em] text-[var(--gold)]/80 hover:text-[var(--gold)]"
                >
                  Edit details
                </button>
              </div>

              <div className="mt-8 rounded-2xl border border-[var(--gold)]/25 bg-[var(--burgundy-deep)]/50 p-6">
                <p className="text-center text-xs uppercase tracking-[0.3em] text-[var(--gold)]">
                  Scan & pay · UPI / bank transfer
                </p>
                <p className="mt-2 text-center font-display text-2xl text-[var(--ivory)]">
                  {formatCurrency(summary.total)}
                </p>

                <div className="mt-6 grid gap-6 md:grid-cols-2 md:items-start">
                  <div className="text-center">
                    <div className="mx-auto max-w-[260px] overflow-hidden rounded-xl border border-[var(--gold)]/30 bg-white p-3">
                      <img
                        src={QR_IMAGE_PATH}
                        alt="ICORE payment QR code"
                        className="h-auto w-full object-contain"
                      />
                    </div>
                    <p className="mt-3 text-xs uppercase tracking-[0.2em] text-[var(--ivory)]/60">
                      UPI QR code
                    </p>
                  </div>

                  <div className="rounded-xl border border-[var(--gold)]/20 bg-[var(--burgundy)]/40 p-5 text-left">
                    <p className="text-xs uppercase tracking-[0.28em] text-[var(--gold)]">
                      Bank transfer details
                    </p>
                    <dl className="mt-4 space-y-3 text-sm">
                      <div>
                        <dt className="text-[10px] uppercase tracking-[0.2em] text-[var(--ivory)]/55">
                          Bank name
                        </dt>
                        <dd className="mt-1 font-medium text-[var(--ivory)]">
                          {BANK_DETAILS.bankName}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[10px] uppercase tracking-[0.2em] text-[var(--ivory)]/55">
                          Account name
                        </dt>
                        <dd className="mt-1 font-medium text-[var(--ivory)]">
                          {BANK_DETAILS.accountName}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[10px] uppercase tracking-[0.2em] text-[var(--ivory)]/55">
                          Account number
                        </dt>
                        <dd className="mt-1 font-mono text-base text-[var(--gold-soft)]">
                          {BANK_DETAILS.accountNumber}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[10px] uppercase tracking-[0.2em] text-[var(--ivory)]/55">
                          IFSC code
                        </dt>
                        <dd className="mt-1 font-mono text-base text-[var(--gold-soft)]">
                          {BANK_DETAILS.ifscCode}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                <p className="mt-6 text-center text-sm text-[var(--ivory)]/65">
                  After payment, upload your proof to Google Drive, set sharing to Anyone with the
                  link, then paste the link below.
                </p>
              </div>

              <div className="mt-8 space-y-6">
                <div>
                  <label className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]/90">
                    Transaction ID / UTR
                  </label>
                  <input
                    className={inputClass}
                    placeholder="e.g. 123456789012"
                    {...paymentForm.register("transactionId")}
                  />
                  {paymentForm.formState.errors.transactionId && (
                    <p className="mt-2 text-xs text-red-300">
                      {paymentForm.formState.errors.transactionId.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]/90">
                    Payment proof — Google Drive link
                  </label>
                  <input
                    className={inputClass}
                    type="url"
                    placeholder="https://drive.google.com/file/d/..."
                    {...paymentForm.register("proofLink")}
                  />
                  <p className="mt-2 text-xs text-[var(--ivory)]/55">
                    Upload proof to Drive → Share → Anyone with the link → Copy link and paste here.
                  </p>
                  {paymentForm.formState.errors.proofLink && (
                    <p className="mt-2 text-xs text-red-300">
                      {paymentForm.formState.errors.proofLink.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]/90">
                    Payment status
                  </label>
                  <select className={selectClass} {...paymentForm.register("paymentStatus")}>
                    <option value="success" style={{ color: "#111827", backgroundColor: "#ffffff" }}>
                      Payment successful
                    </option>
                    <option value="failed" style={{ color: "#111827", backgroundColor: "#ffffff" }}>
                      Payment failed / pending
                    </option>
                  </select>
                  {paymentStatus !== "success" && (
                    <p className="mt-2 text-xs text-amber-200/90">
                      Submit is enabled only when payment is marked successful and the Drive link is added.
                    </p>
                  )}
                </div>
              </div>

              {submitError && (
                <p className="mt-6 rounded-xl border border-red-400/30 bg-red-950/30 px-4 py-3 text-sm text-red-200">
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                disabled={!canSubmitPayment}
                className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-[var(--gold)] px-5 py-4 text-xs uppercase tracking-[0.35em] text-[var(--burgundy-deep)] shadow-gold transition hover:bg-[var(--gold-soft)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Submitting…" : "Submit registration"}
              </button>
            </form>
          )}

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
