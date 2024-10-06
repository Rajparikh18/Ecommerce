import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Slider from '../components/Slider';
import image1 from '../assets/slider1.jpg';
import image2 from '../assets/slider2.jpg';
import image3 from '../assets/slider3.jpg';
import image4 from '../assets/slider4.jpg';
import MorphingLoader from '../components/MorphingLoader';
import './Home.css';
import '../App.css';
import ProductCard from '../components/Productcard';
import axios from 'axios';
import AlertSuccessMessage from '../components/alertSuccess.jsx';

const slides = [
  { mainImage: image1 },
  { mainImage: image2 },
  { mainImage: image3 },
  { mainImage: image4 },
];

const Home = (isAdmin ) => {
  const [products, setProducts] = useState([]);
  const [flashMessage, setFlashMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const getProductsByCategory = async (category, page = 1, limit = 10) => {
    try {
      const response = await axios.get(`/api/admin/getbycategory/${category}`, {
        params: { page, limit }
      });
      return response.data.data.products;
    } catch (error) {
      console.log(`Error fetching ${category} products:`, error);
      return [];
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const haldiramProducts = await getProductsByCategory('Haldiram');
        const g2Products = await getProductsByCategory('G2');

        const allProducts = [...haldiramProducts, ...g2Products];
        setProducts(allProducts);
      } catch (error) {
        console.log('Error fetching products: ', error);
      }
      setIsLoading(false);
    };

    fetchProducts();
    window.scrollTo(0, 0);

    if (location.state && location.state.message) {
      setFlashMessage(location.state.message);
      navigate('.', { replace: true, state: {} });
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
          onClose={() => setFlashMessage(null)}
        />
      )}
      <br />
      <div className='allcards'>
        {isLoading ? (
          <MorphingLoader />
        ) : (
          products.map((product, index) => (
            <React.Fragment key={index}>
              <ProductCard 
                imageUrl={product.image}
                title={product.productName}
                description={product.description}
                currentPrice={product.price[0]}
                originalPrice={product.price[1]}
                id={product._id}
                availability={product.availability}
                verify={isAdmin.isAdmin}
              />   
            </React.Fragment>
          ))
        )}
      </div>
      <br />
      <Footer />
    </>
  );
};

export default Home;