import { useState, useEffect } from 'react';
import { useApiKey } from '@/Contexts/ApiKeyContext';
import { fetchVoices } from '@/pages/api/fetchVoices';
import { Voice } from '@/app/Data/DataDef';

export const useVoices = (locale: string) => {
  const [voices, setVoices] = useState<Voice[]>([]);
  const { apiKey } = useApiKey();

  useEffect(() => {
    if (apiKey && locale) {
      fetchVoices(locale, apiKey)
        .then(setVoices)
        .catch(console.error);
    }
  }, [apiKey, locale]);

  return voices;
};