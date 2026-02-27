import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Travingat - Build your travel profile",
  description: "Turn your journeys into a beautiful personal archive.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
          <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet"/>
      </head>
      <body className="bg-background-light dark:bg-background-dark text-gray-900 dark:text-white antialiased selection:bg-primary selection:text-white">
        {children}
      </body>
    </html>
  );
}
