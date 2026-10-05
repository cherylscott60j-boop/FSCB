import TopBar from "@/components/TopBar";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import RelationshipBanking from "@/components/RelationshipBanking";
import InfoStrips from "@/components/InfoStrips";
import WhySection from "@/components/WhySection";
import ExtendedHours from "@/components/ExtendedHours";
import CommunityImpact from "@/components/CommunityImpact";
import CallUsBanner from "@/components/CallUsBanner";
import ServiceQuality from "@/components/ServiceQuality";
import Products from "@/components/Products";
import DigitalBanking from "@/components/DigitalBanking";
import Testimonials from "@/components/Testimonials";
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
        <RelationshipBanking />
        <InfoStrips />
        <WhySection />
        <ExtendedHours />
        <CommunityImpact />
        <CallUsBanner />
        <ServiceQuality />
        <Products />
        <DigitalBanking />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
