export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

const DEFAULT_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzVgal3N5dGBuftbMjmDXEAC_3x_HbItQFiEm6ImbUxDi7MiS-6BGQbc_y4eze39Dch2g/exec";

const SCRIPT_URL =
  process.env.GOOGLE_SCRIPT_URL || process.env.VITE_GOOGLE_SCRIPT_URL || DEFAULT_SCRIPT_URL;

function parseScriptResponse(responseOk, parsed, rawText) {
  if (parsed.status === "error" || parsed.success === false) {
    return {
      ok: false,
      error: parsed.message || parsed.error || rawText || "Spreadsheet update failed",
    };
  }
  if (parsed.status === "success" || parsed.success === true) {
    return { ok: true, data: parsed };
  }
  if (responseOk) {
    return { ok: true, data: parsed };
  }
  return {
    ok: false,
    error: parsed.message || rawText || "Spreadsheet update failed",
  };
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const payload =
      typeof req.body === "string" ? req.body : JSON.stringify(req.body ?? {});

    const upstream = await fetch(SCRIPT_URL, {
      method: "POST",
      redirect: "follow",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: payload,
    });

    const text = await upstream.text();
    let parsed = {};

    try {
      parsed = JSON.parse(text);
    } catch {
      if (!upstream.ok) {
        return res.status(502).json({
          success: false,
          error: text || "Google Apps Script returned an invalid response",
        });
      }
      return res.status(200).json({ success: true, status: "success" });
    }

    const result = parseScriptResponse(upstream.ok, parsed, text);
    if (!result.ok) {
      return res.status(502).json({
        success: false,
        status: "error",
        error: result.error,
      });
    }

    return res.status(200).json({
      success: true,
      status: "success",
      message: result.data.message || "Data saved successfully",
      proofLink: result.data.proofLink,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      status: "error",
      error: err instanceof Error ? err.message : "Server error",
    });
  }
}
