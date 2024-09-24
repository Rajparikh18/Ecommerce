import React, { useEffect, useState } from 'react';
import { Search, User, ShoppingCart } from 'lucide-react';
import './Header.css';
import Cookies from 'js-cookie';
import axios from 'axios';
import Cart from './Cart';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const [raj, setRaj] = useState(false); // Initially assume not logged in
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false); // Profile menu state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [username, setUsername] = useState("");
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

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
        if(response){
          setResults(response.data);
        }
        console.log(results);
    }
    //  else {
    //     setResults([]);
    // }
}, 1000);

  const gotoproduct= (id)=>{
      navigate(`/product/${id}`);
  }

  const search=document.querySelector('results-dropdown');
  window.addEventListener("click",(e)=>{
    if(e.target !=search && results.length>0){
      setResults([]);
    }
  })

  // Check if cart should be opened after reload
  useEffect(() => {
    if (localStorage.getItem('openCartAfterReload') === 'true') {
      setIsCartOpen(true);
      localStorage.removeItem('openCartAfterReload');
    }
  }, []);

  // Check login status on component mount
  useEffect(() => {
    if (Cookies.get('username')) {
      setRaj(true);
    } else {
      setRaj(false);
    }
  }, []);

  useEffect(() => {
    if (Cookies.get('username')) {
      setUsername(Cookies.get('username'));
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

    // Add event listener for cart updates
    window.addEventListener('cartUpdated', updateCartStatus);

    // Clean up the event listener
    return () => {
      window.removeEventListener('cartUpdated', updateCartStatus);
    };
  }, []);

  // Logout function
  const logClick = async () => {
    if (Cookies.get('username')) {
      await axios.post('/api/logout');
      Cookies.remove('username');
      setRaj(false); // Set logged out state
      setIsProfileMenuOpen(false); // Close profile menu after logging out
      window.location.reload();
      navigate('/');
    } else {
      navigate('/authpage'); // Redirect to login page
    }
  };

  // Toggle profile menu visibility
  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  // Check for login and toggle profile menu
  const checkforlogin = () => {
    if (!raj) {
      navigate('/authpage'); // Redirect to login if not logged in
    } else {
      // Toggle profile menu if logged in
      setIsProfileMenuOpen((prevState) => !prevState);
    }
  };

  // Cart refresh method
  const cartrefresh = () => {
    localStorage.setItem('openCartAfterReload', 'true'); // Set flag to open cart after reload
    window.location.reload(); // Refresh the page
  };

  return (
    <header className="header">
      <div className="top-row">
        <i className="logo">Masterkart</i>
        <div className="mobile-actions">
          <button className="mobile-action-btn" onClick={logClick}>
            <User size={24} />
          </button>
          <button onClick={cartrefresh} className="nav-item cartbtn">
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="cart-count">{cartCount}</span>
            )}
          </button>
          <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </div>
      </div>
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
  {results.length > 0 && (
    <div className="results-dropdown">
      <ul>
        {results.map((product) => (
          <li key={product._id} onClick={()=>gotoproduct(product._id)}>{product.productName}</li>
        ))}
      </ul>
    </div>
  )}
</div>
      <div className="nav-items">
        {/* Profile Menu */}
        <div className="nav-item profile" onClick={checkforlogin}>
          <User size={24} />
          <div className="nav-text">
            <span className="login-text" >
              {raj ? `${username}` : 'Login'} 
            </span>
            {/* Toggle visibility of clickProfile based on state */}
            {isProfileMenuOpen && (
              <div className="clickProfile">
                <p className="yourprofile">Your Profile</p>
                <p onClick={logClick} className="logout">
                  Log Out
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="nav-text">
        <button onClick={cartrefresh} className="nav-item cartbtn">
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <div className="cart-count">{cartCount}</div>
            )}
          </button>
          <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </div>
      </div>
    </header>
  );
};

export default Header;
