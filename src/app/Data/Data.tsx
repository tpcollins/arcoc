import { 
    FormData,
    FooterData,
    Listgroup,
    DropdownData
} from "./DataDef";

import DropdownMenu from "../R Components/DropdownMenu";

// Form Section
export const shareKeyFormData: FormData = {
    formText: "Please Enter Your Speech Key"
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
export const languageList = [
  { lang: "Afrikaans", code: "af", flag: "" },
  { lang: "Albanian", code: "sq", flag: "" },
  { lang: "Amharic", code: "am", flag: "" },
  { lang: "Arabic", code: "ar", flag: "" },
  { lang: "Armenian", code: "hy", flag: "" },
  { lang: "Assamese", code: "as", flag: "" },
  { lang: "Azerbaijani", code: "az", flag: "" },
  { lang: "Bangla", code: "bn", flag: "" },
  { lang: "Bosnian (Latin)", code: "bs", flag: "" },
  { lang: "Bulgarian", code: "bg", flag: "" },
  { lang: "Cantonese (Traditional)", code: "yue", flag: "" },
  { lang: "Catalan", code: "ca", flag: "" },
  { lang: "Chinese (Literary)", code: "lzh", flag: "" },
  { lang: "Chinese Simplified", code: "zh-Hans", flag: "" },
  { lang: "Chinese Traditional", code: "zh-Hant", flag: "" },
  { lang: "Croatian", code: "hr", flag: "" },
  { lang: "Czech", code: "cs", flag: "" },
  { lang: "Danish", code: "da", flag: "" },
  { lang: "Dari", code: "prs", flag: "" },
  { lang: "Dutch", code: "nl", flag: "" },
  { lang: "English", code: "en", flag: "" },
  { lang: "Estonian", code: "et", flag: "" },
  { lang: "Fijian", code: "fj", flag: "" },
  { lang: "Filipino", code: "fil", flag: "" },
  { lang: "Finnish", code: "fi", flag: "" },
  { lang: "French", code: "fr", flag: "" },
  { lang: "French (Canada)", code: "fr-ca", flag: "" },
  { lang: "German", code: "de", flag: "" },
  { lang: "Greek", code: "el", flag: "" },
  { lang: "Gujarati", code: "gu", flag: "" },
  { lang: "Haitian Creole", code: "ht", flag: "" },
  { lang: "Hebrew", code: "he", flag: "" },
  { lang: "Hindi", code: "hi", flag: "" },
  { lang: "Hmong Daw", code: "mww", flag: "" },
  { lang: "Hungarian", code: "hu", flag: "" },
  { lang: "Icelandic", code: "is", flag: "" },
  { lang: "Indonesian", code: "id", flag: "" },
  { lang: "Inuktitut", code: "iu", flag: "" },
  { lang: "Irish", code: "ga", flag: "" },
  { lang: "Italian", code: "it", flag: "" },
  { lang: "Japanese", code: "ja", flag: "" },
  { lang: "Kannada", code: "kn", flag: "" },
  { lang: "Kazakh", code: "kk", flag: "" },
  { lang: "Khmer", code: "km", flag: "" },
  { lang: "Klingon", code: "tlh-Latn", flag: "" },
  { lang: "Klingon (plqaD)", code: "tlh-Piqd", flag: "" },
  { lang: "Korean", code: "ko", flag: "" },
  { lang: "Kurdish (Central)", code: "ku", flag: "" },
  { lang: "Kurdish (Northern)", code: "kmr", flag: "" },
  { lang: "Lao", code: "lo", flag: "" },
  { lang: "Latvian", code: "lv", flag: "" },
  { lang: "Lithuanian", code: "lt", flag: "" },
  { lang: "Malagasy", code: "mg", flag: "" },
  { lang: "Malay", code: "ms", flag: "" },
  { lang: "Malayalam", code: "ml", flag: "" },
  { lang: "Maltese", code: "mt", flag: "" },
  { lang: "Maori", code: "mi", flag: "" },
  { lang: "Marathi", code: "mr", flag: "" },
  { lang: "Myanmar", code: "my", flag: "" },
  { lang: "Nepali", code: "ne", flag: "" }, 
  { lang: "Norwegian", code: "nb", flag: "" },
  { lang: "Odia", code: "or", flag: "" },
  { lang: "Pashto", code: "ps", flag: "" },
  { lang: "Persian", code: "fa", flag: "" },
  { lang: "Polish", code: "pl", flag: "" },
  { lang: "Portuguese (Brazil)", code: "pt", flag: "" },
  { lang: "Portuguese (Portugal)", code: "pt-pt", flag: "" },
  { lang: "Punjabi", code: "pa", flag: "" },
  { lang: "Queretaro Otomi", code: "otq", flag: "" },
  { lang: "Romanian", code: "ro", flag: "" },
  { lang: "Russian", code: "ru", flag: "" },
  { lang: "Samoan", code: "sm", flag: "" },
  { lang: "Serbian (Cyrillic)", code: "sr-Cyrl", flag: "" },
  { lang: "Serbian (Latin)", code: "sr-Latn", flag: "" },
  { lang: "Slovak", code: "sk", flag: "" },
  { lang: "Slovenian", code: "sl", flag: "" },
  { lang: "Spanish", code: "es", flag: "" },
  { lang: "Swahili", code: "sw", flag: "" },
  { lang: "Swedish", code: "sv", flag: "" },
  { lang: "Tahitian", code: "ty", flag: "" },
  { lang: "Tamil", code: "ta", flag: "" },
  { lang: "Telugu", code: "te", flag: "" },
  { lang: "Thai", code: "th", flag: "" },
  { lang: "Tigrinya", code: "ti", flag: "" },
  { lang: "Tongan", code: "to", flag: "" },
  { lang: "Turkish", code: "tr", flag: "" },
  { lang: "Ukrainian", code: "uk", flag: "" },
  { lang: "Urdu", code: "ur", flag: "" },
  { lang: "Vietnamese", code: "vi", flag: "" },
  { lang: "Welsh", code: "cy", flag: "" },
  { lang: "Yucatec Maya", code: "yua", flag: "" } ];

export const targetLangData: DropdownData<{ lang: string; flag: string }> = {
  btnDrpDwnTxt: "Target Language",
  links: languageList
};

  <DropdownMenu
    data={targetLangData}
    renderItem={(item) => (
      <>
        <img alt="flag" src={item.flag} width="16" height="16" style={{ paddingRight: "5px" }} />
        {item.lang}
      </>
    )}
/>;

export const sourceLangData: DropdownData<{ lang: string; flag: string }> = {
  btnDrpDwnTxt: "Source Language",
  links: [
    { lang: "English", flag: "/icons/america.svg" },
    { lang: "Español", flag: "/icons/spain.svg" },
    { lang: "Chinese", flag: "/icons/china.svg" }
  ]
};

  <DropdownMenu
    data={sourceLangData}
    renderItem={(item) => (
      <>
        <img alt="flag" src={item.flag} width="16" height="16" style={{ paddingRight: "5px" }} />
        {item.lang}
      </>
    )}
/>;

export const neuralVoiceData: DropdownData<{ lang: string; flag: string }> = {
  btnDrpDwnTxt: "Neural Voice",
  links: [
    { lang: "AriaNeural (Cheerful Male)", flag: "/icons/america.svg" },
    { lang: "GuyNeural (Professional Male)", flag: "/icons/america.svg" },
    { lang: "JennyNeural (Empathetic Female)", flag: "/icons/america.svg" },
    { lang: "DaliaNeural (General Female)", flag: "/icons/spain.svg" },
    { lang: "JorgeNeural (Friendly Male)", flag: "/icons/spain.svg" },
    { lang: "XiaoxiaoNeural (Cheerful Female)", flag: "/icons/china.svg" },
    { lang: "YunxiNeural (Calm Male)", flag: "/icons/china.svg" }
  ]
};

  <DropdownMenu
    data={neuralVoiceData}
    renderItem={(item) => (
      <>
        <img alt="flag" src={item.flag} width="16" height="16" style={{ paddingRight: "5px" }} />
        {item.lang}
      </>
    )}
/>;