import { motion } from "framer-motion";
import {
  Activity,
  Bone,
  Dumbbell,
  Stethoscope,
  Hand,
  Brain,
  Home,
} from "lucide-react";

const services = [
  { icon: Bone, title: "Back Pain Treatment", description: "Targeted therapy to relieve chronic and acute back pain, restore mobility, and prevent recurrence." },
  { icon: Activity, title: "Neck Pain Therapy", description: "Specialized techniques for cervical pain relief, posture correction, and tension release." },
  { icon: Dumbbell, title: "Sports Injury Rehabilitation", description: "Evidence-based recovery programs for athletes to return to peak performance safely." },
  { icon: Stethoscope, title: "Post Surgery Physiotherapy", description: "Structured rehabilitation to accelerate healing and regain function after surgical procedures." },
  { icon: Hand, title: "Joint Pain Treatment", description: "Comprehensive care for knee, shoulder, hip, and other joint conditions using manual and exercise therapy." },
  { icon: Brain, title: "Neurological Physiotherapy", description: "Specialized therapy for stroke recovery, nerve injuries, and neurological movement disorders." },
  { icon: Home, title: "Home Exercise Programs", description: "Guided exercise plans designed for safe, effective recovery and strengthening at home." },
];

const ServicesSection = () => {
  return (
    <section id="services" className="section-padding bg-muted/50">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-sm font-medium uppercase tracking-widest text-primary mb-3">Our Services</p>
          <h2 className="heading-section text-foreground mb-4">
            Comprehensive Physiotherapy Care
          </h2>
          <p className="text-muted-foreground text-lg">
            From pain management to full rehabilitation, we offer a range of specialized treatments tailored to your condition.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="card-clinical"
            >
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4">
                <service.icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="heading-sub text-foreground mb-2">{service.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
