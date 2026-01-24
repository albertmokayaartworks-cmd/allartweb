import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './CompactFeaturedSlider.css';

const CompactFeaturedSlider = ({ products = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay || products.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(timer);
  }, [autoPlay, products.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
    setAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? products.length - 1 : prevIndex - 1
    );
    setAutoPlay(false);
  };

  if (!products || products.length === 0) {
    return null;
  }

  const currentProduct = products[currentIndex % products.length];

  return (
    <div className="compact-featured-slider">
      <div className="slider-container">
        {/* Main Product Display */}
        <div className="slider-main">
          {currentProduct && (
            <Link to={`/products/${currentProduct.id}`} className="product-link">
              <div className="product-image-wrapper">
                <img
                  src={currentProduct.images?.[0] || currentProduct.image || 'https://via.placeholder.com/200'}
                  alt={currentProduct.name}
                  className="product-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/200?text=Product';
                  }}
                />
                {currentProduct.discount > 0 && (
                  <div className="discount-badge">-{currentProduct.discount}%</div>
                )}
              </div>
              <div className="product-info">
                <h4 className="product-name">{currentProduct.name}</h4>
                <div className="product-rating">
                  <span className="stars">★</span>
                  <span className="rating-value">{currentProduct.rating || 4.5}</span>
                </div>
                <div className="product-price">
                  <span className="price">
                    KSh {Math.round(currentProduct.price).toLocaleString()}
                  </span>
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="slider-controls">
          <button
            onClick={prevSlide}
            className="control-btn prev-btn"
            aria-label="Previous product"
          >
            <FiChevronLeft size={16} />
          </button>
          <button
            onClick={nextSlide}
            className="control-btn next-btn"
            aria-label="Next product"
          >
            <FiChevronRight size={16} />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="slider-dots">
          {products.slice(0, 5).map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentIndex % products.length ? 'active' : ''}`}
              onClick={() => {
                setCurrentIndex(index);
                setAutoPlay(false);
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompactFeaturedSlider;
