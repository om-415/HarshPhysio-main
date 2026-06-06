// Netlify Functions wrapper for booking email notifications
const {
  bookingSchema,
  sendBookingEmail,
} = require("../../src/server/sendBooking");

// Basic in-memory rate limiter per IP
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

exports.handler = async function (event, context) {
  try {
    const ip =
      event.headers["x-forwarded-for"] ||
      event.headers["client-ip"] ||
      context.clientContext?.headers?.["x-forwarded-for"] ||
      "unknown";
    if (isRateLimited(ip)) {
      console.warn("Rate limit exceeded for", ip);
      return {
        statusCode: 429,
        body: JSON.stringify({
          ok: false,
          error: "rate_limited",
          message: "Too many requests",
        }),
      };
    }

    if (event.httpMethod !== "POST")
      return {
        statusCode: 405,
        body: JSON.stringify({ ok: false, error: "method_not_allowed" }),
      };

    const payload = event.body ? JSON.parse(event.body) : null;
    if (!payload || !payload.booking)
      return {
        statusCode: 400,
        body: JSON.stringify({ ok: false, error: "invalid_payload" }),
      };

    const parse = bookingSchema.safeParse(payload.booking);
    if (!parse.success) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          ok: false,
          error: "validation_failed",
          details: parse.error.flatten(),
        }),
      };
    }
    const booking = parse.data;

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

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, emailSent, emailError }),
    };
  } catch (err) {
    console.error("sendBooking error", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: "internal_error" }),
    };
  }
};
