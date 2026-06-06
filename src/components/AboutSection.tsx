import { Heart, UserCheck, ClipboardList } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Heart,
    title: "Patient-Centered Care",
    description: "Every treatment plan is built around your unique needs, comfort, and recovery goals.",
  },
  {
    icon: UserCheck,
    title: "Experienced Physiotherapists",
    description: "Our team brings years of clinical expertise across a wide range of musculoskeletal and neurological conditions.",
  },
  {
    icon: ClipboardList,
    title: "Personalized Recovery Plans",
    description: "We design step-by-step programs tailored to your condition for measurable, lasting results.",
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="section-padding">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-sm font-medium uppercase tracking-widest text-primary mb-3">About Us</p>
          <h2 className="heading-section text-foreground mb-4">
            Dedicated to Your Recovery
          </h2>
          <p className="text-muted-foreground text-lg">
            Harsh Physio Clinic provides expert physiotherapy care for pain relief, injury recovery, and rehabilitation — helping patients return to their best, pain-free selves.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-5">
                <feature.icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="heading-sub text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground max-w-xs mx-auto">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
