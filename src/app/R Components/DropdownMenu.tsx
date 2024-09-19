"use client";

import { Dropdown } from 'react-bootstrap';
import { DropdownData } from '../Data/DataDef';

interface DropdownMenuProps<T> {
  data: DropdownData<T>;
  renderItem: (item: T) => React.ReactNode;
}

const DropdownMenu = <T extends {}>({ data, renderItem }: DropdownMenuProps<T>) => {

  return (
    <>
      <Dropdown>
        <Dropdown.Toggle id="dropdown-basic">
          {data.btnDrpDwnTxt}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {data.links.map((item, idx) => (
            <Dropdown.Item
            href="#/action-1" 
            eventKey={item as any}
            key={idx}
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