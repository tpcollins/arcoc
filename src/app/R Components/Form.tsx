"use client";

import React, { FormEvent, useRef } from 'react';
import { shareKeyFormData } from '../Data/Data';
import { useRouter } from 'next/navigation';

const Form: React.FC = () => {
       const { formText } = shareKeyFormData;
    const router = useRouter();

    const handleSubmit = (e: FormEvent) => {
        console.log(e)
    }

    const handleRoute = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault(); // Prevent button from submitting the form
        router.push('/verbose'); // Route to /verbose
    };

    return(
        <>
            <form onSubmit={handleSubmit}>
                <div className="mb-3 text-center">
                    <label htmlFor="name" className="form-label formtext-style">{formText}</label>
                    <br></br>
                    <input id='name' type="text" className="form-control input-style" />
                </div>

                <div className='text-center'>
                    <button 
                    className="btn btn-light btnStyle"
                    onClick={handleRoute}
                    type='submit'
                     >Submit</button>
                </div>
            </form>
        </>
    )
};

export default Form;