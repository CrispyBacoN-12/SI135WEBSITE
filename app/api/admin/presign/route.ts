import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
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
  // AWS SDK v3 >= 3.726 adds checksum headers by default which browsers don't send,
  // causing R2 to reject presigned PUT requests with 413. Disable this behavior.
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
});

export async function POST(req: Request) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { filename, contentType } = await req.json();
  if (!filename || !contentType) {
    return NextResponse.json({ error: "Missing filename or contentType" }, { status: 400 });
  }

  const key = `uploads/${Date.now()}-${filename.replace(/\s+/g, "_")}`;

  const presignedUrl = await getSignedUrl(
    s3,
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn: 300 }
  );

  const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`;
  return NextResponse.json({ presignedUrl, publicUrl });
}
