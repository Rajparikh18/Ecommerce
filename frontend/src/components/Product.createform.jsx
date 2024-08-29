import React, { useState } from 'react';
import './Product.createform.css';
import axios from 'axios';

const ProductForm = () => {
  const [product, setProduct] = useState({
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        const response=await axios.post('/api/create', product);
        console.log(response);
        if (response.status === 201) {
          alert('Product created successfully!');
          setProduct({
            productName: '',
            price: [],
            characs: [],
            description: '',
            weight: [],
            category: ''
          });
        } else {
          alert('Failed to create product. Please try again.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
      }
  };

  return (
    <div className="product-form-container">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
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