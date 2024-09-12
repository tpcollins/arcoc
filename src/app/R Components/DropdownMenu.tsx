import Image from "next/image";
import { Dropdown } from 'react-bootstrap';
import { DropdownData } from '../Data/DataDef';

interface DropdownMenuProps {
  data: DropdownData;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ data }) => {

  return (
    <>
      <Dropdown>
        <Dropdown.Toggle 
        id="dropdown-basic"
        style={{ 
          outline: 'none',
          border: 'none' }}>
          {data.btnDrpDwnTxt}
        </Dropdown.Toggle>

        <Dropdown.Menu>
        {data.links.map((item, idx) => (
          <Dropdown.Item 
          href="#/action-1"
          style={{
            borderBottom: idx !== data.links.length - 1 ? '1px solid' : 'none',
            padding: '8px 16px',
            width: '100%'
          }}
          >
            <div style={{
              alignItems: 'center', 
              display: 'flex', 
              width: '100%'
              }}>
              <Image
                  alt="File icon"
                  aria-hidden
                  height={16}
                  key={idx}
                  src={item.flag}
                  style={{paddingRight: '5px'}}
                  width={16}
                  
              />
              {item.lang}
            </div>
          </Dropdown.Item>
        ))}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default DropdownMenu;