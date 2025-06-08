import React from 'react';

function Header() {
  return (
    <header className="App-header">
      <h1>FiveM Whitelist Registration</h1>
      <p>Đăng ký whitelist cho máy chủ FiveM</p>
      <nav className="main-nav">
        <ul>
          <li><a href="/" className="active">Trang chủ</a></li>
          <li><a href="/rules">Quy định</a></li>
          <li><a href="/status">Trạng thái</a></li>
          <li><a href="/about">Về chúng tôi</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header; 