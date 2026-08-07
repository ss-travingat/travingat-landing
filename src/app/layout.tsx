import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import LandingLayout from "@landing/components/layout/LandingLayout";
import { MobileComingSoonProvider } from "@/components/ui/MobileComingSoonToast";

const inter = localFont({
  src: [
    {
      path: "../assets/fonts/inter-display/InterDisplay-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/inter-display/InterDisplay-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/inter-display/InterDisplay-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../assets/fonts/inter-display/InterDisplay-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-inter",
  display: "swap",
});

const logoFont = localFont({
  src: [
    {
      path: "../assets/fonts/righteous/Righteous-Regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-logo",
  display: "swap",
});

const interDisplay = localFont({
  src: [
    {
      path: "../assets/fonts/inter-display/InterDisplay-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/inter-display/InterDisplay-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/inter-display/InterDisplay-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../assets/fonts/inter-display/InterDisplay-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-inter-display",
  display: "swap",
});

const openSauceTwo = localFont({
  src: [
    {
      path: "../assets/fonts/open-sauce-two/OpenSauceTwo-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-open-sauce-two",
  display: "swap",
});

const interGoogle = Inter({
  subsets: ["latin"],
  variable: "--font-inter-google",
  display: "swap",
});



export const metadata: Metadata = {
  title: "Travingat - Travel Portfolio for Explorers",
  description: "Build your travel portfolio and organize every journey in one place.",
  icons: [
    {
      media: "(prefers-color-scheme: light)",
      url: "/favicons/Fav icon - light.png",
      href: "/favicons/Fav icon - light.png",
    },
    {
      media: "(prefers-color-scheme: dark)",
      url: "/favicons/Fav icon -dark.png",
      href: "/favicons/Fav icon -dark.png",
    },
  ],
};

export const viewport: Viewport = {
  themeColor: "#111111",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          as="style"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          media="print"
        />
        <Script id="material-icons-swap" strategy="afterInteractive">
          {`document.querySelector('link[href*="Material+Symbols"][media="print"]').media='all'`}
        </Script>
      </head>
      <body className={`${inter.variable} ${interDisplay.variable} ${logoFont.variable} ${openSauceTwo.variable} ${interGoogle.variable}`}>
        <MobileComingSoonProvider>
          <LandingLayout>{children}</LandingLayout>
        </MobileComingSoonProvider>
      </body>
    </html>
  );
}
