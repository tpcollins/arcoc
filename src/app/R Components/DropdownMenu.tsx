// TODO:
/*
1. Make the dropdown change the the specified language after clicking
2. Import array of the neural voices and match them to the specified languages. (Really just Chinese and Spanish need 
more than one option)
3. Explain outloud (a few times if necessary) everything that is going on in the component since most of this is new
3. Start the backend processes


*/


"use client";

import { Dropdown } from 'react-bootstrap';
import { DropdownData, DropdownItem } from '../Data/DataDef';
import { useState, useRef, useEffect } from 'react';

const DropdownMenu = <T extends DropdownItem>({ data, renderItem }: { data: DropdownData<T>, renderItem: (item: T) => React.ReactNode }) => {

  const [filter, setFilter] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [selValue, setSelValue] = useState<HTMLInputElement>(); // set selected value; changes btnDrpDwnTxt to selected language

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  },[isOpen]);

  const filteredData = data.links.filter(item => item.lang.toLowerCase().includes(filter.toLowerCase()));

  const handleSelValue = (e: HTMLInputElement) => {
    setSelValue(e)
  }

  return (
    <>
      <Dropdown show={isOpen} onToggle={(isOpen) => setIsOpen(isOpen)}>
        <Dropdown.Toggle id="dropdown-basic">
          {data.btnDrpDwnTxt}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <input
            aria-label="Search"
            className="form-control"
            onChange={e => setFilter(e.target.value)}
            placeholder="Search..."
            ref={inputRef}
            style={{ margin: '0 px' }}
          />

          {filteredData.map((item, idx) => (
            <Dropdown.Item
            eventKey={item as any}
            href="#/action-1"
            key={idx}
            onClick={
              () => setIsOpen(false)}
            style={{
              borderBottom: idx !== filteredData.length - 1 ? '1px solid' : 'none',
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