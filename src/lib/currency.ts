import type { OrderSummary } from "@/types/cart";

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function getOrderSummary(items: { price: number; quantity: number }[]): OrderSummary {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;
  return { subtotal, gst, total };
}
