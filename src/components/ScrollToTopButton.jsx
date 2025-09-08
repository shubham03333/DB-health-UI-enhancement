import React, { useState, useEffect } from 'react';
import './ScrollToTopButton.css';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    console.log('Scroll position:', scrollTop); // Debug log
    if (scrollTop > 100) { // Reduced threshold for better visibility
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set up scroll event listener with throttling
  useEffect(() => {
    let throttleTimer = null;
    
    const throttledToggleVisibility = () => {
      if (throttleTimer) return;
      
      throttleTimer = setTimeout(() => {
        toggleVisibility();
        throttleTimer = null;
      }, 100);
    };

    window.addEventListener('scroll', throttledToggleVisibility);
    
    // Initial check
    toggleVisibility();
    
    return () => {
      window.removeEventListener('scroll', throttledToggleVisibility);
      if (throttleTimer) clearTimeout(throttleTimer);
    };
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    console.log('Scrolling to top...'); // Debug log
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Fallback for older browsers
    setTimeout(() => {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }, 0);
  };

  return (
    <div className={`scroll-to-top ${isVisible ? 'visible' : 'hidden'}`}>
      <button 
        onClick={scrollToTop} 
        className="scroll-button" 
        aria-label="Scroll to top"
        style={{ display: isVisible ? 'flex' : 'none' }}
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <path d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
      </button>
    </div>
  );
};

export default ScrollToTopButton;
