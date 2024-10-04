import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown, ChevronRight, ShoppingCart, User } from "lucide-react";
import "./Navbar.css";

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleCategory = () => setIsCategoryOpen(!isCategoryOpen);

  const MobileNav = () => (
    <div className={`ecom-nav__mobile ${isMobileMenuOpen ? 'ecom-nav__mobile--open' : ''}`}>
      <button className="ecom-nav__mobile-toggle" onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      <nav className="ecom-nav__mobile-menu">
        <Link to="/" className="ecom-nav__mobile-logo" onClick={() => setIsMobileMenuOpen(false)}>
          APARNA DISTRIBUTORS
        </Link>
        <ul className="ecom-nav__mobile-list">
          <li className="ecom-nav__mobile-item">
            <Link to="/" className="ecom-nav__mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          </li>
          <li className="ecom-nav__mobile-item">
            <button className="ecom-nav__mobile-link" onClick={toggleCategory}>
              Categories <ChevronRight size={16} className={isCategoryOpen ? 'ecom-nav__mobile-icon--rotated' : ''} />
            </button>
            {isCategoryOpen && (
              <ul className="ecom-nav__mobile-sublist">
                <li className="ecom-nav__mobile-subitem">
                  <Link to="/products/Haldiram" className="ecom-nav__mobile-sublink" onClick={() => setIsMobileMenuOpen(false)}>Haldiram</Link>
                </li>
                <li className="ecom-nav__mobile-subitem">
                  <Link to="/products/G2" className="ecom-nav__mobile-sublink" onClick={() => setIsMobileMenuOpen(false)}>G2Products</Link>
                </li>
              </ul>
            )}
          </li>
          <li className="ecom-nav__mobile-item">
            <Link to="/aboutus" className="ecom-nav__mobile-link" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
          </li>
          <li className="ecom-nav__mobile-item">
            <Link to="/contactus" className="ecom-nav__mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Contact Us</Link>
          </li>
        </ul>
      </nav>
    </div>
  );

  const DesktopNav = () => (
    <nav className="ecom-nav__desktop">
        
        <ul className="ecom-nav__desktop-list">
          <li className="ecom-nav__desktop-item">
            <Link to="/" className="ecom-nav__desktop-link">Home</Link>
          </li>
          <li className="ecom-nav__desktop-item ecom-nav__desktop-item--has-dropdown">
            <button className="ecom-nav__desktop-link" onClick={toggleCategory}>
              Categories <ChevronDown size={16} />
            </button>
            {isCategoryOpen && (
              <ul className="ecom-nav__desktop-dropdown">
                <li className="ecom-nav__desktop-dropdown-item">
                  <Link to="/products/Haldiram" className="ecom-nav__desktop-dropdown-link">Haldiram</Link>
                </li>
                <li className="ecom-nav__desktop-dropdown-item">
                  <Link to="/products/G2" className="ecom-nav__desktop-dropdown-link">G2Products</Link>
                </li>
              </ul>
            )}
          </li>
          <li className="ecom-nav__desktop-item">
            <Link to="/aboutus" className="ecom-nav__desktop-link">About Us</Link>
          </li>
          <li className="ecom-nav__desktop-item">
            <Link to="/contactus" className="ecom-nav__desktop-link">Contact Us</Link>
          </li>
        </ul>
    </nav>
  );

  return (
    <>
      {isMobile ? <MobileNav /> : <DesktopNav />}
    </>
  );
}

export default Navbar;