import { NextResponse } from "next/server";
import { google } from "googleapis";
import { createHmac } from "crypto";

function verifyToken(token: string) {
  const expected = createHmac("sha256", process.env.ADMIN_SECRET!)
    .update("admin-authenticated")
    .digest("hex");
  return token === expected;
}

function colToLetter(gvizIndex: number): string {
  let result = "";
  let n = gvizIndex + 1;
  while (n > 0) {
    const rem = (n - 1) % 26;
    result = String.fromCharCode(65 + rem) + result;
    n = Math.floor((n - 1) / 26);
  }
  return result;
}

export async function POST(req: Request) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sheetId, sheetName, row, col, value } = await req.json();

  if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    return NextResponse.json(
      { error: "Google Service Account not configured" },
      { status: 503 }
    );
  }

  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const range = `${sheetName}!${colToLetter(col)}${row}`;

  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range,
    valueInputOption: "RAW",
    requestBody: { values: [[value]] },
  });

  return NextResponse.json({ success: true });
}
