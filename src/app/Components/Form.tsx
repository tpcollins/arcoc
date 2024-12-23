"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormData } from '../Data/DataDef';
import { useDispatch } from 'react-redux';
import { setApiKey } from '@/store/apiKeySlice';

interface FormProps {
  data: FormData;
}

const Form: React.FC<FormProps> = ({ data }) => {
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validate API key by posting to your server
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
      // Dispatch action to Redux store
      dispatch(setApiKey(inputValue));  // Correct usage of dispatch

      // console.log('API Key set to:', inputValue); // Log inputValue here
      
      // Add slight delay before routing to ensure state is updated
      setTimeout(() => {
        console.log('Navigating to verbose page...');
        router.refresh();
        router.push('/translator');
      }, 100); // Adjust the timeout if needed
    }
  };

  // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  
  //   // Validate the API key by posting to your server
  //   const res = await fetch('/api/validateKey', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ apiKey: inputValue }),
  //   });
  
  //   if (!res.ok) {
  //     setErrorMessage('Invalid Key');
  //   } else {
  //     console.log('API key validated and stored in cookie');
  
  //     // Optionally: dispatch some success action or move to the next page
  //     router.push('/verbose');
  //   }
  // };

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
        <button className="btn btn-light btnStyle" type="submit">
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
