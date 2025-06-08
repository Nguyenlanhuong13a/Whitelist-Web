import React from 'react';
import StatusChecker from '../components/StatusChecker';

function StatusPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center space-x-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-glow">
                {/* AWS-style Search Icon */}
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400 bg-clip-text text-transparent break-words vietnamese-text text-wrap-anywhere">
                Kiểm tra trạng thái
              </h1>
            </div>

            <p className="text-lg sm:text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto break-words vietnamese-text text-wrap-anywhere">
              Sử dụng công cụ bên dưới để kiểm tra trạng thái đơn đăng ký whitelist của bạn.
              Kết nối Discord trong Cài đặt để tự động điền ID, hoặc nhập thủ công để xem trạng thái hiện tại.
            </p>

            <div className="glass rounded-2xl p-6 max-w-2xl mx-auto border border-primary-500/30">
              <div className="flex items-center justify-center space-x-3 mb-4">
                {/* AWS-style Info Icon */}
                <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg sm:text-xl font-semibold text-primary-400 break-words vietnamese-text text-wrap-anywhere">Hướng dẫn sử dụng</h3>
              </div>
              <p className="text-primary-200 font-medium break-words vietnamese-text text-wrap-anywhere leading-relaxed">
                Nhập chính xác Discord ID của bạn để kiểm tra trạng thái đơn đăng ký whitelist.
                Kết nối Discord trong Cài đặt để tự động điền thông tin.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Checker Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 overflow-visible">
        <StatusChecker />
      </div>
    </div>
  );
}

export default StatusPage;