import React, { useState } from "react";
import "./Slider.css";

const Slider = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prevSlide) => (prevSlide - 1 + slides.length) % slides.length
    );
  };

  return (
    <div className="slider-container">
      <div className="main-slide">
        <div className="content">
          <h2>{slides[currentSlide].title}</h2>
          <h3>{slides[currentSlide].subtitle}</h3>
          <p>{slides[currentSlide].description}</p>
          <button className="shop-now">Shop Now »</button>
        </div><br />
        <img
          src={slides[currentSlide].mainImage}
          alt="Main Slide"
          className="main-image"
        />
      </div>
      <div className="navigation">
        <button onClick={prevSlide}>{"<"}</button>
        <div className="dots">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentSlide ? "active" : ""}`}
              onClick={() => setCurrentSlide(index)}
            ></span>
          ))}
        </div>
        <button onClick={nextSlide}>{">"}</button>
      </div>
    </div>
  );
};

export default Slider;
