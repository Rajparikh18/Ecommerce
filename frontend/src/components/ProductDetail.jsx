import React, { useState } from 'react';
import { Edit,Trash2 } from 'lucide-react';
import './ProductDetail.css';
import Cookies from 'js-cookie';
import { redirect, useNavigate } from 'react-router-dom';
import axios from 'axios';

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
  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  const navigate = useNavigate();
  async function Editbtn(e){
    e.stopPropagation();
    navigate(`/update/${id}`);
  }
  async function deletebtn(e){
    e.stopPropagation();
    const deleteproduct= await axios.delete(`/api/admin/delete/${id}`);
    if(deleteproduct.status===200){
      navigate(`/`);
    }
  }
  function addToCart(e, product) {
    if(availability===false){
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

    // Dispatch a custom event to notify Header component
    window.dispatchEvent(new Event("cartUpdated"));
  }
  const product = {
    id: id,
    title: productName,
    imageUrl: image,
    price ,
    qty: quantity,
  };
  return (
    <div className="product-page">
        <div className="product-image">
          <img src={image} alt={productName} />
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
          <h3 className='Quantity'>1 Quantity equals {fixedqty} packets</h3>
          <p className={availability?("available"):("notavailable")}>{availability? ('In Stock'):("Out of Stock")}</p>
        <div className='add-to-cart'>
          <div className="quantity-selector">
            <button onClick={decrementQuantity}>-</button>
            <input 
              type="number" 
              value={quantity} 
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            />
            <button onClick={incrementQuantity}>+</button>
          </div>
         {!verify && (<button  className={availability? ("cart-button1 "):("cart-button1 out-of-stock1")} onClick={(e) => addToCart(e, product)}>ADD TO CART</button>)}
          {verify && (
          <div className="adminbtncart1">
            <button className="updatebtn1" onClick={(e)=>Editbtn(e)}><Edit/></button>
            <button className="deletebtn1" onClick={(e)=>deletebtn(e)}><Trash2/></button>
          </div>
        )}
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;