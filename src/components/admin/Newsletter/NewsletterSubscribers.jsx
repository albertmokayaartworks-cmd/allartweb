import React, { useState, useEffect } from 'react';
import { FiDownload, FiRefreshCw, FiMail, FiTrash2, FiSearch } from 'react-icons/fi';
import { getNewsletterSubscribers } from '../../../services/email/brevoService';
import { toast } from 'react-toastify';
import './NewsletterSubscribers.css';

const NewsletterSubscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchSubscribers(currentPage);
  }, [currentPage]);

  const fetchSubscribers = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const offset = (page - 1) * itemsPerPage;
      const result = await getNewsletterSubscribers(null, itemsPerPage, offset);

      if (result.success) {
        setSubscribers(result.contacts || []);
        setTotalCount(result.totalCount || 0);
        setTotalPages(result.totalPages || 0);
        toast.success(`Loaded ${result.contacts?.length || 0} subscribers`);
      } else {
        setError(result.error || 'Failed to load subscribers');
        toast.error(result.error || 'Failed to load subscribers');
      }
    } catch (err) {
      console.error('Error fetching subscribers:', err);
      setError(err.message);
      toast.error('Error loading subscribers');
    } finally {
      setLoading(false);
    }
  };

  // Filter subscribers based on search term
  const filteredSubscribers = subscribers.filter(sub =>
    sub.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Export subscribers to CSV
  const exportToCSV = () => {
    if (subscribers.length === 0) {
      toast.error('No subscribers to export');
      return;
    }

    const headers = ['Email', 'First Name', 'Last Name', 'Added Date', 'Status'];
    const rows = subscribers.map(sub => [
      sub.email || '',
      sub.firstName || '',
      sub.lastName || '',
      sub.attributes?.CREATEDATE ? new Date(sub.attributes.CREATEDATE).toLocaleDateString() : 'N/A',
      sub.listUnsubscribed ? 'Unsubscribed' : 'Active'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`Exported ${subscribers.length} subscribers`);
  };

  return (
    <div className="newsletter-subscribers-container">
      <div className="subscribers-header">
        <div className="header-content">
          <h2><FiMail size={24} style={{marginRight: '12px', display: 'inline'}} /> Newsletter Subscribers</h2>
          <p className="subscriber-count">Total: <strong>{totalCount}</strong> subscribers</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => fetchSubscribers(currentPage)}
            disabled={loading}
          >
            <FiRefreshCw size={18} />
            {loading ? 'Loading...' : 'Refresh'}
          </button>
          <button 
            className="btn btn-primary"
            onClick={exportToCSV}
            disabled={subscribers.length === 0}
          >
            <FiDownload size={18} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="subscribers-search">
        <FiSearch size={20} />
        <input
          type="text"
          placeholder="Search by email, first name, or last name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="loading-message">
          <div className="spinner"></div>
          Loading subscribers...
        </div>
      )}

      {/* Subscribers Table */}
      {!loading && filteredSubscribers.length > 0 && (
        <div className="subscribers-table-wrapper">
          <table className="subscribers-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Subscribed Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscribers.map((subscriber, index) => (
                <tr key={index}>
                  <td className="email-cell">
                    <code>{subscriber.email}</code>
                  </td>
                  <td>{subscriber.firstName || '-'}</td>
                  <td>{subscriber.lastName || '-'}</td>
                  <td>
                    {subscriber.attributes?.CREATEDATE 
                      ? new Date(subscriber.attributes.CREATEDATE).toLocaleDateString()
                      : 'N/A'
                    }
                  </td>
                  <td>
                    <span className={`status-badge ${subscriber.listUnsubscribed ? 'unsubscribed' : 'active'}`}>
                      {subscriber.listUnsubscribed ? 'Unsubscribed' : 'Active'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button 
                      className="action-btn email-btn"
                      title="Send Email"
                      onClick={() => {
                        // Placeholder for send email functionality
                        toast.info('Email feature coming soon');
                      }}
                    >
                      <FiMail size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredSubscribers.length === 0 && subscribers.length > 0 && (
        <div className="empty-state">
          <p>No subscribers match your search term.</p>
        </div>
      )}

      {/* No Subscribers State */}
      {!loading && subscribers.length === 0 && !error && (
        <div className="empty-state">
          <p>📭 No newsletter subscribers yet. Start promoting your newsletter!</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1 || loading}
          >
            Previous
          </button>
          
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages || loading}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default NewsletterSubscribers;
