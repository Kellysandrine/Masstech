import { Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import logo1 from "../logo1.png";

export default function Footer() {
  return (
    <footer className="w-full bg-[#111] dark:bg-[#000] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Company Info */}
<div className="lg:col-span-1">
  <div className="flex items-center mb-6">
    <img
      src={logo1}
      alt="MASS Tech"
      className="h-24 w-auto object-contain"
    />
  </div>
  <p className="text-gray-400 text-sm leading-relaxed mb-6">
    Building Excellence in Rwanda. We specialize in construction,
    architecture, interior design, and project management with
    innovation and precision.
  </p>
  <div className="flex space-x-4">
    <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#006DFF] transition-colors cursor-pointer">
      <span className="text-white text-xs font-bold">f</span>
    </div>
    <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#006DFF] transition-colors cursor-pointer">
      <span className="text-white text-xs font-bold">in</span>
    </div>
    <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#006DFF] transition-colors cursor-pointer">
      <span className="text-white text-xs font-bold">x</span>
    </div>
  </div>
</div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">
              Quick Links
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="/"
                  className="text-gray-400 text-sm hover:text-white transition-colors inline-flex items-center group"
                >
                  <ArrowRight
                    size={14}
                    className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-gray-400 text-sm hover:text-white transition-colors inline-flex items-center group"
                >
                  <ArrowRight
                    size={14}
                    className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/services"
                  className="text-gray-400 text-sm hover:text-white transition-colors inline-flex items-center group"
                >
                  <ArrowRight
                    size={14}
                    className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                  Services
                </a>
              </li>
              <li>
                <a
                  href="/projects"
                  className="text-gray-400 text-sm hover:text-white transition-colors inline-flex items-center group"
                >
                  <ArrowRight
                    size={14}
                    className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                  Projects
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-gray-400 text-sm hover:text-white transition-colors inline-flex items-center group"
                >
                  <ArrowRight
                    size={14}
                    className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">
              Our Services
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="/services"
                  className="text-gray-400 text-sm hover:text-white transition-colors"
                >
                  Residential Construction
                </a>
              </li>
              <li>
                <a
                  href="/services"
                  className="text-gray-400 text-sm hover:text-white transition-colors"
                >
                  Commercial Buildings
                </a>
              </li>
              <li>
                <a
                  href="/services"
                  className="text-gray-400 text-sm hover:text-white transition-colors"
                >
                  Industrial Construction
                </a>
              </li>
              <li>
                <a
                  href="/services"
                  className="text-gray-400 text-sm hover:text-white transition-colors"
                >
                  Architectural Design
                </a>
              </li>
              <li>
                <a
                  href="/services"
                  className="text-gray-400 text-sm hover:text-white transition-colors"
                >
                  Interior Design
                </a>
              </li>
              <li>
                <a
                  href="/services"
                  className="text-gray-400 text-sm hover:text-white transition-colors"
                >
                  Project Management
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">
              Get In Touch
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin
                  size={16}
                  className="text-[#006DFF] mt-1 flex-shrink-0"
                />
                <div>
                  <p className="text-gray-400 text-sm">
                    1 KN 78 St, Kigali, Rwanda
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-[#006DFF] flex-shrink-0" />
                <a
                  href="tel:+250 788 886 502"
                  className="text-gray-400 text-sm hover:text-white transition-colors"
                >
                  +250 788 886 502
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-[#006DFF] flex-shrink-0" />
                <a
                  href="mailto:info@masstech1.com"
                  className="text-gray-400 text-sm hover:text-white transition-colors"
                >
                  info@masstech1.com
                </a>
              </div>
            </div>

            {/* CTA Button */}
            <a
              href="/contact"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#006DFF] to-[#2F7BFF] text-white font-semibold text-sm px-6 py-3 rounded-full hover:brightness-105 active:brightness-95 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#006DFF] focus:ring-opacity-50 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-150 mt-6"
            >
              <span>Get Free Quote</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 MASS Tech Ltd. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            
            <a
              href="mailto:uksandrine@gmail.com"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Designed By: Kelly Sandrine U.
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
