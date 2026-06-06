import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

const CTASection = () => {
  return (
    <section className="section-padding bg-primary">
      <div className="container-main text-center">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="heading-section text-primary-foreground mb-4">
            Start Your Recovery Today
          </h2>
          <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto mb-8">
            Don't let pain hold you back. Book your appointment and take the first step toward a pain-free life.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2 bg-card text-foreground px-8 py-4 rounded-lg font-medium hover:-translate-y-0.5 transition-transform text-base"
          >
            <Calendar className="w-5 h-5" />
            Book Appointment
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
