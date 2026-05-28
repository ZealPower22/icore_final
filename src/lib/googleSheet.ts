export type RegistrationSheetPayload = {
  name: string;
  email: string;
  phone: string;
  qualification: string;
  implantExperience: string;
  additionalInfo: string;
  paymentId: string;
  orderId: string;
  paymentStatus: string;
  transactionId: string;
  subtotal: number;
  gst: number;
  total: number;
  cartItems: string;
  cartSummary: string;
  proofLink: string;
  submittedAt: string;
};

/** Your latest Apps Script web app deployment */
export const GOOGLE_SCRIPT_WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbwk2gxOn9oIEBq2yFu-NUOEE8-dWmUOpWFNST_k4j3OxVOSUSUGG5ZarzkXBzH0FYpwJg/exec";

type ScriptResponse = {
  success?: boolean;
  status?: string;
  message?: string;
  error?: string;
  proofLink?: string;
};

function getSubmitUrl(): string {
  if (import.meta.env.VITE_SUBMIT_API_URL) {
    return import.meta.env.VITE_SUBMIT_API_URL;
  }
  if (import.meta.env.PROD) {
    return "/api/submit-registration";
  }
  return import.meta.env.VITE_GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_WEB_APP_URL;
}

function isDirectAppsScriptUrl(url: string) {
  return url.includes("script.google.com");
}

export function parseScriptResponse(
  responseOk: boolean,
  data: ScriptResponse,
  rawText?: string,
): { ok: boolean; message?: string } {
  if (data.status === "error" || data.success === false) {
    return { ok: false, message: data.message || data.error || rawText || "Spreadsheet update failed" };
  }
  if (data.status === "success" || data.success === true) {
    return { ok: true, message: data.message };
  }
  if (responseOk) {
    return { ok: true };
  }
  return { ok: false, message: data.message || rawText || "Spreadsheet update failed" };
}

export async function submitToGoogleSheet(payload: RegistrationSheetPayload) {
  const url = getSubmitUrl();
  const body = JSON.stringify(payload);
  const direct = isDirectAppsScriptUrl(url);

  const response = await fetch(url, {
    method: "POST",
    headers: direct
      ? { "Content-Type": "text/plain;charset=utf-8" }
      : { "Content-Type": "application/json" },
    body,
  });

  const text = await response.text().catch(() => "");

  if (!text) {
    if (!response.ok) {
      throw new Error(
        direct
          ? "Submission failed. Confirm Web app is deployed as Anyone and URL is correct."
          : "Submission failed. Set GOOGLE_SCRIPT_URL on Vercel and redeploy.",
      );
    }
    return;
  }

  let data: ScriptResponse = {};
  try {
    data = JSON.parse(text) as ScriptResponse;
  } catch {
    if (!response.ok) {
      throw new Error(text.slice(0, 240) || "Submission failed");
    }
    return;
  }

  const result = parseScriptResponse(response.ok, data, text);
  if (!result.ok) {
    throw new Error(result.message || "Spreadsheet update failed. Check Apps Script → Executions.");
  }
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
