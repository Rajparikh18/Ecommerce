import React from "react";
import "./Productcard.css";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Edit, Trash2 } from "lucide-react";
import axios from "axios";

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

  const handleclick = () => {
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

  const deletebtn = async (e) => {
    e.stopPropagation();
    const deleteproduct = await axios.delete(`/api/admin/delete/${id}`);
    if (deleteproduct) {
      window.location.reload();
    }
  };

  const Editbtn = (e) => {
    e.stopPropagation();
    navigate(`/update/${id}`);
  };

  return (
    <div 
      className={`product-card ${!availability ? 'out-of-stock' : ''}`} 
      onClick={handleclick}
    >
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
              <button className="edit-btn" onClick={Editbtn}>
                <Edit size={16} />
                Edit
              </button>
              <button className="delete-btn" onClick={deletebtn}>
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