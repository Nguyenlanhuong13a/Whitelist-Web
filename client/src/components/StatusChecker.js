import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';

function StatusChecker() {
  const { user } = useUser();
  const [discordId, setDiscordId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-populate Discord ID when user is connected
  useEffect(() => {
    if (user?.discordId && !discordId) {
      setDiscordId(user.discordId);
    }
  }, [user, discordId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!discordId) {
      setError('Vui lòng nhập Discord ID của bạn');
      return;
    }

    setLoading(true);
    setError('');
    setSearchResult(null);

    try {
      const response = await fetch(`/api/applications/status/${encodeURIComponent(discordId.trim())}`);
      const data = await response.json();

      if (response.ok) {
        const application = data.application;
        setSearchResult({
          discordId: application.discordId,
          status: application.status,
          submittedDate: new Date(application.submittedAt).toLocaleDateString('vi-VN'),
          reviewedDate: application.reviewedAt
            ? new Date(application.reviewedAt).toLocaleDateString('vi-VN')
            : null,
          feedback: application.feedback || '',
          characterName: application.characterName,
          steamId: application.steamId
        });
      } else {
        if (response.status === 404) {
          setError('Không tìm thấy đơn đăng ký với Discord ID này');
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
        Nhập Discord ID của bạn để kiểm tra trạng thái đơn đăng ký whitelist.
      </p>

      <form onSubmit={handleSubmit} className="space-y-8 flex-grow">
        <div className="space-y-6">
          <label htmlFor="discordSearch" className="block text-base font-medium text-gray-200 vietnamese-text">
            Discord ID:
          </label>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {/* AWS-style User Icon */}
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                type="text"
                id="discordSearch"
                value={discordId}
                onChange={(e) => setDiscordId(e.target.value)}
                placeholder={user?.discordId ? "Đã tự động điền từ tài khoản Discord đã kết nối" : "Nhập Discord ID của bạn"}
                className={`input-field pl-10 text-wrap-anywhere h-14 text-base ${user?.discordId && discordId === user.discordId ? 'border-green-500 focus:border-green-500 bg-green-500/10' : 'focus:border-primary-500'}`}
                readOnly={!!user?.discordId}
              />
              {user?.discordId && discordId === user.discordId && (
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
                    {/* AWS-style User Icon */}
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-400 vietnamese-text">Discord ID</span>
                  </div>
                  <span className="text-white font-mono break-all text-wrap-anywhere">{searchResult.discordId}</span>
                </div>

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
              {user?.discordId
                ? 'Discord ID đã được tự động điền từ tài khoản đã kết nối. Nhấn "Kiểm tra" để xem trạng thái đơn đăng ký.'
                : 'Nhập Discord ID của bạn và nhấn "Kiểm tra" để xem trạng thái đơn đăng ký. Hoặc kết nối Discord trong Cài đặt để tự động điền.'
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default StatusChecker; 