import React from 'react';
import './Productcard.css';


const ProductCard = ({ imageUrl, title,description, currentPrice, originalPrice }) => {
  return (
    <div className="product-card">
      <div className="image-container">
        <img src={imageUrl} alt={title} className="product-image" />
      </div>
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
  );
};

export default ProductCard;
