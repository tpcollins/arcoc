"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FormData } from '../Data/DataDef';
import { useApiKey } from '@/Contexts/ApiKeyContext';

interface FormProps {
  data: FormData;
}

const Form: React.FC<FormProps> = ({ data }) => {
  const {apiKey, setApiKey} = useApiKey();
  const [errorMessage, setErrorMessage] = useState('');
  const [inputValue, setInputValue] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const res = await fetch('/api/validateKey', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ apiKey: inputValue }),
    });

    if (!res.ok) {
      setErrorMessage('Invalid Key');
    } else {
      setApiKey(inputValue); // Update the context key before routing
      console.log('API Key set to:', inputValue); // Log inputValue here
      
      // Add a slight delay or a callback to ensure state is set before routing
      setTimeout(() => {
        console.log('Navigating to verbose page...');
        router.push('/verbose');
      }, 100);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3 text-center">
        <label htmlFor="name" className="form-label forText-style">
          {data.formText}
        </label>
        <br />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          required
          className="form-control input-style"
        />
      </div>

      <div className="text-center">
        <button
          className="btn btn-light btnStyle"
          type="submit"
        >
          Submit
        </button>
      </div>
      {errorMessage && (
        <div className="text-center mt-2" style={{ color: 'red' }}>
          {errorMessage}
        </div>
      )}
    </form>
  );
};

export default Form;
