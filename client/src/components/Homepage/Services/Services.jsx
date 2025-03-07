import React, { useState } from "react";
import { FaShoppingCart, FaTractor, FaSeedling, FaHandshake } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";

const services = [
  {
    category: "Direct Sales & E-commerce",
    icon: <FaShoppingCart size={30} className="text-green-600" />, 
    details: [
      { title: "Fresh Produce Sales", description: "Selling fruits, vegetables, dairy, fish, or eggs directly to consumers." },
      { title: "Farm Products", description: "Honey, vegetables, fruits, flowers, or other products." },
      { title: "Subscription Boxes", description: "Weekly or monthly fresh produce deliveries." },
      { title: "Online Store", description: "Customers can order and pay online." }
    ]
  },
  {
    category: "Farm Experiences & Agritourism",
    icon: <FaTractor size={30} className="text-yellow-600" />, 
    details: [
      { title: "Farm Tours", description: "Guided tours for families or school groups." },
      { title: "Pick-Your-Own Produce", description: "Customers visit to harvest fruits or vegetables." },
      { title: "Workshops & Classes", description: "Teaching organic farming, beekeeping, or cheese-making." },
      { title: "Farm Stays", description: "Rural accommodations like cottages, camping, or B&Bs." },
      { title: "Events & Celebrations", description: "Hosting weddings, corporate retreats, or festivals." }
    ]
  },
  {
    category: "B2B & Wholesale Services",
    icon: <FaHandshake size={30} className="text-blue-600" />, 
    details: [
      { title: "Bulk Sales", description: "Selling to restaurants, grocery stores, or farmers’ markets." },
      { title: "CSA Programs", description: "Customers or businesses subscribe to regular farm produce deliveries." },
      { title: "Farm-to-Table Partnerships", description: "Supplying fresh ingredients to local chefs." }
    ]
  },
  {
    category: "Consultation & Farming Services",
    icon: <FaSeedling size={30} className="text-teal-600" />, 
    details: [
      { title: "Agricultural Consulting", description: "Offering advice on organic farming, hydroponics, or livestock management." },
      { title: "Equipment Rental", description: "Renting tractors, plows, or irrigation tools." },
      { title: "Custom Farming Services", description: "Land preparation, harvesting, or crop management for other farmers." }
    ]
  }
];

export default function ServicesPage() {
  return (
    <div className="max-w-5xl rounded-sm mx-auto py-12 px-6 md:px-12 bg-gray-100">
      <h1 className="text-3xl font-extrabold text-center mb-8 text-green-700 tracking-wide uppercase">Our Services</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {services.map((service) => (
          <div 
            key={service.category} 
            className="p-4 bg-white shadow-md rounded-lg border flex flex-col items-center text-center"
          >
            <div className="mb-2">{service.icon}</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">{service.category}</h2>
            <ul className="text-gray-700 space-y-1 text-sm leading-relaxed w-full">
              {service.details.map((detail, index) => (
                <CollapsibleItem key={index} title={detail.title} description={detail.description} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function CollapsibleItem({ title, description }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <li className="border-b py-1 text-center">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex justify-between items-center w-full text-gray-800 font-semibold text-sm"
      >
        {title} <FiChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="text-gray-600 text-xs mt-1">{description}</p>
      </div>
    </li>
  );
}
