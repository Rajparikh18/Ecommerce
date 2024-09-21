import React from 'react';
import './Productcard.css';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Cookie } from 'lucide-react';


const ProductCard = ({ imageUrl, title,description, currentPrice, originalPrice,id }) => {
  const navigate = useNavigate();
  const handleclick=()=>{
    navigate(`/product/${id}`);
  }
  function addToCart(e,product) {
    e.stopPropagation();
    if(!Cookies.get('cart')){
      Cookies.set('cart', JSON.stringify([product]), { expires: 7 });
      return;
    }
    let cartArr = JSON.parse(Cookies.get('cart')) || [];
    const existingProduct = cartArr.find((p) => p.id === product.id);
    if (existingProduct) {
      existingProduct.qty += 1;
    }else{
      cartArr.push(product);
    }
    Cookies.set('cart', JSON.stringify(cartArr), { expires: 7 });
    Cookies.set('CartbtnStatusClicked', 'true', { expires: 7 });
    
    // Dispatch a custom event to notify Header component
    window.dispatchEvent(new Event('cartUpdated'));
}
const product = {
  id,
  title,
  imageUrl,
  price:currentPrice,
  qty: 1,
};

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
      <div className='btncart' onClick={(e)=>addToCart(e,product)}>
      <button className='addtocart'>Add to cart</button>
      </div>    
      </div>
    </div>
  );
};

export default ProductCard;
