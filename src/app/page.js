import BenefitsSection from "./components/Home/Benefits";
import Footer from "./components/Home/Footer";
import Hero from "./components/Home/Hero";
import HowItWorks from "./components/Home/HowItWorks";
import Navbar from "./components/Home/Navbar";
import ServicesBarterSection from "./components/Home/Services";
import TrustSection from "./components/Home/Trust";
import WhyUsSection from "./components/Home/WhyUsSection";


export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <HowItWorks />
      <BenefitsSection />
      <WhyUsSection />
      <ServicesBarterSection />
      <TrustSection />
      <Footer />
    </main>
  );
}