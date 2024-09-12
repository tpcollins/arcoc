import { useState } from "react";
import { transPageLgData } from "../Data/Data";

function ListGroup() {
    // Hook for setting style index
    const [styleIndex, setStyleIndex] = useState(-1);

    // Event handler for setting style index
    const handleClick = (idx: number) => {
        setStyleIndex(idx);
    };

    return (
        <>  
            {/* <h1>{items.heading}</h1> */}
            <ul 
            className="list-group listGroup">
                {transPageLgData.links.map((item, idx) => (
                    <li 
                    key={idx} 
                    onClick={() => {
                        handleClick(idx);
                    }}
                    className={styleIndex === idx ? "list-group-item active" : "list-group-item"}
                    id="lgTextStyle"
                    style={{backgroundColor: styleIndex === idx ? 'rgba(76, 53, 117, 0.65)' : 'rgba(0, 0, 0, 0.25)'}}
                    >
                        {item.linkHeader}
                    </li> 
                ))}
            </ul>
        </>
    );
}

ListGroup.displayName = 'ListGroup';
export default ListGroup;