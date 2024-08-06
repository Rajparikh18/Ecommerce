import React from 'react'
import Footer from './components/Footer'
import Header from './components/Header'
import Navbar from './components/Navbar'
import Slider from './components/Slider'
import image1 from './assets/slider1.jpg';
import image2 from './assets/slider2.png';
import image3 from './assets/slider3.jpg';
import image4 from './assets/slider4.png';

import './App.css'
import ProductCard from './components/Productcard';
import demoimage from "./assets/images/demoimage.jpeg"

const slides = [
    {
        mainImage: image1,
    },
    {
      mainImage: image2,
  }, {
    mainImage: image3,
}, {
  mainImage: image4,
},
];

const productData = {
  imageUrl:demoimage,
  title: "Haldiram's",
  description:"best bhujia due to a best website",
  currentPrice: 49.00,
  originalPrice: 65.00
};

function App() {
    return (
      <>
        <Header />
        <Navbar />
        <Slider slides={slides} />
        <br />
        <div className='allcards'>
          {
            Array.from({ length: 10 }).map((_, index) => (
              <React.Fragment key={index}>
                <ProductCard {...productData} />  
              </React.Fragment>
            ))
          }
        </div>
        <br />
        <Footer />
      </>
    )
}

export default App
