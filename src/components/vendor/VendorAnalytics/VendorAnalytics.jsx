import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { getVendorSalesSummary, getVendorTopProducts } from '../../../services/vendor/vendorService';
import { FiDollarSign, FiShoppingCart, FiPackage, FiTrendingUp } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './VendorAnalytics.css';

export default function VendorAnalytics() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [summaryResult, products] = await Promise.all([
        getVendorSalesSummary(user.uid),
        getVendorTopProducts(user.uid, 10)
      ]);

      if (summaryResult.success) {
        setSummary(summaryResult.summary);
      } else {
        toast.error('Failed to load sales summary');
      }

      setTopProducts(products);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="analytics-loading">Loading analytics...</div>;
  }

  if (!summary) {
    return <div className="analytics-empty">No analytics data available</div>;
  }

  return (
    <div className="vendor-analytics-container">
      <div className="analytics-header">
        <h2>Sales Analytics</h2>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon" style={{ color: '#ff9800' }}>
            <FiDollarSign size={28} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Total Sales</span>
            <span className="metric-value">KES {summary.totalSales?.toLocaleString()}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ color: '#4caf50' }}>
            <FiShoppingCart size={28} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Total Orders</span>
            <span className="metric-value">{summary.totalOrders}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ color: '#2196f3' }}>
            <FiPackage size={28} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Products</span>
            <span className="metric-value">{summary.totalProducts}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ color: '#9c27b0' }}>
            <FiTrendingUp size={28} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Total Revenue</span>
            <span className="metric-value">KES {summary.totalAmount?.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Order Status Breakdown */}
      <div className="section">
        <h3>Order Status Breakdown</h3>
        <div className="status-grid">
          {[
            { status: 'pending', label: 'Pending', color: '#fff3cd', textColor: '#856404' },
            { status: 'confirmed', label: 'Confirmed', color: '#e3f2fd', textColor: '#1565c0' },
            { status: 'processing', label: 'Processing', color: '#f3e5f5', textColor: '#6a1b9a' },
            { status: 'shipped', label: 'Shipped', color: '#e0f2f1', textColor: '#00695c' },
            { status: 'completed', label: 'Completed', color: '#d4edda', textColor: '#155724' },
            { status: 'cancelled', label: 'Cancelled', color: '#f8d7da', textColor: '#721c24' }
          ].map(item => (
            <div
              key={item.status}
              className="status-card"
              style={{
                background: item.color,
                borderLeft: `4px solid ${item.textColor}`
              }}
            >
              <span className="status-label">{item.label}</span>
              <span className="status-count" style={{ color: item.textColor }}>
                {summary.statusCount[item.status] || 0}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Selling Products */}
      <div className="section">
        <h3>Top Selling Products</h3>
        {topProducts.length === 0 ? (
          <div className="empty-section">
            <p>No product sales data available yet</p>
          </div>
        ) : (
          <div className="products-table-container">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Sold</th>
                  <th>Revenue</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => (
                  <tr key={product.id}>
                    <td>
                      <span className="rank">#{index + 1}</span>
                      {product.name}
                    </td>
                    <td>KES {product.price?.toLocaleString()}</td>
                    <td>
                      <span className="sold-count">{product.sold || 0}</span>
                    </td>
                    <td className="revenue">
                      KES {((product.price || 0) * (product.sold || 0)).toLocaleString()}
                    </td>
                    <td>
                      <span className="rating">⭐ {(product.rating || 0).toFixed(1)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Performance Summary */}
      <div className="section">
        <h3>Performance Summary</h3>
        <div className="performance-grid">
          <div className="performance-card">
            <span className="perf-label">Average Order Value</span>
            <span className="perf-value">
              KES {summary.totalOrders > 0 ? (summary.totalAmount / summary.totalOrders).toLocaleString() : 0}
            </span>
          </div>

          <div className="performance-card">
            <span className="perf-label">Completion Rate</span>
            <span className="perf-value">
              {summary.totalOrders > 0
                ? ((summary.statusCount.completed / summary.totalOrders) * 100).toFixed(1)
                : 0}%
            </span>
          </div>

          <div className="performance-card">
            <span className="perf-label">Cancellation Rate</span>
            <span className="perf-value">
              {summary.totalOrders > 0
                ? ((summary.statusCount.cancelled / summary.totalOrders) * 100).toFixed(1)
                : 0}%
            </span>
          </div>

          <div className="performance-card">
            <span className="perf-label">Active Products</span>
            <span className="perf-value">{summary.totalProducts}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
