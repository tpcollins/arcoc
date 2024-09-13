import { 
    FormData,
    FooterData,
    Listgroup,
    DropdownData
} from "./DataDef";

// Form Section
export const shareKeyFormData: FormData = {
    formText: "Please Enter Your Share Key"
}

// Footer Section
export const mainPageFooterData: FooterData = {
  links: [
    { text: "Collins Web Design LLC 2024", url: "https://tristancollins.org", imgUrl: "/icons/copyright.svg"}
  ]
};

// Listgroup Section
export const transPageLgData: Listgroup = {
  links: [
    {linkHeader: "Translator"},
    {linkHeader: "Settings"},
  ]
}

// Dropdown Section
export const targetLangData: DropdownData = {
  btnDrpDwnTxt: "Target Language",
  links: [
    {lang: "Español", flag: "/icons/spain.svg"},
    {lang: "English", flag: "/icons/america.svg"},
    {lang: "Chinese", flag: "/icons/china.svg"},
  ]
}

export const sourceLangData: DropdownData = {
  btnDrpDwnTxt: "Source Language",
  links: [
    {lang: "Español", flag: "/icons/spain.svg"},
    {lang: "English", flag: "/icons/america.svg"},
    {lang: "Chinese", flag: "/icons/china.svg"},
  ]
}