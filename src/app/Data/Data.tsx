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
  { lang: "Afrikaans", code: "af", flag: "/icons/southafrica.svg" },
  { lang: "Albanian", code: "sq", flag: "/icons/albania.svg" },
  { lang: "Amharic", code: "am", flag: "/icons/ethiopia.svg" },
  { lang: "Arabic", code: "ar", flag: "/icons/uae.svg" },
  { lang: "Armenian", code: "hy", flag: "/icons/armenia.svg" },
  { lang: "Assamese", code: "as", flag: "/icons/india.svg" },
  { lang: "Azerbaijani", code: "az", flag: "/icons/turkey.svg" },
  { lang: "Bangla", code: "bn", flag: "/icons/bangladesh.svg" },
  { lang: "Bosnian (Latin)", code: "bs", flag: "/icons/bosnia.svg" },
  { lang: "Bulgarian", code: "bg", flag: "/icons/bulgaria.svg" },
  { lang: "Cantonese (Traditional)", code: "yue", flag: "/icons/china.svg" },
  { lang: "Catalan", code: "ca", flag: "/icons/spain.svg" },
  { lang: "Chinese (Literary)", code: "lzh", flag: "/icons/china.svg" },
  { lang: "Chinese Simplified", code: "zh-Hans", flag: "/icons/china.svg" },
  { lang: "Chinese Traditional", code: "zh-Hant", flag: "/icons/china.svg" },
  { lang: "Croatian", code: "hr", flag: "/icons/croatia.svg" },
  { lang: "Czech", code: "cs", flag: "/icons/czech.svg" },
  { lang: "Danish", code: "da", flag: "/icons/denmark.svg" },
  { lang: "Dari", code: "prs", flag: "/icons/afghanistan.svg" },
  { lang: "Dutch", code: "nl", flag: "/icons/netherlands.svg" },
  { lang: "English", code: "en", flag: "/icons/america.svg" },
  { lang: "Estonian", code: "et", flag: "/icons/estonia.svg" },
  { lang: "Fijian", code: "fj", flag: "/icons/fiji.svg" },
  { lang: "Filipino", code: "fil", flag: "/icons/philippines.svg" },
  { lang: "Finnish", code: "fi", flag: "/icons/finland.svg" },
  { lang: "French", code: "fr", flag: "/icons/france.svg" },
  { lang: "French (Canada)", code: "fr-ca", flag: "/icons/canada.svg" },
  { lang: "German", code: "de", flag: "/icons/germany.svg" },
  { lang: "Greek", code: "el", flag: "/icons/greece.svg" },
  { lang: "Gujarati", code: "gu", flag: "/icons/india.svg" },
  { lang: "Haitian Creole", code: "ht", flag: "/icons/haiti.svg" },
  { lang: "Hebrew", code: "he", flag: "/icons/israel.svg" },
  { lang: "Hindi", code: "hi", flag: "/icons/india.svg" },
  { lang: "Hmong Daw", code: "mww", flag: "/icons/laos.svg" },
  { lang: "Hungarian", code: "hu", flag: "/icons/hungary.svg" },
  { lang: "Icelandic", code: "is", flag: "/icons/iceland.svg" },
  { lang: "Indonesian", code: "id", flag: "/icons/indonesia.svg" },
  { lang: "Inuktitut", code: "iu", flag: "/icons/canada.svg" },
  { lang: "Irish", code: "ga", flag: "/icons/ireland.svg" },
  { lang: "Italian", code: "it", flag: "/icons/italy.svg" },
  { lang: "Japanese", code: "ja", flag: "/icons/japan.svg" },
  { lang: "Kannada", code: "kn", flag: "/icons/india.svg" },
  { lang: "Kazakh", code: "kk", flag: "/icons/kazakhstan.svg" },
  { lang: "Khmer", code: "km", flag: "/icons/cambodia.svg" },
  { lang: "Korean", code: "ko", flag: "/icons/southkorea.svg" },
  { lang: "Kurdish (Central)", code: "ku", flag: "/icons/iraq.svg" },
  { lang: "Kurdish (Northern)", code: "kmr", flag: "/icons/turkey.svg" },
  { lang: "Lao", code: "lo", flag: "/icons/laos.svg" },
  { lang: "Latvian", code: "lv", flag: "/icons/latvia.svg" },
  { lang: "Lithuanian", code: "lt", flag: "/icons/lithuania.svg" },
  { lang: "Malagasy", code: "mg", flag: "/icons/madagascar.svg" },
  { lang: "Malay", code: "ms", flag: "/icons/malaysia.svg" },
  { lang: "Malayalam", code: "ml", flag: "/icons/india.svg" },
  { lang: "Maltese", code: "mt", flag: "/icons/malta.svg" },
  { lang: "Maori", code: "mi", flag: "/icons/newzealand.svg" },
  { lang: "Marathi", code: "mr", flag: "/icons/india.svg" },
  { lang: "Myanmar", code: "my", flag: "/icons/myanmar.svg" },
  { lang: "Nepali", code: "ne", flag: "/icons/nepal.svg" },
  { lang: "Norwegian", code: "nb", flag: "/icons/norway.svg" },
  { lang: "Odia", code: "or", flag: "/icons/india.svg" },
  { lang: "Pashto", code: "ps", flag: "/icons/afghanistan.svg" },
  { lang: "Persian", code: "fa", flag: "/icons/iran.svg" },
  { lang: "Polish", code: "pl", flag: "/icons/poland.svg" },
  { lang: "Portuguese (Brazil)", code: "pt", flag: "/icons/brazil.svg" },
  { lang: "Portuguese (Portugal)", code: "pt-pt", flag: "/icons/portugal.svg" },
  { lang: "Punjabi", code: "pa", flag: "/icons/india.svg" },
  { lang: "Queretaro Otomi", code: "otq", flag: "/icons/mexico.svg" },
  { lang: "Romanian", code: "ro", flag: "/icons/romania.svg" },
  { lang: "Russian", code: "ru", flag: "/icons/russia.svg" },
  { lang: "Samoan", code: "sm", flag: "/icons/samoa.svg" },
  { lang: "Serbian (Cyrillic)", code: "sr-Cyrl", flag: "/icons/serbia.svg" },
  { lang: "Serbian (Latin)", code: "sr-Latn", flag: "/icons/serbia.svg" },
  { lang: "Slovak", code: "sk", flag: "/icons/slovakia.svg" },
  { lang: "Slovenian", code: "sl", flag: "/icons/slovenia.svg" },
  { lang: "Spanish", code: "es", flag: "/icons/spain.svg" },
  { lang: "Swahili", code: "sw", flag: "/icons/kenya.svg" },
  { lang: "Swedish", code: "sv", flag: "/icons/sweden.svg" },
  { lang: "Tahitian", code: "ty", flag: "/icons/frenchpolynesia.svg" },
  { lang: "Tamil", code: "ta", flag: "/icons/india.svg" },
  { lang: "Telugu", code: "te", flag: "/icons/india.svg" },
  { lang: "Thai", code: "th", flag: "/icons/thailand.svg" },
  { lang: "Tigrinya", code: "ti", flag: "/icons/eritrea.svg" },
  { lang: "Tongan", code: "to", flag: "/icons/tonga.svg" },
  { lang: "Turkish", code: "tr", flag: "/icons/turkey.svg" },
  { lang: "Ukrainian", code: "uk", flag: "/icons/ukraine.svg" },
  { lang: "Urdu", code: "ur", flag: "/icons/pakistan.svg" },
  { lang: "Vietnamese", code: "vi", flag: "/icons/vietnam.svg" },
  { lang: "Welsh", code: "cy", flag: "/icons/wales.svg" },
  { lang: "Yucatec Maya", code: "yua", flag: "/icons/mexico.svg" } 
];

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
  links: languageList
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