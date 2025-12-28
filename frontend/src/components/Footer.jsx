/**
 * Footer Component
 * Site footer with links and information
 *
 * @author Thang Truong
 * @date 2025-12-12
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaLinkedin, FaFacebook, FaGithub, FaBlog } from "react-icons/fa";
import logoImage from "../assets/images/Logo.png";
import ContactUsModal from "./ContactUsModal";
import ShippingInfoModal from "./ShippingInfoModal";
import ReturnsModal from "./ReturnsModal";
import FAQModal from "./FAQModal";
import MeetDeveloperModal from "./MeetDeveloperModal";

/**
 * Footer component
 * @returns {JSX.Element} Footer component
 * @author Thang Truong
 * @date 2025-12-17
 */
const Footer = () => {
  const { isAuthenticated } = useAuth();
  const [openModal, setOpenModal] = useState(null);

  /**
   * Handle opening a modal
   * @param {string} modalName - Name of modal to open
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handleOpenModal = (modalName) => {
    setOpenModal(modalName);
  };

  /**
   * Handle closing modal
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handleCloseModal = () => {
    setOpenModal(null);
  };

  /* Footer component layout */
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      {/* Footer container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Company info with logo matching navbar */}
          <div>
            <Link
              to="/"
              className="flex items-center space-x-3 mb-4 hover:opacity-80 transition-opacity"
            >
              <img
                src={logoImage}
                alt="Badminton Stores Logo"
                className="h-full w-auto object-contain"
              />
              {/* Company name and description */}
            </Link>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white">
                Badminton Stores
              </span>
              <span className="text-xs text-gray-400">
                Your trusted shopping destination
              </span>
            </div>
            <p className="text-gray-400 text-sm mt-2">
              Quality products, exceptional service, and secure shopping
              experience.
            </p>
          </div>

          {/* Quick links - matching navbar items */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white">
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/clearance"
                  className="text-gray-400 hover:text-white"
                >
                  Clearance
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-400 hover:text-white">
                  Cart
                </Link>
              </li>
              {isAuthenticated ? (
                <>
                  <li>
                    <Link
                      to="/profile"
                      className="text-gray-400 hover:text-white"
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/orders"
                      className="text-gray-400 hover:text-white"
                    >
                      Orders
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/invoices"
                      className="text-gray-400 hover:text-white"
                    >
                      Invoices
                    </Link>
                  </li>
                </>
              ) : (
                <li>
                  <Link to="/login" className="text-gray-400 hover:text-white">
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Customer service */}
          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => handleOpenModal("contact")}
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleOpenModal("shipping")}
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  Shipping Info
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleOpenModal("returns")}
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  Returns
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleOpenModal("faq")}
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-semibold mb-4">About</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => handleOpenModal("developer")}
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  Meet the Developer
                </button>
              </li>
              {/* Social media links */}
              <li className="pt-2">
                <div className="flex items-center space-x-3">
                  <a
                    href="https://www.linkedin.com/in/thang-truong-00b245200/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedin className="text-lg" />
                  </a>
                  <a
                    href="https://www.facebook.com/profile.php?id=100051753410222"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="Facebook"
                  >
                    <FaFacebook className="text-lg" />
                  </a>
                  <a
                    href="https://github.com/thangtruong1808/Ecommerce_mysql_db"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="GitHub"
                  >
                    <FaGithub className="text-lg" />
                  </a>
                  <a
                    href="https://www.thang-truong.blog/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="Thang Truong's Blog"
                  >
                    <FaBlog className="text-lg" />
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>ABN: 12 345 678 901</li>
              <li>123 Main Street</li>
              <li>Melbourne Victoria 3000, Australia</li>
              <li>Email: thangtruong1808@gmail.com</li>
              <li>Phone: +61 2 9876 5432</li>
            </ul>
          </div>
        </div>

        {/* Footer message */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>
            This ecommerce platform was thoughtfully designed and developed by
            Thang Truong. Thank you for shopping with us!
          </p>
        </div>
      </div>
      {/* Modals */}
      <ContactUsModal
        isOpen={openModal === "contact"}
        onClose={handleCloseModal}
      />
      <ShippingInfoModal
        isOpen={openModal === "shipping"}
        onClose={handleCloseModal}
      />
      <ReturnsModal
        isOpen={openModal === "returns"}
        onClose={handleCloseModal}
      />
      <FAQModal isOpen={openModal === "faq"} onClose={handleCloseModal} />
      <MeetDeveloperModal
        isOpen={openModal === "developer"}
        onClose={handleCloseModal}
      />
    </footer>
  );
};

export default Footer;
