import React, { useState } from 'react';
import Slider from 'rc-slider';
import "rc-slider/assets/index.css";

const VolumeSlider: React.FC = () => {
  const [volume, setVolume] = useState(50); // Initialize volume state

  // Handle change in the slider
  const handleSliderChange = (value: number) => {
    setVolume(value);
  };

  // Handle change in the input field
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    if (newValue >= 0 && newValue <= 100) { // Ensure value is between 0 and 100
      setVolume(newValue);
    }
  };

  return (
    <>
        <div className='volume-container'>
            <Slider />
            <input
                type="number"
                value={volume}
                onChange={handleInputChange} // Sync input field with slider
                min="0"
                max="100"
                style={{ width: '50px', marginLeft: '10px' }}
            />
        </div>
    </>

  );
};

export default VolumeSlider;