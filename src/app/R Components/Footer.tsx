import React from 'react';
import Image from "next/image";
import { FooterData } from '../Data/DataDef';

interface FooterProps {
    data: FooterData;
}

const Footer: React.FC<FooterProps> = ({ data }) => {
    return(
        <>
            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
                {data.links.map((item, idx) => (
                    <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href={item.url}
                    key={idx}
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                    <Image
                        aria-hidden
                        src={item.imgUrl}
                        alt="File icon"
                        width={16}
                        height={16}
                    />
                    {item.text}
                    </a>
                ))}
            </footer>
        </>
    )
};

export default Footer;







