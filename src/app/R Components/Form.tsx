"use client";

import React, { FormEvent, useRef } from 'react';
import { shareKeyFormData } from '../Data/Data';
import { useRouter } from 'next/navigation';

const Form: React.FC = () => {
    // useRef hooks are used to reference an object 
    // They are good for sending an object to a database (we are just logging the object here, not actually sending it)
    // Ref accesses elements from the DOM; keeps the same reference between renders
    // Most common use is to grab HTML elements from the DOM

    const { formText } = shareKeyFormData;
    const router = useRouter();

    const handleSubmit = (e: FormEvent) => {
        console.log(e)
    }

    return(
        <>
            <form onSubmit={handleSubmit}>
                <div className="mb-3 text-center">
                    <label htmlFor="name" className="form-label formtext-style">{formText}</label>
                    <br></br>
                    <input id='name' type="text" className="form-control input-style" />
                </div>

                <div className='text-center'>
                    <button className="btn btn-primary" type='submit'>Submit</button>
                </div>
            </form>
        </>
    )
};

export default Form;