"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormData } from '../Data/DataDef';

interface FormProps {
  data: FormData;
}

const Form: React.FC<FormProps> = ({ data }) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const res = await fetch('/api/validateKey', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ apiKey }),
    });

    if (!res.ok) {
      const result = await res.json();
      setError(result.error);
      setErrorMessage('Invalid Key');
    } else {
      setError('');
      router.push('/verbose');
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
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
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
