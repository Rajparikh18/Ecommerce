import React, { useEffect, useState } from 'react';
import { Search, User, ShoppingCart, Menu,Edit,Trash2 } from 'lucide-react';
import Cookies from 'js-cookie';
import axios from 'axios';
import Cart from './Cart';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import DeleteProduct from './adminDeleteProduct';
export default function Header(isAdmin ) {
  const navigate = useNavigate();
  const [raj, setRaj] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [username, setUsername] = useState("");
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [deletePopup, setDeletePopup] = useState(false);
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
  const deleteBtn = (e,id) => {
    e.stopPropagation();
    setDeletePopup(true);
  };
  
  const Editbtn = (id, e) => {
    e.stopPropagation();
    navigate(`/update/${id}`);
  };
  const gotoMyorders = (name) => {
    if (!name) {
      return navigate('/authpage');
    }
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
    <header className="header66 header-container">
        <div className="logo-section">
          <p className="logo">APARNA DISTRIBUTORS</p>
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
                  {product.productName}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {isAdmin.isAdmin.isAdmin && (
                    <>
                      <button 
                        className="edit-btn11" 
                        onClick={(e) => Editbtn(product._id, e)}
                      >
                        <Edit size={16} />
                      </button>&nbsp;&nbsp;
                      <button 
                        className="delete-btn11" 
                        onClick={(e) => deleteBtn( e,product._id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                   {deletePopup && (
            <DeleteProduct 
              productName={product.productName} 
              id={product._id} 
              onClose={() => setDeletePopup(false)} 
            />
          )}
                </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <nav className={`nav-section ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
        {isAdmin.isAdmin.isAdmin ? (
  <button onClick={gotoTodaysorders} className="nav-button">Today's Orders</button>
) : (
  <button onClick={() => gotoMyorders(username)} className="nav-button">My Orders</button>
)}

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