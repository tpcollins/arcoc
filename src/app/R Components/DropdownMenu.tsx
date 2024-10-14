"use client";

import { Dropdown } from 'react-bootstrap';
import { DropdownMenuProps } from '../Data/DataDef';
import { useState, useRef, useEffect } from 'react';

const DropdownMenu = <T extends { [key: string]: any }>({
  data,
  renderItem,
  handleTarLang,
  handleShortName,
}: DropdownMenuProps<T>) => {

  const [filter, setFilter] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [selValue, setSelValue] = useState('');

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  },[isOpen]);

  const handleTargetLangChange = <T1, T2>(item1: T1, item2: T2) => {
    if (handleTarLang) {
      handleTarLang(item1 as unknown as string, item2 as unknown as string);
    }
  };

  const handleShortNameChange = (item: T) => {
    if (handleShortName) {
      handleShortName(item as unknown as string);
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
                handleTargetLangChange(item.code, item.tarCode);
                handleShortNameChange(item.shortName);
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