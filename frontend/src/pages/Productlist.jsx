import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Home.css'
import ProductCard from '../components/Productcard';
import Navbar from '../components/Navbar';
import MorphingLoader from '../components/MorphingLoader';
const Productlist=(isAdmin)=> {
    const { category } = useParams();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // Define the async function inside the useEffect
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`/api/admin/getbycategory/${category}`);
                setProducts(response.data.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        // Call the async function
        fetchProducts();
    }, [category]);

    return (
        <>
            <Header isAdmin={isAdmin}/>
            <Navbar/>
            <div className='allcards11'>
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
            <Footer />
        </>
    );
}

export default Productlist;
