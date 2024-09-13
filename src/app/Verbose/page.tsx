/* TODO:
    1. Read in Neural Voice data to 3rd dropdown (review azure docs on what this data looks like)
    2. Figure out where exactly to bring in dropdown menu
    3. Review Azure Speech docs to start connecting backend
*/
"use client";

import React from 'react';
import PlayButton from '../R Components/PlayButton';
import ListGroup from '../R Components/ListGroup';
import DropdownMenu from '../R Components/DropdownMenu';
import { transPageLgData } from '../Data/Data';
import { targetLangData } from '../Data/Data';
import { sourceLangData } from '../Data/Data';

const Verbose: React.FC = () => {

    return(
        <>
            <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100">
                <div className="d-flex justify-content-around w-75 mb-4">
                    <DropdownMenu data={sourceLangData} />
                    <DropdownMenu data={targetLangData} />
                    <DropdownMenu data={targetLangData} />
                </div>

                <div className="d-flex justify-content-center mt-5">
                    <PlayButton />
                </div>
            </div>
        </>
    )
};

export default Verbose;