// src/components/Newsletter/NewsletterSubscription.jsx
import React, { useState } from 'react';
import { FiMail, FiCheck } from 'react-icons/fi';
import { toast } from 'react-toastify';
import axios from 'axios';
import './NewsletterSubscription.css';

const NewsletterSubscription = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/newsletter/subscribe`,
        { email }
      );

      if (response.data.success) {
        setSubscribed(true);
        setEmail('');
        toast.success('Successfully subscribed to newsletter!');
        
        // Reset after 3 seconds
        setTimeout(() => setSubscribed(false), 3000);
      } else {
        toast.error(response.data.message || 'Subscription failed');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      const message = error.response?.data?.message || error.message || 'Failed to subscribe';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="newsletter-subscription">
      <div className="newsletter-content">
        <div className="newsletter-header">
          <FiMail className="newsletter-icon" />
          <h3>Subscribe to Our Newsletter</h3>
        </div>
        <p className="newsletter-description">
          Get exclusive deals, new arrivals, and special offers delivered to your inbox
        </p>

        {subscribed ? (
          <div className="subscription-success">
            <FiCheck className="success-icon" />
            <p>Thank you for subscribing!</p>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="newsletter-input"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="newsletter-button"
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        )}

        <p className="newsletter-privacy">
          We respect your privacy. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
};

export default NewsletterSubscription;
