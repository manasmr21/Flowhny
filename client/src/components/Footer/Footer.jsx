import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#211f1f] text-white py-6 w-full flex-shrink-0">
      <div className="max-w-6xl mx-auto px-6 md:px-12 text-center md:text-left">
        <div className="grid gap-6 md:grid-cols-3">
          {/* About Section */}
          <div>
            <h2 className="text-xl font-bold text-themegreen">About Flowhny</h2>
            <p className="text-sm mt-2 leading-relaxed">
              Flowhny is dedicated to revolutionizing agribusiness by connecting people with fresh produce, farm experiences, and sustainable farming solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-xl font-bold text-themegreen">Quick Links</h2>
            <ul className="mt-2 space-y-2 text-sm">
              <li><Link to="/products" className="hover:underline">Products</Link></li>
              <li><Link to="/about" className="hover:underline">About</Link></li>
              <li><Link to="/contact" className="hover:underline">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h2 className="text-xl font-bold text-themegreen">Contact Us</h2>
            <p className="text-sm mt-2 leading-relaxed">Email: contact@flowhny.com</p>
            <p className="text-sm">Phone: +123 456 7890</p>
            <p className="text-sm">Location: Somewhere in Anugul  </p>
            
            {/* Social Icons */}
            <div className="flex justify-center md:justify-start mt-4 space-x-4">
              <Link to="/" className="text-white text-xl hover:text-gray-300"><FaFacebook /></Link>
              <Link to="/" className="text-white text-xl hover:text-gray-300"><FaInstagram /></Link>
              <Link to="/" className="text-white text-xl hover:text-gray-300"><FaTwitter /></Link>
              <a href="mailto:contact@flowhny.com" className="text-white text-xl hover:text-gray-300"><FaEnvelope /></a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 border-t border-white/30 pt-4 text-sm text-center">
          © {new Date().getFullYear()} Flowhny. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
