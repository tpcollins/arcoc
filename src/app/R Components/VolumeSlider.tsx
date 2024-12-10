import React, { useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

interface VolumeSliderProps {
  onVolumeChange: (volume: number) => void; // Callback prop
}

const VolumeSlider: React.FC<VolumeSliderProps> = ({ onVolumeChange }) => {
  const [volume, setVolume] = useState(100);

  const handleSliderChange = (value: number | number[]) => {
    const newValue = Array.isArray(value) ? value[0] : value;
    setVolume(newValue);
    onVolumeChange(newValue); // Call the parent's callback
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    if (newValue >= 0 && newValue <= 300) {
      setVolume(newValue);
      onVolumeChange(newValue); // Call the parent's callback
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
      <Slider
        value={volume}
        onChange={handleSliderChange}
        min={0}
        max={500}
        // marks={{
        //   0: '0',
        //   50: '|',
        //   100: '100',
        //   150: '|',
        //   200: '200',
        // }}
        step={10}
        style={{ flexGrow: 1, marginRight: '10px' }}
      />
      <input
        type="number"
        value={volume}
        onChange={handleInputChange}
        min="0"
        max="500"
        style={{
          width: '60px',
          border: '1px solid #4caf50',
          borderRadius: '5px',
          padding: '5px',
          color: 'black',
          background: '#fff',
        }}
      />
    </div>
  );
};

export default VolumeSlider;