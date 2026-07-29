import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { SessionProvider } from "@/components/SessionProvider";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Llama or Alpaca?",
  description:
    "A fast, fun guessing game with real photos — is it a llama or an alpaca? Build your streak, learn the tells, and beat your best score.",
  icons: { icon: "/favicon.svg" },
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
      </head>
      <body>
        <SessionProvider>
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
        </SessionProvider>
      </body>
    </html>
  );
}
