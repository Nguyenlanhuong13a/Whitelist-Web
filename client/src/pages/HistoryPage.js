import React from 'react';
import ApplicationHistory from '../components/ApplicationHistory';
import './HistoryPage.css';

const HistoryPage = () => {
  return (
    <div className="history-page">
      <div className="page-container">
        <ApplicationHistory />
      </div>
    </div>
  );
};

export default HistoryPage;
