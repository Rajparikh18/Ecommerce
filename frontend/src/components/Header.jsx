import React from 'react';
import { Search, User, ShoppingCart } from 'lucide-react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="top-row">
        <i className="logo">Masterkart</i>
        <div className="mobile-actions">
          <button className="mobile-action-btn">
            <User size={24} />
          </button>
          <button className="mobile-action-btn">
            <ShoppingCart size={24} />
          </button>
        </div>
      </div>
      <div className="search-container">
        <select className="category-select"> 
          <option>Category</option>
        </select>
        <input 
          type="text" 
          placeholder="Search Products..." 
          className="search-input"
        />
        <button className="search-button">
          <Search size={20} />
        </button>
      </div>
      <div className="nav-items">
        <div className="nav-item">
          <User size={24} />
          <div className="nav-text">
            <span>Account</span>
            <span className="login-text">LOGIN</span>
          </div>
        </div>
        <div className="nav-item">
          <ShoppingCart size={24} />
          <div className="nav-text">
            <span>Cart</span>
            <span>3-ITEMS</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;