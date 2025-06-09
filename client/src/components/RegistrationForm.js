import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { authenticatedFetch } from '../utils/steamAuth';

function RegistrationForm() {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    discord: '',
    steam: '',
    name: '',
    birthDate: '',
    backstory: '',
    reason: ''
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-populate Steam ID and Discord ID when user is connected
  useEffect(() => {
    if (user?.steamId && !formData.steam) {
      setFormData(prev => ({
        ...prev,
        steam: user.steamId
      }));
    }

    if (user?.discordId && !formData.discord) {
      setFormData(prev => ({
        ...prev,
        discord: user.discordId
      }));
    }
  }, [user, formData.steam, formData.discord]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validate = () => {
    let tempErrors = {};
    
    if (!formData.discord) tempErrors.discord = "Discord ID là bắt buộc";
    if (!formData.steam) tempErrors.steam = "Steam ID là bắt buộc";
    if (!formData.name) tempErrors.name = "Tên nhân vật là bắt buộc";
    
    if (!formData.birthDate) {
      tempErrors.birthDate = "Ngày sinh là bắt buộc";
    } else {
      // Tính tuổi dựa trên ngày sinh
      const today = new Date();
      const birthDate = new Date(formData.birthDate);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 16) {
        tempErrors.birthDate = "Bạn phải từ 16 tuổi trở lên";
      }
    }
    
    if (!formData.backstory) tempErrors.backstory = "Tiểu sử nhân vật là bắt buộc";
    else if (formData.backstory.length < 100) tempErrors.backstory = "Tiểu sử phải có ít nhất 100 ký tự";
    if (!formData.reason) tempErrors.reason = "Lý do tham gia là bắt buộc";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      setIsSubmitting(true);

      try {
        const response = await authenticatedFetch('/api/applications', {
          method: 'POST',
          body: JSON.stringify({
            discord: formData.discord,
            steam: formData.steam,
            name: formData.name,
            birthDate: formData.birthDate,
            backstory: formData.backstory,
            reason: formData.reason
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setSubmitted(true);
        } else {
          // Handle validation errors
          if (data.details && Array.isArray(data.details)) {
            const newErrors = {};
            data.details.forEach(error => {
              const field = error.path || error.param;
              if (field) {
                newErrors[field] = error.msg;
              }
            });
            setErrors(newErrors);
          } else {
            setErrors({ general: data.message || 'Có lỗi xảy ra khi gửi đơn đăng ký' });
          }
        }
      } catch (error) {
        console.error('Submission error:', error);
        setErrors({ general: 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (submitted) {
    return (
      <div className="glass-strong rounded-2xl p-8 text-center shadow-glass animate-scale-in">
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center border border-emerald-500/30 animate-bounce-subtle">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h2 className="text-3xl font-display font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent mb-4">
          Đơn đăng ký đã được gửi!
        </h2>

        <p className="text-gray-300 mb-8 max-w-lg mx-auto leading-relaxed">
          Cảm ơn bạn đã đăng ký whitelist cho West Roleplay. Chúng tôi sẽ xem xét đơn của bạn và liên hệ thông qua Discord.
          Bạn có thể kiểm tra trạng thái đơn đăng ký của mình ở trang "Trạng thái".
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            className="btn-primary group"
            onClick={() => {
              setFormData({
                discord: '',
                steam: '',
                name: '',
                birthDate: '',
                backstory: '',
                reason: ''
              });
              setSubmitted(false);
            }}
          >
            {/* AWS-style Document Icon */}
            <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Gửi đơn mới</span>
          </button>
          <a href="/status" className="btn-outline group">
            {/* AWS-style Chart Icon */}
            <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Kiểm tra trạng thái</span>
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-strong rounded-2xl shadow-glass overflow-hidden animate-fade-in">
      <div className="bg-gradient-to-r from-primary-600/20 to-secondary-600/20 border-b border-dark-700/50 p-8">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-glow">
            {/* AWS-style Document Icon */}
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-display font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              Đơn đăng ký Whitelist
            </h2>
            <p className="text-gray-300 mt-1 font-medium">Điền đầy đủ thông tin bên dưới để đăng ký</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        {errors.general && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1 min-w-0">
                <h4 className="text-red-400 font-medium mb-1">Lỗi</h4>
                <p className="text-red-200 break-words vietnamese-text text-wrap-anywhere leading-relaxed">{errors.general}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label htmlFor="discord" className="block text-sm font-semibold text-gray-200 mb-3">
              <span className="flex items-center space-x-2">
                {/* AWS-style Chat Icon */}
                <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>Discord ID</span>
                <span className="text-red-400">*</span>
              </span>
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400 group-focus-within:text-primary-400 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                </svg>
              </div>
              <input
                type="text"
                id="discord"
                name="discord"
                placeholder={user?.discordId ? "Đã tự động điền từ tài khoản Discord" : "Ví dụ: username#1234"}
                value={formData.discord}
                onChange={handleChange}
                className={`input-field pl-12 h-14 ${errors.discord ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : user?.discordId ? 'border-green-500 focus:border-green-500' : 'focus:border-primary-500'}`}
                readOnly={!!user?.discordId}
              />
              {user?.discordId && (
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
            {errors.discord && (
              <p className="mt-2 text-sm text-red-400 flex items-center space-x-1">
                {/* AWS-style Warning Icon */}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{errors.discord}</span>
              </p>
            )}
          </div>
          
          <div>
            <label htmlFor="steam" className="block text-sm font-semibold text-gray-200 mb-3">
              <span className="flex items-center space-x-2">
                {/* AWS-style Game Icon */}
                <svg className="w-4 h-4 text-primary-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.541 0 0.295 4.384 0.025 9.9L6.5 12.577L6.533 12.561C7.07 12.275 7.714 12.281 8.234 12.595C8.777 12.926 9.109 13.499 9.115 14.116L9.112 14.15L12.942 16.554L12.993 16.5C13.149 16.331 13.331 16.181 13.532 16.069C15.73 14.742 18.933 15.533 20.26 17.731C21.586 19.928 20.796 23.131 18.598 24.458C16.402 25.784 13.199 24.994 11.873 22.797C11.574 22.28 11.419 21.7 11.419 21.092C11.407 20.557 11.548 20.048 11.785 19.596L9.273 13.827C9.221 13.829 9.17 13.831 9.118 13.829C7.772 13.773 6.651 12.831 6.53 11.631L0.059 9L0.061 9.008C0.201 12.324 1.767 15.632 4.589 17.903C8.146 20.781 13.306 21.157 17.254 18.945L17.25 18.964C19.997 17.212 21.93 14.581 22.973 11.309C24.06 7.886 23.243 4.292 20.677 1.707C18.627 -0.348 15.543 -0.524 13.239 0.239C12.495 0.435 11.747 0.714 11.018 1.067C9.672 1.71 8.254 2.679 6.994 3.939C4.33 6.599 2.868 9.648 2.412 11.984C2.403 12.023 2.395 12.063 2.39 12.104L6.454 14L6.485 13.966C6.675 13.749 6.904 13.57 7.156 13.432C7.681 13.135 8.289 13.091 8.834 13.225L12.141 6.645C12.146 5.991 12.345 5.406 12.66 4.908C13.339 3.793 14.608 3.058 16.025 3.058C17.989 3.058 19.58 4.649 19.58 6.613C19.58 8.577 17.989 10.169 16.025 10.169C16.009 10.169 15.994 10.168 15.978 10.168L11.456 16.5C11.563 16.631 11.66 16.772 11.739 16.92C11.833 17.097 11.905 17.287 11.959 17.486C12.013 17.687 12.047 17.894 12.06 18.1C12.066 18.254 12.061 18.402 12.047 18.545L15.145 20.875L15.156 20.856C16.761 20.119 17.754 18.437 17.61 16.634C17.456 14.696 15.96 13.051 14.09 12.484L14.097 12.485C11.724 11.932 9.334 13.276 8.493 15.553C8.188 16.354 8.161 17.136 8.347 17.844L6.298 19.179C6.4 19.235 6.493 19.312 6.596 19.366C6.876 19.508 7.189 19.561 7.493 19.567C8.403 19.585 9.142 18.873 9.16 17.963C9.178 17.055 8.466 16.316 7.557 16.297C7.128 16.287 6.747 16.456 6.475 16.738L4.677 15.487C6.053 13.219 8.987 12.535 11.31 13.887C11.65 14.069 11.943 14.301 12.205 14.558C12.252 14.607 12.308 14.644 12.385 14.653C12.463 14.664 12.535 14.64 12.591 14.593L17.227 7.999C17.286 8.002 17.347 8.003 17.409 8.003C18.869 8.003 20.053 6.818 20.053 5.359C20.053 3.901 18.868 2.717 17.409 2.717C15.95 2.717 14.765 3.901 14.765 5.359C14.765 5.369 14.765 5.379 14.766 5.389L10.156 11.983C10.025 12.044 9.902 12.126 9.784 12.224C9.4 12.544 9.13 13.008 9.088 13.523L9.073 13.597L8.005 15.596C7.262 15.342 6.131 15.443 5.591 15.98C5.526 16.045 5.458 16.121 5.403 16.196L4.333 15.64C5.126 14.971 6.033 14.454 6.983 14.122L6.513 12.566L6.48 12.6C5.909 13.248 4.38 13.296 3.671 12.661C3.538 12.543 3.444 12.382 3.444 12.189C3.445 12.044 3.49 11.896 3.6 11.784L3.604 11.779C3.604 11.779 3.842 9.331 6.561 6.633C8.97 4.238 11.427 3.276 12.835 2.861C15.269 2.088 17.774 2.231 19.405 3.823C21.678 5.849 22.173 8.779 21.266 11.625C20.321 14.443 18.643 16.775 16.211 18.295C13.621 19.809 9.909 19.966 7.013 17.76C4.243 15.572 2.553 11.546 3.094 7.478C3.1 7.431 3.092 7.371 3.064 7.333C3.035 7.293 2.985 7.264 2.928 7.262C2.871 7.259 2.814 7.284 2.779 7.328C2.744 7.37 2.729 7.431 2.742 7.485C2.742 7.485 2.998 8.944 3.998 10.534C5.214 12.417 6.98 14.047 8.528 14.946C12.201 17.054 15.068 16.891 16.873 16.101C19.204 15.067 21.155 13.332 22.275 10.833C24.376 5.994 21.396 1.715 18.307 0.941C16.994 0.643 14.703 0.729 12.48 1.823C10.463 2.946 6.669 6.084 5.615 10.481C5.595 10.556 5.592 10.63 5.608 10.684L5.958 11.541L5.99 11.526C6.276 11.349 6.654 11.28 6.995 11.384L7.022 11.39L11.43 3.694C10.445 4.344 9.617 5.197 9.617 5.197L5.021 13.258C5.021 13.258 5.156 13.78 5.908 14.019L6.673 12.34L6.711 12.356C7.112 12.561 7.249 12.899 6.942 13.373C6.942 13.373 5.816 12.853 4.482 12.122C4.178 11.956 3.863 11.785 3.569 11.619L3.549 11.596C3.549 11.596 4.08 7.085 8.733 3.77C11.382 1.547 14.045 1.306 16.136 1.845C17.764 2.281 19.762 3.2 20.748 5.834C21.702 8.085 21.311 10.448 20.321 12.533C18.967 15.553 16.496 17.628 12.919 18.252C12.333 18.33 11.749 18.369 11.174 18.369C9.149 18.369 7.245 17.699 5.805 16.392C3.652 14.215 2.671 11.159 3.111 8.143C3.111 8.142 3.112 8.141 3.112 8.141C3.334 6.923 3.814 5.816 4.458 4.825C6.572 1.55 11.147 -0.739 15.532 0.214C21.226 1.151 23.897 6.323 23.983 11.509C23.622 17.284 18.61 22 12.503 22C11.744 22 11.001 21.905 10.286 21.722C8.109 21.195 6.158 19.912 4.745 18.11C3.375 16.242 2.5 14.127 2.5 11.983C2.5 11.768 2.529 11.555 2.544 11.342C2.589 10.595 2.661 9.841 2.781 9.099L2.698 9.066C2.698 9.066 2.499 9.452 2.418 9.954C2.407 10.039 2.4 10.132 2.4 10.234V10.237L2.4 10.252C2.4 10.273 2.4 10.295 2.4 10.316C2.4 16.386 7.33 21.316 13.4 21.316C19.471 21.316 24.4 16.386 24.4 10.316C24.4 4.245 19.471 -0.684 13.4 -0.684L12 0Z"/>
                </svg>
                <span>Steam ID</span>
                <span className="text-red-400">*</span>
              </span>
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400 group-focus-within:text-primary-400 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.541 0 0.295 4.384 0.025 9.9L6.5 12.577L6.533 12.561C7.07 12.275 7.714 12.281 8.234 12.595C8.777 12.926 9.109 13.499 9.115 14.116L9.112 14.15L12.942 16.554L12.993 16.5C13.149 16.331 13.331 16.181 13.532 16.069C15.73 14.742 18.933 15.533 20.26 17.731C21.586 19.928 20.796 23.131 18.598 24.458C16.402 25.784 13.199 24.994 11.873 22.797C11.574 22.28 11.419 21.7 11.419 21.092C11.407 20.557 11.548 20.048 11.785 19.596L9.273 13.827C9.221 13.829 9.17 13.831 9.118 13.829C7.772 13.773 6.651 12.831 6.53 11.631L0.059 9L0.061 9.008C0.201 12.324 1.767 15.632 4.589 17.903C8.146 20.781 13.306 21.157 17.254 18.945L17.25 18.964C19.997 17.212 21.93 14.581 22.973 11.309C24.06 7.886 23.243 4.292 20.677 1.707C18.627 -0.348 15.543 -0.524 13.239 0.239C12.495 0.435 11.747 0.714 11.018 1.067C9.672 1.71 8.254 2.679 6.994 3.939C4.33 6.599 2.868 9.648 2.412 11.984C2.403 12.023 2.395 12.063 2.39 12.104L6.454 14L6.485 13.966C6.675 13.749 6.904 13.57 7.156 13.432C7.681 13.135 8.289 13.091 8.834 13.225L12.141 6.645C12.146 5.991 12.345 5.406 12.66 4.908C13.339 3.793 14.608 3.058 16.025 3.058C17.989 3.058 19.58 4.649 19.58 6.613C19.58 8.577 17.989 10.169 16.025 10.169C16.009 10.169 15.994 10.168 15.978 10.168L11.456 16.5C11.563 16.631 11.66 16.772 11.739 16.92C11.833 17.097 11.905 17.287 11.959 17.486C12.013 17.687 12.047 17.894 12.06 18.1C12.066 18.254 12.061 18.402 12.047 18.545L15.145 20.875L15.156 20.856C16.761 20.119 17.754 18.437 17.61 16.634C17.456 14.696 15.96 13.051 14.09 12.484L14.097 12.485C11.724 11.932 9.334 13.276 8.493 15.553C8.188 16.354 8.161 17.136 8.347 17.844L6.298 19.179C6.4 19.235 6.493 19.312 6.596 19.366C6.876 19.508 7.189 19.561 7.493 19.567C8.403 19.585 9.142 18.873 9.16 17.963C9.178 17.055 8.466 16.316 7.557 16.297C7.128 16.287 6.747 16.456 6.475 16.738L4.677 15.487C6.053 13.219 8.987 12.535 11.31 13.887C11.65 14.069 11.943 14.301 12.205 14.558C12.252 14.607 12.308 14.644 12.385 14.653C12.463 14.664 12.535 14.64 12.591 14.593L17.227 7.999C17.286 8.002 17.347 8.003 17.409 8.003C18.869 8.003 20.053 6.818 20.053 5.359C20.053 3.901 18.868 2.717 17.409 2.717C15.95 2.717 14.765 3.901 14.765 5.359C14.765 5.369 14.765 5.379 14.766 5.389L10.156 11.983C10.025 12.044 9.902 12.126 9.784 12.224C9.4 12.544 9.13 13.008 9.088 13.523L9.073 13.597L8.005 15.596C7.262 15.342 6.131 15.443 5.591 15.98C5.526 16.045 5.458 16.121 5.403 16.196L4.333 15.64C5.126 14.971 6.033 14.454 6.983 14.122L6.513 12.566L6.48 12.6C5.909 13.248 4.38 13.296 3.671 12.661C3.538 12.543 3.444 12.382 3.444 12.189C3.445 12.044 3.49 11.896 3.6 11.784L3.604 11.779C3.604 11.779 3.842 9.331 6.561 6.633C8.97 4.238 11.427 3.276 12.835 2.861C15.269 2.088 17.774 2.231 19.405 3.823C21.678 5.849 22.173 8.779 21.266 11.625C20.321 14.443 18.643 16.775 16.211 18.295C13.621 19.809 9.909 19.966 7.013 17.76C4.243 15.572 2.553 11.546 3.094 7.478C3.1 7.431 3.092 7.371 3.064 7.333C3.035 7.293 2.985 7.264 2.928 7.262C2.871 7.259 2.814 7.284 2.779 7.328C2.744 7.37 2.729 7.431 2.742 7.485C2.742 7.485 2.998 8.944 3.998 10.534C5.214 12.417 6.98 14.047 8.528 14.946C12.201 17.054 15.068 16.891 16.873 16.101C19.204 15.067 21.155 13.332 22.275 10.833C24.376 5.994 21.396 1.715 18.307 0.941C16.994 0.643 14.703 0.729 12.48 1.823C10.463 2.946 6.669 6.084 5.615 10.481C5.595 10.556 5.592 10.63 5.608 10.684L5.958 11.541L5.99 11.526C6.276 11.349 6.654 11.28 6.995 11.384L7.022 11.39L11.43 3.694C10.445 4.344 9.617 5.197 9.617 5.197L5.021 13.258C5.021 13.258 5.156 13.78 5.908 14.019L6.673 12.34L6.711 12.356C7.112 12.561 7.249 12.899 6.942 13.373C6.942 13.373 5.816 12.853 4.482 12.122C4.178 11.956 3.863 11.785 3.569 11.619L3.549 11.596C3.549 11.596 4.08 7.085 8.733 3.77C11.382 1.547 14.045 1.306 16.136 1.845C17.764 2.281 19.762 3.2 20.748 5.834C21.702 8.085 21.311 10.448 20.321 12.533C18.967 15.553 16.496 17.628 12.919 18.252C12.333 18.33 11.749 18.369 11.174 18.369C9.149 18.369 7.245 17.699 5.805 16.392C3.652 14.215 2.671 11.159 3.111 8.143C3.111 8.142 3.112 8.141 3.112 8.141C3.334 6.923 3.814 5.816 4.458 4.825C6.572 1.55 11.147 -0.739 15.532 0.214C21.226 1.151 23.897 6.323 23.983 11.509C23.622 17.284 18.61 22 12.503 22C11.744 22 11.001 21.905 10.286 21.722C8.109 21.195 6.158 19.912 4.745 18.11C3.375 16.242 2.5 14.127 2.5 11.983C2.5 11.768 2.529 11.555 2.544 11.342C2.589 10.595 2.661 9.841 2.781 9.099L2.698 9.066C2.698 9.066 2.499 9.452 2.418 9.954C2.407 10.039 2.4 10.132 2.4 10.234V10.237L2.4 10.252C2.4 10.273 2.4 10.295 2.4 10.316C2.4 16.386 7.33 21.316 13.4 21.316C19.471 21.316 24.4 16.386 24.4 10.316C24.4 4.245 19.471 -0.684 13.4 -0.684L12 0Z"/>
                </svg>
              </div>
              <input
                type="text"
                id="steam"
                name="steam"
                placeholder={user?.steamId ? "Đã tự động điền từ tài khoản Steam" : "Ví dụ: 76561198123456789"}
                value={formData.steam}
                onChange={handleChange}
                className={`input-field pl-12 h-14 ${errors.steam ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : user?.steamId ? 'border-green-500 focus:border-green-500' : 'focus:border-primary-500'}`}
                readOnly={!!user?.steamId}
              />
              {user?.steamId && (
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
            {errors.steam && (
              <p className="mt-2 text-sm text-red-400 flex items-center space-x-1">
                {/* AWS-style Warning Icon */}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{errors.steam}</span>
              </p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-200 mb-3">
              <span className="flex items-center space-x-2">
                {/* AWS-style User Icon */}
                <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Tên nhân vật trong game</span>
                <span className="text-red-400">*</span>
              </span>
            </label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              placeholder="Ví dụ: Nguyen Van A" 
              value={formData.name}
              onChange={handleChange}
              className={`input-field h-14 ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'focus:border-primary-500'}`}
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-400 flex items-center space-x-1">
                {/* AWS-style Warning Icon */}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{errors.name}</span>
              </p>
            )}
          </div>
          
          <div>
            <label htmlFor="birthDate" className="block text-sm font-semibold text-gray-200 mb-3">
              <span className="flex items-center space-x-2">
                {/* AWS-style Calendar Icon */}
                <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Ngày tháng năm sinh</span>
                <span className="text-red-400">*</span>
              </span>
            </label>
            <input 
              type="date" 
              id="birthDate" 
              name="birthDate" 
              value={formData.birthDate}
              onChange={handleChange}
              max={new Date(new Date().setFullYear(new Date().getFullYear() - 16)).toISOString().split('T')[0]}
              className={`input-field h-14 ${errors.birthDate ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'focus:border-primary-500'}`}
            />
            {errors.birthDate && (
              <p className="mt-2 text-sm text-red-400 flex items-center space-x-1">
                {/* AWS-style Warning Icon */}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{errors.birthDate}</span>
              </p>
            )}
            <p className="mt-1 text-xs text-gray-400 font-medium">Bạn phải từ 16 tuổi trở lên</p>
          </div>
        </div>
        
        <div>
          <label htmlFor="backstory" className="block text-sm font-semibold text-gray-200 mb-3">
            <span className="flex items-center space-x-2">
              {/* AWS-style Document Icon */}
              <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Tiểu sử nhân vật</span>
              <span className="text-red-400">*</span>
            </span>
          </label>
          <div className="relative">
            <textarea 
              id="backstory" 
              name="backstory" 
              rows="5" 
              placeholder="Viết tiểu sử cho nhân vật của bạn (ít nhất 100 ký tự)" 
              value={formData.backstory}
              onChange={handleChange}
              className={`input-field ${errors.backstory ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'focus:border-primary-500'}`}
            ></textarea>
          </div>
          <div className="flex justify-between items-center mt-1">
            {errors.backstory && (
              <p className="text-sm text-red-400 flex items-center space-x-1">
                {/* AWS-style Warning Icon */}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{errors.backstory}</span>
              </p>
            )}
            <div className={`text-xs ${formData.backstory.length < 100 ? 'text-red-400' : 'text-green-400'} ml-auto`}>
              {formData.backstory.length}/100 ký tự
            </div>
          </div>
        </div>
        
        <div>
          <label htmlFor="reason" className="block text-sm font-semibold text-gray-200 mb-3">
            <span className="flex items-center space-x-2">
              {/* AWS-style Heart Icon */}
              <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>Lý do muốn tham gia máy chủ</span>
              <span className="text-red-400">*</span>
            </span>
          </label>
          <textarea 
            id="reason" 
            name="reason" 
            rows="3" 
            placeholder="Tại sao bạn muốn tham gia West Roleplay?"
            value={formData.reason}
            onChange={handleChange}
            className={`input-field ${errors.reason ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'focus:border-primary-500'}`}
          ></textarea>
          {errors.reason && (
            <p className="mt-2 text-sm text-red-400 flex items-center space-x-1">
              {/* AWS-style Warning Icon */}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{errors.reason}</span>
            </p>
          )}
        </div>
        
        <div className="pt-8 border-t border-dark-700/50 flex flex-col sm:flex-row justify-end gap-4">
          <button
            type="button"
            className="btn-secondary group"
            onClick={() => {
              setFormData({
                discord: '',
                steam: '',
                name: '',
                birthDate: '',
                backstory: '',
                reason: ''
              });
              setErrors({});
            }}
          >
            {/* AWS-style Refresh Icon */}
            <svg className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Làm mới</span>
          </button>
          <button
            type="submit"
            className="btn-primary relative group"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Đang gửi...</span>
              </>
            ) : (
              <>
                {/* AWS-style Rocket Icon */}
                <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span>Gửi đơn đăng ký</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default RegistrationForm; 