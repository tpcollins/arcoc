"use client";

import React from 'react';
import PlayButton from '../R Components/PlayButton';
import ListGroup from '../R Components/ListGroup';
import DropdownMenu from '../R Components/DropdownMenu';
import { transPageLgData } from '../Data/Data';
import { langSelectionData } from '../Data/Data';

const Verbose: React.FC = () => {

    return(
        <>
            <ListGroup data={transPageLgData} />
            <PlayButton />
            <DropdownMenu data={langSelectionData}/>
            <DropdownMenu data={langSelectionData}/>
            <DropdownMenu data={langSelectionData}/>
        </>
    )
};

export default Verbose;