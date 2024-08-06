import React, { useState, useEffect } from "react";
import "./Slider.css";

const Slider = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);


  // Automatically change slide every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 2)%4);
    }, 2000);

    return () => clearInterval(interval); // Clean up the interval on unmount
  },[]); // Run effect whenever slides length changes

  return (
    <div className="slider-container">
      <div className="main-slide">
          <img
            key={0}
            src={slides[currentSlide].mainImage}
            alt={`Slide ${1}`}
            className={`main-image `}
          />
          <img
            key={1}
            src={slides[currentSlide+1].mainImage}
            alt={`Slide ${1}`}
            className={`main-image `}
          />
      </div>
      <div className="navigation">
        <div className="dots">
            <span
              key={0}
              className={`dot ${currentSlide===0 ? 'active': null}`}  
            ></span>
            <span
              key={1}
              className={`dot ${currentSlide===2 ? 'active': null}`}  
            ></span>
        </div>
      </div>
    </div>
  );
};

export default Slider;
