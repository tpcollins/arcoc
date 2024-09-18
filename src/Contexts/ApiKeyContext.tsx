"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const useApiKey = () => {
    const context = useContext(ApiKeyContext);
    if (context === undefined) {
        throw new Error('useApiKey must be used within an ApiKeyProvider');
    }
    return context;
};

type ApiKeyContextType = {
  apiKey: string;
  setApiKey: (key: string) => void;
};

interface ApiKeyProviderProps {
    children: ReactNode;
}

export const ApiKeyProvider: React.FC<ApiKeyProviderProps> = ({ children }) => {
  const [apiKey, setApiKey] = useState<string>('');

  return (
    <ApiKeyContext.Provider value={{ apiKey, setApiKey }}>
      {children}
    </ApiKeyContext.Provider>
  );
};

