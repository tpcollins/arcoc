"use client";

import React from 'react';
import PlayButton from '../R Components/PlayButton';
import ListGroup from '../R Components/ListGroup';
import DropdownMenu from '../R Components/DropdownMenu';

import { transPageLgData } from '../Data/Data';
import { sourceLangData, targetLangData, neuralVoiceData } from '../Data/Data';

const Verbose: React.FC = () => {

    return(
        <>
            <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100">
                <div className="w-100 d-flex justify-content-around mb-20">
                    <ListGroup data={transPageLgData} />
                </div>

                <div className="d-flex justify-content-around w-75 mb-4">
                    <DropdownMenu 
                        data={sourceLangData} 
                        renderItem={(item) => (
                            <div
                            style={{
                                alignItems: 'center', 
                                display: 'flex', 
                                width: '100%'
                            }}
                            >
                                <img 
                                alt="File icon"
                                aria-hidden
                                height={16}
                                src={item.flag}
                                style={{paddingRight: '5px'}}
                                width={16}
                                />
                                {item.lang}
                            </div>
                        )}
                    />

                    <div className="d-flex flex-column align-items-center">
                        <DropdownMenu
                        data={targetLangData}
                        renderItem={(item) => (
                            <div style={{ 
                                alignItems: 'center',
                                display: 'flex',
                                width: '100%' }}>
                                <img
                                    alt="File icon"
                                    aria-hidden
                                    height={16}
                                    src={item.flag}
                                    style={{ paddingRight: '5px' }}
                                    width={16}
                                />
                                {item.lang}
                            </div>
                        )}
                        />

                        <div className="mt-4">
                            <PlayButton />
                        </div>
                    </div>

                    <DropdownMenu 
                        data={neuralVoiceData} 
                        renderItem={(item) => (
                            <div
                            style={{
                                alignItems: 'center', 
                                display: 'flex', 
                                width: '100%'
                            }}
                            >
                                <img 
                                    
                                alt="File icon"
                                aria-hidden
                                height={16}
                                src={item.flag}
                                style={{paddingRight: '5px'}}
                                width={16}
                                />
                                {item.lang}
                            </div>
                        )}
                    />
                </div>
            </div>
        </>
    )
};

export default Verbose;