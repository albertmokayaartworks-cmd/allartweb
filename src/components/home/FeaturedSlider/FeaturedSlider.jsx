// src/components/home/FeaturedSlider/FeaturedSlider.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './FeaturedSlider.css';

const FeaturedSlider = ({ products, loading }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || loading || products.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % products.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [autoPlay, loading, products.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % products.length);
    setAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + products.length) % products.length);
    setAutoPlay(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setAutoPlay(false);
  };

  if (loading || products.length === 0) {
    return (
      <div className="featured-slider bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
        <div className="h-64 md:h-80 lg:h-96 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto mb-4"></div>
            <p>Loading featured products...</p>
          </div>
        </div>
      </div>
    );
  }

  const currentProduct = products[currentSlide];

  return (
    <div 
      className="featured-slider bg-gradient-to-r from-orange-500 to-red-500 rounded-lg overflow-hidden"
      onMouseEnter={() => setAutoPlay(false)}
      onMouseLeave={() => setAutoPlay(true)}
    >
      {/* Slider Container */}
      <div className="relative h-64 md:h-80 lg:h-96 w-full overflow-hidden">
        {/* Product Image and Info */}
        <Link
          to={`/products/${currentProduct.id}`}
          className="block h-full w-full"
        >
          <div className="h-full w-full flex items-center justify-between px-6 md:px-12">
            {/* Left Side - Product Image */}
            <div className="hidden sm:flex flex-1 items-center justify-center">
              <img
                src={currentProduct.images?.[0] || currentProduct.image || 'https://via.placeholder.com/300'}
                alt={currentProduct.name}
                className="h-48 md:h-64 lg:h-72 object-contain drop-shadow-lg hover:scale-105 transition-transform"
              />
            </div>

            {/* Right Side - Product Info */}
            <div className="flex-1 text-white">
              <p className="text-sm md:text-base uppercase tracking-wide mb-2 text-orange-100">Featured Product</p>
              
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 line-clamp-2 hover:text-orange-100 transition">
                {currentProduct.name}
              </h2>

              <p className="text-sm md:text-base text-orange-50 mb-4 line-clamp-2">
                {currentProduct.description}
              </p>

              {/* Price Section */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl md:text-4xl font-bold">
                  KES {currentProduct.price?.toLocaleString()}
                </span>
                {currentProduct.originalPrice && currentProduct.originalPrice > currentProduct.price && (
                  <span className="text-lg text-orange-100 line-through">
                    KES {currentProduct.originalPrice?.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Rating */}
              {currentProduct.rating && (
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-300 text-lg">
                        {i < Math.round(currentProduct.rating) ? '★' : '☆'}
                      </span>
                    ))}
                  </div>
                  <span className="text-white font-semibold">{currentProduct.rating}</span>
                  {currentProduct.reviewCount && (
                    <span className="text-orange-100">({currentProduct.reviewCount} reviews)</span>
                  )}
                </div>
              )}

              {/* CTA Button */}
              <button className="bg-white text-orange-600 px-8 py-3 rounded-lg font-bold hover:bg-orange-100 transition shadow-lg">
                View Product
              </button>
            </div>
          </div>
        </Link>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 md:p-3 rounded-full transition z-10 backdrop-blur-sm"
          aria-label="Previous slide"
        >
          <FiChevronLeft size={24} />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 md:p-3 rounded-full transition z-10 backdrop-blur-sm"
          aria-label="Next slide"
        >
          <FiChevronRight size={24} />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide
                  ? 'bg-white w-8 h-3'
                  : 'bg-white/50 hover:bg-white/75 w-3 h-3'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Product Counter */}
      <div className="bg-black/20 px-6 md:px-12 py-3 text-white text-sm flex justify-between items-center">
        <span>{currentSlide + 1} of {products.length}</span>
        <span className="text-orange-200">
          {currentProduct.discount && currentProduct.discount > 0 && (
            <span className="bg-orange-600 px-3 py-1 rounded-full font-semibold">
              {currentProduct.discount}% OFF
            </span>
          )}
        </span>
      </div>
    </div>
  );
};

export default FeaturedSlider;
