import React, { useState, useEffect } from 'react';
import { FiCheck, FiX, FiClock, FiRefreshCw } from 'react-icons/fi';
import { getVendorApplications, approveVendorWithNotification, rejectVendorWithNotification } from '../../../services/vendor/vendorService';
import { useAuth } from '../../../hooks/useAuth';
import { toast } from 'react-toastify';
import './VendorApplications.css';

export default function VendorApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(false);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState({});

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, filter]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const apps = await getVendorApplications();
      setApplications(apps);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to fetch vendor applications');
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    if (filter === 'all') {
      setFilteredApplications(applications);
    } else {
      setFilteredApplications(applications.filter(app => app.status === filter));
    }
  };

  const handleApprove = async (applicationId) => {
    if (!window.confirm('Are you sure you want to approve this vendor application?')) {
      return;
    }

    try {
      // Find the application data
      const application = applications.find(app => app.id === applicationId);
      if (!application) {
        toast.error('Application not found');
        return;
      }

      // Prepare app data for notification
      const appData = {
        userId: application.userId,
        email: application.email,
        businessName: application.businessName,
        firstName: application.businessName.split(' ')[0]
      };

      const result = await approveVendorWithNotification(applicationId, user.uid, appData);
      if (result.success) {
        toast.success('✅ Vendor approved! Email and notification sent.');
        fetchApplications();
      } else {
        toast.error(result.error || 'Failed to approve application');
      }
    } catch (error) {
      console.error('Error approving application:', error);
      toast.error('Error approving application');
    }
  };

  const handleReject = async (applicationId) => {
    const reason = rejectionReason[applicationId] || 'No specific reason provided';
    
    if (!window.confirm('Are you sure you want to reject this application?')) {
      return;
    }

    try {
      // Find the application data
      const application = applications.find(app => app.id === applicationId);
      if (!application) {
        toast.error('Application not found');
        return;
      }

      // Prepare app data for notification
      const appData = {
        userId: application.userId,
        email: application.email,
        businessName: application.businessName,
        firstName: application.businessName.split(' ')[0]
      };

      const result = await rejectVendorWithNotification(applicationId, user.uid, appData, reason);
      if (result.success) {
        toast.success('⚠️ Application rejected! Email and notification sent.');
        setRejectionReason(prev => {
          const newState = { ...prev };
          delete newState[applicationId];
          return newState;
        });
        fetchApplications();
      } else {
        toast.error(result.error || 'Failed to reject application');
      }
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast.error('Error rejecting application');
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { icon: FiClock, color: 'warning', label: 'Pending Review' },
      approved: { icon: FiCheck, color: 'success', label: 'Approved' },
      rejected: { icon: FiX, color: 'danger', label: 'Rejected' }
    };

    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;

    return (
      <span className={`status-badge status-${badge.color}`}>
        <Icon size={14} /> {badge.label}
      </span>
    );
  };

  return (
    <div className="vendor-applications-container">
      <div className="vendor-applications-header">
        <h3>Vendor Applications</h3>
        <button
          className="btn-refresh"
          onClick={fetchApplications}
          disabled={loading}
        >
          <FiRefreshCw /> Refresh
        </button>
      </div>

      <div className="filter-tabs">
        {['pending', 'approved', 'rejected', 'all'].map(status => (
          <button
            key={status}
            className={`filter-tab ${filter === status ? 'active' : ''}`}
            onClick={() => setFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {loading && !applications.length ? (
        <div className="loading-state">Loading applications...</div>
      ) : filteredApplications.length === 0 ? (
        <div className="empty-state">
          <p>No {filter !== 'all' ? filter : ''} vendor applications found</p>
        </div>
      ) : (
        <div className="applications-list">
          {filteredApplications.map(application => (
            <div key={application.id} className="application-card">
              <div className="application-card-header">
                <div className="header-info">
                  <h4>{application.businessName}</h4>
                  <p className="business-category">{application.businessCategory}</p>
                </div>
                <div className="header-status">
                  {getStatusBadge(application.status)}
                </div>
              </div>

              <div className="application-card-body">
                <div className="info-row">
                  <label>Applicant Email:</label>
                  <span>{application.email}</span>
                </div>

                <div className="info-row">
                  <label>Contact Phone:</label>
                  <span>{application.contactPhone}</span>
                </div>

                <div className="info-row">
                  <label>Business Address:</label>
                  <span>{application.businessAddress}</span>
                </div>

                <div className="info-row full-width">
                  <label>Business Description:</label>
                  <p className="description">{application.businessDescription}</p>
                </div>

                <div className="info-row">
                  <label>Applied:</label>
                  <span>{formatDate(application.submittedAt)}</span>
                </div>

                {application.status !== 'pending' && (
                  <div className="info-row">
                    <label>Decision Made:</label>
                    <span>{formatDate(application.updatedAt)}</span>
                  </div>
                )}

                {application.rejectionReason && (
                  <div className="info-row full-width">
                    <label>Rejection Reason:</label>
                    <p className="rejection-reason">{application.rejectionReason}</p>
                  </div>
                )}
              </div>

              {application.status === 'pending' && (
                <div className="application-card-actions">
                  <div className="rejection-section">
                    <textarea
                      placeholder="Rejection reason (optional)"
                      value={rejectionReason[application.id] || ''}
                      onChange={(e) => setRejectionReason(prev => ({
                        ...prev,
                        [application.id]: e.target.value
                      }))}
                      className="rejection-textarea"
                    />
                  </div>

                  <div className="action-buttons">
                    <button
                      className="btn btn-approve"
                      onClick={() => handleApprove(application.id)}
                    >
                      <FiCheck /> Approve
                    </button>
                    <button
                      className="btn btn-reject"
                      onClick={() => handleReject(application.id)}
                    >
                      <FiX /> Reject
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
