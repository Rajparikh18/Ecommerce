import React, { useState } from 'react';
import { Heart, Eye } from 'lucide-react';
import './ProductDetail.css';
import Cookies from 'js-cookie';

const ProductDetail = ({
  productName,
  price,
  description,
  id,
  Fixedqty=12,
  mainImage,
  characs,
  availability=true,
}) => {
  const [quantity, setQuantity] = useState(1);
  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  
  function addToCart(e, product) {
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

    // Dispatch a custom event to notify Header component
    window.dispatchEvent(new Event("cartUpdated"));
  }
  const product = {
    id: id,
    title: productName,
    imageUrl: mainImage,
    price ,
    qty: quantity,
  };
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
          <h3>1 Quantity equals {Fixedqty} packets</h3><br />
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
          <button className="cart-button" onClick={(e) => addToCart(e, product)}>ADD TO CART</button>
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;