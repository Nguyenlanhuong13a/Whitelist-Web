import React, { useState } from 'react';
import './ApplicationHistory.css';

const ApplicationHistory = () => {
  const [identifier, setIdentifier] = useState('');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState(null);
  const [summary, setSummary] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchApplicationHistory = async (page = 1, status = '') => {
    if (!identifier.trim()) {
      setError('Vui lòng nhập Discord ID hoặc Steam ID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      });

      if (status) {
        params.append('status', status);
      }

      const response = await fetch(`/api/applications/history/${encodeURIComponent(identifier.trim())}?${params}`);
      const data = await response.json();

      if (data.success) {
        setApplications(data.applications);
        setPagination(data.pagination);
        setSummary(data.summary);
        setCurrentPage(page);
      } else {
        setError(data.message || 'Không tìm thấy đơn đăng ký nào');
        setApplications([]);
        setPagination(null);
        setSummary(null);
      }
    } catch (err) {
      console.error('Error fetching application history:', err);
      setError('Có lỗi xảy ra khi tải lịch sử đơn đăng ký');
      setApplications([]);
      setPagination(null);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchApplicationHistory(1, statusFilter);
  };

  const handlePageChange = (newPage) => {
    fetchApplicationHistory(newPage, statusFilter);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
    if (identifier.trim()) {
      fetchApplicationHistory(1, status);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return '✅';
      case 'rejected':
        return '❌';
      case 'pending':
        return '⏳';
      default:
        return '❓';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved':
        return 'Đã duyệt';
      case 'rejected':
        return 'Từ chối';
      case 'pending':
        return 'Đang xem xét';
      default:
        return 'Không xác định';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      case 'pending':
        return 'status-pending';
      default:
        return 'status-unknown';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa có';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="application-history">
      <div className="history-header">
        <h2>📋 Lịch Sử Đơn Đăng Ký</h2>
        <p>Xem tất cả các đơn đăng ký whitelist đã gửi trước đây</p>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Nhập Discord ID hoặc Steam ID của bạn..."
            className="search-input"
            disabled={loading}
          />
          <button type="submit" className="search-button" disabled={loading || !identifier.trim()}>
            {loading ? '🔍 Đang tìm...' : '🔍 Tìm kiếm'}
          </button>
        </div>
      </form>

      {summary && (
        <div className="summary-stats">
          <div className="stat-item">
            <span className="stat-number">{summary.total}</span>
            <span className="stat-label">Tổng đơn</span>
          </div>
          <div className="stat-item approved">
            <span className="stat-number">{summary.approved}</span>
            <span className="stat-label">Đã duyệt</span>
          </div>
          <div className="stat-item rejected">
            <span className="stat-number">{summary.rejected}</span>
            <span className="stat-label">Từ chối</span>
          </div>
          <div className="stat-item pending">
            <span className="stat-number">{summary.pending}</span>
            <span className="stat-label">Đang xem xét</span>
          </div>
        </div>
      )}

      {applications.length > 0 && (
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${statusFilter === '' ? 'active' : ''}`}
            onClick={() => handleStatusFilter('')}
          >
            Tất cả
          </button>
          <button 
            className={`filter-btn ${statusFilter === 'pending' ? 'active' : ''}`}
            onClick={() => handleStatusFilter('pending')}
          >
            ⏳ Đang xem xét
          </button>
          <button 
            className={`filter-btn ${statusFilter === 'approved' ? 'active' : ''}`}
            onClick={() => handleStatusFilter('approved')}
          >
            ✅ Đã duyệt
          </button>
          <button 
            className={`filter-btn ${statusFilter === 'rejected' ? 'active' : ''}`}
            onClick={() => handleStatusFilter('rejected')}
          >
            ❌ Từ chối
          </button>
        </div>
      )}

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {applications.length > 0 && (
        <div className="applications-list">
          {applications.map((app) => (
            <div key={app.id} className={`application-card ${getStatusClass(app.status)}`}>
              <div className="card-header">
                <div className="status-badge">
                  <span className="status-icon">{getStatusIcon(app.status)}</span>
                  <span className="status-text">{getStatusText(app.status)}</span>
                </div>
                <div className="application-id">ID: {app.id}</div>
              </div>

              <div className="card-content">
                <div className="character-info">
                  <h3>{app.characterName}</h3>
                  <p className="character-age">Tuổi: {app.age}</p>
                </div>

                <div className="application-details">
                  <div className="detail-row">
                    <span className="detail-label">📅 Ngày gửi:</span>
                    <span className="detail-value">{formatDate(app.submissionDate)}</span>
                  </div>
                  
                  {app.reviewDate && (
                    <div className="detail-row">
                      <span className="detail-label">🔍 Ngày xem xét:</span>
                      <span className="detail-value">{formatDate(app.reviewDate)}</span>
                    </div>
                  )}

                  {app.moderator && (
                    <div className="detail-row">
                      <span className="detail-label">👤 Người xem xét:</span>
                      <span className="detail-value">{app.moderator.username}</span>
                    </div>
                  )}

                  {app.feedback && (
                    <div className="feedback-section">
                      <span className="detail-label">💬 Phản hồi từ Admin:</span>
                      <div className="feedback-content">{app.feedback}</div>
                    </div>
                  )}
                </div>

                <div className="backstory-section">
                  <details>
                    <summary>📖 Xem tiểu sử nhân vật</summary>
                    <div className="backstory-content">{app.backstory}</div>
                  </details>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="pagination">
          <button 
            className="page-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!pagination.hasPrevPage}
          >
            ← Trước
          </button>
          
          <span className="page-info">
            Trang {pagination.currentPage} / {pagination.totalPages}
          </span>
          
          <button 
            className="page-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!pagination.hasNextPage}
          >
            Sau →
          </button>
        </div>
      )}
    </div>
  );
};

export default ApplicationHistory;
