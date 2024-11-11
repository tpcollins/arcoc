"use client";

import React from 'react';
import ListGroup from '../R Components/ListGroup';
import LanguageSelection from '../Components/LanguageSelection';

import { transPageLgData } from '../Data/Data';
import { LocalizationProvider } from '@/Contexts/LocalizationContext';
import { Provider } from 'react-redux';
import store from '@/store/store';

const Verbose: React.FC = () => {

    return(
        <>
            <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100">
                <div className="w-100 d-flex justify-content-around mb-20">
                    <ListGroup data={transPageLgData} />
                </div>

                <div className="d-flex justify-content-around w-75 mb-4">
                    <Provider store={store}>
                        <LocalizationProvider>
                            <LanguageSelection />
                        </LocalizationProvider>
                    </Provider>

                </div>
            </div>
        </>
    )
};

export default Verbose;