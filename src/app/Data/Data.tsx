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

// Dropdown Language Section
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

export const neuralVoiceData: DropdownData = {
  btnDrpDwnTxt: "Neural Voice",
  links: [
    {lang: "Español", flag: "/icons/spain.svg"},
    {lang: "AriaNeural", flag: "/icons/america.svg"},
    {lang: "GuyNeural", flag: "/icons/america.svg"},
    {lang: "JennyNeural", flag: "/icons/america.svg"},
    {lang: "Chinese", flag: "/icons/china.svg"},
  ]
}