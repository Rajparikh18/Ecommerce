import React from 'react';
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import OrderManagement from '../components/Adminmyorder.jsx';


function OrderToday(isAdmin) {
  useEffect(() => {
    // Scroll to the top of the page on component mount
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
        <Header isAdmin={isAdmin}/>
        <Navbar/>
        <OrderManagement/>
        <Footer/>
    </>
  );
};

export default OrderToday;