import type { Metadata } from "next";
import Script from "next/script";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { SessionProvider } from "@/components/SessionProvider";
import { SoundProvider } from "@/components/SoundProvider";
import SiteFooter from "@/components/SiteFooter";

// Self-hosted by Next with size-matched fallbacks, so text doesn't jump when the fonts arrive.
const fredoka = Fredoka({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-fredoka", display: "swap" });
const nunito = Nunito({ subsets: ["latin"], weight: ["500", "700", "800"], variable: "--font-nunito", display: "swap" });

const SITE_URL = "https://www.llamaoralpaca.com";
const TITLE = "Llama or Alpaca? — The Free Photo Guessing Game";
const DESCRIPTION =
  "A fast, fun guessing game with real photos — is it a llama or an alpaca? Build your streak, learn the tells, and beat your best score.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s | Llama or Alpaca?" },
  description: DESCRIPTION,
  icons: { icon: "/icon-192.png" },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "Llama or Alpaca?",
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Llama or Alpaca? — the free photo guessing game" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.png"],
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Llama or Alpaca?",
  url: SITE_URL,
  description: DESCRIPTION,
  applicationCategory: "Game",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  image: `${SITE_URL}/llamaVectorHead-NoText.png`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fredoka.variable} ${nunito.variable}`}>
      <head>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-QT9EGB624S" />
        <Script id="ga-init">
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-QT9EGB624S');`}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </head>
      <body>
        <SessionProvider>
          <SoundProvider>
            <div className="bg-scene" aria-hidden="true">
              <div className="cloud c1" />
              <div className="cloud c2" />
              <div className="cloud c3" />
              <div className="hill hill-back" />
              <div className="hill hill-front" />
            </div>
            <div className="app">
              <Navbar />
              <main className="stage">{children}</main>
              <SiteFooter />
            </div>
          </SoundProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
