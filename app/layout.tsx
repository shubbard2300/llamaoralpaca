import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { SessionProvider } from "@/components/SessionProvider";
import { SoundProvider } from "@/components/SoundProvider";
import SiteFooter from "@/components/SiteFooter";

const SITE_URL = "https://www.llamaoralpaca.com";
const TITLE = "Llama or Alpaca?";
const DESCRIPTION =
  "A fast, fun guessing game with real photos — is it a llama or an alpaca? Build your streak, learn the tells, and beat your best score.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  icons: { icon: "/llamaVectorHead-NoText.png" },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "Llama or Alpaca?",
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    images: [{ url: "/llamaVectorHead-NoText.png", alt: "Llama or Alpaca? logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/llamaVectorHead-NoText.png"],
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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@500;700;800&display=swap"
          rel="stylesheet"
        />
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
