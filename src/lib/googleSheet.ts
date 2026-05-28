export type RegistrationSheetPayload = {
  name: string;
  email: string;
  phone: string;
  qualification: string;
  implantExperience: string;
  additionalInfo: string;
  /** Legacy column name used by your original sheet */
  paymentId: string;
  orderId: string;
  paymentStatus: string;
  transactionId: string;
  subtotal: number;
  gst: number;
  total: number;
  cartItems: string;
  cartSummary: string;
  proofFileName?: string;
  proofMimeType?: string;
  proofBase64?: string;
  submittedAt: string;
};

const DEFAULT_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyctNSWfITxpyHWjsxVChOemqrlsE3DvnSDM1N0ZhiRJKev6K9lxi92nRD1aTVSkXibXA/exec";

const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || DEFAULT_SCRIPT_URL;

export async function submitToGoogleSheet(payload: RegistrationSheetPayload) {
  const body = JSON.stringify(payload);

  const response = await fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body,
  });

  if (response.ok) {
    try {
      const data = (await response.json()) as { success?: boolean; error?: string };
      if (data.success === false) {
        throw new Error(data.error ?? "Spreadsheet update failed");
      }
    } catch (err) {
      if (err instanceof Error && err.message !== "Spreadsheet update failed") {
        // Non-JSON success response is acceptable for Apps Script.
        return;
      }
      throw err;
    }
    return;
  }

  // Fallback for strict Apps Script CORS (cannot read response).
  await fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body,
  });
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("Unable to read file"));
        return;
      }
      const base64 = result.split(",")[1];
      if (!base64) {
        reject(new Error("Unable to encode file"));
        return;
      }
      resolve(base64);
    };
    reader.onerror = () => reject(new Error("Unable to read file"));
    reader.readAsDataURL(file);
  });
}

export function formatCartSummary(
  items: { title: string; source: string; quantity: number; price: number }[],
) {
  return items
    .map(
      (item) =>
        `${item.title} (${item.source}) x${item.quantity} = ₹${(item.price * item.quantity).toLocaleString("en-IN")}`,
    )
    .join(" | ");
}
