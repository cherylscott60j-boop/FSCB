import TopBar from "./TopBar";
import Nav from "./Nav";
import Footer from "./Footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopBar />
      <Nav />
      <main>{children}</main>
      <Footer />
    </>
  );
}
