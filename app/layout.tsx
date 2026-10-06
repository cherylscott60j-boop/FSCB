import type { Metadata, Viewport } from "next";
import { Inter, Libre_Franklin, Poppins } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import CookieConsent from "@/components/CookieConsent";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const montserrat = Libre_Franklin({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "SGGINV — Safeguard Global Investment Bank",
  description:
    "Decades of community trust. Banking built for your family, your business, and your future.",
  icons: {
    icon: "/pngfavicon.svg",
    apple: "/pngfavicon.svg",
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable} ${poppins.variable}`} suppressHydrationWarning>
      <body>
        <NextTopLoader color="#8C1D25" shadow="0 0 10px #8C1D25,0 0 5px #D4AF37" height={3} showSpinner={false}/>
        <div className="page-clip">
          {children}
        </div>
        <CookieConsent />
      </body>
    </html>
  );
}