// TODO:
/*
1. Fetch neural voices through API; match by target language locale
2. Explain outloud (a few times if necessary) everything that is going on in the component since most of this is new
3. Start the backend processes

*/


"use client";

import { Dropdown } from 'react-bootstrap';
import { DropdownMenuProps } from '../Data/DataDef';
import { useState, useRef, useEffect } from 'react';

const DropdownMenu = <T extends { [key: string]: any }>({
  data,
  renderItem,
  handleTarLangChange,
}: DropdownMenuProps<T>) => {

  const [filter, setFilter] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [selValue, setSelValue] = useState('');

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  },[isOpen]);

  const handleSelect = (item: T) => {
    if (handleTarLangChange) {
      handleTarLangChange(item as unknown as string);
    }
    
  };

  const handleSelValue = (item: T) =>{
    setSelValue(item[data.config.displayText] as string);
    setIsOpen(false);
  }

  

  const filteredData = data.links.filter(item => item[data.config.renderItemText].toLowerCase().includes(filter.toLowerCase()));

  return (
    <>
      <Dropdown show={isOpen} onToggle={(isOpen) => setIsOpen(isOpen)}>
        <Dropdown.Toggle id="dropdown-basic">
          {selValue || data.btnDrpDwnTxt} 
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
              key={idx}
              onClick={async () => {
                await handleSelValue(item);
                handleSelect(item.code);
              }}
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