import Link from "next/link";

export default function ProfileFooter({ className = "" }: { className?: string }) {
  return (
    <footer className={`w-full bg-black py-10 md:py-14 flex items-center justify-center ${className}`}>
      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-[14px] md:text-[12px] text-gray-500 px-6">
        <a href="mailto:hello@travingat.com" className="hover:text-white transition-colors">Contact</a>
        <a href="https://travingat.com/about" className="hover:text-white transition-colors">About</a>
        <a href="https://travingat.com/templates" className="hover:text-white transition-colors">Templates</a>
        <a href="https://travingat.com/blog" className="hover:text-white transition-colors">Blog</a>
        <a href="https://travingat.com/terms" className="hover:text-white transition-colors whitespace-nowrap">Terms of Service</a>
        <a href="https://travingat.com/privacy" className="hover:text-white transition-colors whitespace-nowrap">Privacy Policy</a>
      </div>
    </footer>
  );
}
