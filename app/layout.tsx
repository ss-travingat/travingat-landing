import type { Metadata } from "next";
import { Inter, Righteous } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import LandingLayout from "@landing/LandingLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const righteous = Righteous({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-logo",
  display: "swap",
});

const interDisplay = localFont({
  src: [
    {
      path: "../inter-display/InterDisplay-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../inter-display/InterDisplay-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../inter-display/InterDisplay-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../inter-display/InterDisplay-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-inter-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Travingat - Travel Portfolio for Explorers",
  description: "Build your travel portfolio and organize every journey in one place.",
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
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className={`${inter.variable} ${interDisplay.variable} ${righteous.variable}`}>
        <LandingLayout>{children}</LandingLayout>
      </body>
    </html>
  );
}
