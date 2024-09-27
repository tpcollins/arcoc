"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ApiKeyContextType } from '@/app/Data/DataDef';

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const useApiKey = () => {
    const context = useContext(ApiKeyContext);
    if (context === undefined) {
        throw new Error('useApiKey must be used within an ApiKeyProvider');
    }
    return context;
};

interface ApiKeyProviderProps {
    children: ReactNode;
}

export const ApiKeyProvider: React.FC<ApiKeyProviderProps> = ({ children }) => {
  const [apiKey, setApiKey] = useState('');

  return (
    <ApiKeyContext.Provider value={{ apiKey, setApiKey }}>
      {children}
    </ApiKeyContext.Provider>
  );
};

