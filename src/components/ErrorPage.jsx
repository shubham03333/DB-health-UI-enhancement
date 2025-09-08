import React from 'react';
import './ErrorPage.css';
import errorImage from '../assets/image.png'; // Placeholder for the illustration image

const ErrorPage = () => {
  return (
    <div className="error-page-container">
      <div className="error-image-container">
        {/* If you want to use the attached image, place it in src/assets/error-404.svg */}
        <img src={errorImage} alt="404 Error" className="error-image" />
      </div>
     
    </div>
  );
};

export default ErrorPage;
