// src/pages/Home.jsx

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiArrowRight, 
  FiHeart
} from 'react-icons/fi';
import { getProducts, getCategories } from '../services/firebase/firestoreHelpers';
import ProductCard from '../components/products/ProductCard/ProductCard';
import SkeletonCard from '../components/common/Loader/Skeleton';
import Newsletter from '../components/home/Newsletter/Newsletter';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNotifications } from '../context/NotificationContext';
import AuthModal from '../components/auth/AuthModal.jsx';
import { toast } from 'react-toastify';

const Home = () => {
  const navigate = useNavigate();
  const { user, userData, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const { addNotification } = useNotifications();
  
  // State management
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [topDeals, setTopDeals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState('login');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  // Fetch all data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch products and categories in parallel
        const [productsData, categoriesData] = await Promise.all([
          getProducts(24), // Fetch more products
          getCategories()
        ]);

        if (!productsData.error && productsData.products) {
          const products = productsData.products;
          
          // Split products into different sections
          setFeaturedProducts(products.slice(0, 8));
          setNewArrivals(products.slice(8, 16));
          setTopDeals(products.slice(16, 24));
        } else {
          console.error('Error fetching products:', productsData.error);
          setError(productsData.error);
        }

        if (!categoriesData.error) {
          setCategories(categoriesData.categories);
        } else {
          console.error('Error fetching categories:', categoriesData.error);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const openAuthModal = (view = 'login') => {
    setAuthModalView(view);
    setAuthModalOpen(true);
  };

  return (
    <div className="home-page bg-gray-50">
      {/* Hero Section with Promo Banner */}
      <section className="hero-section py-4 sm:py-6 md:py-8 bg-white">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {/* Main Hero Banner */}
            <div className="lg:col-span-3">
              <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 text-white rounded-lg p-4 sm:p-6 md:p-8 lg:p-12 h-full flex flex-col justify-center">
                <div className="max-w-xl">
                  <p className="text-xs sm:text-sm uppercase tracking-wide mb-2 text-orange-100">Limited Time Offer</p>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
                    Shop Easy 
                    <span className="block text-xl sm:text-2xl md:text-3xl lg:text-4xl mt-1 sm:mt-2">Now available in Gusii Region</span>
                  </h1>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-6 text-orange-50">
                    On all electronics, fashion, and home appliances
                  </p>
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-2 bg-white text-orange-600 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-lg font-bold hover:bg-gray-100 transition shadow-lg text-sm sm:text-base"
                  >
                    Shop Now <FiArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Side Promotional Cards */}
            <div className="space-y-3 sm:space-y-4">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-lg p-4 sm:p-6 cursor-pointer hover:shadow-lg transition">
                <p className="text-xs sm:text-sm font-semibold mb-1">⚡ Flash Sale</p>
                <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Electronics</h3>
                <p className="text-xs sm:text-sm text-purple-100">Up to 40% off</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-lg p-4 sm:p-6 cursor-pointer hover:shadow-lg transition">
                <p className="text-xs sm:text-sm font-semibold mb-1">🎁 Special Offer</p>
                <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Fashion</h3>
                <p className="text-xs sm:text-sm text-blue-100">Buy 2 Get 1 Free</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products py-6 sm:py-8 bg-white">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex justify-between items-center mb-4 sm:mb-6 gap-2">
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Top Selling Products</h2>
              <p className="text-gray-600 text-xs sm:text-sm mt-1">Most popular items this week</p>
            </div>
            <Link to="/products" className="text-orange-500 hover:text-orange-600 flex items-center gap-1 sm:gap-2 font-semibold text-xs sm:text-sm whitespace-nowrap flex-shrink-0">
              View All <FiArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
            {loading ? (
              Array(10).fill(0).map((_, index) => <SkeletonCard key={index} />)
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-8 sm:py-12">
                <p className="text-gray-500 text-sm sm:text-lg mb-4">No products available yet.</p>
                <p className="text-gray-400 text-xs sm:text-sm">Check back soon for amazing deals!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      {newArrivals.length > 0 && (
        <section className="new-arrivals py-6 sm:py-8 bg-gray-50">
          <div className="container mx-auto px-3 sm:px-4">
            <div className="flex justify-between items-center mb-4 sm:mb-6 gap-2">
              <div className="min-w-0">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">New Arrivals</h2>
                <p className="text-gray-600 text-xs sm:text-sm mt-1">Fresh products just for you</p>
              </div>
              <Link to="/products?filter=new" className="text-orange-500 hover:text-orange-600 flex items-center gap-1 sm:gap-2 font-semibold text-xs sm:text-sm whitespace-nowrap flex-shrink-0">
                View All <FiArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Guest Shopping Banner */}
      {!isAuthenticated && cartCount > 0 && (
        <section className="guest-banner py-6 bg-blue-50 border-t border-b border-blue-200">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <h3 className="text-lg font-bold text-blue-900">
                  🛒 You have {cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart
                </h3>
                <p className="text-blue-700 text-sm mt-1">
                  Sign in to save your cart and enjoy faster checkout
                </p>
              </div>
              <button
                onClick={() => openAuthModal('login')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold whitespace-nowrap"
              >
                Sign In Now
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action - Sign Up */}
      {!isAuthenticated && cartCount === 0 && (
        <section className="cta py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Aruviah Today!</h2>
              <p className="text-lg md:text-xl mb-6 text-orange-50">
                Create an account to unlock exclusive deals, faster checkout, and personalized recommendations
              </p>
              <button
                onClick={() => openAuthModal('signup')}
                className="inline-flex items-center gap-2 bg-white text-orange-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition shadow-lg"
              >
                Sign Up Now - It's Free! <FiArrowRight />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <Newsletter variant="full" />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultView={authModalView}
      />
    </div>
  );
};

export default Home;