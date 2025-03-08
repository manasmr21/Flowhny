import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-green-700 text-white py-6 mt-auto w-full flex-shrink-0 ">
      <div className="max-w-6xl mx-auto px-6 md:px-12 text-center md:text-left">
        <div className="grid gap-6 md:grid-cols-3">
          {/* About Section */}
          <div>
            <h2 className="text-xl font-bold">About Flowhny</h2>
            <p className="text-sm mt-2 leading-relaxed">
              Flowhny is dedicated to revolutionizing agribusiness by connecting people with fresh produce, farm experiences, and sustainable farming solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-xl font-bold">Quick Links</h2>
            <ul className="mt-2 space-y-2 text-sm">
              <li><a href="#" className="hover:underline">Home</a></li>
              <li><a href="#" className="hover:underline">Services</a></li>
              <li><a href="#" className="hover:underline">About</a></li>
              <li><a href="#" className="hover:underline">Contact</a></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h2 className="text-xl font-bold">Contact Us</h2>
            <p className="text-sm mt-2 leading-relaxed">Email: contact@flowhny.com</p>
            <p className="text-sm">Phone: +123 456 7890</p>
            <p className="text-sm">Location: Green Valley, Earth</p>
            
            {/* Social Icons */}
            <div className="flex justify-center md:justify-start mt-4 space-x-4">
              <a href="#" className="text-white text-xl hover:text-gray-300"><FaFacebook /></a>
              <a href="#" className="text-white text-xl hover:text-gray-300"><FaInstagram /></a>
              <a href="#" className="text-white text-xl hover:text-gray-300"><FaTwitter /></a>
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
