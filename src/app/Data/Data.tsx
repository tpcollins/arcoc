/* 
TABLE OF CONTENTS:

1. Form Section
2. Footer Section
3. Listgroup Section
4. Dropdown Language Section
5. Playbutton Section

*/


import { 
    FormData,
    FooterData,
    Listgroup,
    DropdownData,
    PlaybuttonData
} from "./DataDef";

import DropdownMenu from "../R Components/DropdownMenu";

// 1. Form Section
export const shareKeyFormData: FormData = {
    formText: "Please Enter Your Speech Key"
}

// 2. Footer Section
export const mainPageFooterData: FooterData = {
  links: [
    { text: "Collins Web Design LLC 2024", url: "https://tristancollins.org", imgUrl: "/Icons/copyright.svg"}
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
  { lang: "Afrikaans", code: "af-ZA", tarCode: "af", flag: "/Icons/Flags/af-ZA.svg" },
  { lang: "Albanian", code: "sq-AL", tarCode: "sq", flag: "/Icons/Flags/sq-AL.svg" },
  { lang: "Amharic", code: "am-ET", tarCode: "am", flag: "/Icons/Flags/am-ET.svg" },
  { lang: "Arabic", code: "ar-AE", tarCode: "ar", flag: "/Icons/Flags/ar-AE.svg" },
  { lang: "Armenian", code: "hy-AM", tarCode: "hy", flag: "/Icons/Flags/hy-AM.svg" },
  { lang: "Assamese", code: "as-IN", tarCode: "as", flag: "/Icons/Flags/as-IN.svg" },
  { lang: "Azerbaijani", code: "az-AZ", tarCode: "az", flag: "/Icons/Flags/az-AZ.svg" },
  { lang: "Bangla", code: "bn-BD", tarCode: "bn", flag: "/Icons/Flags/bn-BD.svg" },
  { lang: "Bosnian (Latin)", code: "bs-BA", tarCode: "bs", flag: "/Icons/Flags/bs-BA.svg" },
  { lang: "Bulgarian", code: "bg-BG", tarCode: "bg", flag: "/Icons/Flags/bg-BG.svg" },
  { lang: "Cantonese (Traditional)", code: "yue-CN", tarCode: "yue", flag: "/Icons/Flags/yue-CN.svg" },
  { lang: "Catalan", code: "ca-ES", tarCode: "ca", flag: "/Icons/Flags/ca-ES.svg" },
  { lang: "Chinese Simplified", code: "zh-CN", tarCode: "zh-Hans", flag: "/Icons/Flags/zh-CN.svg" },
  { lang: "Chinese Traditional", code: "zh-HK", tarCode: "zh-Hant", flag: "/Icons/Flags/zh-HK.svg" },
  { lang: "Croatian", code: "hr-HR", tarCode: "hr", flag: "/Icons/Flags/hr-HR.svg" },
  { lang: "Czech", code: "cs-CZ", tarCode: "cs", flag: "/Icons/Flags/cs-CZ.svg" },
  { lang: "Danish", code: "da-DK", tarCode: "da", flag: "/Icons/Flags/da-DK.svg" },
  { lang: "Dutch", code: "nl-NL", tarCode: "nl", flag: "/Icons/Flags/nl-NL.svg" },
  { lang: "English", code: "en-US", tarCode: "en", flag: "/Icons/Flags/en-US.svg" },
  { lang: "Estonian", code: "et-EE", tarCode: "et", flag: "/Icons/Flags/et-EE.svg" },
  { lang: "Filipino", code: "fil-PH", tarCode: "fil", flag: "/Icons/Flags/fil-PH.svg" },
  { lang: "Finnish", code: "fi-FI", tarCode: "fi", flag: "/Icons/Flags/fi-FI.svg" },
  { lang: "French", code: "fr-FR", tarCode: "fr", flag: "/Icons/Flags/fr-FR.svg" },
  { lang: "French (Canada)", code: "fr-CA", tarCode: "fr", flag: "/Icons/Flags/fr-ca.svg" },
  { lang: "German", code: "de-DE", tarCode: "de", flag: "/Icons/Flags/de-DE.svg" },
  { lang: "Greek", code: "el-GR", tarCode: "el", flag: "/Icons/Flags/el-GR.svg" },
  { lang: "Gujarati", code: "gu-IN", tarCode: "gu", flag: "/Icons/Flags/gu-IN.svg" },
  { lang: "Hebrew", code: "he-IL", tarCode: "he", flag: "/Icons/Flags/he-IL.svg" },
  { lang: "Hindi", code: "hi-IN", tarCode: "hi", flag: "/Icons/Flags/hi-IN.svg" },
  { lang: "Hungarian", code: "hu-HU", tarCode: "hu", flag: "/Icons/Flags/hu-HU.svg" },
  { lang: "Icelandic", code: "is-IS", tarCode: "is", flag: "/Icons/Flags/is-IS.svg" },
  { lang: "Indonesian", code: "id-ID", tarCode: "id", flag: "/Icons/Flags/id-ID.svg" },
  { lang: "Irish", code: "ga-IE", tarCode: "ga", flag: "/Icons/Flags/ga-IE.svg" },
  { lang: "Italian", code: "it-IT", tarCode: "it", flag: "/Icons/Flags/it-IT.svg" },
  { lang: "Japanese", code: "ja-JP", tarCode: "ja", flag: "/Icons/Flags/ja-JP.svg" },
  { lang: "Kannada", code: "kn-IN", tarCode: "kn", flag: "/Icons/Flags/kn-IN.svg" },
  { lang: "Kazakh", code: "kk-KZ", tarCode: "kk", flag: "/Icons/Flags/kk-KZ.svg" },
  { lang: "Khmer", code: "km-KH", tarCode: "km", flag: "/Icons/Flags/km-KH.svg" },
  { lang: "Korean", code: "ko-KR", tarCode: "ko", flag: "/Icons/Flags/ko-KR.svg" },
  { lang: "Lao", code: "lo-LA", tarCode: "lo", flag: "/Icons/Flags/lo-LA.svg" },
  { lang: "Latvian", code: "lv-LV", tarCode: "lv", flag: "/Icons/Flags/lv-LV.svg" },
  { lang: "Lithuanian", code: "lt-LT", tarCode: "lt", flag: "/Icons/Flags/lt-LT.svg" },
  { lang: "Malay", code: "ms-MY", tarCode: "ms", flag: "/Icons/Flags/ms-MY.svg" },
  { lang: "Malayalam", code: "ml-IN", tarCode: "ml", flag: "/Icons/Flags/ml-IN.svg" },
  { lang: "Maltese", code: "mt-MT", tarCode: "mt", flag: "/Icons/Flags/mt-MT.svg" },
  { lang: "Marathi", code: "mr-IN", tarCode: "mr", flag: "/Icons/Flags/mr-IN.svg" },
  { lang: "Myanmar", code: "my-MM", tarCode: "my", flag: "/Icons/Flags/my-MM.svg" },
  { lang: "Nepali", code: "ne-NP", tarCode: "ne", flag: "/Icons/Flags/ne-NP.svg" },
  { lang: "Norwegian", code: "nb-NO", tarCode: "nb", flag: "/Icons/Flags/nb-NO.svg" },
  { lang: "Pashto", code: "ps-AF", tarCode: "ps", flag: "/Icons/Flags/ps-AF.svg" },
  { lang: "Persian", code: "fa-IR", tarCode: "fa", flag: "/Icons/Flags/fa-IR.svg" },
  { lang: "Polish", code: "pl-PL", tarCode: "pl", flag: "/Icons/Flags/pl-PL.svg" },
  { lang: "Portuguese (Brazil)", code: "pt-BR", tarCode: "pt", flag: "/Icons/Flags/pt-BR.svg" },
  { lang: "Portuguese (Portugal)", code: "pt-PT", tarCode: "pt", flag: "/Icons/Flags/pt-PT.svg" },
  { lang: "Punjabi", code: "pa-IN", tarCode: "pa", flag: "/Icons/Flags/pa-IN.svg" },
  { lang: "Romanian", code: "ro-RO", tarCode: "ro", flag: "/Icons/Flags/ro-RO.svg" },
  { lang: "Russian", code: "ru-RU", tarCode: "ru", flag: "/Icons/Flags/ru-RU.svg" },
  { lang: "Serbian (Cyrillic)", code: "sr-RS", tarCode: "sr", flag: "/Icons/Flags/sr-RS.svg" },
  { lang: "Serbian (Latin)", code: "sr-Latn-RS", tarCode: "sr-Latn", flag: "/Icons/Flags/sr-Latn-RS.svg" },
  { lang: "Slovak", code: "sk-SK", tarCode: "sk", flag: "/Icons/Flags/sk-SK.svg" },
  { lang: "Slovenian", code: "sl-SI", tarCode: "sl", flag: "/Icons/Flags/sl-SI.svg" },
  { lang: "Spanish", code: "es-ES", tarCode: "es", flag: "/Icons/Flags/es-ES.svg" },
  { lang: "Swahili", code: "sw-KE", tarCode: "sw", flag: "/Icons/Flags/sw-KE.svg" },
  { lang: "Swedish", code: "sv-SE", tarCode: "sv", flag: "/Icons/Flags/sv-SE.svg" },
  { lang: "Tamil", code: "ta-IN", tarCode: "ta", flag: "/Icons/Flags/ta-IN.svg" },
  { lang: "Telugu", code: "te-IN", tarCode: "te", flag: "/Icons/Flags/te-IN.svg" },
  { lang: "Thai", code: "th-TH", tarCode: "th", flag: "/Icons/Flags/th-TH.svg" },
  { lang: "Turkish", code: "tr-TR", tarCode: "tr", flag: "/Icons/Flags/tr-TR.svg" },
  { lang: "Ukrainian", code: "uk-UA", tarCode: "uk", flag: "/Icons/Flags/uk-UA.svg" },
  { lang: "Urdu", code: "ur-IN", tarCode: "ur", flag: "/Icons/Flags/ur-IN.svg" },
  { lang: "Vietnamese", code: "vi-VN", tarCode: "vi", flag: "/Icons/Flags/vi-VN.svg" },
  { lang: "Welsh", code: "cy-GB", tarCode: "cy", flag: "/Icons/Flags/cy-GB.svg" }
];

const sourceLangList = [
  { lang: "English", code: "en-US", tarCode: "en", flag: "/Icons/Flags/en-US.svg" }
]

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
  links: sourceLangList,
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

export const neuralVoiceData: DropdownData<{ lang: string; flag: string; gender: string; }> = {
  btnDrpDwnTxt: "Neural Voice",
  links: [
    // { lang: "AriaNeural (Cheerful Male)", flag: "/icons/Flags/en-US.svg" },
    // { lang: "GuyNeural (Professional Male)", flag: "/icons/Flags/en-US.svg" },
    // { lang: "JennyNeural (Empathetic Female)", flag: "/icons/Flags/en-US.svg" },
    // { lang: "DaliaNeural (General Female)", flag: "/icons/Flags/es-ES.svg" },
    // { lang: "JorgeNeural (Friendly Male)", flag: "/icons/Flags/es-ES.svg" },
    // { lang: "XiaoxiaoNeural (Cheerful Female)", flag: "/icons/Flags/zh-Hant.svg" },
    // { lang: "YunxiNeural (Calm Male)", flag: "/icons/Flags/zh-Hant.svg" }
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
        {item.lang + ' (' + item.gender + ')'}
      </>
    )}
/>;

// 5. Playbutton Section
export const plyBtnData: PlaybuttonData = {
  errorMessage: "Please make sure you have selected a target language and neural voice"
}