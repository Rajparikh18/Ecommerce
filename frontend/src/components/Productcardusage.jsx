import React from 'react';
import './Productcard.css'
import ProductCard from './Productcard';
import demoimage from "../assets/images/demoimage.jpeg"

const ProductCardUsage = () => {
  const productData = {
    imageUrl:demoimage,
    title: "Haldiram's",
    description:"best bhujia due to a best website",
    currentPrice: 49.00,
    originalPrice: 65.00
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0' }}>
      <ProductCard {...productData} />
    </div>
  );
};

export default ProductCardUsage;