import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import StatusPage from './pages/StatusPage';
import RulesPage from './pages/RulesPage';
import AboutPage from './pages/AboutPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import SteamLoginPage from './pages/SteamLoginPage';
import SteamCallbackPage from './pages/SteamCallbackPage';
import DiscordCallbackPage from './pages/DiscordCallbackPage';
import { UserProvider, useUser } from './contexts/UserContext';

function AppContent() {
  const { user, logout, checkSteamAuth } = useUser();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navItems = [
    {
      to: '/',
      label: 'Trang chủ',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      to: '/rules',
      label: 'Quy định',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      to: '/status',
      label: 'Trạng thái',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      to: '/history',
      label: 'Lịch sử',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      to: '/settings',
      label: 'Cài đặt',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      to: '/about',
      label: 'Về chúng tôi',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      )
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 relative overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 via-secondary-600/20 to-primary-600/20 animate-gradient bg-[length:400%_400%]"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-bounce-subtle"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl animate-bounce-subtle" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Header */}
      <header className={`relative z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-dark-900/80 backdrop-blur-xl border-b border-dark-700/50 shadow-2xl'
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-4 animate-fade-in">
              <img
                src="/west-logo.png"
                alt="West Roleplay Logo"
                className="w-14 h-14 sm:w-16 sm:h-16 object-contain"
              />
              <div>
                <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                  West Roleplay
                </h1>
                <p className="text-sm text-gray-400 font-medium">Whitelist Registration</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <nav className="flex items-center space-x-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `group relative px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-glow'
                          : 'text-gray-300 hover:text-white hover:bg-dark-700/50'
                      }`
                    }
                  >
                    <span className="flex items-center space-x-2">
                      <span className="flex items-center">{item.icon}</span>
                      <span>{item.label}</span>
                    </span>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  </NavLink>
                ))}
              </nav>

              {/* User Info & Logout */}
              {checkSteamAuth() && user && (
                <div className="flex items-center space-x-3 pl-4 border-l border-gray-700">
                  <div className="flex items-center space-x-2">
                    {user.steamAvatar && (
                      <img
                        src={user.steamAvatar}
                        alt={user.steamUsername}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <span className="text-gray-300 text-sm font-medium">
                      {user.steamUsername}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    title="Đăng xuất"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-dark-700/50 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 animate-slide-down">
              <div className="flex flex-col space-y-2">
                {/* User Info in Mobile Menu */}
                {checkSteamAuth() && user && (
                  <div className="flex items-center justify-between p-4 border-b border-gray-700 mb-2">
                    <div className="flex items-center space-x-3">
                      {user.steamAvatar && (
                        <img
                          src={user.steamAvatar}
                          alt={user.steamUsername}
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                      <span className="text-gray-300 text-sm font-medium">
                        {user.steamUsername}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      title="Đăng xuất"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </button>
                  </div>
                )}

                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white'
                          : 'text-gray-300 hover:text-white hover:bg-dark-700/50'
                      }`
                    }
                  >
                    <span className="flex items-center">{item.icon}</span>
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-grow">
        <div className="animate-fade-in">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<SteamLoginPage />} />
            <Route path="/auth/steam/callback" element={<SteamCallbackPage />} />

            {/* Protected routes - require Steam authentication */}
            <Route path="/" element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } />
            <Route path="/rules" element={
              <ProtectedRoute>
                <RulesPage />
              </ProtectedRoute>
            } />
            <Route path="/status" element={
              <ProtectedRoute>
                <StatusPage />
              </ProtectedRoute>
            } />
            <Route path="/history" element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } />
            <Route path="/about" element={
              <ProtectedRoute>
                <AboutPage />
              </ProtectedRoute>
            } />

            {/* Discord callback (for linking Discord to existing Steam account) */}
            <Route path="/auth/discord/callback" element={
              <ProtectedRoute>
                <DiscordCallbackPage />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </Router>
  );
}

export default App;
