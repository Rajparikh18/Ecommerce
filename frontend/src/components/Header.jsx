import React, { useEffect } from 'react';
import { useState } from 'react';
import { Search, User, ShoppingCart, Link } from 'lucide-react';
import './Header.css';
import Cookies from 'js-cookie';
import axios from 'axios';
import Cart from './Cart';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const [raj, setRaj] = useState('');
  useEffect(() => {
    if(Cookies.get('hegsgeerjyhweffyw')){
      setRaj(true)
    }else{
      setRaj(false)
    }} , [raj]);
  const logClick = async() =>{ 
    if(Cookies.get('hegsgeerjyhweffyw')){
      Cookies.remove('hegsgeerjyhweffyw');
      setRaj(false)
      await axios.post("/api/logout",(req,res)=>{
      navigate('/home');
    })}else{
      navigate('/authpage')
    }
    
  };
  const [isCartOpen, setIsCartOpen] = useState(false);
  return (
    <header className="header">
      <div className="top-row">
        <i className="logo">Masterkart</i>
        <div className="mobile-actions">
          <button className="mobile-action-btn" onClick={logClick}>
            <User size={24} />
          </button>
            <button onClick={() => setIsCartOpen(true)} className="nav-item">
              <ShoppingCart size={24} />
            </button>
            <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </div>
      </div>
      <div className="search-container">
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
        <div className="nav-item" onClick={logClick}>
          <User size={24} />
          <div className="nav-text" >
            <span className="login-text">{raj ?"Logout" : "Login"}</span>
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
}
export default Header;