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
  
export interface Footer {
    links: FooterLink[]; // Array of FooterLink objects
}

// Listgroup Section
export interface ListgroupLink {
    linkHeader: string;
}

export interface Listgroup {
    links: ListgroupLink[]; // Array of FooterLink objects
}