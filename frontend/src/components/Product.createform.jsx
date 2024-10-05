import React, { useState } from 'react';
import './Product.createform.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToggleLeft, ToggleRight } from 'lucide-react';

const ProductForm = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    productImage: null,
    productName: '',
    price: [,],
    characs: [],
    description: '',
    fixedqty: '',
    category: '',
    availability: true,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handlePriceChange = (e, index) => {
    const { value } = e.target;
    const newPrice = [...product.price];
    newPrice[index] = parseFloat(value) || 0;
    setProduct({ ...product, price: newPrice });
  };

  const handleArrayInputChange = (e, field) => {
    const { value } = e.target;
    setProduct({ ...product, [field]: value.split(',').map(item => item.trim()) });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProduct({ ...product, productImage: file });
  };
  const toggleAvailability = () => {
    setProduct({ ...product, availability: !product.availability });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/api/admin/create', product, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response);
      if (response.status === 201) {
        navigate("/", { state: { message: response.data.message } })
        setProduct({
          productImage: null,
          productName: '',
          price: [0, 0],
          characs: [],
          description: '',
          fixedqty: '',
          category: '',
          availability: true
        });
      } else {
        console.error('Error submitting form');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="product-form-container">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="productImage">Product Image:</label>
          <input
            type="file"
            id="productImage"
            name="productImage"
            onChange={handleFileChange}
            accept="image/*"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="productName">Product Name:</label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={product.productName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group priceandqty">
          <div className="price1">
            <label htmlFor="price1">Our Price:</label>
            <input
              type="number"
              id="price1"
              name="price1"
              value={product.price[0]}
              onChange={(e) => handlePriceChange(e, 0)}
              required
            />
          </div>
          <div className="price2">
            <label htmlFor="price2">MRP:</label>
            <input
              type="number"
              id="price2"
              name="price2"
              value={product.price[1]}
              onChange={(e) => handlePriceChange(e, 1)}
              required
            />
          </div>
          <div className="fixedqty">
            <label htmlFor="fixedqty">Fixed Quantity:</label>
            <input
              type="number"
              min={0}
              id="fixedqty"
              name="fixedqty"
              value={product.fixedqty}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div className="form-group catgoryandavailability">
          <div className='category'>
            <label htmlFor="category">Category:</label>
          <select
            name="category"
            id="category"
            className="dropdown"
            value={product.category}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Haldiram">Haldiram</option>
            <option value="G2">G2</option>
          </select>
          </div>
          <div className='availability'>
            <label htmlFor="availability">Availability:</label>
            <button type="button" id='availability' className={`availability-toggle ${product.availability ? 'active' : 'inactive'}`} onClick={toggleAvailability}>
              {product.availability ? <ToggleRight />: <ToggleLeft /> }
            </button>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="characs">Characteristics (comma-separated):</label>
          <input
            type="text"
            id="characs"
            name="characs"
            value={product.characs.join(", ")}
            onChange={(e) => handleArrayInputChange(e, "characs")}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={product.description}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>
        <button type="submit" className="submit-button">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default ProductForm;