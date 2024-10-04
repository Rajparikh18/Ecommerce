import React from 'react';
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import OrderDetails from '../components/TodayOrderDetail.jsx';


function AdminOrderTodayDetail(isAdmin) {
  useEffect(() => {
    // Scroll to the top of the page on component mount
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
        <Header isAdmin={isAdmin}/>
        <Navbar/>
        <OrderDetails/>
        <Footer/>
    </>
  );
};

export default AdminOrderTodayDetail;