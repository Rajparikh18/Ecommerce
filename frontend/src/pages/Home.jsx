import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
import axios from 'axios';
import AlertSuccessMessage from '../components/alertSuccess';

const slides = [
    { mainImage: image1 },
    { mainImage: image2 },
    { mainImage: image3 },
    { mainImage: image4 },
];

const Home = ({ isAdmin }) => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const getProductsByCategory = async (category) => {
    try {
      const response = await axios.get(`/api/admin/getbycategory/${category}`);
      const productData = response.data.data;
      return Array.isArray(productData) ? productData.slice(0, 10) : [];
    } catch (error) {
      console.log("Error fetching product data: ", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const haldiramProducts = await getProductsByCategory("Haldiram");
        const g2Products = await getProductsByCategory("G2");
        const allProducts = [...haldiramProducts, ...g2Products];
        setProducts(allProducts);
      } catch (error) {
        console.log("Error fetching products: ", error);
      }
    };
    fetchProducts();
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (location.state?.alert) {
      console.log("namaskar",location.state.message);
      setAlertMessage(location.state.message);
      setShowAlert(true);
      // Clear the location state to prevent the alert from showing again on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleCloseAlert = () => {
    setShowAlert(false);
    setAlertMessage('');
  };

  return (
    <>
      <Header isAdmin={isAdmin} />
      {showAlert && (
        <AlertSuccessMessage
          message={alertMessage}
          onClose={handleCloseAlert}
        />
      )}
      <Navbar />
      <Slider slides={slides} />
      <br />
      <div className='allcards'>
        {products.length > 0 ? products.map((product, index) => (
          <ProductCard 
            key={index}
            imageUrl={product.image}
            title={product.productName}
            description={product.description}
            currentPrice={product.price[0]}
            originalPrice={product.price[1]}
            id={product._id}
            availability={product.availability}
            verify={isAdmin}
          />   
        )) : <p>No products available</p>}
      </div>
      <br />
      <Footer />
    </>
  );
}

export default Home;