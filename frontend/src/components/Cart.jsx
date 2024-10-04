import React, { useState, useEffect } from 'react';
import './Cart.css';
import { X, Minus, Plus } from 'lucide-react';
import Cookies from 'js-cookie';
import {useNavigate} from 'react-router-dom';

const CartItem = ({ item, updateQuantity, removeItem }) => (
  <div className="cart-item">
    <img src={item.imageUrl} alt={item.title} className="item-image" />
    <div className="item-details">
      <h3 className="item-name">{item.title}</h3>
      <p className="item-price">
      <span className="current-price1">&#8377;{item.price[0]} x {item.qty} {item.unit}</span>
        <span className="original-price1">&#8377;{item.price[1]}</span>
      </p>
    </div>
    <div className="quantity-controls">
      <button onClick={() => updateQuantity(item.id, item.qty - 1)} className="quantity-button">
        <Minus size={16} />
      </button>
      <span className="quantity">{item.qty}</span>
      <button onClick={() => updateQuantity(item.id, item.qty + 1)} className="quantity-button">
        <Plus size={16} />
      </button>
    </div>
    <button onClick={() => removeItem(item.id)} className="remove-button">
      <X size={20} />
    </button>
  </div>
);
const Cart = ({ isOpen, onClose }) => {
  
const navigate=useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Load the cart from cookies on mount
    if (Cookies.get('cart')) {
      setItems(JSON.parse(Cookies.get('cart')));
    }
  }, []);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(id);
    } else {
      const updatedItems = items.map(item =>
        item.id === id ? { ...item, qty: newQuantity } : item
      );
      setItems(updatedItems);
      Cookies.set('cart', JSON.stringify(updatedItems)); // Update cookie
      dispatchCartUpdate(); // Notify other components
    }
  };

  const removeItem = (id) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
    Cookies.set('cart', JSON.stringify(updatedItems)); // Update cookie
    dispatchCartUpdate(); // Notify other components
  };
  const handleCheckout = () => {
    navigate('/checkout');
  };

  const dispatchCartUpdate = () => {
    // Custom event to signal cart update to other parts of the app
    const event = new Event('cartUpdated');
    window.dispatchEvent(event);
  };

  const subtotalOriginal = items.reduce((sum, item) => sum + item.price[1] * item.qty, 0);
  const subtotalDiscounted = items.reduce((sum, item) => sum + item.price[0] * item.qty, 0);
  const total = subtotalDiscounted; // Use the total of discounted prices for final total

  if (!isOpen) return null;

  return (
    <div className="cart-overlay">
      <div className="cart-container">
        <div className="cart-header">
          <h2 className="cart-title">My Cart</h2>
          <button onClick={onClose} className="close-button">
            <X size={24} />
          </button>
        </div>

        <div className="cart-items">
          {items.map(item => (
            <CartItem
              key={item.id}
              item={item}
              updateQuantity={updateQuantity}
              removeItem={removeItem}
            />
          ))}
        </div>

        <div className="cart-summary">
          <div className="summary-row">
            <span>Sub-Total (Original):</span>
            <span>&#8377;{subtotalOriginal}</span>
          </div>
          <div className="summary-row">
            <span>Sub-Total (Discounted):</span>
            <span>&#8377;{subtotalDiscounted}</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>&#8377;{total.toFixed(2)}</span>
          </div>
        </div>

        <div className="cart-buttons">
          <button className="view-cart-button">VIEW CART</button>
          <button className="checkout-button" onClick={handleCheckout}>CHECKOUT</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
