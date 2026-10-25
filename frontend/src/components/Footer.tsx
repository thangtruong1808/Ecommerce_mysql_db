import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBlog, FaFacebook, FaGithub, FaLinkedin } from "react-icons/fa";
import logoImage from "../assets/images/Logo.png";
import { useAuth } from "../context/AuthContext";
import ContactUsModal from "./ContactUsModal";
import FAQModal from "./FAQModal";
import MeetDeveloperModal from "./MeetDeveloperModal";
import ReturnsModal from "./ReturnsModal";
import ShippingInfoModal from "./ShippingInfoModal";

type FooterModal = "contact" | "shipping" | "returns" | "faq" | "developer" | null;

const textLink =
  "rounded-ui-sm text-sm text-canvas/80 hover:text-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-canvas focus-visible:ring-offset-2 focus-visible:ring-offset-ink";

const textButton = `${textLink} text-left`;

function Footer() {
  const { isAuthenticated } = useAuth() as { isAuthenticated: boolean };
  const [openModal, setOpenModal] = useState<FooterModal>(null);
  const closeModal = () => setOpenModal(null);

  return (
    <footer className="mt-auto bg-ink text-canvas">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-2 lg:grid-cols-5 lg:px-8">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-3 rounded-ui-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-canvas focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            <img src={logoImage} alt="" className="h-12 w-auto object-contain" />
            <span>
              <span className="block text-lg font-bold">Badminton Stores</span>
              <span className="block text-xs text-canvas/70">
                Your trusted shopping destination
              </span>
            </span>
          </Link>
          <p className="mt-3 text-sm text-canvas/80">
            Quality products, exceptional service, and secure shopping experience.
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="text-sm font-semibold">Quick links</h2>
          <ul className="mt-3 space-y-2">
            <li><Link className={textLink} to="/">Home</Link></li>
            <li><Link className={textLink} to="/products">Products</Link></li>
            <li><Link className={textLink} to="/clearance">Clearance</Link></li>
            <li><Link className={textLink} to="/cart">Cart</Link></li>
            {isAuthenticated ? (
              <>
                <li><Link className={textLink} to="/profile">Profile</Link></li>
                <li><Link className={textLink} to="/orders">Orders</Link></li>
                <li><Link className={textLink} to="/invoices">Invoices</Link></li>
              </>
            ) : (
              <li><Link className={textLink} to="/login">Login</Link></li>
            )}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold">Customer service</h2>
          <ul className="mt-3 space-y-2">
            <li><button type="button" className={textButton} onClick={() => setOpenModal("contact")}>Contact us</button></li>
            <li><button type="button" className={textButton} onClick={() => setOpenModal("shipping")}>Shipping info</button></li>
            <li><button type="button" className={textButton} onClick={() => setOpenModal("returns")}>Returns</button></li>
            <li><button type="button" className={textButton} onClick={() => setOpenModal("faq")}>FAQ</button></li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold">About</h2>
          <button type="button" className={`${textButton} mt-3`} onClick={() => setOpenModal("developer")}>
            Meet the developer
          </button>
          <ul className="mt-4 flex items-center gap-3">
            <li>
              <a className={textLink} href="https://www.linkedin.com/in/thang-truong-00b245200/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FaLinkedin aria-hidden="true" />
              </a>
            </li>
            <li>
              <a className={textLink} href="https://www.facebook.com/profile.php?id=100051753410222" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebook aria-hidden="true" />
              </a>
            </li>
            <li>
              <a className={textLink} href="https://github.com/thangtruong1808/Ecommerce_mysql_db" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <FaGithub aria-hidden="true" />
              </a>
            </li>
            <li>
              <a className={textLink} href="https://www.thang-truong.blog/" target="_blank" rel="noopener noreferrer" aria-label="Thang Truong's Blog">
                <FaBlog aria-hidden="true" />
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold">Contact</h2>
          <ul className="mt-3 space-y-2 text-sm text-canvas/80">
            <li>ABN: 12 345 678 901</li>
            <li>123 Main Street</li>
            <li>Melbourne Victoria 3000, Australia</li>
            <li>
              <a className={textLink} href="mailto:thangtruong1808@gmail.com">
                thangtruong1808@gmail.com
              </a>
            </li>
            <li>
              <a className={textLink} href="tel:0466828649">0466828649</a>
            </li>
          </ul>
        </div>
      </div>
      <p className="border-t border-canvas/20 px-4 py-6 text-center text-sm text-canvas/70">
        This ecommerce platform was thoughtfully designed and developed by Thang Truong. Thank you for shopping with us!
      </p>
      <ContactUsModal isOpen={openModal === "contact"} onClose={closeModal} />
      <ShippingInfoModal isOpen={openModal === "shipping"} onClose={closeModal} />
      <ReturnsModal isOpen={openModal === "returns"} onClose={closeModal} />
      <FAQModal isOpen={openModal === "faq"} onClose={closeModal} />
      <MeetDeveloperModal isOpen={openModal === "developer"} onClose={closeModal} />
    </footer>
  );
}

export default Footer;
