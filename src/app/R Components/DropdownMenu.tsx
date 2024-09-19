// TODO:
// 1. Get azure speech language api working. api key needs to be passed, using the context api already created, from the form component
"use client";

import { Dropdown } from 'react-bootstrap';
import { DropdownData } from '../Data/DataDef';
import { useApiKey } from '@/Contexts/ApiKeyContext';
import { useState, useEffect } from "react";

interface Language {
  name: string;
}

const DropdownMenu = () => {
  const { apiKey } = useApiKey();
  const [languages, setLanguages] = useState<Language[]>([]);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch('https://api.cognitive.microsofttranslator.com/languages?api-version=3.0&scope=translation');
        if (!response.ok) {
          throw new Error('Failed to fetch languages');
        }
        const data = await response.json();
        setLanguages(Object.values(data.translation));
      } catch (error) {
        console.error('Error fetching languages:', error);
      }
    };
  
    fetchLanguages();
  }, []);

  return (
    <>
      <Dropdown>
        <Dropdown.Toggle id="dropdown-basic">
          Language
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {languages.map((item, idx) => (
            <Dropdown.Item
            href="#/action-1" 
            // eventKey={item as any}
            key={idx}
            style={{
              borderBottom: idx !== languages.length - 1 ? '1px solid' : 'none',
              padding: '8px 16px',
              width: '100%'
          }}
            >
              {item.name}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default DropdownMenu;