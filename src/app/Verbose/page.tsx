"use client";

import React from 'react';
import PlayButton from '../R Components/PlayButton';
import ListGroup from '../R Components/ListGroup';
import { transPageLgData } from '../Data/Data';

const Verbose: React.FC = () => {

    return(
        <>
            <ListGroup data={transPageLgData} />
            <PlayButton />
        </>
    )
};

export default Verbose;