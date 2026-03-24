import type { Metadata } from "next";
import "./globals.css";
import LandingLayout from "@landing/LandingLayout";

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
      <body>
        <LandingLayout>{children}</LandingLayout>
      </body>
    </html>
  );
}
