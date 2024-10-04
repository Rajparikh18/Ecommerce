import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductDetail from '../components/ProductDetail';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';

function ProductPage(isAdmin) {
  const { id } = useParams(); 
  const [productData, setProductData] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0); 
    const fetchProductData = async () => {
      try {
        const response = await axios.get(`/api/admin/getbyid/${id}`);
        response.data.data.id=id;
        response.data.data.verify=isAdmin.isAdmin;
        setProductData(response.data.data); 
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchProductData();
  }, [id]);

  if (!productData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header isAdmin={isAdmin}/>
      <Navbar />
      <ProductDetail {...productData} />
      <Footer />
    </div>
  );
}

export default ProductPage;
