import React from 'react';
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Authcomponent from '../components/Authentication';


function Authpage(){
  useEffect(() => {
    // Scroll to the top of the page on component mount
    window.scrollTo(0, 0);
  }, []);
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