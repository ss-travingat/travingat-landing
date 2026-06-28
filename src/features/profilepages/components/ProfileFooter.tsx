import Link from "next/link";

export default function ProfileFooter() {
  return (
    <footer className="w-full bg-black py-10 md:py-14 flex items-center justify-center">
      <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-[12px] text-gray-500">
        <Link href="#" className="hover:text-white transition-colors">Help</Link>
        <Link href="#" className="hover:text-white transition-colors">About</Link>
        <Link href="#" className="hover:text-white transition-colors">Careers</Link>
        <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
        <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
      </div>
    </footer>
  );
}
