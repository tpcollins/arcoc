// import React, { useState } from 'react';
// import Slider from 'rc-slider';
// import "rc-slider/assets/index.css";

// const VolumeSlider: React.FC = () => {
//   const [volume, setVolume] = useState(100);

//   const handleSliderChange = (value: number | number[]) => {
//     // If the value is an array (multi-slider), use the first element, otherwise use the number directly
//     const newValue = Array.isArray(value) ? value[0] : value;
//     setVolume(newValue);
//   }; 
  

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const newValue = Number(e.target.value);
//     if (newValue >= 0 && newValue <= 200) {
//       setVolume(newValue);
//     }
//   };

//   return (
//     <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
//       <Slider
//         value={volume}
//         onChange={handleSliderChange}
//         min={0}
//         max={200}
//         style={{ flexGrow: 1, marginRight: '10px' }} // Flex-grow makes it stretch
//       />
//       <input
//         type="number"
//         value={volume}
//         onChange={handleInputChange}
//         min="0"
//         max="100"
//         style={{ width: '60px' }}
//       />
//     </div>
//   );
// };

// export default VolumeSlider;

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
    if (newValue >= 0 && newValue <= 200) {
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
        max={200}
        style={{ flexGrow: 1, marginRight: '10px' }}
      />
      <input
        type="number"
        value={volume}
        onChange={handleInputChange}
        min="0"
        max="200"
        style={{ width: '60px' }}
      />
    </div>
  );
};

export default VolumeSlider;
