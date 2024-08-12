import React from 'react';
import { useState } from 'react';
import { Search, User, ShoppingCart } from 'lucide-react';
import './Header.css';
import Cart from './Cart';

const Header = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  return (
    <header className="header">
      <div className="top-row">
        <i className="logo">Masterkart</i>
        <div className="mobile-actions">
          <button className="mobile-action-btn">
            <User size={24} />
          </button>
            <button onClick={() => setIsCartOpen(true)} className="nav-item">
              <ShoppingCart size={24} />
            </button>
            <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
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
          <div className="nav-text">
            <button onClick={() => setIsCartOpen(true)} className="nav-item cartbtn">
              <ShoppingCart size={24} />
            </button>
            <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
          </div>
      </div>
    </header>
  );
};

export default Header;