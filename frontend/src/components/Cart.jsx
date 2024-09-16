import React, { useState } from 'react';
import image1 from '../assets/slider1.jpg';
import image2 from '../assets/images/demoimage.jpeg';
import './Cart.css';
import { X, Minus, Plus, ShoppingCart } from 'lucide-react';
import Cookies from 'js-cookie';


const CartItem = ({ item, updateQuantity, removeItem }) =>(

  <div className="cart-item">
    <img src={item.imageUrl} alt={item.title} className="item-image" />
    <div className="item-details">
      <h3 className="item-name">{item.title}</h3>
      <p className="item-price"> &#8377;{item.price} x {item.qty} {item.unit}</p>
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

  if(Cookies.get('cart')){
    const [items, setItems] = useState(JSON.parse(Cookies.get('cart')) || []);
    const updateQuantity = (id, newQuantity) => {
      setItems(items.map(item => 
        item.id === id ? {qty: Math.max(newQuantity, 0) } : item
      ));
    };
    

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const vat = subtotal * 0.2;
  const total = subtotal + vat;

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
            <span>Sub-Total:</span>
            <span> &#8377;{subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>VAT (20%):</span>
            <span> &#8377;{vat.toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span> &#8377;{total.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="cart-buttons">
          <button className="view-cart-button">VIEW CART</button>
          <button className="checkout-button">CHECKOUT</button>
        </div>
      </div>
    </div>
  );
};
}
export default Cart;