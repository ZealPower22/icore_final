# Deploy ICORE on Vercel + Google Sheets

## 1. Google Apps Script (spreadsheet)

1. Open your Google Sheet → **Extensions → Apps Script**.
2. Paste code from `google-apps-script/Code.gs` (script must be **bound** to that spreadsheet).
3. Use a tab named **`Sheet1`** (or change `SHEET_NAME` in `Code.gs`).

   Row 1 headers (columns A–Q):

   `Timestamp | Name | Email | Phone | Qualification | Implant Experience | Additional Info | Payment ID | Order ID | Payment Status | Transaction ID | Subtotal | GST | Total | Cart Items | Proof File | Proof Link`

4. Optional: set `PROOF_FOLDER_ID` in `Code.gs` to a Drive folder ID for payment proofs.
5. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Copy the **Web app URL** (ends with `/exec`).

Test in browser: open the URL — you should see:  
`ICORE registration endpoint is active.`  
If you see `doGet` not found, redeploy after saving `Code.gs`.

**Your production Web App URL:**  
https://script.google.com/macros/s/AKfycbwk2gxOn9oIEBq2yFu-NUOEE8-dWmUOpWFNST_k4j3OxVOSUSUGG5ZarzkXBzH0FYpwJg/exec

Successful POST returns JSON: `{"status":"success","message":"Data saved successfully",...}`

## 2. Vercel deployment

1. Push this repo to GitHub.
2. [vercel.com](https://vercel.com) → **Add New Project** → import the repo.
3. Framework: **Vite** (auto-detected). Build: `npm run build`, Output: `dist`.
4. **Environment variables** (Production + Preview):

   | Name | Value |
   |------|--------|
   | `GOOGLE_SCRIPT_URL` | `https://script.google.com/macros/s/AKfycbwk2gxOn9oIEBq2yFu-NUOEE8-dWmUOpWFNST_k4j3OxVOSUSUGG5ZarzkXBzH0FYpwJg/exec` |

   Optional for local `npm run dev` (direct to script, no proxy):

   | Name | Value |
   |------|--------|
   | `VITE_GOOGLE_SCRIPT_URL` | Same Web app URL |

5. Deploy.

Production checkout calls `/api/submit-registration` (server-side proxy → no browser CORS issues).

## 3. Local development

```bash
npm install
npm run dev
```

- **Option A:** `vercel dev` — uses `/api/submit-registration` like production.
- **Option B:** `npm run dev` only — set `VITE_GOOGLE_SCRIPT_URL` in `.env` to post directly to Apps Script.

## 4. Troubleshooting

| Problem | Fix |
|--------|-----|
| Row not in sheet | Apps Script **Executions** log; confirm headers match |
| 502 from Vercel | Wrong `GOOGLE_SCRIPT_URL` or script not deployed as Anyone |
| Proof not in Drive | Set `PROOF_FOLDER_ID`; keep file under 3 MB |
| Works locally, not on Vercel | Add `GOOGLE_SCRIPT_URL` in Vercel env and redeploy |
