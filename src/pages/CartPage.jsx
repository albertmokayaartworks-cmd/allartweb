import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMinus, FiPlus, FiTrash2, FiArrowLeft, FiAlertCircle } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
  const [stockWarnings, setStockWarnings] = useState({});

  const handleQuantityChange = (itemId, change, maxStock) => {
    const currentItem = cartItems.find(item => item.id === itemId);
    const newQuantity = currentItem.quantity + change;
    
    // Validate against stock
    if (newQuantity > maxStock) {
      const warning = `Only ${maxStock} ${currentItem.name}(s) available in stock`;
      setStockWarnings(prev => ({ ...prev, [itemId]: warning }));
      toast.error(warning);
      setTimeout(() => setStockWarnings(prev => {
        const updated = { ...prev };
        delete updated[itemId];
        return updated;
      }), 3000);
      return;
    }
    
    // Clear warning if valid
    if (stockWarnings[itemId]) {
      setStockWarnings(prev => {
        const updated = { ...prev };
        delete updated[itemId];
        return updated;
      });
    }
    
    updateQuantity(itemId, change);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
        <div className="container mx-auto px-3 sm:px-4">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Shopping Cart</h1>
          <div className="bg-white rounded-lg shadow-md p-6 sm:p-12 text-center">
            <p className="text-gray-600 text-base sm:text-lg mb-4">Your cart is empty</p>
            <Link
              to="/products"
              className="inline-block bg-orange-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-orange-600 transition text-sm sm:text-base"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="container mx-auto px-3 sm:px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-6 sm:mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-orange-500 hover:text-orange-600 text-sm sm:text-base"
          >
            <FiArrowLeft size={18} />
            Back
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold">Shopping Cart</h1>
          <span className="text-gray-600 text-sm sm:text-base sm:ml-auto">({cartCount} items)</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-6 border-b last:border-b-0 hover:bg-gray-50 transition ${
                    stockWarnings[item.id] ? 'bg-red-50' : ''
                  }`}
                >
                  {/* Product Image */}
                  <div className="w-full sm:w-24 h-32 sm:h-24 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={Array.isArray(item.images) && item.images.length > 0 
                        ? item.images[0] 
                        : item.image || 'https://via.placeholder.com/100'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item.id}`}
                      className="text-base sm:text-lg font-semibold text-gray-800 hover:text-orange-500 transition break-words"
                    >
                      {item.name}
                    </Link>
                    <p className="text-gray-600 text-xs sm:text-sm mt-1">
                      SKU: {item.id || 'N/A'}
                    </p>
                    
                    {/* Stock Info */}
                    <div className="text-xs sm:text-sm mt-2">
                      {item.stock && item.stock > 0 ? (
                        <p className="text-green-600 font-medium">
                          ✅ In Stock ({item.stock} available)
                        </p>
                      ) : (
                        <p className="text-red-600 font-medium">
                          ❌ Out of Stock
                        </p>
                      )}
                    </div>
                    
                    {/* Stock Warning */}
                    {stockWarnings[item.id] && (
                      <div className="flex items-center gap-2 mt-2 text-red-600 text-xs sm:text-sm bg-red-50 p-2 rounded">
                        <FiAlertCircle size={14} />
                        <span>{stockWarnings[item.id]}</span>
                      </div>
                    )}
                    
                    <p className="text-orange-500 font-bold text-base sm:text-lg mt-2">
                      KSh {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>

                  {/* Quantity & Remove Controls */}
                  <div className="flex items-center gap-2 sm:flex-col sm:gap-3 w-full sm:w-auto">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 border rounded-lg px-2 sm:px-3 py-1 sm:py-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, -1, item.stock)}
                        className="text-gray-600 hover:text-orange-500 transition p-1"
                        title="Decrease quantity"
                      >
                        <FiMinus size={16} />
                      </button>
                      <span className="font-semibold w-6 text-center text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.id, 1, item.stock)}
                        disabled={item.quantity >= (item.stock || 0)}
                        className={`transition p-1 ${
                          item.quantity >= (item.stock || 0)
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-600 hover:text-orange-500'
                        }`}
                        title={item.quantity >= (item.stock || 0) ? 'Maximum stock reached' : 'Increase quantity'}
                      >
                        <FiPlus size={16} />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 transition p-1 flex-shrink-0"
                      title="Remove from cart"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 sticky top-20">
              <h2 className="text-lg sm:text-xl font-bold mb-4">Order Summary</h2>

              {/* Pricing Details */}
              <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b text-xs sm:text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>KSh {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>KSh {(cartTotal * 0.16).toLocaleString()}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between text-base sm:text-xl font-bold mb-4 sm:mb-6">
                <span>Total</span>
                <span className="text-orange-500">
                  KSh {(cartTotal + cartTotal * 0.16).toLocaleString()}
                </span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-orange-500 text-white font-semibold py-2 sm:py-3 rounded-lg hover:bg-orange-600 transition mb-2 sm:mb-3 text-sm sm:text-base"
              >
                Proceed to Checkout
              </button>

              {/* Continue Shopping */}
              <Link
                to="/products"
                className="w-full block text-center py-2 sm:py-3 border border-orange-500 text-orange-500 font-semibold rounded-lg hover:bg-orange-50 transition text-sm sm:text-base"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
