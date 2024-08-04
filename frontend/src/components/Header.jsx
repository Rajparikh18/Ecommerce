import React from 'react';
import { Search, User, Heart, ShoppingCart } from 'lucide-react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
        <i>Masterkart</i>
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
          <div className="nav-text">
            <span>Account</span>
            <span className="login-text">LOGIN</span>
          </div>
        </div>
        <div className="nav-item">
          <Heart size={24} />
          <div className="nav-text">
            <span>Wishlist</span>
            <span>3-ITEMS</span>
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