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
export interface DropdownData<T> {
    btnDrpDwnTxt: string;   
    links: T[];
}

export interface DropdownButtons {
    lang: string;
    flag: string;
}