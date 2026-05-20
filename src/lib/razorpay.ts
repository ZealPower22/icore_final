import type { CheckoutDetails } from "@/types/cart";

export type RazorpaySuccessResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayHandlerResponse = RazorpaySuccessResponse;

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes?: Record<string, string>;
  theme?: { color: string };
  handler: (response: RazorpayHandlerResponse) => void | Promise<void>;
  modal?: {
    ondismiss?: () => void;
  };
};

type RazorpayInstance = {
  open: () => void;
  on: (event: "payment.failed", handler: (response: { error: { description: string } }) => void) => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

const SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";
const API_BASE = import.meta.env.VITE_API_URL ?? "";

let scriptPromise: Promise<void> | null = null;

function loadRazorpayScript() {
  if (window.Razorpay) {
    return Promise.resolve();
  }
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${SCRIPT_URL}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Failed to load Razorpay")));
      return;
    }
    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay checkout"));
    document.body.appendChild(script);
  });

  return scriptPromise;
}

export async function createPaymentOrder(payload: {
  amount: number;
  currency: string;
  customer: CheckoutDetails;
  items: { id: string; title: string; quantity: number; price: number }[];
}) {
  const response = await fetch(`${API_BASE}/api/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as {
    orderId?: string;
    amount?: number;
    currency?: string;
    keyId?: string;
    error?: string;
  };

  if (!response.ok) {
    throw new Error(data.error ?? "Unable to create payment order");
  }

  return data as { orderId: string; amount: number; currency: string; keyId: string };
}

export async function verifyPayment(payment: RazorpaySuccessResponse) {
  const response = await fetch(`${API_BASE}/api/verify-payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payment),
  });

  const data = (await response.json()) as { success?: boolean; error?: string };
  if (!response.ok || !data.success) {
    throw new Error(data.error ?? "Payment verification failed");
  }
}

export async function openRazorpayCheckout(options: {
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
  customer: CheckoutDetails;
  institute: string;
  onSuccess: (payment: RazorpaySuccessResponse) => void | Promise<void>;
  onDismiss?: () => void;
}) {
  await loadRazorpayScript();

  if (!window.Razorpay) {
    throw new Error("Razorpay is not available");
  }

  const rzp = new window.Razorpay({
    key: options.keyId,
    amount: options.amount,
    currency: options.currency,
    name: "ICORE 2026",
    description: "Conference registration",
    order_id: options.orderId,
    prefill: {
      name: options.customer.name,
      email: options.customer.email,
      contact: options.customer.phone,
    },
    notes: {
      institute: options.institute,
    },
    theme: { color: "#C9A227" },
    handler: (response) => {
      void options.onSuccess(response);
    },
    modal: {
      ondismiss: options.onDismiss,
    },
  });

  rzp.on("payment.failed", (response) => {
    throw new Error(response.error.description || "Payment failed");
  });

  rzp.open();
}
