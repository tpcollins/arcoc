import React, { useEffect, useState } from 'react';
import { PlaybuttonProps } from '../Data/DataDef';

const PlayButton = <T extends { [key: string]: any }>({ 
  isPlaying,
  setIsPlaying,
  requiredFields,
  data
}: PlaybuttonProps<T>) => {

  const [showAlert, setShowAlert] = useState(false);

  const handleClick = () => {
    // Check if all required fields are truthy
    const allFieldsSet = requiredFields.every(field => Boolean(field));

    if (!allFieldsSet) {
        setShowAlert(true);  // Show alert if any required field is missing
    } else {
        setIsPlaying(!isPlaying);  // Toggle play state
        setShowAlert(false);  // Hide the alert if it's already showing
    }
  };

  return (
    <>
    
      <button 
        disabled={showAlert ? true : false}
        onClick={handleClick} 
        style={{ 
          padding: '10px 20px', 
          fontSize: '24px', 
          borderRadius: '20%', 
          backgroundColor: 'transparent',
          border: '2px solid black',
          cursor: 'pointer'
        }}
      >
          {isPlaying ? (
          <svg 
          height="75"
          viewBox="0 0 24 24"
          width="75"
          xmlns="http://www.w3.org/2000/svg">
              <rect 
              fill='#b1b2b5'
              height="12"
              width="12"
              x="6"
              y="6"
              />
          </svg>
        ) : (
          <svg 
          height="75"
          viewBox="0 0 24 24"
          width="75"
          xmlns="http://www.w3.org/2000/svg">
            <path 
            d="M8 5v14l11-7z"
            fill='#b1b2b5' />
          </svg>
        )}
      </button>

      {showAlert && (
        <div style={{ color: "red", marginTop: "10px" }}>
            {data.errorMessage}
        </div>
      )}
    </>
  );
};

export default PlayButton;
