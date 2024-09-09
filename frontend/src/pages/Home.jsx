import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Slider from '../components/Slider';
import image1 from '../assets/slider1.jpg';
import image2 from '../assets/slider2.png';
import image3 from '../assets/slider3.jpg';
import image4 from '../assets/slider4.png';
import './Home.css';
import '../App.css';
import ProductCard from '../components/Productcard';
import demoimage from "../assets/images/demoimage.jpeg";
import axios from 'axios';

const slides = [
    { mainImage: image1 },
    { mainImage: image2 },
    { mainImage: image3 },
    { mainImage: image4 },
];

function Home() {
  const [products, setProducts] = useState([]); // Combined product list from both categories

  // Function to fetch products by category
  const getProductsByCategory = async (category) => {
    try {
      const response = await axios.get(`/api/admin/getbycategory/${category}`);
      const productData = response.data.data;
      // Ensure the response is an array, otherwise return an empty array
      if (Array.isArray(productData)) {
        return productData.slice(0, 10); // Return only 10 products
      } else {
        return []; // In case of any issue, return an empty array
      }
    } catch (error) {
      console.log("Error fetching product data: ", error);
      return []; // Return an empty array in case of error
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch 10 products from "Haldiram"
        const haldiramProducts = await getProductsByCategory("Haldiram");
        // Fetch 10 products from "G2"
        const g2Products = await getProductsByCategory("G2");

        // Combine both product arrays
        const allProducts = [...haldiramProducts, ...g2Products];
        setProducts(allProducts); // Update the state with combined products
      } catch (error) {
        console.log("Error fetching products: ", error);
      }
    };
    fetchProducts(); // Call the async function to fetch the products
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, []);
  return (
    <>
      <Header />
      <Navbar />
      <Slider slides={slides} />
      <br />
      <div className='allcards'>
        {
          products.length > 0 ? products.map((product, index) => (
            <React.Fragment key={index}>
              <ProductCard
                imageUrl={demoimage} // Use the correct image path if dynamic
                title={product.productName}
                description={product.description}
                currentPrice={product.price[0]}
                originalPrice={product.price[1]}
              />
            </React.Fragment>
          )) : <p>No products available</p>
        }
      </div>
      <br />
      <Footer />
    </>
  );
}

export default Home;
