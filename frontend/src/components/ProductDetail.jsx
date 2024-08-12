import React, { useState } from 'react';
import { Heart, Eye } from 'lucide-react';
import './ProductDetail.css';

const ProductPage = ({
  title,
  ratings,
  numRatings,
  price,
  discount,
  originalPrice,
  description,
  features,
  weightOptions,
  mainImage,
  thumbnails
}) => {
  const [quantity, setQuantity] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState(weightOptions[0]);

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="product-page">
        <div className="product-image">
          <img src={mainImage} alt={title} />
        </div>
      <div className="product-info">
        <h1>{title}</h1>
        <div className="ratings">
          <div className="stars">
            {"★★★★☆".slice(0, ratings)}
            {"☆☆☆☆☆".slice(ratings)}
          </div>
          <span>{numRatings} Ratings</span>
        </div>
        
        <div className="price-info">
          <span className="current-price">${price.toFixed(2)}</span>
          <span className="discount">-{discount}%</span>
          <p className="original-price">M.R.P.: <span>${originalPrice.toFixed(2)}</span></p>
        </div>
        
        <p className="description">{description}</p>
        
        <ul className="features">
          {features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
        
        <div className="weight-selection">
          <h3>WEIGHT</h3><br />
          <div className="weight-options">
            {weightOptions.map((weight) => (
              <button 
                key={weight}
                onClick={() => setSelectedWeight(weight)}
                className={selectedWeight === weight ? 'selected' : ''}
              >
                {weight}
              </button>
            ))}
          </div>
        </div>
        <br /><br />
        <div className="add-to-cart">
          <div className="quantity-selector">
            <button onClick={decrementQuantity}>-</button>
            <input 
              type="number" 
              value={quantity} 
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            />
            <button onClick={incrementQuantity}>+</button>
          </div>
          <button className="cart-button">ADD TO CART</button>
        </div>

      </div>
    </div>
  );
};

export default ProductPage;