import React from 'react';
import ServerRules from '../components/ServerRules';

function RulesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center space-x-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-glow">
                {/* AWS-style Scale Icon */}
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <h1 className="text-5xl md:text-6xl font-display font-bold bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400 bg-clip-text text-transparent">
                Luật Server
              </h1>
            </div>

            <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
              Dưới đây là bộ quy định chi tiết và đầy đủ của West Roleplay. Vui lòng đọc kỹ từng mục
              trước khi tham gia để đảm bảo trải nghiệm roleplay tốt nhất cho tất cả mọi người.
            </p>

            <div className="glass rounded-2xl p-6 max-w-2xl mx-auto border border-amber-500/30">
              <div className="flex items-center justify-center space-x-3 mb-4">
                {/* AWS-style Warning Icon */}
                <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-amber-400">Thông báo quan trọng</h3>
              </div>
              <p className="text-amber-200 font-medium">
                Việc tuân thủ nghiêm ngặt các quy định này là điều kiện bắt buộc để duy trì tư cách thành viên.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Rules Content */}
      <ServerRules />
    </div>
  );
}

export default RulesPage;