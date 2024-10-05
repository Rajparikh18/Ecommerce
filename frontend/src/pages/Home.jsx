import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import Footer from '../components/Footer';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Slider from '../components/Slider';
import image1 from '../assets/slider1.jpg';
import image2 from '../assets/slider2.png';
import image3 from '../assets/slider3.jpg';
import image4 from '../assets/slider4.png';
import MorphingLoader from '../components/MorphingLoader';
import './Home.css';
import '../App.css';
import ProductCard from '../components/Productcard';
import axios from 'axios';
import AlertSuccessMessage from '../components/alertSuccess.jsx'; // Import your flash message component

const slides = [
  { mainImage: image1 },
  { mainImage: image2 },
  { mainImage: image3 },
  { mainImage: image4 },
];

const Home = ( isAdmin ) => {
  const [products, setProducts] = useState([]); // Combined product list from both categories
  const [flashMessage, setFlashMessage] = useState(null); // To handle the flash message
  const navigate = useNavigate();
  const location = useLocation();

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
      console.log('Error fetching product data: ', error);
      return []; // Return an empty array in case of error
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const haldiramProducts = await getProductsByCategory('Haldiram');
        const g2Products = await getProductsByCategory('G2');

        const allProducts = [...haldiramProducts, ...g2Products];
        setProducts(allProducts); // Update the state with combined products
      } catch (error) {
        console.log('Error fetching products: ', error);
      }
    };
    fetchProducts(); // Call the async function to fetch the products
    window.scrollTo(0, 0); // Scroll to the top of the page

    // Check if there’s a message passed from the previous route
    if (location.state && location.state.message) {
      setFlashMessage(location.state.message);

      // Clear the flash message from history by resetting location state
      navigate('.', { replace: true, state: {} }); // Remove the state after the message is displayed
    }
  }, [location.state, navigate]);

  return (
    <>
      <Header isAdmin={isAdmin} />
      <Navbar />
      <Slider slides={slides} />
      {flashMessage && (
        <AlertSuccessMessage
          message={flashMessage}
          onClose={() => setFlashMessage(null)} // Close the flash message
        />
      )}
      <br />
      <div className='allcards'>
      {
          products.length > 0 ? products.map((product, index) => (
            <React.Fragment key={index}>
              <ProductCard 
                imageUrl={product.image} // Use the correct image path if dynamic
                title={product.productName}
                description={product.description}
                currentPrice={product.price[0]}
                originalPrice={product.price[1]}
                id={product._id}
                availability={product.availability}
                verify={isAdmin.isAdmin}
                />   
            </React.Fragment>
          )) : <MorphingLoader/>
        }
      </div>
      <br />
      <Footer />
    </>
  );
};

export default Home;
