import LandingHeader from "@landing/components/LandingHeader";
import LandingFooter from "@landing/components/LandingFooter";

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] max-w-98.25 md:max-w-208.5 xl:max-w-none mx-auto overflow-hidden">
      <LandingHeader />
      {children}
      <LandingFooter />
    </div>
  );
}
