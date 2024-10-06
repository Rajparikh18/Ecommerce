import React, { useState, useEffect } from "react";
import "./Product.createform.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ToggleLeft, ToggleRight } from "lucide-react";
import AlertSuccessMessage from "./alertSuccess";

const EditProductForm = () => {
  const [imgStatus, setImgStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [productData, setProductData] = useState(null);
  const [product, setProduct] = useState({
    productImage: null,
    productName: "",
    price: [0, 0],
    characs: [""],
    description: "",
    fixedqty: 0,
    category: "",
    availability: true,
  });

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/admin/getbyid/${id}`);
        setProductData(response.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (productData) {
      setProduct({
        productImage: null,
        productName: productData.productName,
        price: [productData.price[0], productData.price[1]],
        characs: [productData.characs[0]],
        description: productData.description,
        fixedqty: productData.fixedqty,
        category: productData.category,
        availability: productData.availability,
      });
    }
  }, [productData]);

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
    setProduct({
      ...product,
      [field]: value.split(",").map((item) => item.trim()),
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProduct({ ...product, productImage: file });
    setImgStatus(true);
  };

  const toggleAvailability = () => {
    setProduct({ ...product, availability: !product.availability });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      let data;
      let headers = {};

      if (imgStatus) {
        data = new FormData();
        if (product.productImage) {
          data.append("productImage", product.productImage);
        }
        data.append("productName", product.productName);
        data.append("price", JSON.stringify(product.price));
        data.append("characs", JSON.stringify(product.characs));
        data.append("description", product.description);
        data.append("fixedqty", product.fixedqty);
        data.append("category", product.category);
        data.append("availability", product.availability);
      } else {
        data = {
          productName: product.productName,
          price: product.price,
          characs: product.characs,
          description: product.description,
          fixedqty: product.fixedqty,
          category: product.category,
          availability: product.availability,
        };
        headers["Content-Type"] = "application/json";
      }

      const response = await axios.put(`/api/admin/update/${id}/${imgStatus}`, data, { headers });
      if (response.status === 200) {
        // Navigate to home with flash message
        navigate("/", { state: { message: response.data.message } });
      } else {
        console.error("Error submitting form");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-form-container">
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="productImage">Product Image:</label>
          <input
            type="file"
            id="productImage"
            name="productImage"
            onChange={handleFileChange}
            accept="image/*"
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
          <div className="category">
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
          <div className="availability">
            <label htmlFor="availability">Availability:</label>
            <button
              type="button"
              id="availability"
              className={`availability-toggle ${
                product.availability ? "active" : "inactive"
              }`}
              onClick={toggleAvailability}
            >
              {product.availability ? <ToggleRight /> : <ToggleLeft />}
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
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProductForm;
