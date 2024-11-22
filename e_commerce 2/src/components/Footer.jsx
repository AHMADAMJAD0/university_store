import React from 'react';
import { FaFacebook, FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black text-gray-300 px-10 py-20 mt-10 font-sans md:px-20">
      <div className="flex justify-between">
        <div className="flex-1">
          <h3 className="text-white mb-6 font-bold">CATEGORIES</h3>
          <ul className="list-none p-0 space-y-1">
            <li>Bachelors</li>
            <li>Masters</li>
            <li>PHD</li>
          </ul>
        </div>
        <div className="flex-1">
          <h3 className="text-white mb-6 font-bold">HELP</h3>
          <ul className="list-none p-0 space-y-1">
            <li>Track Order</li>
            <li>Returns</li>
            <li>FAQs</li>
          </ul>
        </div>
        <div className="flex-1">
          <h3 className="text-white mb-6 font-bold">GET IN TOUCH</h3>
          <p>
            Any questions? Let us know in store at location or call us on (+00) 00000000
          </p>
          <div className="flex space-x-4 mt-10 text-2xl justify-center">
            <FaFacebook className="hover:text-blue-600 cursor-pointer" />
            <FaInstagram className="hover:text-pink-500 cursor-pointer" />
            <FaYoutube className="hover:text-red-600 cursor-pointer" />
            <FaLinkedin className="hover:text-blue-700 cursor-pointer" />
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center pt-4 border-t border-gray-600 mt-4">
        <p className="text-sm">&copy; 2024 All rights reserved</p>
        <button
          className="footer_btn bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded"
          onClick={scrollToTop}
        >
          ↑
        </button>
      </div>
    </footer>
  );
};

export default Footer;
