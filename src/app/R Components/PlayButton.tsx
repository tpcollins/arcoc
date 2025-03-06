// import React, { useEffect, useState } from 'react';
// import { PlaybuttonProps } from '../Data/DataDef';

// const PlayButton = ({ 
//   isPlaying,
//   setIsPlaying,
//   requiredFields,
//   data
// }: PlaybuttonProps) => {

//   const [showAlert, setShowAlert] = useState(false);

//   const handleClick = () => {
//     // Check if all required fields are truthy
//     const allFieldsSet = requiredFields.every(field => Boolean(field));

//     if (!allFieldsSet) {
//       // If required fields are missing, show the alert
//       setShowAlert(true);
//     } else {
//       // If all fields are set, toggle play state and hide alert
//       setIsPlaying(!isPlaying);
//       setShowAlert(false);  // Hide the alert if it was showing
//     }
//   };

//   useEffect(() => {
//     const allFieldsSet = requiredFields.every(field => Boolean(field));

//     if (allFieldsSet) {
//       setShowAlert(false);  // Automatically hide the alert once fields are selected
//     }
//   }, [requiredFields]);  // Run this effect when requiredFields change

//   return (
//     <>
//       <div
//       className='playButtonContainer'
//       >

//         {showAlert && (
//           <div className={`alertMessage ${showAlert ? 'show' : ''}`}>
//             {data.errorMessage}
//           </div>
//         )}

//         <button 
//           onClick={handleClick} 
//           style={{ 
//             padding: '10px 20px', 
//             fontSize: '24px', 
//             borderRadius: '20%', 
//             backgroundColor: 'transparent',
//             border: '2px solid black',
//             cursor: 'pointer'
//           }}
//         >
//             {isPlaying ? (
//             <svg 
//             height="75"
//             viewBox="0 0 24 24"
//             width="75"
//             xmlns="http://www.w3.org/2000/svg">
//                 <rect 
//                 fill='#b1b2b5'
//                 height="12"
//                 width="12"
//                 x="6"
//                 y="6"
//                 />
//             </svg>
//           ) : (
//             <svg 
//             height="75"
//             viewBox="0 0 24 24"
//             width="75"
//             xmlns="http://www.w3.org/2000/svg">
//               <path 
//               d="M8 5v14l11-7z"
//               fill='#b1b2b5' />
//             </svg>
//           )}
//         </button>

//       </div>
//     </>
//   );
// };

// export default PlayButton;


import React, { useEffect, useState } from 'react';
import { PlaybuttonProps } from '../Data/DataDef';

const PlayButton = ({ 
  isPlaying,
  setIsPlaying,
  isWarmingUp, // 🔥 Receive warm-up state
  setIsWarmingUp, // 🔥 Allow toggling warm-up
  requiredFields,
  data
}: PlaybuttonProps) => {

  const [showAlert, setShowAlert] = useState(false);

  const handleClick = () => {
    const allFieldsSet = requiredFields.every(field => Boolean(field));

    if (!allFieldsSet) {
      setShowAlert(true);
      return;
    }

    if (isPlaying) {
      // 🔴 Stop transcription
      console.log("🛑 Stopping translation...");
      setIsPlaying(false);
      setIsWarmingUp(false); // Reset warm-up state
    } else {
      // 🟢 Start transcription (with warm-up)
      console.log("🎙️ Starting translation...");
      setShowAlert(false);
      setIsWarmingUp(true); // 🔥 Trigger warm-up
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    const allFieldsSet = requiredFields.every(field => Boolean(field));

    if (allFieldsSet) {
      setShowAlert(false);
    }
  }, [requiredFields]); 

  return (
    <>
      <div className='playButtonContainer'>

        {showAlert && (
          <div className={`alertMessage ${showAlert ? 'show' : ''}`}>
            {data.errorMessage}
          </div>
        )}

        <button 
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
          {isWarmingUp ? (
            // 🔄 Show Spinner during Warm-Up
            <svg 
              height="75"
              viewBox="0 0 50 50"
              width="75"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle 
                cx="25" cy="25" r="20"
                fill="none" stroke="#b1b2b5" strokeWidth="5"
                strokeDasharray="90,150" strokeLinecap="round"
                transform="rotate(-90 25 25)"
              >
                <animateTransform 
                  attributeName="transform"
                  attributeType="XML"
                  type="rotate"
                  from="0 25 25"
                  to="360 25 25"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
          ) : isPlaying ? (
            // ⏸ Pause Icon
            <svg height="75" viewBox="0 0 24 24" width="75" xmlns="http://www.w3.org/2000/svg">
              <rect fill='#b1b2b5' height="12" width="12" x="6" y="6" />
            </svg>
          ) : (
            // ▶️ Play Icon
            <svg height="75" viewBox="0 0 24 24" width="75" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 5v14l11-7z" fill='#b1b2b5' />
            </svg>
          )}
        </button>

      </div>
    </>
  );
};

export default PlayButton;