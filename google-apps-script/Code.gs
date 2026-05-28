const SHEET_NAME = "Sheet1";

/** Column numbers (1-based): P = Proof label, Q = Proof Link */
const COL_PROOF_FILE = 16;
const COL_PROOF_LINK = 17;

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonOut({ status: "error", message: "Empty request body" });
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) {
      return jsonOut({ status: "error", message: 'Sheet "' + SHEET_NAME + '" not found' });
    }

    const data = JSON.parse(e.postData.contents);
    const proofLink = normalizeProofLink_(data.proofLink || "");

    const paymentId = data.paymentId || data.transactionId || "";
    const transactionId = data.transactionId || data.paymentId || "";

    sheet.appendRow([
      new Date(),
      data.name || "",
      data.email || "",
      data.phone || "",
      data.qualification || "",
      data.implantExperience || "",
      data.additionalInfo || "",
      paymentId,
      data.orderId || "",
      data.paymentStatus || "",
      transactionId,
      data.subtotal != null ? data.subtotal : "",
      data.gst != null ? data.gst : "",
      data.total != null ? data.total : "",
      data.cartSummary || data.cartItems || "",
      proofLink ? "Drive link" : "",
      proofLink,
    ]);

    const lastRow = sheet.getLastRow();
    writeProofCells_(sheet, lastRow, proofLink);

    return jsonOut({
      status: "success",
      message: "Data saved successfully",
      proofLink: proofLink,
    });
  } catch (error) {
    return jsonOut({
      status: "error",
      message: error.toString(),
    });
  }
}

function normalizeProofLink_(url) {
  var s = String(url || "").trim();
  if (!s) return "";
  if (s.indexOf("http://") !== 0 && s.indexOf("https://") !== 0) {
    s = "https://" + s;
  }
  return s;
}

function writeProofCells_(sheet, row, proofLink) {
  sheet.getRange(row, COL_PROOF_FILE).setValue(proofLink ? "Drive link" : "");

  if (proofLink && proofLink.indexOf("http") === 0) {
    sheet
      .getRange(row, COL_PROOF_LINK)
      .setFormula(buildHyperlinkFormula_(proofLink, "View payment proof"));
  } else {
    sheet.getRange(row, COL_PROOF_LINK).setValue(proofLink || "");
  }
}

function buildHyperlinkFormula_(url, label) {
  const safeUrl = String(url).replace(/"/g, '""');
  const safeLabel = String(label).replace(/"/g, '""');
  return '=HYPERLINK("' + safeUrl + '","' + safeLabel + '")';
}

function doGet() {
  return ContentService.createTextOutput("ICORE registration endpoint is active.");
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
