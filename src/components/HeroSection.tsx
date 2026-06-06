import { Phone, Calendar, Star, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-physio.jpg";
import { useEffect, useState } from "react";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-16 overflow-hidden">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/60" />

      <div className="container-main relative z-10">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Star className="w-4 h-4 fill-primary text-primary" />
            4.9 Rating · 16 Reviews · Open 24 Hours
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="heading-hero text-foreground mb-4"
          >
            Move Better. Live Pain-Free.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-xl mb-6 leading-relaxed"
          >
            Expert Physiotherapy Treatment For Pain Relief, Rehabilitation And
            Long-Term Recovery.
          </motion.p>

          <div className="flex gap-4 mb-6">
            <div className="inline-flex items-center gap-3 bg-background/70 rounded-full px-4 py-2 shadow-sm">
              <Star className="w-4 h-4 fill-primary text-primary" />
              <div className="text-sm">4.9 Rating</div>
            </div>
            <div className="inline-flex items-center gap-3 bg-background/70 rounded-full px-4 py-2 shadow-sm">
              <Calendar className="w-4 h-4 text-primary" />
              <div className="text-sm">Open 24 Hours</div>
            </div>
            <div className="inline-flex items-center gap-3 bg-background/70 rounded-full px-4 py-2 shadow-sm">
              <MessageSquare className="w-4 h-4 text-primary" />
              <div className="text-sm">19+ Verified Reviews</div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:-translate-y-0.5 transition-transform text-base"
            >
              <Calendar className="w-5 h-5" />
              Book Appointment
            </a>
            <a
              href="tel:+916391989878"
              className="inline-flex items-center justify-center gap-2 bg-transparent text-foreground px-6 py-3 rounded-lg font-medium hover:-translate-y-0.5 transition-transform text-base"
              style={{ boxShadow: "0 0 0 1px hsl(var(--border))" }}
            >
              <Phone className="w-5 h-5" />
              Call Now
            </a>
            <a
              href={`https://api.whatsapp.com/send?phone=+916391989878&text=${encodeURIComponent(
                "Hello Harsh Physio Clinic, I would like to book an appointment.",
              )}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:-translate-y-0.5 transition-transform text-base"
            >
              <Phone className="w-5 h-5" />
              WhatsApp Consultation
            </a>
          </motion.div>

          {/* Animated counters */}
          <div className="mt-8 flex gap-6">
            <Counter label="Patients Treated" to={1000} />
            <Counter label="Google Rating" to={4.9} decimals={1} />
            <Counter label="Verified Reviews" to={19} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

function Counter({
  label,
  to,
  decimals = 0,
}: {
  label: string;
  to: number;
  decimals?: number;
}) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = 0;
    const duration = 1200;
    const startTime = performance.now();
    const step = (now: number) => {
      const progress = Math.min(1, (now - startTime) / duration);
      const current = start + (to - start) * progress;
      setValue(Number(current.toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [to, decimals]);

  return (
    <div className="bg-background/70 p-4 rounded-xl shadow-sm text-center">
      <div className="text-2xl font-semibold text-foreground">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
