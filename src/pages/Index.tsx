import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import DoctorSection from "@/components/DoctorSection";
import ServicesSection from "@/components/ServicesSection";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import ReviewsSection from "@/components/ReviewsSection";
import ContactSection from "@/components/ContactSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { WhatsAppFloat } from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <DoctorSection />
        <ServicesSection />
        <WhyChooseUsSection />
        <ReviewsSection />
        <ContactSection />
        <CTASection />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
};

export default Index;
