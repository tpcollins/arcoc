// Form Section
export interface Form {
    formText: string;
}

// Footer section
// Footer section
export interface FooterLink {
    text: string;
    url: string;
    imgUrl: string;
}
  
  export interface Footer {
    links: FooterLink[]; // Array of FooterLink objects
}
  