import { MapPin, Phone, Clock } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background section-padding">
      <div className="container-main">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold text-xl mb-3 tracking-tight">
              Harsh Physio Clinic
            </h3>
            <p className="text-background/60 text-sm max-w-sm leading-relaxed">
              Expert physiotherapy care for pain relief, injury recovery, and
              rehabilitation. Helping patients regain mobility and a pain-free
              lifestyle.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-widest text-background/80">
              Contact
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-background/60 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={1.5} />
                <a href="https://maps.app.goo.gl/SYMsXNVRpMHAdBH27">
                  <span>
                    Gali no 12, M S Hospital, Integral University, Bharawamau,
                    Lucknow 226026
                  </span>
                </a>
              </div>
              <div className="flex items-center gap-2 text-background/60 text-sm">
                <Phone className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                <a
                  href="tel:+916391989878"
                  className="hover:text-background transition-colors tabular-nums"
                >
                  +91 63919 89878
                </a>
              </div>
              <div className="flex items-center gap-2 text-background/60 text-sm">
                <Clock className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                <span>Open 24 Hours</span>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-widest text-background/80">
              Quick Links
            </h4>
            <nav className="flex flex-col gap-2">
              {["About", "Services", "Why Us", "Reviews", "Contact"].map(
                (link) => (
                  <a
                    key={link}
                    href={`#${link.toLowerCase().replace(" ", "-")}`}
                    className="text-background/60 text-sm hover:text-background transition-colors"
                  >
                    {link}
                  </a>
                ),
              )}
            </nav>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 text-center text-background/40 text-sm">
          © {new Date().getFullYear()} Harsh Physio Clinic. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

// Floating WhatsApp button
export const WhatsAppFloat = () => (
  <a
    href={`https://api.whatsapp.com/send?phone=+916391989878&text=${encodeURIComponent("Hello Harsh Physio Clinic, I would like to book an appointment.")}`}
    target="_blank"
    rel="noreferrer"
    className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg flex items-center justify-center"
    aria-label="WhatsApp"
  >
    <img
      src="/src/assets/whatsapp.png"
      alt="WhatsApp"
      width={20}
      height={20}
      className="w-5 h-5"
    />
  </a>
);
