import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Send } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const WHATSAPP_NUMBER = "+916391989878";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    treatment: "Back Pain Treatment",
    date: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Persist booking to Supabase
      const bookingPayload = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || null,
        treatment_type: formData.treatment,
        preferred_date: formData.date || null,
        message: formData.message,
      };

      console.log("Booking Payload:", bookingPayload);

      const { data, error } = await supabase
        .from("bookings")
        .insert([bookingPayload])
        .select()
        .single();

      if (error) throw error;

      // Send email notification via local server endpoint
      try {
        const apiBase = (import.meta.env.VITE_API_URL as string) || "";
        await fetch(`${apiBase}/api/sendBooking`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ booking: data }),
        });
      } catch (err) {
        console.warn("Failed to call email endpoint:", err);
      }

      // Open WhatsApp with prefilled message
      const waMessage = encodeURIComponent(
        `Hello Harsh Physio Clinic, I would like to book an appointment. Name: ${formData.name || "-"}, Phone: ${formData.phone}, Treatment: ${formData.treatment}, Date: ${formData.date || "ASAP"}`,
      );
      window.open(
        `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${waMessage}`,
        "_blank",
      );

      // Success UI
      alert(
        "Booking received. We've sent a confirmation and opened WhatsApp for quick chat.",
      );
      setFormData({
        name: "",
        phone: "",
        treatment: "Back Pain Treatment",
        date: "",
        message: "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to create booking. Please try again or call us.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section-padding">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-sm font-medium uppercase tracking-widest text-primary mb-3">
            Get In Touch
          </p>
          <h2 className="heading-section text-foreground mb-4">Contact Us</h2>
          <p className="text-muted-foreground text-lg">
            Ready to start your recovery? Reach out to us — we're here to help.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact info + map */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Address</h3>
                <a href="https://maps.app.goo.gl/SYMsXNVRpMHAdBH27">
                  <p className="text-muted-foreground text-sm">
                    Gali no 12, M S Hospital, Integral University,
                    <br />
                    Bharawamau, Lucknow, Uttar Pradesh 226026
                  </p>
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                <a
                  href="tel:+916391989878"
                  className="text-primary font-medium tabular-nums"
                >
                  +91 63919 89878
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Hours</h3>
                <p className="text-muted-foreground text-sm">Open 24 Hours</p>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div
              className="rounded-2xl overflow-hidden mt-6"
              style={{ boxShadow: "0 0 0 1px rgba(0,0,0,.05)" }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.0!2d81.0!3d26.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDU0JzAwLjAiTiA4McKwMDAnMDAuMCJF!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Harsh Physio Clinic Location"
              />
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <form onSubmit={handleSubmit} className="card-clinical space-y-5">
              <h3 className="heading-sub text-foreground mb-2">
                Book an Appointment
              </h3>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="input-clinical"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="input-clinical"
                  placeholder="Your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email (optional)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="input-clinical"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Treatment Type
                </label>
                <select
                  value={formData.treatment}
                  onChange={(e) =>
                    setFormData({ ...formData, treatment: e.target.value })
                  }
                  className="input-clinical"
                  required
                >
                  <option>Back Pain Treatment</option>
                  <option>Neck Pain Therapy</option>
                  <option>Knee Pain Therapy</option>
                  <option>Sports Injury Rehabilitation</option>
                  <option>Shoulder Pain Treatment</option>
                  <option>Paralysis Rehabilitation</option>
                  <option>Post-Surgery Recovery</option>
                  <option>Home Physiotherapy</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Preferred Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="input-clinical"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="input-clinical resize-none"
                  placeholder="Tell us about your condition..."
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:-translate-y-0.5 transition-transform"
              >
                <Send className="w-4 h-4" />
                {loading ? "Booking..." : "Book Appointment"}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
