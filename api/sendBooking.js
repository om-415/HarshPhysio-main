// Vercel Serverless function wrapper for booking email notifications
const {
  bookingSchema,
  sendBookingEmail,
} = require("../src/server/sendBooking");

// Simple in-memory rate limiter (per IP). Note: serverless instances are ephemeral.
const rateMap = new Map();
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 6;

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateMap.get(ip) || [];
  const recent = entry.filter((ts) => now - ts < WINDOW_MS);
  recent.push(now);
  rateMap.set(ip, recent);
  return recent.length > MAX_REQUESTS;
}

module.exports = async function handler(req, res) {
  try {
    const ip =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
    if (isRateLimited(ip)) {
      console.warn("Rate limit exceeded for", ip);
      return res.status(429).json({
        ok: false,
        error: "rate_limited",
        message: "Too many requests",
      });
    }

    if (req.method !== "POST")
      return res.status(405).json({ ok: false, error: "method_not_allowed" });

    const payload = req.body;
    if (!payload || !payload.booking)
      return res.status(400).json({ ok: false, error: "invalid_payload" });

    const parse = bookingSchema.safeParse(payload.booking);
    if (!parse.success) {
      return res.status(400).json({
        ok: false,
        error: "validation_failed",
        details: parse.error.flatten(),
      });
    }

    const booking = parse.data;

    // Prepare SMTP config from environment variables
    const smtpConfig = {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    };
    const clinicEmail =
      process.env.CLINIC_EMAIL || "reharshclinic008@gmail.com";

    let emailSent = false;
    let emailError = null;

    try {
      await sendBookingEmail({ booking, smtpConfig, clinicEmail });
      emailSent = true;
    } catch (err) {
      console.error("Email send failed:", err);
      emailError = String(err?.message || err);
    }

    // Return success even if email failed (booking should already exist in Supabase)
    return res.status(200).json({ ok: true, emailSent, emailError });
  } catch (err) {
    console.error("sendBooking error", err);
    return res.status(500).json({ ok: false, error: "internal_error" });
  }
};
