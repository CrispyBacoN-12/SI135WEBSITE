import express from "express";
import cors from "cors";
import { OAuth2Client } from "google-auth-library";

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://si135.com", credentials: true }));

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const ALLOWED_DOMAIN = "student.mahidol.edu";
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

app.post("/api/auth/google", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: "Missing token" });

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload?.email;
    const emailVerified = payload?.email_verified;

    if (!email || !emailVerified) {
      return res.status(401).json({ error: "Unverified Google account" });
    }

    if (!email.toLowerCase().endsWith(`@${ALLOWED_DOMAIN}`)) {
      return res.status(403).json({ error: "Only @student.mahidol.edu allowed" });
    }

    // ✅ ตรงนี้ค่อย create session/JWT ของแอปคุณเอง
    // แนะนำ: set HttpOnly cookie session แทน localStorage
    return res.json({ email }); // หรือ { email, authToken }
  } catch (err) {
    return res.status(401).json({ error: "Invalid Google token" });
  }
});

app.listen(3000, () => console.log("API running on http://localhost:3000"));

