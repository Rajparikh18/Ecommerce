import React from 'react';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Authcomponent from '../components/Authentication';


function Authpage(){
  return (
    <>
        <Header/>
        <Navbar/>
        <Authcomponent/>
        <Footer/>
    </>
  );
};

export default Authpage;