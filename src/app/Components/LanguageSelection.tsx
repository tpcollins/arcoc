import React, {useState, useEffect} from 'react';
import DropdownMenu from '../R Components/DropdownMenu';
import { useLocale } from '@/Contexts/LocalizationContext';
import { useVoices } from '@/Custom Hooks/useVoices';
import { sourceLangData, targetLangData, neuralVoiceData } from '../Data/Data';
import PlayButton from '../R Components/PlayButton';

const LanguageSelectionComponent = () => {
  const { locale, setLocale } = useLocale();
  const voices = useVoices(locale);
  const [dropdownData, setDropdownData] = useState(neuralVoiceData);

  const handleTargetLanguageChange = (newLocale: string) => {
    setLocale(newLocale);  // Update the locale in the context, which will trigger the useVoices hook
  };

  useEffect(() => {
    // When voices are fetched, update the links in dropdownData
    setDropdownData(prevData => ({
        ...prevData,
        links: voices.map(voice => ({
            lang: voice.lang,
            flag: voice.flag // Assuming 'voice' has a 'flag' property
        }))
    }));
}, [voices]);

  return (
    <div>
      <DropdownMenu 
        data={sourceLangData} 
        renderItem={(item) => (
            <div
            style={{
                alignItems: 'center', 
                display: 'flex', 
                width: '100%'
            }}
            >
                <img 
                alt="File icon"
                aria-hidden
                height={16}
                src={item.flag}
                style={{paddingRight: '5px'}}
                width={16}
                />
                {item.lang}
            </div>
            )}
        />

        <div className="d-flex flex-column align-items-center">
            <DropdownMenu
                data={targetLangData}
                onChange={handleTargetLanguageChange}
                renderItem={(item) => (
                    <div style={{ 
                        alignItems: 'center',
                        display: 'flex',
                        width: '100%' }}>
                        <img
                            alt="File icon"
                            aria-hidden
                            height={16}
                            src={item.flag}
                            style={{ paddingRight: '5px' }}
                            width={16}
                        />
                        {item.lang}
                    </div>
                )}
            />

            <div className="mt-4">
                <PlayButton />
            </div>
        </div>

        <DropdownMenu 
            data={voices} 
            renderItem={(item) => (
                <div
                style={{
                    alignItems: 'center', 
                    display: 'flex', 
                    width: '100%'
                }}
                >
                    <img 
                        
                    alt="File icon"
                    aria-hidden
                    height={16}
                    src={item.flag}
                    style={{paddingRight: '5px'}}
                    width={16}
                    />
                    {item.lang}
                </div>
            )}
        />
    </div>
  );
};

export default LanguageSelectionComponent;
