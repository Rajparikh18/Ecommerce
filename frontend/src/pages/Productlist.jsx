import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Home.css'
import ProductCard from '../components/Productcard';
import Navbar from '../components/Navbar';
import MorphingLoader from '../components/MorphingLoader';

const Productlist = ({ isAdmin }) => {
    const { category } = useParams();
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const productsPerPage = 20;

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`/api/admin/getbycategory/${category}`, {
                    params: {
                        page: currentPage,
                        limit: productsPerPage
                    }
                });
                setProducts(response.data.data.products);
                setTotalPages(response.data.data.totalPages);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
            setIsLoading(false);
        };

        fetchProducts();
    }, [category, currentPage]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <>
            <Header isAdmin={isAdmin} />
            <Navbar />
            <div className='allcards11'>
                {isLoading ? (
                    <MorphingLoader />
                ) : products.length > 0 ? (
                    products.map((product, index) => (
                        <React.Fragment key={product._id}>
                            <ProductCard 
                                imageUrl={product.image}
                                title={product.productName}
                                description={product.description}
                                currentPrice={product.price[0]}
                                originalPrice={product.price[1]}
                                id={product._id}
                                availability={product.availability}
                                verify={isAdmin}
                            />   
                        </React.Fragment>
                    ))
                ) : (
                    <p>No products found in this category.</p>
                )}
            </div>
            {totalPages > 1 && (
                <div className="pagination">
                    <button 
                        onClick={() => handlePageChange(currentPage - 1)} 
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span>{`Page ${currentPage} of ${totalPages}`}</span>
                    <button 
                        onClick={() => handlePageChange(currentPage + 1)} 
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}<br />
            <Footer />
        </>
    );
}

export default Productlist;