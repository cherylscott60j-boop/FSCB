import TopBar from "@/components/TopBar";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import WhySection from "@/components/WhySection";
import MetricsBanner from "@/components/MetricsBanner";
import CommunityImpact from "@/components/CommunityImpact";
import Products from "@/components/Products";
import DigitalBanking from "@/components/DigitalBanking";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import AuthRedirect from "@/components/AuthRedirect";

export default function Home() {
  return (
    <>
      <AuthRedirect />
      <TopBar />
      <Nav />
      <main>
        <Hero />
        <WhySection />
        <MetricsBanner />
        <CommunityImpact />
        <Products />
        <DigitalBanking />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
