export default function Footer() {
    return (
        <footer className="bg-black py-10 md:py-16 border-t border-gray-900">
            <div className="max-w-7xl mx-auto px-5 md:px-4 flex flex-col md:flex-row justify-between items-start gap-8 md:gap-12">
                <div className="md:w-1/3">
                    <a className="flex items-center space-x-2 mb-4 md:mb-6" href="#">
                        <span className="text-xl md:text-2xl font-bold text-white">travingat</span>
                    </a>
                    <a className="block text-gray-400 hover:text-white text-sm md:text-base mb-1 md:mb-2" href="mailto:connect@travingat.com">connect@travingat.com</a>
                    <p className="text-gray-400 text-sm md:text-base">+1 826 725 005</p>
                    <div className="flex space-x-5 md:space-x-6 mt-6 md:mt-8">
                        <a className="text-gray-400 hover:text-white" href="#"><i className="fab fa-facebook-f"></i></a>
                        <a className="text-gray-400 hover:text-white" href="#"><i className="fab fa-instagram"></i></a>
                        <a className="text-gray-400 hover:text-white" href="#"><i className="fab fa-linkedin-in"></i></a>
                        <a className="text-gray-400 hover:text-white" href="#"><i className="fab fa-tiktok"></i></a>
                        <a className="text-gray-400 hover:text-white" href="#"><i className="fab fa-x-twitter"></i></a>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-x-12 md:gap-x-16 gap-y-3 md:gap-y-4">
                    <div className="flex flex-col space-y-3">
                        <a className="text-gray-400 hover:text-white text-sm md:text-base" href="#">About us</a>
                        <a className="text-gray-400 hover:text-white text-sm md:text-base" href="#">Featured profiles</a>
                        <a className="text-gray-400 hover:text-white text-sm md:text-base" href="#">Blog</a>
                        <a className="text-gray-400 hover:text-white text-sm md:text-base" href="#">Join waiting list</a>
                    </div>
                    <div className="flex flex-col space-y-3">
                        <a className="text-gray-400 hover:text-white text-sm md:text-base" href="#">Contact us</a>
                        <a className="text-gray-400 hover:text-white text-sm md:text-base" href="#">Careers</a>
                        <a className="text-gray-400 hover:text-white text-sm md:text-base" href="#">Showreel</a>
                        <a className="text-gray-400 hover:text-white text-sm md:text-base" href="#">Invest</a>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-5 md:px-4 mt-10 md:mt-16 pt-6 md:pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                <p>©Copyrights 2025 travingat</p>
                <div className="flex space-x-4 md:space-x-6 mt-3 md:mt-0">
                    <a className="hover:text-white" href="#">Privacy</a>
                    <a className="hover:text-white" href="#">Terms</a>
                    <a className="hover:text-white" href="#">Policy</a>
                </div>
            </div>
        </footer>
    );
}
