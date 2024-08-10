import React, { useState, useEffect } from "react";
import "./Slider.css";

const Slider = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="slider-container">
      <div className="main-slide">
        <img
          src={slides[currentSlide].mainImage}
          alt={`Slide ${currentSlide + 1}`}
          className="main-image"
        />
        {!isMobile && (
          <img
            src={slides[(currentSlide + 1) % slides.length].mainImage}
            alt={`Slide ${((currentSlide + 1) % slides.length) + 1}`}
            className="main-image"
          />
        )}
      </div>
      <div className="navigation">
        <div className="dots">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`dot ${currentSlide === index ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;