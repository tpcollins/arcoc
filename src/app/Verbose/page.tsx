"use client";

import React from 'react';
import ListGroup from '../R Components/ListGroup';
import LanguageSelection from '../Components/LanguageSelection';

import { transPageLgData } from '../Data/Data';
import { LocalizationProvider } from '@/Contexts/LocalizationContext';
import { ApiKeyProvider } from '@/Contexts/ApiKeyContext';

const Verbose: React.FC = () => {

    return(
        <>
            <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100">
                <div className="w-100 d-flex justify-content-around mb-20">
                    <ListGroup data={transPageLgData} />
                </div>

                <div className="d-flex justify-content-around w-75 mb-4">
                    <ApiKeyProvider>
                        <LocalizationProvider>
                            <LanguageSelection />
                        </LocalizationProvider>
                    </ApiKeyProvider>
                </div>
            </div>
        </>
    )
};

export default Verbose;