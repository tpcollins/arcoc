import React, { useState, useEffect } from 'react';
import DropdownMenu from '../R Components/DropdownMenu';
import { useLocale } from '@/Contexts/LocalizationContext';
import { useVoices } from '@/Custom Hooks/useVoices';
import { sourceLangData, targetLangData, neuralVoiceData } from '../Data/Data';
import PlayButton from '../R Components/PlayButton';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const LanguageSelection = () => {
    const { locale, setLocale } = useLocale();
    
    // Using Redux to get the API key
    const apiKey = useSelector((state: RootState) => state.apiKey.apiKey); 
    
    const voices = useVoices(locale, apiKey);
    const [dropdownData, setDropdownData] = useState(neuralVoiceData);

    const handleTarLangChange = (newLocale: string) => {
        setLocale(newLocale);  // Update the locale in the context, which will trigger the useVoices hook
    };

    useEffect(() => {
        if (voices && voices.links) {
          setDropdownData({
            ...dropdownData, // Keep the existing structure of dropdownData
            links: voices.links.map(voice => ({
              lang: voice.LocalName,
              flag: `/icons/Flags/${voice.Locale}.svg`
            }))
          });
        }
        console.log("useEffect Locale", locale);
        console.log("Voices", voices);
        console.log("API Key from Redux", apiKey);
      }, [voices, locale]);

  return (
    <>
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
                handleTarLangChange={handleTarLangChange}
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
            data={dropdownData} 
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
    </>
  );
};

export default LanguageSelection;
