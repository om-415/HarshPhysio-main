// Refactored: this file is now a lightweight wrapper for local usage only.
// For production, use the serverless functions in `/api/sendBooking.js` (Vercel)
// and `/netlify/functions/sendBooking.js` (Netlify) which import the core below.

const nodemailer = require("nodemailer");
const { z } = require("zod");

const bookingSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  phone: z.string().min(5),
  treatment_type: z.string().min(1),
  preferred_date: z.string().optional().nullable(),
  message: z.string().optional().nullable(),
});

const fs = require("fs");
const path = require("path");

function loadTemplate(name) {
  try {
    const p = path.join(__dirname, "templates", name);
    return fs.readFileSync(p, "utf8");
  } catch (err) {
    console.warn("Template load failed", name, err);
    return null;
  }
}

function render(template, vars) {
  if (!template) return "";
  return template.replace(/\{\{([^}]+)\}\}/g, (_, key) => {
    const k = key.trim();
    return vars[k] ?? "";
  });
}

async function sendBookingEmail({ booking, smtpConfig, clinicEmail }) {
  const transporter = nodemailer.createTransport(smtpConfig);

  const adminTemplate = loadTemplate("adminNotification.html");
  const patientTemplate = loadTemplate("patientConfirmation.html");

  const adminHtml = render(adminTemplate, {
    NAME: booking.name || "Anonymous",
    PHONE: booking.phone || "-",
    EMAIL: booking.email || "-",
    TREATMENT: booking.treatment_type,
    DATE: booking.preferred_date || "ASAP",
    MESSAGE: booking.message || "-",
    ID: booking.id || "-",
  });

  const adminSubject = `New booking: ${booking.treatment_type} — ${booking.name || booking.phone}`;

  // Send admin email
  const adminResult = await transporter.sendMail({
    from: process.env.SMTP_FROM || clinicEmail,
    to: clinicEmail,
    subject: adminSubject,
    html: adminHtml || undefined,
    text: `New booking from ${booking.name || booking.phone}`,
  });

  let patientResult = null;
  if (booking.email) {
    const patientHtml = render(patientTemplate, {
      NAME: booking.name || "Patient",
      TREATMENT: booking.treatment_type,
      DATE: booking.preferred_date || "ASAP",
      CLINIC_NAME: "Harsh Physio Clinic",
      CLINIC_PHONE: process.env.CLINIC_PHONE || "+91 63919 89878",
    });
    const patientSubject = `Booking confirmation — ${booking.treatment_type}`;
    try {
      patientResult = await transporter.sendMail({
        from: process.env.SMTP_FROM || clinicEmail,
        to: booking.email,
        subject: patientSubject,
        html: patientHtml || undefined,
        text: `Thank you for booking with Harsh Physio Clinic`,
      });
    } catch (err) {
      console.error("Patient email failed", err);
      // continue even if patient email fails
    }
  }

  return { adminResult, patientResult };
}

module.exports = {
  bookingSchema,
  sendBookingEmail,
};
