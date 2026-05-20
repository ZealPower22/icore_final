import crypto from "node:crypto";
import express from "express";
import cors from "cors";
import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const keyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

app.use(cors({ origin: true }));
app.use(express.json());

function getRazorpay() {
  if (!keyId || !keySecret) {
    return null;
  }
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    razorpayConfigured: Boolean(keyId && keySecret),
  });
});

app.post("/api/create-order", async (req, res) => {
  try {
    const razorpay = getRazorpay();
    if (!razorpay) {
      return res.status(503).json({
        error:
          "Payment server is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your .env file.",
      });
    }

    const { amount, currency = "INR", customer, items } = req.body ?? {};

    if (!amount || amount < 1) {
      return res.status(400).json({ error: "Invalid order amount" });
    }
    if (!customer?.name || !customer?.email || !customer?.phone || !customer?.institute) {
      return res.status(400).json({ error: "Customer details are incomplete" });
    }

    const amountPaise = Math.round(Number(amount) * 100);

    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency,
      receipt: `icore_${Date.now()}`,
      notes: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        institute: customer.institute,
        items: JSON.stringify(items ?? []),
      },
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
    });
  } catch (err) {
    console.error("create-order error:", err);
    res.status(500).json({ error: "Failed to create payment order" });
  }
});

app.post("/api/verify-payment", (req, res) => {
  try {
    if (!keySecret) {
      return res.status(503).json({ error: "Payment verification is not configured" });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body ?? {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing payment verification fields" });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto.createHmac("sha256", keySecret).update(body).digest("hex");

    if (expected !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("verify-payment error:", err);
    res.status(500).json({ error: "Payment verification failed" });
  }
});

app.listen(PORT, () => {
  console.log(`ICORE payment API listening on http://localhost:${PORT}`);
  if (!keyId || !keySecret) {
    console.warn("Razorpay keys missing — set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env");
  }
});
