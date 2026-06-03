import { useState } from "react";
import { ChevronDown, ArrowRight, Menu, X } from "lucide-react";
import logo from "../logo.png";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header className="w-full bg-white dark:bg-[#1E1E1E] border-b border-[#E5E7EB] dark:border-[#333333] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Brand block - left aligned */}
<div className="flex items-center space-x-3">
  <img
  src={logo}
  alt="MASS Tech"
  className="h-8 sm:h-10 w-auto object-contain"
/>
</div>

          {/* Navigation menu - center aligned - hidden on mobile */}
          <nav
            className="hidden md:flex items-center space-x-8"
            role="navigation"
            aria-label="Primary"
          >
            <a
              href="/"
              className="text-[#1C2536] dark:text-white font-normal text-sm relative hover:opacity-100 active:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#0A6FFF] dark:focus:ring-[#4D8FFF] focus:ring-offset-2 rounded-sm transition-opacity"
            >
              Home
            </a>
            <a
              href="/about"
              className="text-[#1C2536] dark:text-[#B3B3B3] opacity-80 font-normal text-sm hover:opacity-100 hover:dark:text-white active:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#0A6FFF] dark:focus:ring-[#4D8FFF] focus:ring-offset-2 rounded-sm transition-all"
            >
              About Us
            </a>
            <a
              href="/services"
              className="text-[#1C2536] dark:text-[#B3B3B3] opacity-80 font-normal text-sm hover:opacity-100 hover:dark:text-white active:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#0A6FFF] dark:focus:ring-[#4D8FFF] focus:ring-offset-2 rounded-sm transition-all"
            >
              Services
            </a>
            <a
              href="/projects"
              className="text-[#1C2536] dark:text-[#B3B3B3] opacity-80 font-normal text-sm hover:opacity-100 hover:dark:text-white active:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#0A6FFF] dark:focus:ring-[#4D8FFF] focus:ring-offset-2 rounded-sm transition-all"
            >
              Projects
            </a>
            <a
              href="/contact"
              className="text-[#1C2536] dark:text-[#B3B3B3] opacity-80 font-normal text-sm hover:opacity-100 hover:dark:text-white active:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#0A6FFF] dark:focus:ring-[#4D8FFF] focus:ring-offset-2 rounded-sm transition-all"
            >
              Contact
            </a>
          </nav>

          {/* CTA button - right aligned - hidden on mobile */}
          <a
            href="/contact"
            className="hidden sm:flex items-center space-x-2.5 bg-gradient-to-r from-[#006DFF] to-[#2F7BFF] dark:from-[#4D8FFF] dark:to-[#6BA3FF] text-white font-semibold text-sm px-4 sm:px-6 py-2 sm:py-2.5 rounded-full hover:brightness-105 active:brightness-95 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#006DFF] dark:focus:ring-[#4D8FFF] focus:ring-opacity-50 focus:ring-offset-2 transition-all duration-150"
          >
            <span>Get Quote</span>
            <ArrowRight size={16} />
          </a>

          {/* Mobile menu button - visible on mobile only */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-[#1C2536] dark:text-white hover:opacity-80 active:opacity-70 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#0A6FFF] dark:focus:ring-[#4D8FFF] focus:ring-offset-2 rounded-sm transition-all duration-150"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Background overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-20 dark:bg-opacity-60 z-40 md:hidden"
            onClick={toggleMobileMenu}
          />

          {/* Mobile menu drawer */}
          <div className="fixed top-16 sm:top-20 right-0 w-80 max-w-[calc(100vw-2rem)] h-full bg-white dark:bg-[#1E1E1E] shadow-xl z-50 md:hidden transform transition-transform duration-300 ease-out">
            <nav
              className="flex flex-col p-6 space-y-6"
              role="navigation"
              aria-label="Mobile navigation"
            >
              <a
                href="/"
                className="text-[#1C2536] dark:text-white font-normal text-lg py-2 border-b border-gray-100 dark:border-[#333333] hover:opacity-80 active:opacity-70 focus:outline-none focus:ring-2 focus:ring-[#0A6FFF] dark:focus:ring-[#4D8FFF] rounded-sm transition-opacity"
                onClick={toggleMobileMenu}
              >
                Home
              </a>
              <a
                href="/about"
                className="text-[#1C2536] dark:text-[#B3B3B3] opacity-80 font-normal text-lg py-2 hover:opacity-100 hover:dark:text-white active:opacity-70 focus:outline-none focus:ring-2 focus:ring-[#0A6FFF] dark:focus:ring-[#4D8FFF] rounded-sm transition-all"
                onClick={toggleMobileMenu}
              >
                About Us
              </a>
              <a
                href="/services"
                className="text-[#1C2536] dark:text-[#B3B3B3] opacity-80 font-normal text-lg py-2 hover:opacity-100 hover:dark:text-white active:opacity-70 focus:outline-none focus:ring-2 focus:ring-[#0A6FFF] dark:focus:ring-[#4D8FFF] rounded-sm transition-all"
                onClick={toggleMobileMenu}
              >
                Services
              </a>
              <a
                href="/projects"
                className="text-[#1C2536] dark:text-[#B3B3B3] opacity-80 font-normal text-lg py-2 hover:opacity-100 hover:dark:text-white active:opacity-70 focus:outline-none focus:ring-2 focus:ring-[#0A6FFF] dark:focus:ring-[#4D8FFF] rounded-sm transition-all"
                onClick={toggleMobileMenu}
              >
                Projects
              </a>
              <a
                href="/contact"
                className="text-[#1C2536] dark:text-[#B3B3B3] opacity-80 font-normal text-lg py-2 hover:opacity-100 hover:dark:text-white active:opacity-70 focus:outline-none focus:ring-2 focus:ring-[#0A6FFF] dark:focus:ring-[#4D8FFF] rounded-sm transition-all"
                onClick={toggleMobileMenu}
              >
                Contact
              </a>

              {/* Mobile CTA button */}
              <a
                href="/contact"
                className="flex items-center justify-center space-x-2.5 bg-gradient-to-r from-[#006DFF] to-[#2F7BFF] dark:from-[#4D8FFF] dark:to-[#6BA3FF] text-white font-semibold text-sm px-6 py-3 rounded-full hover:brightness-105 active:brightness-95 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#006DFF] dark:focus:ring-[#4D8FFF] focus:ring-opacity-50 focus:ring-offset-2 transition-all duration-150 mt-4"
                onClick={toggleMobileMenu}
              >
                <span>Get Quote</span>
                <ArrowRight size={16} />
              </a>
            </nav>
          </div>
        </>
      )}
    </>
  );
}
