import TopBar from "@/components/TopBar";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import RelationshipBanking from "@/components/RelationshipBanking";
import WhySafeguard from "@/components/WhySafeguard";
import ServiceQuality from "@/components/ServiceQuality";
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
        <WhySafeguard />
        <ServiceQuality />
      </main>
      <Footer />
    </>
  );
}
