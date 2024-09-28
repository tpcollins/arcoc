import React, {useState, useEffect} from 'react';
import DropdownMenu from '../R Components/DropdownMenu';
import { useLocale } from '@/Contexts/LocalizationContext';
import { useVoices } from '@/Custom Hooks/useVoices';
import { sourceLangData, targetLangData, neuralVoiceData } from '../Data/Data';
import PlayButton from '../R Components/PlayButton';
import { useApiKey } from '@/Contexts/ApiKeyContext';

const LanguageSelection = () => {
    const { locale, setLocale } = useLocale();
    const {apiKey} = useApiKey();
    const voices = useVoices(locale, apiKey);
    const [dropdownData, setDropdownData] = useState(neuralVoiceData);

    const handleTarLangChange = (newLocale: string) => {
        setLocale(newLocale);  // Update the locale in the context, which will trigger the useVoices hook
    };

    useEffect(() => {
        // When voices are fetched, update the links in dropdownData
        setDropdownData(prevData => ({
            ...prevData,
            voices
        }));
        console.log("useEffect Locale",locale)
        console.log("voices", voices)
        console.log("apiKey", apiKey);
        
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
