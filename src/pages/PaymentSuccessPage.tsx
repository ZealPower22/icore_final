import { Link, useLocation } from "react-router-dom";

type SuccessState = {
  transactionId?: string;
  email?: string;
};

export function PaymentSuccessPage() {
  const location = useLocation();
  const state = (location.state ?? {}) as SuccessState;

  return (
    <div className="min-h-screen bg-[var(--background)] px-6 py-24 text-center text-[var(--ivory)]">
      <div className="mx-auto max-w-xl rounded-3xl border border-[var(--gold)]/25 bg-[var(--burgundy)]/30 p-10 md:p-12">
        <div className="text-4xl text-[var(--gold)]">✦</div>
        <h1 className="mt-6 font-display text-4xl">Registration submitted</h1>
        <p className="mt-4 text-[var(--ivory)]/75 leading-relaxed">
          Thank you for registering for ICORE 2026. We have received your payment details. A
          confirmation will be sent to{" "}
          {state.email ? (
            <span className="font-sans normal-case tracking-normal text-[var(--gold-soft)]">
              {state.email}
            </span>
          ) : (
            "your email"
          )}
          .
        </p>
        {state.transactionId && (
          <p className="mt-4 font-sans text-sm normal-case tracking-normal text-[var(--ivory)]/70">
            Transaction ID: {state.transactionId}
          </p>
        )}
        <Link
          to="/"
          className="mt-10 inline-flex rounded-full bg-[var(--gold)] px-8 py-4 text-xs uppercase tracking-[0.35em] text-[var(--burgundy-deep)]"
        >
          Return to homepage
        </Link>
      </div>
    </div>
  );
}
