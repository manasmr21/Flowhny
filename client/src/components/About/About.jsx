import React from "react";

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-6 md:px-12 bg-gray-50 text-center">
      <h1 className="text-4xl font-extrabold text-green-700 tracking-wide uppercase">About Flowhny</h1>
      <p className="text-gray-700 text-lg mt-4 leading-relaxed">
        Flowhny is dedicated to revolutionizing agribusiness by providing fresh produce, farm experiences, and sustainable farming solutions. We aim to connect communities with nature while ensuring quality and freshness in every product we deliver.
      </p>
      
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <div className="p-6 bg-white shadow-md rounded-lg border text-left">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Our Vision</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            At Flowhny, we envision a world where sustainable agriculture thrives. We strive to bring farm-fresh products to consumers while promoting eco-friendly farming practices and innovative agribusiness solutions.
          </p>
        </div>

        <div className="p-6 bg-white shadow-md rounded-lg border text-left">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Our Services</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            From direct produce sales to farm experiences and consulting, Flowhny offers a range of services tailored to both consumers and businesses. We provide fresh organic products, agritourism experiences, and expert farming solutions to support sustainable growth.
          </p>
        </div>

        <div className="p-6 bg-white shadow-md rounded-lg border text-left">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Our Commitment</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Sustainability and quality are at the heart of everything we do. We are committed to ethical farming practices, community-driven initiatives, and delivering premium agricultural products with integrity.
          </p>
        </div>

        <div className="p-6 bg-white shadow-md rounded-lg border text-left">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Get Involved</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Whether you're a farmer, a business owner, or a conscious consumer, Flowhny welcomes you. Join our journey in making agriculture more sustainable, efficient, and community-focused.
          </p>
        </div>
      </div>
    </div>
  );
}
