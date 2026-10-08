import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Inter, Antonio } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import LandingLayout from "@landing/components/layout/LandingLayout";
import { MobileComingSoonProvider } from "@/components/ui/MobileComingSoonToast";
const antonio = Antonio({
  subsets: ["latin"],
  variable: "--font-antonio",
  display: "swap",
  preload: false,
});

const inter = localFont({
  src: [
    {
      path: "../assets/fonts/inter/Inter-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/inter/Inter-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/inter/Inter-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../assets/fonts/inter/Inter-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-inter",
  display: "swap",
  preload: false,
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
  preload: false,
});

const interDisplay = localFont({
  src: [
    {
      path: "../assets/fonts/inter-display-woff2/InterDisplay-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/inter-display-woff2/InterDisplay-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/inter-display-woff2/InterDisplay-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../assets/fonts/inter-display-woff2/InterDisplay-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-inter-display",
  display: "swap",
  preload: false,
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
  preload: false,
});

const interGoogle = Inter({
  subsets: ["latin"],
  variable: "--font-inter-google",
  display: "swap",
  preload: false,
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
    <html lang="en" className={`${inter.variable} ${interDisplay.variable} ${logoFont.variable} ${openSauceTwo.variable} ${interGoogle.variable} ${antonio.variable}`}>
      <head>
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          as="style"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          media="print"
          crossOrigin="anonymous"
        />
        <link rel="preload" href="/web/inter.css" as="style" />
        <link rel="stylesheet" href="/web/inter.css" />
        <Script id="material-icons-swap" strategy="afterInteractive">
          {`document.querySelector('link[href*="Material+Symbols"][media="print"]').media='all'`}
        </Script>
      </head>
      <body>
        <MobileComingSoonProvider>
          <LandingLayout>{children}</LandingLayout>
        </MobileComingSoonProvider>
      </body>
    </html>
  );
}
