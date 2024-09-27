/* 
TABLE OF CONTENTS:

1. Form Section
2. Footer Section
3. Listgroup Section
4. Dropdown Language Section
5. Context APIs

*/


import { 
    FormData,
    FooterData,
    Listgroup,
    DropdownData
} from "./DataDef";

import DropdownMenu from "../R Components/DropdownMenu";

// 1. Form Section
export const shareKeyFormData: FormData = {
    formText: "Please Enter Your Speech Key"
}

// 2. Footer Section
export const mainPageFooterData: FooterData = {
  links: [
    { text: "Collins Web Design LLC 2024", url: "https://tristancollins.org", imgUrl: "/icons/copyright.svg"}
  ]
};

// 3. Listgroup Section
export const transPageLgData: Listgroup = {
  links: [
    {linkHeader: "Translator"},
    {linkHeader: "Settings"},
  ]
}
 
// 4. Dropdown Language Section
export const languageList = [
  { lang: "Afrikaans", code: "af-ZA", flag: "/icons/southafrica.svg" },
  { lang: "Albanian", code: "sq-AL", flag: "/icons/albania.svg" },
  { lang: "Amharic", code: "am-ET", flag: "/icons/ethiopia.svg" },
  { lang: "Arabic", code: "ar-AE", flag: "/icons/uae.svg" },
  { lang: "Armenian", code: "hy-AM", flag: "/icons/armenia.svg" },
  { lang: "Assamese", code: "as", flag: "/icons/india.svg" },
  { lang: "Azerbaijani", code: "az-AZ", flag: "/icons/turkey.svg" },
  { lang: "Bangla", code: "bn", flag: "/icons/bangladesh.svg" },
  { lang: "Bosnian (Latin)", code: "bs-BA", flag: "/icons/bosnia.svg" },
  { lang: "Bulgarian", code: "bg-BG", flag: "/icons/bulgaria.svg" },
  { lang: "Cantonese (Traditional)", code: "yue-CN", flag: "/icons/china.svg" },
  { lang: "Catalan", code: "ca-ES", flag: "/icons/spain.svg" },
  { lang: "Chinese (Literary)", code: "lzh", flag: "/icons/china.svg" },
  { lang: "Chinese Simplified", code: "zh-Hans", flag: "/icons/china.svg" },
  { lang: "Chinese Traditional", code: "zh-Hant", flag: "/icons/china.svg" },
  { lang: "Croatian", code: "hr-HR", flag: "/icons/croatia.svg" },
  { lang: "Czech", code: "cs-CZ", flag: "/icons/czech.svg" },
  { lang: "Danish", code: "da-DK", flag: "/icons/denmark.svg" },
  { lang: "Dari", code: "prs", flag: "/icons/afghanistan.svg" },
  { lang: "Dutch", code: "nl-NL", flag: "/icons/netherlands.svg" },
  { lang: "English", code: "en-US", flag: "/icons/america.svg" },
  { lang: "Estonian", code: "et-EE", flag: "/icons/estonia.svg" },
  { lang: "Fijian", code: "fj", flag: "/icons/fiji.svg" },
  { lang: "Filipino", code: "fil-PH", flag: "/icons/philippines.svg" },
  { lang: "Finnish", code: "fi-FI", flag: "/icons/finland.svg" },
  { lang: "French", code: "fr-FR", flag: "/icons/france.svg" },
  { lang: "French (Canada)", code: "fr-ca", flag: "/icons/canada.svg" },
  { lang: "German", code: "de-DE", flag: "/icons/germany.svg" },
  { lang: "Greek", code: "el-GR", flag: "/icons/greece.svg" },
  { lang: "Gujarati", code: "gu-IN", flag: "/icons/india.svg" },
  { lang: "Haitian Creole", code: "ht", flag: "/icons/haiti.svg" },
  { lang: "Hebrew", code: "he-IL", flag: "/icons/israel.svg" },
  { lang: "Hindi", code: "hi-IN", flag: "/icons/india.svg" },
  { lang: "Hmong Daw", code: "mww", flag: "/icons/laos.svg" },
  { lang: "Hungarian", code: "hu-HU", flag: "/icons/hungary.svg" },
  { lang: "Icelandic", code: "is-IS", flag: "/icons/iceland.svg" },
  { lang: "Indonesian", code: "id-ID", flag: "/icons/indonesia.svg" },
  { lang: "Inuktitut", code: "iu", flag: "/icons/canada.svg" },
  { lang: "Irish", code: "ga-IE", flag: "/icons/ireland.svg" },
  { lang: "Italian", code: "it-IT", flag: "/icons/italy.svg" },
  { lang: "Japanese", code: "ja-JP", flag: "/icons/japan.svg" },
  { lang: "Kannada", code: "kn-IN", flag: "/icons/india.svg" },
  { lang: "Kazakh", code: "kk-KZ", flag: "/icons/kazakhstan.svg" },
  { lang: "Khmer", code: "km-KH", flag: "/icons/cambodia.svg" },
  { lang: "Korean", code: "ko-KR", flag: "/icons/southkorea.svg" },
  { lang: "Kurdish (Central)", code: "ku", flag: "/icons/iraq.svg" },
  { lang: "Kurdish (Northern)", code: "kmr", flag: "/icons/turkey.svg" },
  { lang: "Lao", code: "lo-LA", flag: "/icons/laos.svg" },
  { lang: "Latvian", code: "lv-LV", flag: "/icons/latvia.svg" },
  { lang: "Lithuanian", code: "lt-LT", flag: "/icons/lithuania.svg" },
  { lang: "Malagasy", code: "mg", flag: "/icons/madagascar.svg" },
  { lang: "Malay", code: "ms-MY", flag: "/icons/malaysia.svg" },
  { lang: "Malayalam", code: "ml-IN", flag: "/icons/india.svg" },
  { lang: "Maltese", code: "mt-MT", flag: "/icons/malta.svg" },
  { lang: "Maori", code: "mi", flag: "/icons/newzealand.svg" },
  { lang: "Marathi", code: "mr-IN", flag: "/icons/india.svg" },
  { lang: "Myanmar", code: "my-MM", flag: "/icons/myanmar.svg" },
  { lang: "Nepali", code: "ne-NP", flag: "/icons/nepal.svg" },
  { lang: "Norwegian", code: "nb-NO", flag: "/icons/norway.svg" },
  { lang: "Odia", code: "or", flag: "/icons/india.svg" },
  { lang: "Pashto", code: "ps-AF", flag: "/icons/afghanistan.svg" },
  { lang: "Persian", code: "fa-IR", flag: "/icons/iran.svg" },
  { lang: "Polish", code: "pl-PL", flag: "/icons/poland.svg" },
  { lang: "Portuguese (Brazil)", code: "pt-BR", flag: "/icons/brazil.svg" },
  { lang: "Portuguese (Portugal)", code: "pt-PT", flag: "/icons/portugal.svg" },
  { lang: "Punjabi", code: "pa-IN", flag: "/icons/india.svg" },
  { lang: "Queretaro Otomi", code: "otq", flag: "/icons/mexico.svg" },
  { lang: "Romanian", code: "ro-RO", flag: "/icons/romania.svg" },
  { lang: "Russian", code: "ru-RU", flag: "/icons/russia.svg" },
  { lang: "Samoan", code: "sm", flag: "/icons/samoa.svg" },
  { lang: "Serbian (Cyrillic)", code: "sr-RS", flag: "/icons/serbia.svg" },
  { lang: "Serbian (Latin)", code: "sr-Latn", flag: "/icons/serbia.svg" },
  { lang: "Slovak", code: "sk-SK", flag: "/icons/slovakia.svg" },
  { lang: "Slovenian", code: "sl-SL ", flag: "/icons/slovenia.svg" },
  { lang: "Spanish", code: "es-ES", flag: "/icons/spain.svg" },
  { lang: "Swahili", code: "sw-KE", flag: "/icons/kenya.svg" },
  { lang: "Swedish", code: "sv-SE", flag: "/icons/sweden.svg" },
  { lang: "Tahitian", code: "ty", flag: "/icons/frenchpolynesia.svg" },
  { lang: "Tamil", code: "ta-IN", flag: "/icons/india.svg" },
  { lang: "Telugu", code: "te-IN", flag: "/icons/india.svg" },
  { lang: "Thai", code: "th-TH", flag: "/icons/thailand.svg" },
  { lang: "Tigrinya", code: "ti", flag: "/icons/eritrea.svg" },
  { lang: "Tongan", code: "to", flag: "/icons/tonga.svg" },
  { lang: "Turkish", code: "tr-TR", flag: "/icons/turkey.svg" },
  { lang: "Ukrainian", code: "uk-UA", flag: "/icons/ukraine.svg" },
  { lang: "Urdu", code: "ur-IN", flag: "/icons/pakistan.svg" },
  { lang: "Vietnamese", code: "vi-VN", flag: "/icons/vietnam.svg" },
  { lang: "Welsh", code: "cy-GB", flag: "/icons/wales.svg" },
  { lang: "Yucatec Maya", code: "yua", flag: "/icons/mexico.svg" } 
];

export const targetLangData: DropdownData<{ lang: string; flag: string }> = {
  btnDrpDwnTxt: "Target Language",
  links: languageList,
  config: {
    displayText: 'lang',
    renderItemText: 'lang'
  }
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
  links: languageList,
  config: {
    displayText: 'lang',
    renderItemText: 'lang'
  }
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
  ],
  config: {
    displayText: 'lang',
    renderItemText: 'lang'
  }
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

// 5. Context APIs

  // 5a. API Key Context
  export type ApiKeyContextType = {
    apiKey: string;
    setApiKey: (key: string) => void;
  };

  // 5b. Locale Context
  export type LocaleContextType = {
    locale: string;
    setLocale: (locale: string) => void;
  };