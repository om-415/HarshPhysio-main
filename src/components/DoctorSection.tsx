import { Mail, Phone, User } from "lucide-react";
import { motion } from "framer-motion";

const DoctorSection = () => {
  return (
    <section id="doctor" className="section-padding bg-muted/10">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 items-center"
        >
          <div className="md:col-span-1 flex items-center justify-center">
            <div className="w-48 h-48 rounded-2xl overflow-hidden bg-gradient-to-tr from-teal-50 to-cyan-50 shadow-lg flex items-center justify-center">
              {/* Placeholder -- replace with professional photo in assets */}
              <div className="w-full h-full bg-[url('/src/assets/doctor.jpg')] bg-center bg-cover" />
            </div>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-2xl font-semibold mb-2">Dr. Harshvardhan Upadhyay</h3>
            <p className="text-muted-foreground mb-4">
              Founder & Chief Physiotherapist — Recovery specialist focused on
              evidence-based, patient-first care.
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <li className="flex items-start gap-3">
                <User className="w-5 h-5 text-primary mt-1" />
                <div>
                  <div className="font-medium">Patient-first care</div>
                  <div className="text-sm text-muted-foreground">
                    Personalized, outcome-driven programs
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-1" />
                <div>
                  <div className="font-medium">Evidence-based treatment</div>
                  <div className="text-sm text-muted-foreground">
                    Modern techniques for lasting recovery
                  </div>
                </div>
              </li>
            </ul>

            <div className="flex gap-3">
              <a
                href="mailto:reharshclinic008@gmail.com"
                className="inline-flex items-center gap-2 bg-transparent border border-border px-4 py-2 rounded-lg text-sm"
              >
                <Mail className="w-4 h-4" /> Email
              </a>
              <a
                href="tel:+916391989878"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm"
              >
                <Phone className="w-4 h-4" /> Call
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DoctorSection;
