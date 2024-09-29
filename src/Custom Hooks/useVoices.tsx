import { useState, useEffect } from 'react';
import { fetchVoices } from '@/pages/api/fetchVoices';
import { DropdownData,Voice } from '@/app/Data/DataDef';

export const useVoices = (locale: string, apiKey: string) => {
    const [voices, setVoices] = useState<DropdownData<Voice>>({ 
        btnDrpDwnTxt: "Neural Voices", 
        links: [], 
        config: { displayText: 'LocalName', renderItemText: 'LocalName' } 
    });

    useEffect(() => {
        if (apiKey && locale) {
            fetchVoices(locale, apiKey)
                .then(setVoices)
                .catch(console.error);
        }
    }, [apiKey, locale]);

    return voices;
};