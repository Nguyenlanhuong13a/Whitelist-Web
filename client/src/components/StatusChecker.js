import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { authenticatedFetch } from '../utils/steamAuth';

function StatusChecker() {
  const { user } = useUser();
  const [steamId, setSteamId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-populate Steam ID when user is connected
  useEffect(() => {
    if (user?.steamId && !steamId) {
      setSteamId(user.steamId);
    }
  }, [user, steamId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!steamId) {
      setError('Vui lòng nhập Steam ID của bạn');
      return;
    }

    setLoading(true);
    setError('');
    setSearchResult(null);

    try {
      const response = await authenticatedFetch(`/api/applications/status/steam/${encodeURIComponent(steamId.trim())}`);
      const data = await response.json();

      if (response.ok) {
        const application = data.application;
        setSearchResult({
          steamId: application.steamId,
          discordId: application.discordId,
          status: application.status,
          submittedDate: new Date(application.submittedAt).toLocaleDateString('vi-VN'),
          reviewedDate: application.reviewedAt
            ? new Date(application.reviewedAt).toLocaleDateString('vi-VN')
            : null,
          feedback: application.feedback || '',
          characterName: application.characterName
        });
      } else {
        if (response.status === 404) {
          setError('Không tìm thấy đơn đăng ký với Steam ID này');
        } else {
          setError(data.message || 'Có lỗi xảy ra khi kiểm tra trạng thái');
        }
      }
    } catch (error) {
      console.error('Status check error:', error);
      setError('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    if (status === 'approved') return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
    if (status === 'rejected') return 'bg-red-500/20 text-red-400 border border-red-500/30';
    return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
  };

  const getStatusText = (status) => {
    if (status === 'approved') return 'Đã duyệt';
    if (status === 'rejected') return 'Từ chối';
    return 'Đang xem xét';
  };

  const getStatusIcon = (status) => {
    if (status === 'approved') {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
    if (status === 'rejected') {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  };

  return (
    <div className="glass-strong rounded-2xl p-8 lg:p-10 shadow-glass animate-fade-in flex flex-col">
      <div className="flex items-start space-x-4 mb-8 py-2">
        <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-glow flex-shrink-0 mt-1">
          {/* AWS-style Search Icon */}
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-white break-words vietnamese-text text-wrap-anywhere leading-relaxed">
            Kiểm tra trạng thái đơn đăng ký
          </h2>
        </div>
      </div>

      <p className="text-gray-300 mb-10 leading-relaxed break-words vietnamese-text text-wrap-anywhere text-lg">
        Nhập Steam ID của bạn để kiểm tra trạng thái đơn đăng ký whitelist.
      </p>

      <form onSubmit={handleSubmit} className="space-y-8 flex-grow">
        <div className="space-y-6">
          <label htmlFor="steamSearch" className="block text-base font-medium text-gray-200 vietnamese-text">
            Steam ID:
          </label>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {/* Steam Icon */}
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.541 0 0.295 4.384 0.025 9.9L6.5 12.577L6.533 12.561C7.07 12.275 7.714 12.281 8.234 12.595C8.777 12.926 9.109 13.499 9.115 14.116L9.112 14.15L12.942 16.554L12.993 16.5C13.149 16.331 13.331 16.181 13.532 16.069C15.73 14.742 18.933 15.533 20.26 17.731C21.586 19.928 20.796 23.131 18.598 24.458C16.402 25.784 13.199 24.994 11.873 22.797C11.574 22.28 11.419 21.7 11.419 21.092C11.407 20.557 11.548 20.048 11.785 19.596L9.273 13.827C9.221 13.829 9.17 13.831 9.118 13.829C7.772 13.773 6.651 12.831 6.53 11.631L0.059 9L0.061 9.008C0.201 12.324 1.767 15.632 4.589 17.903C8.146 20.781 13.306 21.157 17.254 18.945L17.25 18.964C19.997 17.212 21.93 14.581 22.973 11.309C24.06 7.886 23.243 4.292 20.677 1.707C18.627 -0.348 15.543 -0.524 13.239 0.239C12.495 0.435 11.747 0.714 11.018 1.067C9.672 1.71 8.254 2.679 6.994 3.939C4.33 6.599 2.868 9.648 2.412 11.984C2.403 12.023 2.395 12.063 2.39 12.104L6.454 14L6.485 13.966C6.675 13.749 6.904 13.57 7.156 13.432C7.681 13.135 8.289 13.091 8.834 13.225L12.141 6.645C12.146 5.991 12.345 5.406 12.66 4.908C13.339 3.793 14.608 3.058 16.025 3.058C17.989 3.058 19.58 4.649 19.58 6.613C19.58 8.577 17.989 10.169 16.025 10.169C16.009 10.169 15.994 10.168 15.978 10.168L11.456 16.5C11.563 16.631 11.66 16.772 11.739 16.92C11.833 17.097 11.905 17.287 11.959 17.486C12.013 17.687 12.047 17.894 12.06 18.1C12.066 18.254 12.061 18.402 12.047 18.545L15.145 20.875L15.156 20.856C16.761 20.119 17.754 18.437 17.61 16.634C17.456 14.696 15.96 13.051 14.09 12.484L14.097 12.485C11.724 11.932 9.334 13.276 8.493 15.553C8.188 16.354 8.161 17.136 8.347 17.844L6.298 19.179C6.4 19.235 6.493 19.312 6.596 19.366C6.876 19.508 7.189 19.561 7.493 19.567C8.403 19.585 9.142 18.873 9.16 17.963C9.178 17.055 8.466 16.316 7.557 16.297C7.128 16.287 6.747 16.456 6.475 16.738L4.677 15.487C6.053 13.219 8.987 12.535 11.31 13.887C11.65 14.069 11.943 14.301 12.205 14.558C12.252 14.607 12.308 14.644 12.385 14.653C12.463 14.664 12.535 14.64 12.591 14.593L17.227 7.999C17.286 8.002 17.347 8.003 17.409 8.003C18.869 8.003 20.053 6.818 20.053 5.359C20.053 3.901 18.868 2.717 17.409 2.717C15.95 2.717 14.765 3.901 14.765 5.359C14.765 5.369 14.765 5.379 14.766 5.389L10.156 11.983C10.025 12.044 9.902 12.126 9.784 12.224C9.4 12.544 9.13 13.008 9.088 13.523L9.073 13.597L8.005 15.596C7.262 15.342 6.131 15.443 5.591 15.98C5.526 16.045 5.458 16.121 5.403 16.196L4.333 15.64C5.126 14.971 6.033 14.454 6.983 14.122L6.513 12.566L6.48 12.6C5.909 13.248 4.38 13.296 3.671 12.661C3.538 12.543 3.444 12.382 3.444 12.189C3.445 12.044 3.49 11.896 3.6 11.784L3.604 11.779C3.604 11.779 3.842 9.331 6.561 6.633C8.97 4.238 11.427 3.276 12.835 2.861C15.269 2.088 17.774 2.231 19.405 3.823C21.678 5.849 22.173 8.779 21.266 11.625C20.321 14.443 18.643 16.775 16.211 18.295C13.621 19.809 9.909 19.966 7.013 17.76C4.243 15.572 2.553 11.546 3.094 7.478C3.1 7.431 3.092 7.371 3.064 7.333C3.035 7.293 2.985 7.264 2.928 7.262C2.871 7.259 2.814 7.284 2.779 7.328C2.744 7.37 2.729 7.431 2.742 7.485C2.742 7.485 2.998 8.944 3.998 10.534C5.214 12.417 6.98 14.047 8.528 14.946C12.201 17.054 15.068 16.891 16.873 16.101C19.204 15.067 21.155 13.332 22.275 10.833C24.376 5.994 21.396 1.715 18.307 0.941C16.994 0.643 14.703 0.729 12.48 1.823C10.463 2.946 6.669 6.084 5.615 10.481C5.595 10.556 5.592 10.63 5.608 10.684L5.958 11.541L5.99 11.526C6.276 11.349 6.654 11.28 6.995 11.384L7.022 11.39L11.43 3.694C10.445 4.344 9.617 5.197 9.617 5.197L5.021 13.258C5.021 13.258 5.156 13.78 5.908 14.019L6.673 12.34L6.711 12.356C7.112 12.561 7.249 12.899 6.942 13.373C6.942 13.373 5.816 12.853 4.482 12.122C4.178 11.956 3.863 11.785 3.569 11.619L3.549 11.596C3.549 11.596 4.08 7.085 8.733 3.77C11.382 1.547 14.045 1.306 16.136 1.845C17.764 2.281 19.762 3.2 20.748 5.834C21.702 8.085 21.311 10.448 20.321 12.533C18.967 15.553 16.496 17.628 12.919 18.252C12.333 18.33 11.749 18.369 11.174 18.369C9.149 18.369 7.245 17.699 5.805 16.392C3.652 14.215 2.671 11.159 3.111 8.143C3.111 8.142 3.112 8.141 3.112 8.141C3.334 6.923 3.814 5.816 4.458 4.825C6.572 1.55 11.147 -0.739 15.532 0.214C21.226 1.151 23.897 6.323 23.983 11.509C23.622 17.284 18.61 22 12.503 22C11.744 22 11.001 21.905 10.286 21.722C8.109 21.195 6.158 19.912 4.745 18.11C3.375 16.242 2.5 14.127 2.5 11.983C2.5 11.768 2.529 11.555 2.544 11.342C2.589 10.595 2.661 9.841 2.781 9.099L2.698 9.066C2.698 9.066 2.499 9.452 2.418 9.954C2.407 10.039 2.4 10.132 2.4 10.234V10.237L2.4 10.252C2.4 10.273 2.4 10.295 2.4 10.316C2.4 16.386 7.33 21.316 13.4 21.316C19.471 21.316 24.4 16.386 24.4 10.316C24.4 4.245 19.471 -0.684 13.4 -0.684L12 0Z"/>
                </svg>
              </div>
              <input
                type="text"
                id="steamSearch"
                value={steamId}
                onChange={(e) => setSteamId(e.target.value)}
                placeholder={user?.steamId ? "Đã tự động điền từ tài khoản Steam đã kết nối" : "Nhập Steam ID của bạn"}
                className={`input-field pl-10 text-wrap-anywhere h-14 text-base ${user?.steamId && steamId === user.steamId ? 'border-green-500 focus:border-green-500 bg-green-500/10' : 'focus:border-primary-500'}`}
                readOnly={!!user?.steamId}
              />
              {user?.steamId && steamId === user.steamId && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="flex items-center space-x-1 text-green-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-xs font-medium">Tự động</span>
                  </div>
                </div>
              )}
            </div>
            <button type="submit" className="btn-primary px-6 sm:px-8 w-full sm:w-auto group h-14 text-base">
              {/* AWS-style Search Icon */}
              <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="vietnamese-text">Kiểm tra</span>
            </button>
          </div>
          {error && (
            <div className="flex items-start space-x-2 text-red-400 text-sm">
              {/* AWS-style Error Icon */}
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="break-words vietnamese-text text-wrap-anywhere leading-relaxed">{error}</span>
            </div>
          )}
        </div>
      </form>

      {loading && (
        <div className="mt-8 text-center">
          <div className="glass rounded-xl p-8 border border-primary-500/30">
            <div className="flex items-center justify-center space-x-3 mb-4">
              {/* AWS-style Loading Icon */}
              <svg className="w-6 h-6 text-primary-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-primary-400 font-medium vietnamese-text">Đang tìm kiếm...</span>
            </div>
            <div className="w-full bg-dark-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
            </div>
          </div>
        </div>
      )}

      {searchResult && !loading && (
        <div className="mt-10 animate-slide-up">
          <div className="flex items-start space-x-3 mb-8">
            {/* AWS-style Document Icon */}
            <svg className="w-6 h-6 text-emerald-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg sm:text-xl font-display font-semibold text-white break-words vietnamese-text text-wrap-anywhere leading-relaxed">Kết quả tìm kiếm</h3>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <span className={`status-badge ${getStatusClass(searchResult.status)}`}>
                  {getStatusIcon(searchResult.status)}
                  <span className="ml-2 vietnamese-text">{getStatusText(searchResult.status)}</span>
                </span>
              </div>
            </div>

            <div className="card-body space-y-8 py-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    {/* Steam Icon */}
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.541 0 0.295 4.384 0.025 9.9L6.5 12.577L6.533 12.561C7.07 12.275 7.714 12.281 8.234 12.595C8.777 12.926 9.109 13.499 9.115 14.116L9.112 14.15L12.942 16.554L12.993 16.5C13.149 16.331 13.331 16.181 13.532 16.069C15.73 14.742 18.933 15.533 20.26 17.731C21.586 19.928 20.796 23.131 18.598 24.458C16.402 25.784 13.199 24.994 11.873 22.797C11.574 22.28 11.419 21.7 11.419 21.092C11.407 20.557 11.548 20.048 11.785 19.596L9.273 13.827C9.221 13.829 9.17 13.831 9.118 13.829C7.772 13.773 6.651 12.831 6.53 11.631L0.059 9L0.061 9.008C0.201 12.324 1.767 15.632 4.589 17.903C8.146 20.781 13.306 21.157 17.254 18.945L17.25 18.964C19.997 17.212 21.93 14.581 22.973 11.309C24.06 7.886 23.243 4.292 20.677 1.707C18.627 -0.348 15.543 -0.524 13.239 0.239C12.495 0.435 11.747 0.714 11.018 1.067C9.672 1.71 8.254 2.679 6.994 3.939C4.33 6.599 2.868 9.648 2.412 11.984C2.403 12.023 2.395 12.063 2.39 12.104L6.454 14L6.485 13.966C6.675 13.749 6.904 13.57 7.156 13.432C7.681 13.135 8.289 13.091 8.834 13.225L12.141 6.645C12.146 5.991 12.345 5.406 12.66 4.908C13.339 3.793 14.608 3.058 16.025 3.058C17.989 3.058 19.58 4.649 19.58 6.613C19.58 8.577 17.989 10.169 16.025 10.169C16.009 10.169 15.994 10.168 15.978 10.168L11.456 16.5C11.563 16.631 11.66 16.772 11.739 16.92C11.833 17.097 11.905 17.287 11.959 17.486C12.013 17.687 12.047 17.894 12.06 18.1C12.066 18.254 12.061 18.402 12.047 18.545L15.145 20.875L15.156 20.856C16.761 20.119 17.754 18.437 17.61 16.634C17.456 14.696 15.96 13.051 14.09 12.484L14.097 12.485C11.724 11.932 9.334 13.276 8.493 15.553C8.188 16.354 8.161 17.136 8.347 17.844L6.298 19.179C6.4 19.235 6.493 19.312 6.596 19.366C6.876 19.508 7.189 19.561 7.493 19.567C8.403 19.585 9.142 18.873 9.16 17.963C9.178 17.055 8.466 16.316 7.557 16.297C7.128 16.287 6.747 16.456 6.475 16.738L4.677 15.487C6.053 13.219 8.987 12.535 11.31 13.887C11.65 14.069 11.943 14.301 12.205 14.558C12.252 14.607 12.308 14.644 12.385 14.653C12.463 14.664 12.535 14.64 12.591 14.593L17.227 7.999C17.286 8.002 17.347 8.003 17.409 8.003C18.869 8.003 20.053 6.818 20.053 5.359C20.053 3.901 18.868 2.717 17.409 2.717C15.95 2.717 14.765 3.901 14.765 5.359C14.765 5.369 14.765 5.379 14.766 5.389L10.156 11.983C10.025 12.044 9.902 12.126 9.784 12.224C9.4 12.544 9.13 13.008 9.088 13.523L9.073 13.597L8.005 15.596C7.262 15.342 6.131 15.443 5.591 15.98C5.526 16.045 5.458 16.121 5.403 16.196L4.333 15.64C5.126 14.971 6.033 14.454 6.983 14.122L6.513 12.566L6.48 12.6C5.909 13.248 4.38 13.296 3.671 12.661C3.538 12.543 3.444 12.382 3.444 12.189C3.445 12.044 3.49 11.896 3.6 11.784L3.604 11.779C3.604 11.779 3.842 9.331 6.561 6.633C8.97 4.238 11.427 3.276 12.835 2.861C15.269 2.088 17.774 2.231 19.405 3.823C21.678 5.849 22.173 8.779 21.266 11.625C20.321 14.443 18.643 16.775 16.211 18.295C13.621 19.809 9.909 19.966 7.013 17.76C4.243 15.572 2.553 11.546 3.094 7.478C3.1 7.431 3.092 7.371 3.064 7.333C3.035 7.293 2.985 7.264 2.928 7.262C2.871 7.259 2.814 7.284 2.779 7.328C2.744 7.37 2.729 7.431 2.742 7.485C2.742 7.485 2.998 8.944 3.998 10.534C5.214 12.417 6.98 14.047 8.528 14.946C12.201 17.054 15.068 16.891 16.873 16.101C19.204 15.067 21.155 13.332 22.275 10.833C24.376 5.994 21.396 1.715 18.307 0.941C16.994 0.643 14.703 0.729 12.48 1.823C10.463 2.946 6.669 6.084 5.615 10.481C5.595 10.556 5.592 10.63 5.608 10.684L5.958 11.541L5.99 11.526C6.276 11.349 6.654 11.28 6.995 11.384L7.022 11.39L11.43 3.694C10.445 4.344 9.617 5.197 9.617 5.197L5.021 13.258C5.021 13.258 5.156 13.78 5.908 14.019L6.673 12.34L6.711 12.356C7.112 12.561 7.249 12.899 6.942 13.373C6.942 13.373 5.816 12.853 4.482 12.122C4.178 11.956 3.863 11.785 3.569 11.619L3.549 11.596C3.549 11.596 4.08 7.085 8.733 3.77C11.382 1.547 14.045 1.306 16.136 1.845C17.764 2.281 19.762 3.2 20.748 5.834C21.702 8.085 21.311 10.448 20.321 12.533C18.967 15.553 16.496 17.628 12.919 18.252C12.333 18.33 11.749 18.369 11.174 18.369C9.149 18.369 7.245 17.699 5.805 16.392C3.652 14.215 2.671 11.159 3.111 8.143C3.111 8.142 3.112 8.141 3.112 8.141C3.334 6.923 3.814 5.816 4.458 4.825C6.572 1.55 11.147 -0.739 15.532 0.214C21.226 1.151 23.897 6.323 23.983 11.509C23.622 17.284 18.61 22 12.503 22C11.744 22 11.001 21.905 10.286 21.722C8.109 21.195 6.158 19.912 4.745 18.11C3.375 16.242 2.5 14.127 2.5 11.983C2.5 11.768 2.529 11.555 2.544 11.342C2.589 10.595 2.661 9.841 2.781 9.099L2.698 9.066C2.698 9.066 2.499 9.452 2.418 9.954C2.407 10.039 2.4 10.132 2.4 10.234V10.237L2.4 10.252C2.4 10.273 2.4 10.295 2.4 10.316C2.4 16.386 7.33 21.316 13.4 21.316C19.471 21.316 24.4 16.386 24.4 10.316C24.4 4.245 19.471 -0.684 13.4 -0.684L12 0Z"/>
                    </svg>
                    <span className="text-sm font-medium text-gray-400 vietnamese-text">Steam ID</span>
                  </div>
                  <span className="text-white font-mono break-all text-wrap-anywhere">{searchResult.steamId}</span>
                </div>

                {searchResult.discordId && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      {/* Discord Icon */}
                      <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-400 vietnamese-text">Discord ID</span>
                    </div>
                    <span className="text-white font-mono break-all text-wrap-anywhere">{searchResult.discordId}</span>
                  </div>
                )}

                {searchResult.characterName && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      {/* AWS-style Tag Icon */}
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-400 vietnamese-text">Tên nhân vật</span>
                    </div>
                    <span className="text-white vietnamese-text text-wrap-anywhere">{searchResult.characterName}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    {/* AWS-style Calendar Icon */}
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-400 vietnamese-text">Ngày gửi đơn</span>
                  </div>
                  <span className="text-white vietnamese-text text-wrap-anywhere">{searchResult.submittedDate}</span>
                </div>

                {searchResult.reviewedDate && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      {/* AWS-style Clock Icon */}
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-400 vietnamese-text">Ngày xem xét</span>
                    </div>
                    <span className="text-white vietnamese-text text-wrap-anywhere">{searchResult.reviewedDate}</span>
                  </div>
                )}
              </div>

              {searchResult.feedback && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    {/* AWS-style Warning Icon */}
                    <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-red-400 font-medium mb-1 break-words vietnamese-text text-wrap-anywhere">Phản hồi từ Admin</h4>
                      <p className="text-red-200 break-words whitespace-pre-wrap vietnamese-text text-wrap-anywhere leading-relaxed">{searchResult.feedback}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {searchResult.status === 'rejected' && (
              <div className="card-footer">
                <button className="btn-primary w-full group">
                  {/* AWS-style Refresh Icon */}
                  <svg className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="vietnamese-text">Gửi lại đơn đăng ký</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {!searchResult && !loading && (
        <div className="mt-10 text-center">
          <div className="glass rounded-xl p-10 border border-dark-600/50 flex flex-col justify-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              {/* AWS-style Info Icon */}
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-400 italic break-words vietnamese-text text-wrap-anywhere leading-relaxed text-lg">
              {user?.steamId
                ? 'Steam ID đã được tự động điền từ tài khoản đã kết nối. Nhấn "Kiểm tra" để xem trạng thái đơn đăng ký.'
                : 'Nhập Steam ID của bạn và nhấn "Kiểm tra" để xem trạng thái đơn đăng ký.'
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default StatusChecker; 