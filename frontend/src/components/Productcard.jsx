import React from 'react';
import './Productcard.css';
import { useNavigate } from 'react-router-dom';


const ProductCard = ({ imageUrl, title,description, currentPrice, originalPrice,id }) => {
  const navigate = useNavigate();
  const handleclick=()=>{
    navigate(`/product/${id}`);
  }

  return (
    <div className="product-card" onClick={handleclick}>
      <div className="image-container">
        <img src={imageUrl} alt={title} className="product-image" />
      </div>
      <div className='info-cart'>
      <div className="product-info">
        <h2 className="product-title">{title}</h2>
        <p>{description}</p>

        <div className="price-container">
          <span className="current-price">&#8377;{currentPrice}</span>
          {originalPrice && (
            <span className="original-price">&#8377;{originalPrice}</span>
          )}
        </div>
      </div>
      <div className='btncart'>
      <button className='addtocart'>Add to cart</button>
      </div>    
      </div>
    </div>
  );
};

export default ProductCard;
