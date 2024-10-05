import React, { useState } from "react";
import "./Productcard.css";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Edit, Trash2 } from "lucide-react";
import DeleteProduct from "./adminDeleteProduct.jsx";

const ProductCard = ({
  verify,
  imageUrl,
  title,
  description,
  currentPrice,
  originalPrice,
  availability,
  id,
}) => {
  const navigate = useNavigate();
  const [deletePopup, setDeletePopup] = useState(false);

  const handleClick = () => {
    navigate(`/product/${id}`);
  };

  const addToCart = (e) => {
    e.stopPropagation();
    if (!availability) {
      return;
    }
    const product = {
      id,
      title,
      imageUrl,
      price: [currentPrice, originalPrice],
      availability,
      qty: 1,
    };
    let cartArr = JSON.parse(Cookies.get("cart") || "[]");
    const existingProduct = cartArr.find((p) => p.id === product.id);
    if (existingProduct) {
      existingProduct.qty += 1;
    } else {
      cartArr.push(product);
    }
    Cookies.set("cart", JSON.stringify(cartArr), { expires: 7 });
    Cookies.set("CartbtnStatusClicked", "true", { expires: 7 });
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const deleteBtn = (e) => {
    e.stopPropagation();
    setDeletePopup(true);
  };

  const editBtn = (e) => {
    e.stopPropagation();
    navigate(`/update/${id}`);
  };

  return (
    <div 
      className={`product-card ${!availability ? 'out-of-stock' : ''}`} 
      onClick={handleClick}
    >
      {deletePopup && (
            <DeleteProduct 
              productName={title} 
              id={id} 
              onClose={() => setDeletePopup(false)} 
            />
          )}
      <div className="image-container">
        <img src={imageUrl} alt={title} className="product-image1" />
        {!availability && <span className="out-of-stock-label">Out of Stock</span>}
      </div>
      <div className="product-details">
        <h2 className="product-title">{title}</h2>
        <p className="product-description">{description}</p>
        <div className="price-container">
          <span className="current-price">₹{currentPrice}</span>
          {originalPrice && (
            <span className="original-price">₹{originalPrice}</span>
          )}
        </div>
        <div className="action-buttons">
          {!verify && (
            <button 
              className="add-to-cart-btn" 
              onClick={addToCart}
              disabled={!availability}
            >
              Add to cart
            </button>
          )}
          {verify && (
            <>
              <button className="edit-btn" onClick={editBtn}>
                <Edit size={16} />
                Edit
              </button>
              <button className="delete-btn" onClick={deleteBtn}>
                <Trash2 size={16} />
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;