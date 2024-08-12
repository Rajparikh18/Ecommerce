import React from 'react';
import ProductDetail from '../components/ProductDetail'
import demoimage from '../assets/images/demoimage.jpeg'
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import Footer from '../components/Footer';

function ProductPage(){
    const productData = {
        title: "Crunchy Potato Chips Cheese Flavour, 1 Kg (2 x 500g) Pack.",
        ratings: 4,
        numRatings: 992,
        price: 664.00,
        discount: 78,
        originalPrice: 2999.00,
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1990.",
        features: [
          "Closure: Hook & Loop",
          "Sole: Polyvinyl Chloride",
          "Width: Medium",
          "Outer Material: A-Grade Standard Quality"
        ],
        weightOptions: ['250g', '500g', '1kg', '2kg'],
        sku: "WH12",
        inStock: true,
        mainImage: demoimage,
        thumbnails: [
          demoimage,
          demoimage,demoimage,demoimage
        ]
      };
  return (
    <div>
      <Header/>
      <Navbar/>
      <ProductDetail {...productData}/>
      <Footer/>
    </div>
  );
};

export default ProductPage;