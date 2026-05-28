/**
 * ICORE — single spreadsheet registration (attendee + payment in ONE row)
 *
 * Deploy: Extensions → Apps Script → paste → Deploy → Web app
 * Execute as: Me | Who has access: Anyone
 *
 * Row 1 headers (add any you need; script maps by header text):
 * Timestamp | Name | Email | Phone | Qualification | Implant Experience | Additional Info |
 * Payment ID | Order ID | Payment Status | Transaction ID | Subtotal | GST | Total |
 * Cart Items | Proof File | Proof Link
 */
const PROOF_FOLDER_ID = "";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    const lastCol = Math.max(sheet.getLastColumn(), 1);
    const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];

    var proofLink = "";
    if (data.proofBase64 && data.proofFileName) {
      try {
        proofLink = saveProofFile(data);
      } catch (proofErr) {
        proofLink = "Proof upload failed: " + data.proofFileName;
      }
    }

    var paymentId = data.paymentId || data.transactionId || "";
    var transactionId = data.transactionId || data.paymentId || "";

    var valuesByHeader = {
      timestamp: data.submittedAt || new Date().toISOString(),
      name: data.name || "",
      email: data.email || "",
      phone: data.phone || "",
      qualification: data.qualification || "",
      "implant experience": data.implantExperience || "",
      "additional info": data.additionalInfo || "",
      "payment id": paymentId,
      paymentid: paymentId,
      "order id": data.orderId || "",
      orderid: data.orderId || "",
      "payment status": data.paymentStatus || "",
      paymentstatus: data.paymentStatus || "",
      "transaction id": transactionId,
      transactionid: transactionId,
      subtotal: data.subtotal != null ? data.subtotal : "",
      gst: data.gst != null ? data.gst : "",
      total: data.total != null ? data.total : "",
      "cart items": data.cartSummary || data.cartItems || "",
      cartitems: data.cartSummary || data.cartItems || "",
      "proof file": data.proofFileName || "",
      prooffile: data.proofFileName || "",
      "proof link": proofLink,
      prooflink: proofLink,
    };

  if (headers.length === 1 && headers[0] === "") {
      sheet.appendRow([
        valuesByHeader.timestamp,
        valuesByHeader.name,
        valuesByHeader.email,
        valuesByHeader.phone,
        valuesByHeader.qualification,
        valuesByHeader["implant experience"],
        valuesByHeader["additional info"],
        valuesByHeader["payment id"],
        valuesByHeader["order id"],
        valuesByHeader["payment status"],
        valuesByHeader["transaction id"],
        valuesByHeader.subtotal,
        valuesByHeader.gst,
        valuesByHeader.total,
        valuesByHeader["cart items"],
        valuesByHeader["proof file"],
        valuesByHeader["proof link"],
      ]);
    } else {
      var row = headers.map(function (header) {
        var key = normalizeHeader(header);
        if (valuesByHeader.hasOwnProperty(key)) {
          return valuesByHeader[key];
        }
        return "";
      });
      sheet.appendRow(row);
    }

    return ContentService.createTextOutput(
      JSON.stringify({ success: true, proofLink: proofLink }),
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: String(err) }),
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function normalizeHeader(header) {
  return String(header || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function saveProofFile(data) {
  var bytes = Utilities.base64Decode(data.proofBase64);
  var blob = Utilities.newBlob(
    bytes,
    data.proofMimeType || "application/octet-stream",
    data.proofFileName,
  );
  var folder = PROOF_FOLDER_ID
    ? DriveApp.getFolderById(PROOF_FOLDER_ID)
    : DriveApp.getRootFolder();
  var file = folder.createFile(blob);
  return file.getUrl();
}

function doGet() {
  return ContentService.createTextOutput("ICORE registration endpoint is active.");
}
