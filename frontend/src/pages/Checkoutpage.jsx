import React from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BillingDetails from '../components/BillingDetails';
import BillCart from '../components/BillCart';

function Checkout(isAdmin){
return (
    <>
            <Header isAdmin={isAdmin}/>
            <Navbar />
            <div className="container" style={{ display: 'flex',flexWrap: 'wrap'}}>
                    <BillingDetails />
                    <BillCart />
            </div>
            <Footer />
    </>
);
};

export default Checkout;