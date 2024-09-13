"use client";

import { Dropdown } from 'react-bootstrap';
import { DropdownData } from '../Data/DataDef';
import { useState } from "react";

interface DropdownMenuProps<T> {
  data: DropdownData<T>;
  renderItem: (item: T) => React.ReactNode;
}

const DropdownMenu = <T extends {}>({ data, renderItem }: DropdownMenuProps<T>) => {

  const [selected, setSelected] = useState(data.btnDrpDwnTxt);

  const handleSelect = (selectedItem: T) => {
    setSelected((selectedItem as any).lang);
  }

  return (
    <>
      <Dropdown onSelect={(eventKey) => handleSelect(eventKey as unknown as T)}>
        <Dropdown.Toggle id="dropdown-basic">
          {selected}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {data.links.map((item, idx) => (
            <Dropdown.Item
            href="#/action-1" 
            eventKey={item as any}
            key={idx}
            onClick={() => handleSelect(item)}
            style={{
              borderBottom: idx !== data.links.length - 1 ? '1px solid' : 'none',
              padding: '8px 16px',
              width: '100%'
          }}
            >
              {renderItem(item)}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default DropdownMenu;