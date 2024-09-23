// Form Section
export interface FormData {
    formText: string;
}

// Footer section
export interface FooterLink {
    text: string;
    url: string;
    imgUrl: string;
}
  
export interface FooterData {
    links: FooterLink[]; // Array of FooterLink objects
}

// Listgroup Section
export interface ListgroupLink {
    linkHeader: string;
}

export interface Listgroup {
    links: ListgroupLink[]; // Array of FooterLink objects
}

// Dropdown Section

export interface DropdownItem {
    // Note regarding this interface: links is now of type generic. Any data can go in dropdown item so comp is still reusable
    lang: string;
}

export interface DropdownData<T> {
    btnDrpDwnTxt: string;
    links: T[];
    config: {
        displayText: keyof T;  // Property name for the text to display on the button
        renderItemText: keyof T;  // Property name for the text to render in the list
    };
}

export interface DropdownButtons {
    lang: string;
    flag: string;
}