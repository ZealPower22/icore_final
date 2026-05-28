const SHEET_NAME = "Sheet1";
const PROOF_FOLDER_ID = ""; // Optional Google Drive Folder ID

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

    let proofLink = "";
    if (data.proofBase64 && data.proofFileName) {
      try {
        proofLink = saveProofFile(data);
      } catch (uploadError) {
        proofLink = "Upload failed";
      }
    } else {
      proofLink = data.proofLink || "";
    }

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
      data.proofFileName || "",
      proofLink,
    ]);

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

function saveProofFile(data) {
  const bytes = Utilities.base64Decode(data.proofBase64);
  const blob = Utilities.newBlob(
    bytes,
    data.proofMimeType || "application/octet-stream",
    data.proofFileName,
  );
  const folder = PROOF_FOLDER_ID
    ? DriveApp.getFolderById(PROOF_FOLDER_ID)
    : DriveApp.getRootFolder();
  const file = folder.createFile(blob);
  return file.getUrl();
}

function doGet() {
  return ContentService.createTextOutput("ICORE registration endpoint is active.");
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
