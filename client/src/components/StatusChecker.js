import React, { useState } from 'react';

function StatusChecker() {
  const [discordId, setDiscordId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!discordId) {
      setError('Vui lòng nhập Discord ID của bạn');
      return;
    }

    setLoading(true);
    setError('');
    
    // Giả lập API call
    setTimeout(() => {
      setLoading(false);
      
      // Giả lập dữ liệu
      const statuses = ['pending', 'approved', 'rejected'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      setSearchResult({
        discordId: discordId,
        status: randomStatus,
        submittedDate: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        reviewedDate: randomStatus !== 'pending' 
          ? new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000).toLocaleDateString() 
          : null,
        feedback: randomStatus === 'rejected' 
          ? 'Tiểu sử nhân vật không đủ chi tiết. Vui lòng điều chỉnh và gửi lại.'
          : ''
      });
    }, 1500);
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
    <div className="glass-strong rounded-2xl p-8 shadow-glass animate-fade-in">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-glow">
          {/* AWS-style Search Icon */}
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h2 className="text-xl sm:text-2xl font-display font-bold text-white break-words vietnamese-text">Kiểm tra trạng thái đơn đăng ký</h2>
      </div>

      <p className="text-gray-300 mb-8 leading-relaxed break-words vietnamese-text">
        Nhập Discord ID của bạn để kiểm tra trạng thái đơn đăng ký whitelist.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <label htmlFor="discordSearch" className="block text-sm font-medium text-gray-200">
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
                placeholder="Nhập Discord ID của bạn"
                className="input-field pl-10"
              />
            </div>
            <button type="submit" className="btn-primary px-6 sm:px-8 w-full sm:w-auto group">
              {/* AWS-style Search Icon */}
              <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Kiểm tra
            </button>
          </div>
          {error && (
            <div className="flex items-center space-x-2 text-red-400 text-sm">
              {/* AWS-style Error Icon */}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
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
              <span className="text-primary-400 font-medium">Đang tìm kiếm...</span>
            </div>
            <div className="w-full bg-dark-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
            </div>
          </div>
        </div>
      )}

      {searchResult && !loading && (
        <div className="mt-8 animate-slide-up">
          <div className="flex items-center space-x-3 mb-6">
            {/* AWS-style Document Icon */}
            <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg sm:text-xl font-display font-semibold text-white break-words">Kết quả tìm kiếm</h3>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <span className={`status-badge ${getStatusClass(searchResult.status)}`}>
                  {getStatusIcon(searchResult.status)}
                  <span className="ml-2">{getStatusText(searchResult.status)}</span>
                </span>
              </div>
            </div>

            <div className="card-body space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    {/* AWS-style User Icon */}
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-400">Discord ID</span>
                  </div>
                  <span className="text-white font-mono break-all">{searchResult.discordId}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    {/* AWS-style Calendar Icon */}
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-400">Ngày gửi đơn</span>
                  </div>
                  <span className="text-white">{searchResult.submittedDate}</span>
                </div>

                {searchResult.reviewedDate && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      {/* AWS-style Clock Icon */}
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-400">Ngày xem xét</span>
                    </div>
                    <span className="text-white">{searchResult.reviewedDate}</span>
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
                      <h4 className="text-red-400 font-medium mb-1 break-words">Phản hồi từ Admin</h4>
                      <p className="text-red-200 break-words whitespace-pre-wrap vietnamese-text">{searchResult.feedback}</p>
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
                  Gửi lại đơn đăng ký
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {!searchResult && !loading && (
        <div className="mt-8 text-center">
          <div className="glass rounded-xl p-8 border border-dark-600/50">
            <div className="flex items-center justify-center space-x-3 mb-4">
              {/* AWS-style Info Icon */}
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-400 italic break-words">
              Nhập Discord ID của bạn và nhấn "Kiểm tra" để xem trạng thái đơn đăng ký.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default StatusChecker; 