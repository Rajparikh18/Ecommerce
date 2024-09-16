import React, { useState } from 'react';
import { Heart, Eye } from 'lucide-react';
import './ProductDetail.css';

const ProductDetail = ({
  productName,
  price,
  originalPrice,
  description,
  features,
  weight,
  mainImage,
  characs
}) => {
  const [quantity, setQuantity] = useState(0);
  const [qty,Setqty]=useState(12);
  const [availability,Setavailability]=useState(true);
  const [selectedWeight, setSelectedWeight] = useState(weight[0]);
  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="product-page">
        <div className="product-image">
          <img src={mainImage} alt={productName} />
        </div>
      <div className="product-info">
        <h1>{productName}</h1>
        {/* <div className="ratings">
          <div className="stars">
            {"★★★★☆".slice(0, ratings)}
            {"☆☆☆☆☆".slice(ratings)}
          </div>
        </div> */}
        
        <div className="price-info">
          <span className="current-price"> &#8377;{price[0]}</span> 
          <span className="discount">-{Math.round(((price[1]-price[0])/price[1])*100)}%</span>
          <p className="original-price">M.R.P.: <span> &#8377;{price[1]}</span></p>
        </div>
        
        <p className="description">{description}</p>
        
        <ul className="features">
          {characs.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
          <h3>1 Quantity equals {qty} packets</h3><br />
          <h2>Availability Yes</h2>
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

export default ProductDetail;