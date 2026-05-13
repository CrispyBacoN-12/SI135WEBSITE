import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createHmac } from "crypto";

function verifyToken(token: string) {
  const expected = createHmac("sha256", process.env.ADMIN_SECRET!)
    .update("admin-authenticated")
    .digest("hex");
  return token === expected;
}

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.Access_Key_ID!,
    secretAccessKey: process.env.Secret_Access_Key!,
  },
});

export async function POST(req: Request) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const key = `uploads/${Date.now()}-${file.name.replace(/\s+/g, "_")}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: file.type || "application/octet-stream",
    })
  );

  const url = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`;
  return NextResponse.json({ url });
}
