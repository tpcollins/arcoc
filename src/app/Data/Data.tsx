import { 
    FormData,
    FooterData,
    Listgroup
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