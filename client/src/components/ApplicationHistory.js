import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '../contexts/UserContext';
import './ApplicationHistory.css';

const ApplicationHistory = () => {
  const { user } = useUser();
  const [identifier, setIdentifier] = useState('');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState(null);
  const [summary, setSummary] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [hasAutoSearched, setHasAutoSearched] = useState(false);

  const fetchApplicationHistory = useCallback(async (page = 1, status = '') => {
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
  }, [identifier]);

  // Auto-populate search field and perform search when user is connected
  useEffect(() => {
    if (user?.discordId && !identifier && !hasAutoSearched) {
      setIdentifier(user.discordId);
      setHasAutoSearched(true);
      // Automatically search after a short delay
      setTimeout(() => {
        fetchApplicationHistory(1, '');
      }, 500);
    }
  }, [user, identifier, hasAutoSearched, fetchApplicationHistory]);

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
      {/* Header Section */}
      <div className="history-header">
        <div className="header-content">
          <div className="header-icon">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="header-text">
            <h1 className="header-title">Lịch Sử Đơn Đăng Ký</h1>
            <p className="header-subtitle">Xem tất cả các đơn đăng ký whitelist đã gửi trước đây</p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-container">
            <div className="search-input-wrapper">
              <div className="search-icon">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={user?.discordId ? "Đã tự động điền Discord ID từ tài khoản đã kết nối" : "Nhập Discord ID hoặc Steam ID của bạn..."}
                className={`search-input ${user?.discordId && identifier === user.discordId ? 'auto-filled' : ''}`}
                disabled={loading}
              />
              {user?.discordId && identifier === user.discordId && (
                <div className="auto-fill-indicator">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xs text-green-400 font-medium">Tự động</span>
                </div>
              )}
            </div>
            <button type="submit" className="search-button" disabled={loading || !identifier.trim()}>
              <span className="button-content">
                {loading ? (
                  <>
                    <div className="loading-spinner"></div>
                    Đang tìm...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Tìm kiếm
                  </>
                )}
              </span>
            </button>
          </div>
        </form>
      </div>

      {/* Summary Statistics */}
      {summary && (
        <div className="summary-section">
          <div className="summary-grid">
            <div className="stat-card total">
              <div className="stat-icon">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="stat-content">
                <span className="stat-number">{summary.total}</span>
                <span className="stat-label">Tổng đơn</span>
              </div>
            </div>
            <div className="stat-card approved">
              <div className="stat-icon">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="stat-content">
                <span className="stat-number">{summary.approved}</span>
                <span className="stat-label">Đã duyệt</span>
              </div>
            </div>
            <div className="stat-card rejected">
              <div className="stat-icon">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="stat-content">
                <span className="stat-number">{summary.rejected}</span>
                <span className="stat-label">Từ chối</span>
              </div>
            </div>
            <div className="stat-card pending">
              <div className="stat-icon">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="stat-content">
                <span className="stat-number">{summary.pending}</span>
                <span className="stat-label">Đang xem xét</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Buttons */}
      {applications.length > 0 && (
        <div className="filter-section">
          <div className="filter-container">
            <button
              className={`filter-btn ${statusFilter === '' ? 'active' : ''}`}
              onClick={() => handleStatusFilter('')}
            >
              <span className="filter-icon">📋</span>
              <span>Tất cả</span>
            </button>
            <button
              className={`filter-btn pending ${statusFilter === 'pending' ? 'active' : ''}`}
              onClick={() => handleStatusFilter('pending')}
            >
              <span className="filter-icon">⏳</span>
              <span>Đang xem xét</span>
            </button>
            <button
              className={`filter-btn approved ${statusFilter === 'approved' ? 'active' : ''}`}
              onClick={() => handleStatusFilter('approved')}
            >
              <span className="filter-icon">✅</span>
              <span>Đã duyệt</span>
            </button>
            <button
              className={`filter-btn rejected ${statusFilter === 'rejected' ? 'active' : ''}`}
              onClick={() => handleStatusFilter('rejected')}
            >
              <span className="filter-icon">❌</span>
              <span>Từ chối</span>
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="error-section">
          <div className="error-card">
            <div className="error-icon">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="error-content">
              <h3 className="error-title">Không tìm thấy kết quả</h3>
              <p className="error-text">{error}</p>
            </div>
          </div>
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
