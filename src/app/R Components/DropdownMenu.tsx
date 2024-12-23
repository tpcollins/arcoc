// "use client";

// import { Dropdown } from 'react-bootstrap';
// import { DropdownMenuProps } from '../Data/DataDef';
// import { useState, useRef, useEffect } from 'react';

// const DropdownMenu = <T extends { [key: string]: any }>({
//   data,
//   renderItem,
//   handleTarLang,
//   handleShortName,
//   isDisabled,
//   actTransClick,
//   requiredFields
// }: DropdownMenuProps<T>) => {

//   const [filter, setFilter] = useState('');
//   const [isOpen, setIsOpen] = useState(false);
//   const inputRef = useRef<HTMLInputElement>(null);
//   const [selValue, setSelValue] = useState('');
//   const [reqFields, setReqFields] = useState(true);

//   const handleTargetLangChange = <T1, T2>(item1: T1, item2: T2) => {
//     if (handleTarLang) {
//       handleTarLang(item1 as unknown as string, item2 as unknown as string);
//     }
//   };

//   const handleShortNameChange = (item: T) => {
//     if (handleShortName) {
//       handleShortName(item as unknown as string);
//     }
//   };

//   const handleSelValue = (item: T) =>{
//     setSelValue(item[data.config.displayText] as string);
//     setIsOpen(false);
//   }

//   const handleActTransClick = (e: any) => {
//     if (isDisabled && actTransClick){
//       actTransClick(e);
//     }
//   }

//   useEffect(() => {
//     // Prevent focus scroll behavior on dropdown toggle
//     const toggleButton = document.getElementById("dropdown-basic");
//     if (toggleButton) {
//       toggleButton.addEventListener("mousedown", (e) => e.preventDefault());
//     }

//     return () => {
//       if (toggleButton) {
//         toggleButton.removeEventListener("mousedown", (e) => e.preventDefault());
//       }
//     };
//   }, []);

//   useEffect(() => {
//     if (isOpen && inputRef.current) inputRef.current.focus();
//   },[isOpen]);

//   useEffect(() => {
//     if (requiredFields){
//       const allFieldsSet = requiredFields.every(field => Boolean(field));
  
//       if (!allFieldsSet) {
//         setReqFields(false); 
//       }else{
//         setReqFields(true);
//       }
//     }
//   }, [requiredFields]);

//   const filteredData = data.links.filter(item => item[data.config.renderItemText].toLowerCase().includes(filter.toLowerCase()));

//   return (
//     <>
//       <Dropdown show={isOpen} onToggle={(isOpen) => setIsOpen(isOpen)}>
//         <Dropdown.Toggle 
//         className={isDisabled ? 'disabledDropdown' : ''}
//         id="dropdown-basic"
//         // disabled={isDisabled ? true : false}
//         onMouseDown={handleActTransClick}
//         >
//           {reqFields ? (selValue || data.btnDrpDwnTxt) : data.btnDrpDwnTxt}
//           {/* {selValue || data.btnDrpDwnTxt} */}
//         </Dropdown.Toggle>

//         <Dropdown.Menu>
//           <input
//             aria-label="Search"
//             className="form-control"
//             onChange={e => setFilter(e.target.value)}
//             placeholder="Search..."
//             ref={inputRef}
//             style={{ margin: '0 px' }}
//           />

//           {filteredData.map((item, idx) => (
//             <Dropdown.Item
//               eventKey={item as any}
//               key={idx} 
//               onClick={async () => {
//                 await handleSelValue(item);
//                 handleTargetLangChange(item.code, item.tarCode);
//                 handleShortNameChange(item.shortName);
//               }}
//               style={{
//                 borderBottom: idx !== filteredData.length - 1 ? '1px solid' : 'none',
//                 padding: '8px 16px',
//                 width: '100%'
//               }}
//             >
//               {renderItem(item)}
//             </Dropdown.Item>
//           ))}

//         </Dropdown.Menu>
//       </Dropdown>
//     </>
//   );
// };

// export default DropdownMenu;

"use client";

import { Dropdown } from 'react-bootstrap';
import { DropdownMenuProps } from '../Data/DataDef';
import { useState, useRef, useEffect } from 'react';

const DropdownMenu = <T extends { [key: string]: any }>({
  data,
  renderItem,
  handleTarLang,
  handleShortName,
  isDisabled,
  actTransClick,
  requiredFields
}: DropdownMenuProps<T>) => {

  const [filter, setFilter] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [selValue, setSelValue] = useState('');
  const [reqFields, setReqFields] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null); // Ref for the dropdown menu

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

  const handleActTransClick = (e: any) => {
    if (isDisabled && actTransClick){
      actTransClick(e);
    }
  }

  const handleToggle = (isOpen: boolean) => {
    setIsOpen(isOpen);
    if (isOpen && menuRef.current) {
      // Reset the scroll position of the dropdown menu to the top every time it opens
      menuRef.current.scrollTop = 0;
    }
  };

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  },[isOpen]);

  useEffect(() => {
    if (requiredFields){
      const allFieldsSet = requiredFields.every(field => Boolean(field));
  
      if (!allFieldsSet) {
        setReqFields(false); 
      } else {
        setReqFields(true);
      }
    }
  }, [requiredFields]);

  const filteredData = data.links.filter(item => item[data.config.renderItemText].toLowerCase().includes(filter.toLowerCase()));

  return (
    <>
      <Dropdown show={isOpen} onToggle={handleToggle}>
        <Dropdown.Toggle 
          className={isDisabled ? 'disabledDropdown' : ''}
          id="dropdown-basic"
          onMouseDown={handleActTransClick}
          tabIndex={-1} // Prevents the toggle button from gaining focus
        >
          {reqFields ? (selValue || data.btnDrpDwnTxt) : data.btnDrpDwnTxt}
        </Dropdown.Toggle>

        <Dropdown.Menu ref={menuRef}>
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
