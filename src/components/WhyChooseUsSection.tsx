import { motion } from "framer-motion";
import { Award, ClipboardCheck, Zap, HeartHandshake, Sparkles, Building } from "lucide-react";

const features = [
  { icon: Award, title: "Experienced Physiotherapists", description: "Years of clinical expertise across diverse conditions." },
  { icon: ClipboardCheck, title: "Personalized Treatment Plans", description: "Every plan is uniquely tailored to your recovery goals." },
  { icon: Zap, title: "Advanced Therapy Techniques", description: "Modern methods backed by the latest research." },
  { icon: Sparkles, title: "Fast Recovery Focus", description: "Efficient protocols designed for quicker results." },
  { icon: HeartHandshake, title: "Supportive Staff", description: "A caring team that guides you every step of the way." },
  { icon: Building, title: "Clean & Modern Clinic", description: "A comfortable, well-equipped environment for your care." },
];

const WhyChooseUsSection = () => {
  return (
    <section id="why-us" className="section-padding">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-sm font-medium uppercase tracking-widest text-primary mb-3">Why Choose Us</p>
          <h2 className="heading-section text-foreground mb-4">
            The Care You Deserve
          </h2>
          <p className="text-muted-foreground text-lg">
            We combine expertise, modern techniques, and genuine care to deliver the best physiotherapy experience.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shrink-0">
                <feature.icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
