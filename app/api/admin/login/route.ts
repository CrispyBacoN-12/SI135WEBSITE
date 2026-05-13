import { NextResponse } from "next/server";
import { createHmac } from "crypto";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = createHmac("sha256", process.env.ADMIN_SECRET!)
      .update("admin-authenticated")
      .digest("hex");
    return NextResponse.json({ token });
  }

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}
