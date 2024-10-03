import React, { useState } from 'react';
import { PlaybuttonProps } from '../Data/DataDef';

const PlayButton: React.FC<PlaybuttonProps> = ({ action }) => {

  const [isPlaying, setIsPlaying] = useState(false); // State to track play/pause

  // Toggle between play and pause
  const handleToggle = () => {
    setIsPlaying(!isPlaying);
  };

  const handleAction = () => {
    if (action && isPlaying){
      action();
    }
  }

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
  );
};

export default PlayButton;
