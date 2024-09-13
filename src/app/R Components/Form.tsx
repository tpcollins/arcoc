"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormData } from '../Data/DataDef';

interface FormProps {
  data: FormData;
}

const Form: React.FC<FormProps> = ({ data }) => {
  const [inputValue, setInputValue] = useState(''); // Track input value
  const [errorMessage, setErrorMessage] = useState(''); // Track error message
  const correctKey = '111'; // The correct key
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value); // Capture the input value
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    if (inputValue === correctKey) {
      // If the key is valid, route to the next page
      setErrorMessage(''); // Clear any error message
      router.push('/verbose');
    } else {
      // If the key is invalid, set an error message
      setErrorMessage('Invalid Key');
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
          id="name"
          type="text"
          name="key"
          className="form-control input-style"
          value={inputValue}
          onChange={handleInputChange} // Capture user input
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
        </div> // Display error message if key is invalid
      )}
    </form>
  );
};

export default Form;
