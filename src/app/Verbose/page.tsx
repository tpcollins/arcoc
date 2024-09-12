"use client";

import React from 'react';
import PlayButton from '../R Components/PlayButton';
import ListGroup from '../R Components/ListGroup';
import Dropdown from '../R Components/Dropdown';
import { transPageLgData } from '../Data/Data';

const Verbose: React.FC = () => {

    return(
        <>
            <ListGroup data={transPageLgData} />
            <PlayButton />
            <Dropdown />
        </>
    )
};

export default Verbose;