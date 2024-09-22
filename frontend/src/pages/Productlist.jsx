import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/Productcard';
import Navbar from '../components/Navbar';
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
            <Header />
            <Navbar/>
            <div className="container">
                {products.map((product) => (
                    <ProductCard 
                    key={product._id} 
                    imageUrl={product.image}// Use the correct image path if dynamic
                    title={product.productName}
                    description={product.description}
                    currentPrice={product.price[0]}
                    originalPrice={product.price[1]}
                    id={product._id} verify={isAdmin}/>
                ))}
            </div>
            <Footer />
        </>
    );
}

export default Productlist;
