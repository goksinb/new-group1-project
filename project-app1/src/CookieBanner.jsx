import React from 'react';
import './CookieBanner.css';

function CookieBanner() {
  const acceptCookies = () => {
    localStorage.setItem('gaConsent', 'true');
    window.location.reload(); // Refresh to activate Google Analytics
  };

  if (localStorage.getItem('gaConsent')) {
    return null; // Don't show if already accepted
  }

  return (
    <div className="cookie-banner">
      <p>This site uses cookies to count visitors.</p>
      <button 
        onClick={acceptCookies}
        className="cookie-button"
      >
        OK, I understand
      </button>
    </div>
  );
}

export default CookieBanner;