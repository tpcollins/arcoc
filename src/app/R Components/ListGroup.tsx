"use client";

import { Listgroup } from '../Data/DataDef';
import { useState } from 'react';

interface ListGroupProps {
  data: Listgroup;
}

const ListGroup: React.FC<ListGroupProps> = ({ data }) => {
  const [styleIndex, setStyleIndex] = useState(-1);

  const handleClick = (idx: number) => {
    setStyleIndex(idx);
  };

  return (
    <ul className="list-group listGroup">
      {data.links.map((item, idx) => (
        <li
          key={idx}
          onClick={() => handleClick(idx)}
          className={styleIndex === idx ? "list-group-item active" : "list-group-item"}
          id='lgTextStyle'
          style={{
            backgroundColor: styleIndex === idx ? 'rgba(76, 53, 117, 0.65)' : 'rgba(0, 0, 0, 0.25)',
          }}
        >
          {item.linkHeader}
        </li>
      ))}
    </ul>
  );
};

export default ListGroup;
