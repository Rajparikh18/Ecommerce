import React, { useState } from 'react';
import './Product.createform.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProductForm = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    productImage: null,
    productName: '',
    price: [],
    characs: [],
    description: '',
    weight: [],
    category: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleArrayInputChange = (e, field) => {
    const { value } = e.target;
    setProduct({ ...product, [field]: value.split(',').map(item => item.trim()) });
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProduct({ ...product, productImage: file });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        console.log(product);
        const response = await axios.post('/api/admin/create', product,{
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log(response);
        if (response.status === 201) {
          navigate("/home")
          setProduct({
            productImage: null,
            productName: '',
            price: [],
            characs: [],
            description: '',
            weight: [],
            category: ''
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
        <div className="form-group">
          <label htmlFor="price">Price (comma-separated):</label>
          <input
            type="text"
            id="price"
            name="price"
            value={product.price.join(', ')}
            onChange={(e) => handleArrayInputChange(e, 'price')}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="characs">Characteristics (comma-separated):</label>
          <input
            type="text"
            id="characs"
            name="characs"
            value={product.characs.join(', ')}
            onChange={(e) => handleArrayInputChange(e, 'characs')}
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
        <div className="form-group">
          <label htmlFor="weight">Weight (comma-separated):</label>
          <input
            type="text"
            id="weight"
            name="weight"
            value={product.weight.join(', ')}
            onChange={(e) => handleArrayInputChange(e, 'weight')}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <input
            type="text"
            id="category"
            name="category"
            value={product.category}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="submit-button">Add Product</button>
      </form>
    </div>
  );
};

export default ProductForm;