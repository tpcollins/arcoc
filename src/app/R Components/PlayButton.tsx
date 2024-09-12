import React, { useState } from 'react';

const PlayButton: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false); // State to track play/pause

  // Toggle between play and pause
  const handleToggle = () => {
    setIsPlaying((prevState) => !prevState); // Toggle state
  };

  return (
    <button 
      onClick={handleToggle} 
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
        height="48"
        viewBox="0 0 24 24"
        width="48"
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
        height="48"
        viewBox="0 0 24 24"
        width="48"
        xmlns="http://www.w3.org/2000/svg">
          <path 
          d="M8 5v14l11-7z"
          fill='#b1b2b5' />
        </svg>
      )}
    </button>
  );
};

export default PlayButton;