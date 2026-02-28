import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const inter = localFont({
  src: [
    { path: "../../public/fonts/inter-display/InterVariable.ttf", style: "normal" },
    { path: "../../public/fonts/inter-display/InterVariable-Italic.ttf", style: "italic" },
  ],
  display: "swap",
  variable: "--font-inter",
});

const interDisplay = localFont({
  src: [
    { path: "../../public/fonts/inter-display/InterDisplay-Regular.ttf",  weight: "400", style: "normal" },
    { path: "../../public/fonts/inter-display/InterDisplay-Italic.ttf",    weight: "400", style: "italic" },
    { path: "../../public/fonts/inter-display/InterDisplay-Medium.ttf",    weight: "500", style: "normal" },
    { path: "../../public/fonts/inter-display/InterDisplay-SemiBold.ttf",  weight: "600", style: "normal" },
    { path: "../../public/fonts/inter-display/InterDisplay-Bold.ttf",      weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-inter-display",
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
    <html lang="en" className={`${inter.variable} ${interDisplay.variable}`}>
      <head>
          <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet"/>
      </head>
      <body className="bg-background-light dark:bg-background-dark text-gray-900 dark:text-white antialiased selection:bg-primary selection:text-white">
        {children}
      </body>
    </html>
  );
}
