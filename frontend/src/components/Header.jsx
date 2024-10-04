import React, { useEffect, useState } from 'react';
import { Search, User, ShoppingCart, Menu } from 'lucide-react';
import Cookies from 'js-cookie';
import axios from 'axios';
import Cart from './Cart';
import { useNavigate } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const navigate = useNavigate();
  const [raj, setRaj] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [username, setUsername] = useState("");
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  const handleSearch = debounce(async (event) => {
    const value = event.target.value;
    setQuery(value);

    if (value) {
      const response = await axios.get(`/api/products/search?query=${value}`);
      if (response) {
        setResults(response.data);
      }
    } else {
      setResults([]);
    }
  }, 300);

  const gotoproduct = (id) => {
    navigate(`/product/${id}`);
    setResults([]);
  }

  const gotoMyorders = (name) => {
    navigate(`/${name}/myorders`);
    setIsMobileMenuOpen(false);
  }

  const gotoTodaysorders = () => {
    navigate("/todayorders");
    setIsMobileMenuOpen(false);
  }

  useEffect(() => {
    if (localStorage.getItem('openCartAfterReload') === 'true') {
      setIsCartOpen(true);
      localStorage.removeItem('openCartAfterReload');
    }
  }, []);

  useEffect(() => {
    if (Cookies.get('username')) {
      setRaj(true);
      setUsername(Cookies.get('username'));
    } else {
      setRaj(false);
    }
  }, []);

  const updateCartStatus = () => {
    if (Cookies.get('cart')) {
      const cartArr = JSON.parse(Cookies.get('cart'));
      const totalQty = cartArr.reduce((total, item) => total + item.qty, 0);
      setCartCount(totalQty);
    }
  };

  useEffect(() => {
    updateCartStatus();
    window.addEventListener('cartUpdated', updateCartStatus);
    return () => {
      window.removeEventListener('cartUpdated', updateCartStatus);
    };
  }, []);

  const logClick = async () => {
    if (Cookies.get('username')) {
      await axios.post('/api/logout');
      Cookies.remove('username');
      setRaj(false);
      setIsProfileMenuOpen(false);
      window.location.reload();
      navigate('/');
    } else {
      navigate('/authpage');
    }
    setIsMobileMenuOpen(false);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const checkforlogin = () => {
    if (!raj) {
      navigate('/authpage');
    } else {
      toggleProfileMenu();
    }
    setIsMobileMenuOpen(false);
  };

  const cartrefresh = () => {
    localStorage.setItem('openCartAfterReload', 'true');
    window.location.reload();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="header header-container">
        <div className="logo-section">
          <h1 className="logo">APARNA DISTRIBUTORS</h1>
          <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
            <Menu size={24} />
          </button>
        </div>
        <div className="search-section">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search Products..."
              className="search-input"
              onChange={handleSearch}
            />
            <button className="search-button">
              <Search size={20} />
            </button>
          </div>
          {results.length > 0 && (
            <div className="search-results">
              <ul>
                {results.map((product) => (
                  <li key={product._id} onClick={() => gotoproduct(product._id)}>
                    {product.productName}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <nav className={`nav-section ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
          <button onClick={() => gotoMyorders(username)} className="nav-button">My Orders</button>
          <button onClick={gotoTodaysorders} className="nav-button">Today's Orders</button>
          <div className="profile-section">
            <button onClick={checkforlogin} className="profile-button">
              <User size={24} />
              <span>{raj ? username : 'Login'}</span>
            </button>
            {isProfileMenuOpen && (
              <div className="profile-menu">
                <a href="#" className="profile-menu-item">Your Profile</a>
                <a href="#" onClick={logClick} className="profile-menu-item">Log Out</a>
              </div>
            )}
          </div>
          <button onClick={cartrefresh} className="cart-button">
            <ShoppingCart size={24} />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </button>
        </nav>
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}