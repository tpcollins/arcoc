import React, { createContext, useContext, useState, ReactNode } from 'react';
import { LocaleContextType } from '@/app/Data/DataDef';


const LocalizationContext = createContext<LocaleContextType | undefined>(undefined);

export const useLocale = () => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocalizationProvider');
  }
  return context;
};

interface LocalizationProviderProps {
    children: ReactNode;
}
export const LocalizationProvider: React.FC<LocalizationProviderProps> = ({ children }) => {
  const [locale, setLocale] = useState('');

  return (
    <LocalizationContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocalizationContext.Provider>
  );
};