import React, { useState } from 'react';
import { Edit, Trash2, Minus, Plus, ShoppingCart } from 'lucide-react';
import './ProductDetail.css';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { set } from 'date-fns';
import DeleteProduct from './adminDeleteProduct';

const ProductDetail = ({
  verify,
  productName,
  price,
  description,
  id,
  fixedqty,
  image,
  characs,
  availability,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [deletePopup, setDeletePopup] = useState(false);
  const navigate = useNavigate();

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  async function Editbtn(e) {
    e.stopPropagation();
    navigate(`/update/${id}`);
  }

  async function deletebtn(e) {
    e.stopPropagation();
    setDeletePopup(true);
    }

  function addToCart(e, product) {
    if (availability === false) {
      return;
    }
    if (!Cookies.get("cart")) {
      Cookies.set("cart", JSON.stringify([product]), { expires: 7 });
      return;
    }
    let cartArr = JSON.parse(Cookies.get("cart")) || [];
    const existingProduct = cartArr.find((p) => p.id === product.id);
    if (existingProduct) {
      existingProduct.qty += quantity;
    } else {
      cartArr.push(product);
    }
    Cookies.set("cart", JSON.stringify(cartArr), { expires: 7 });
    Cookies.set("CartbtnStatusClicked", "true", { expires: 7 });

    window.dispatchEvent(new Event("cartUpdated"));
  }

  const product = {
    id: id,
    title: productName,
    imageUrl: image,
    price,
    qty: quantity,
  };

  return (
    <div className="pd-container">
      {deletePopup && (
            <DeleteProduct 
              productName={productName} 
              id={id} 
              onClose={() => setDeletePopup(false)} 
            />
          )}
      <div className="pd-image-wrapper">
        <img className="pd-image" src={image} alt={productName} />
      </div>
      <div className="pd-info">
        <h1 className="pd-title">{productName}</h1>
        <div className="pd-price-info">
          <span className="pd-current-price">₹{price[0]}</span>
          <span className="pd-discount">-{Math.round(((price[1] - price[0]) / price[1]) * 100)}%</span>
          <p className="pd-original-price">M.R.P.: <span>₹{price[1]}</span></p>
        </div>
        <p className="pd-description">{description}</p>
        <ul className="pd-features">
          {characs.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
        <p className="pd-quantity-info">1 Quantity equals {fixedqty} packets</p>
        <p className={`pd-availability ${availability ? "pd-in-stock" : "pd-out-of-stock"}`}>
          {availability ? 'In Stock' : 'Out of Stock'}
        </p>
        <div className="pd-add-to-cart">
          <div className="pd-quantity-selector">
            <button className="pd-quantity-btn" onClick={decrementQuantity}><Minus size={16} /></button>
            <input
              className="pd-quantity-input"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            />
            <button className="pd-quantity-btn" onClick={incrementQuantity}><Plus size={16} /></button>
          </div>
          {!verify && (
            <button
              className={`pd-cart-button ${!availability && "pd-cart-button-disabled"}`}
              onClick={(e) => addToCart(e, product)}
              disabled={!availability}
            >
              <ShoppingCart size={20} />
              ADD TO CART
            </button>
          )}
          {verify && (
            <div className="pd-admin-actions">
              <button className="pd-edit-button" onClick={(e) => Editbtn(e)}><Edit size={20} /></button>
              <button className="pd-delete-button" onClick={(e) => deletebtn(e)}><Trash2 size={20} /></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ProductDetail;