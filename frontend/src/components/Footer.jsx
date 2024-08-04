import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
} from "lucide-react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Category */}
          <div className="footer-section">
            <h3 className="section-title">CATEGORY</h3>
            <ul className="footer-list">
              {[
                "Dairy & Milk",
                "Snack & Spice",
                "Fast Food",
                "Juice & Drinks",
                "Bakery",
                "Seafood",
              ].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          {/* Company */}
          <div className="footer-section">
            <h3 className="section-title">COMPANY</h3>
            <ul className="footer-list">
              {[
                "About us",
                "Delivery",
                "Legal Notice",
                "Terms & conditions",
                "Secure payment",
                "Contact us",
              ].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          {/* Account */}
          <div className="footer-section">
            <h3 className="section-title">ACCOUNT</h3>
            <ul className="footer-list">
              {[
                "Sign In",
                "View Cart",
                "Return Policy",
                "Become a Vendor",
                "Affiliate Program",
                "Payments",
              ].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          {/* Contact */}
          <div className="footer-section">
            <h3 className="section-title">CONTACT</h3>
            <div className="footer-list">
              <p className="contact-item">
                <MapPin size={18} className="contact-icon" /> 2548 Broaddus
                Maple Court, Madisonville KY 4783, USA.
              </p>
              <p className="contact-item">
                <Phone size={18} className="contact-icon" /> +00 9876543210
              </p>
              <p className="contact-item">
                <Mail size={18} className="contact-icon" /> example@email.com
              </p>
            </div>
            {/* Social Media Icons */}
            <div className="social-media">
              <Instagram size={24} className="social-icon" />
              <Twitter size={24} className="social-icon" />
              <Facebook size={24} className="social-icon" />
              <Linkedin size={24} className="social-icon" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
