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
  { lang: "Afrikaans", code: "af-ZA", tarCode: "af", flag: "/icons/Flags/af-ZA.svg" },
  { lang: "Albanian", code: "sq-AL", tarCode: "sq", flag: "/icons/Flags/sq-AL.svg" },
  { lang: "Amharic", code: "am-ET", tarCode: "am", flag: "/icons/Flags/am-ET.svg" },
  { lang: "Arabic", code: "ar-AE", tarCode: "ar", flag: "/icons/Flags/ar-AE.svg" },
  { lang: "Armenian", code: "hy-AM", tarCode: "hy", flag: "/icons/Flags/hy-AM.svg" },
  { lang: "Assamese", code: "as-IN", tarCode: "as", flag: "/icons/Flags/as-IN.svg" },
  { lang: "Azerbaijani", code: "az-AZ", tarCode: "az", flag: "/icons/Flags/az-AZ.svg" },
  { lang: "Bangla", code: "bn-BD", tarCode: "bn", flag: "/icons/Flags/bn-BD.svg" },
  { lang: "Bosnian (Latin)", code: "bs-BA", tarCode: "bs", flag: "/icons/Flags/bs-BA.svg" },
  { lang: "Bulgarian", code: "bg-BG", tarCode: "bg", flag: "/icons/Flags/bg-BG.svg" },
  { lang: "Cantonese (Traditional)", code: "yue-CN", tarCode: "yue", flag: "/icons/Flags/yue-CN.svg" },
  { lang: "Catalan", code: "ca-ES", tarCode: "ca", flag: "/icons/Flags/ca-ES.svg" },
  { lang: "Chinese Simplified", code: "zh-CN", tarCode: "zh-Hans", flag: "/icons/Flags/zh-CN.svg" },
  { lang: "Chinese Traditional", code: "zh-HK", tarCode: "zh-Hant", flag: "/icons/Flags/zh-HK.svg" },
  { lang: "Croatian", code: "hr-HR", tarCode: "hr", flag: "/icons/Flags/hr-HR.svg" },
  { lang: "Czech", code: "cs-CZ", tarCode: "cs", flag: "/icons/Flags/cs-CZ.svg" },
  { lang: "Danish", code: "da-DK", tarCode: "da", flag: "/icons/Flags/da-DK.svg" },
  { lang: "Dari", code: "prs", tarCode: "prs", flag: "/icons/Flags/prs.svg" },
  { lang: "Dutch", code: "nl-NL", tarCode: "nl", flag: "/icons/Flags/nl-NL.svg" },
  { lang: "English", code: "en-US", tarCode: "en", flag: "/icons/Flags/en-US.svg" },
  { lang: "Estonian", code: "et-EE", tarCode: "et", flag: "/icons/Flags/et-EE.svg" },
  { lang: "Filipino", code: "fil-PH", tarCode: "fil", flag: "/icons/Flags/fil-PH.svg" },
  { lang: "Finnish", code: "fi-FI", tarCode: "fi", flag: "/icons/Flags/fi-FI.svg" },
  { lang: "French", code: "fr-FR", tarCode: "fr", flag: "/icons/Flags/fr-FR.svg" },
  { lang: "French (Canada)", code: "fr-CA", tarCode: "fr", flag: "/icons/Flags/fr-ca.svg" },
  { lang: "German", code: "de-DE", tarCode: "de", flag: "/icons/Flags/de-DE.svg" },
  { lang: "Greek", code: "el-GR", tarCode: "el", flag: "/icons/Flags/el-GR.svg" },
  { lang: "Gujarati", code: "gu-IN", tarCode: "gu", flag: "/icons/Flags/gu-IN.svg" },
  { lang: "Hebrew", code: "he-IL", tarCode: "he", flag: "/icons/Flags/he-IL.svg" },
  { lang: "Hindi", code: "hi-IN", tarCode: "hi", flag: "/icons/Flags/hi-IN.svg" },
  { lang: "Hungarian", code: "hu-HU", tarCode: "hu", flag: "/icons/Flags/hu-HU.svg" },
  { lang: "Icelandic", code: "is-IS", tarCode: "is", flag: "/icons/Flags/is-IS.svg" },
  { lang: "Indonesian", code: "id-ID", tarCode: "id", flag: "/icons/Flags/id-ID.svg" },
  { lang: "Irish", code: "ga-IE", tarCode: "ga", flag: "/icons/Flags/ga-IE.svg" },
  { lang: "Italian", code: "it-IT", tarCode: "it", flag: "/icons/Flags/it-IT.svg" },
  { lang: "Japanese", code: "ja-JP", tarCode: "ja", flag: "/icons/Flags/ja-JP.svg" },
  { lang: "Kannada", code: "kn-IN", tarCode: "kn", flag: "/icons/Flags/kn-IN.svg" },
  { lang: "Kazakh", code: "kk-KZ", tarCode: "kk", flag: "/icons/Flags/kk-KZ.svg" },
  { lang: "Khmer", code: "km-KH", tarCode: "km", flag: "/icons/Flags/km-KH.svg" },
  { lang: "Korean", code: "ko-KR", tarCode: "ko", flag: "/icons/Flags/ko-KR.svg" },
  { lang: "Lao", code: "lo-LA", tarCode: "lo", flag: "/icons/Flags/lo-LA.svg" },
  { lang: "Latvian", code: "lv-LV", tarCode: "lv", flag: "/icons/Flags/lv-LV.svg" },
  { lang: "Lithuanian", code: "lt-LT", tarCode: "lt", flag: "/icons/Flags/lt-LT.svg" },
  { lang: "Malay", code: "ms-MY", tarCode: "ms", flag: "/icons/Flags/ms-MY.svg" },
  { lang: "Malayalam", code: "ml-IN", tarCode: "ml", flag: "/icons/Flags/ml-IN.svg" },
  { lang: "Maltese", code: "mt-MT", tarCode: "mt", flag: "/icons/Flags/mt-MT.svg" },
  { lang: "Marathi", code: "mr-IN", tarCode: "mr", flag: "/icons/Flags/mr-IN.svg" },
  { lang: "Myanmar", code: "my-MM", tarCode: "my", flag: "/icons/Flags/my-MM.svg" },
  { lang: "Nepali", code: "ne-NP", tarCode: "ne", flag: "/icons/Flags/ne-NP.svg" },
  { lang: "Norwegian", code: "nb-NO", tarCode: "nb", flag: "/icons/Flags/nb-NO.svg" },
  { lang: "Pashto", code: "ps-AF", tarCode: "ps", flag: "/icons/Flags/ps-AF.svg" },
  { lang: "Persian", code: "fa-IR", tarCode: "fa", flag: "/icons/Flags/fa-IR.svg" },
  { lang: "Polish", code: "pl-PL", tarCode: "pl", flag: "/icons/Flags/pl-PL.svg" },
  { lang: "Portuguese (Brazil)", code: "pt-BR", tarCode: "pt", flag: "/icons/Flags/pt-BR.svg" },
  { lang: "Portuguese (Portugal)", code: "pt-PT", tarCode: "pt", flag: "/icons/Flags/pt-PT.svg" },
  { lang: "Punjabi", code: "pa-IN", tarCode: "pa", flag: "/icons/Flags/pa-IN.svg" },
  { lang: "Romanian", code: "ro-RO", tarCode: "ro", flag: "/icons/Flags/ro-RO.svg" },
  { lang: "Russian", code: "ru-RU", tarCode: "ru", flag: "/icons/Flags/ru-RU.svg" },
  { lang: "Serbian (Cyrillic)", code: "sr-RS", tarCode: "sr", flag: "/icons/Flags/sr-RS.svg" },
  { lang: "Serbian (Latin)", code: "sr-Latn-RS", tarCode: "sr-Latn", flag: "/icons/Flags/sr-Latn-RS.svg" },
  { lang: "Slovak", code: "sk-SK", tarCode: "sk", flag: "/icons/Flags/sk-SK.svg" },
  { lang: "Slovenian", code: "sl-SI", tarCode: "sl", flag: "/icons/Flags/sl-SI.svg" },
  { lang: "Spanish", code: "es-ES", tarCode: "es", flag: "/icons/Flags/es-ES.svg" },
  { lang: "Swahili", code: "sw-KE", tarCode: "sw", flag: "/icons/Flags/sw-KE.svg" },
  { lang: "Swedish", code: "sv-SE", tarCode: "sv", flag: "/icons/Flags/sv-SE.svg" },
  { lang: "Tamil", code: "ta-IN", tarCode: "ta", flag: "/icons/Flags/ta-IN.svg" },
  { lang: "Telugu", code: "te-IN", tarCode: "te", flag: "/icons/Flags/te-IN.svg" },
  { lang: "Thai", code: "th-TH", tarCode: "th", flag: "/icons/Flags/th-TH.svg" },
  { lang: "Turkish", code: "tr-TR", tarCode: "tr", flag: "/icons/Flags/tr-TR.svg" },
  { lang: "Ukrainian", code: "uk-UA", tarCode: "uk", flag: "/icons/Flags/uk-UA.svg" },
  { lang: "Urdu", code: "ur-IN", tarCode: "ur", flag: "/icons/Flags/ur-IN.svg" },
  { lang: "Vietnamese", code: "vi-VN", tarCode: "vi", flag: "/icons/Flags/vi-VN.svg" },
  { lang: "Welsh", code: "cy-GB", tarCode: "cy", flag: "/icons/Flags/cy-GB.svg" }
];

const sourceLangList = [
  { lang: "English", code: "en-US", tarCode: "en", flag: "/icons/Flags/en-US.svg" }
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

export const neuralVoiceData: DropdownData<{ lang: string; flag: string }> = {
  btnDrpDwnTxt: "Neural Voice",
  links: [
    { lang: "AriaNeural (Cheerful Male)", flag: "/icons/Flags/en-US.svg" },
    { lang: "GuyNeural (Professional Male)", flag: "/icons/Flags/en-US.svg" },
    { lang: "JennyNeural (Empathetic Female)", flag: "/icons/Flags/en-US.svg" },
    { lang: "DaliaNeural (General Female)", flag: "/icons/Flags/es-ES.svg" },
    { lang: "JorgeNeural (Friendly Male)", flag: "/icons/Flags/es-ES.svg" },
    { lang: "XiaoxiaoNeural (Cheerful Female)", flag: "/icons/Flags/zh-Hant.svg" },
    { lang: "YunxiNeural (Calm Male)", flag: "/icons/Flags/zh-Hant.svg" }
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

// 5. Playbutton Section
export const plyBtnData: PlaybuttonData<string> = {
  errorMessage: "Please make sure you have selected a target language and neural voice"
}