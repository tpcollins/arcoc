/* 
TABLE OF CONTENTS:

1. Form Section
2. Footer Section
3. Listgroup Section
4. Dropdown Language Section

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
  { lang: "Afrikaans", code: "af-ZA", flag: "/icons/Flags/af-ZA.svg" },
  { lang: "Albanian", code: "sq-AL", flag: "/icons/Flags/sq-AL.svg" },
  { lang: "Amharic", code: "am-ET", flag: "/icons/Flags/am-ET.svg" },
  { lang: "Arabic", code: "ar-AE", flag: "/icons/Flags/ar-AE.svg" },
  { lang: "Armenian", code: "hy-AM", flag: "/icons/Flags/hy-AM.svg" },
  { lang: "Assamese", code: "as", flag: "/icons/Flags/as.svg" },
  { lang: "Azerbaijani", code: "az-AZ", flag: "/icons/Flags/az-AZ.svg" },
  { lang: "Bangla", code: "bn", flag: "/icons/Flags/bn.svg" },
  { lang: "Bosnian (Latin)", code: "bs-BA", flag: "/icons/Flags/bs-BA.svg" },
  { lang: "Bulgarian", code: "bg-BG", flag: "/icons/Flags/bg-BG.svg" },
  { lang: "Cantonese (Traditional)", code: "yue-CN", flag: "/icons/Flags/yue-CN.svg" },
  { lang: "Catalan", code: "ca-ES", flag: "/icons/Flags/ca-ES.svg" },
  { lang: "Chinese (Literary)", code: "lzh", flag: "/icons/Flags/lzh.svg" },
  { lang: "Chinese Simplified", code: "zh-Hans", flag: "/icons/Flags/zh-Hans.svg" },
  { lang: "Chinese Traditional", code: "zh-Hant", flag: "/icons/Flags/zh-Hant.svg" },
  { lang: "Croatian", code: "hr-HR", flag: "/icons/Flags/hr-HR.svg" },
  { lang: "Czech", code: "cs-CZ", flag: "/icons/Flags/cs-CZ.svg" },
  { lang: "Danish", code: "da-DK", flag: "/icons/Flags/da-DK.svg" },
  { lang: "Dari", code: "prs", flag: "/icons/Flags/prs.svg" },
  { lang: "Dutch", code: "nl-NL", flag: "/icons/Flags/nl-NL.svg" },
  { lang: "English", code: "en-US", flag: "/icons/Flags/en-US.svg" },
  { lang: "Estonian", code: "et-EE", flag: "/icons/Flags/et-EE.svg" },
  { lang: "Fijian", code: "fj", flag: "/icons/Flags/fj.svg" },
  { lang: "Filipino", code: "fil-PH", flag: "/icons/Flags/fil-PH.svg" },
  { lang: "Finnish", code: "fi-FI", flag: "/icons/Flags/fi-FI.svg" },
  { lang: "French", code: "fr-FR", flag: "/icons/Flags/fr-FR.svg" },
  { lang: "French (Canada)", code: "fr-ca", flag: "/icons/Flags/fr-ca.svg" },
  { lang: "German", code: "de-DE", flag: "/icons/Flags/de-DE.svg" },
  { lang: "Greek", code: "el-GR", flag: "/icons/Flags/el-GR.svg" },
  { lang: "Gujarati", code: "gu-IN", flag: "/icons/Flags/gu-IN.svg" },
  { lang: "Haitian Creole", code: "ht", flag: "/icons/Flags/ht.svg" },
  { lang: "Hebrew", code: "he-IL", flag: "/icons/Flags/he-IL.svg" },
  { lang: "Hindi", code: "hi-IN", flag: "/icons/Flags/hi-IN.svg" },
  { lang: "Hmong Daw", code: "mww", flag: "/icons/Flags/mww.svg" },
  { lang: "Hungarian", code: "hu-HU", flag: "/icons/Flags/hu-HU.svg" },
  { lang: "Icelandic", code: "is-IS", flag: "/icons/Flags/is-IS.svg" },
  { lang: "Indonesian", code: "id-ID", flag: "/icons/Flags/id-ID.svg" },
  { lang: "Inuktitut", code: "iu", flag: "/icons/Flags/iu.svg" },
  { lang: "Irish", code: "ga-IE", flag: "/icons/Flags/ga-IE.svg" },
  { lang: "Italian", code: "it-IT", flag: "/icons/Flags/it-IT.svg" },
  { lang: "Japanese", code: "ja-JP", flag: "/icons/Flags/ja-JP.svg" },
  { lang: "Kannada", code: "kn-IN", flag: "/icons/Flags/kn-IN.svg" },
  { lang: "Kazakh", code: "kk-KZ", flag: "/icons/Flags/kk-KZ.svg" },
  { lang: "Khmer", code: "km-KH", flag: "/icons/Flags/km-KH.svg" },
  { lang: "Korean", code: "ko-KR", flag: "/icons/Flags/ko-KR.svg" },
  { lang: "Kurdish (Central)", code: "ku", flag: "/icons/Flags/ku.svg" },
  { lang: "Kurdish (Northern)", code: "kmr", flag: "/icons/Flags/kmr.svg" },
  { lang: "Lao", code: "lo-LA", flag: "/icons/Flags/lo-LA.svg" },
  { lang: "Latvian", code: "lv-LV", flag: "/icons/Flags/lv-LV.svg" },
  { lang: "Lithuanian", code: "lt-LT", flag: "/icons/Flags/lt-LT.svg" },
  { lang: "Malagasy", code: "mg", flag: "/icons/Flags/mg.svg" },
  { lang: "Malay", code: "ms-MY", flag: "/icons/Flags/ms-MY.svg" },
  { lang: "Malayalam", code: "ml-IN", flag: "/icons/Flags/ml-IN.svg" },
  { lang: "Maltese", code: "mt-MT", flag: "/icons/Flags/mt-MT.svg" },
  { lang: "Maori", code: "mi", flag: "/icons/Flags/mi.svg" },
  { lang: "Marathi", code: "mr-IN", flag: "/icons/Flags/mr-IN.svg" },
  { lang: "Myanmar", code: "my-MM", flag: "/icons/Flags/my-MM.svg" },
  { lang: "Nepali", code: "ne-NP", flag: "/icons/Flags/ne-NP.svg" },
  { lang: "Norwegian", code: "nb-NO", flag: "/icons/Flags/nb-NO.svg" },
  { lang: "Odia", code: "or", flag: "/icons/Flags/or.svg" },
  { lang: "Pashto", code: "ps-AF", flag: "/icons/Flags/ps-AF.svg" },
  { lang: "Persian", code: "fa-IR", flag: "/icons/Flags/fa-IR.svg" },
  { lang: "Polish", code: "pl-PL", flag: "/icons/Flags/pl-PL.svg" },
  { lang: "Portuguese (Brazil)", code: "pt-BR", flag: "/icons/Flags/pt-BR.svg" },
  { lang: "Portuguese (Portugal)", code: "pt-PT", flag: "/icons/Flags/pt-PT.svg" },
  { lang: "Punjabi", code: "pa-IN", flag: "/icons/Flags/pa-IN.svg" },
  { lang: "Queretaro Otomi", code: "otq", flag: "/icons/Flags/otq.svg" },
  { lang: "Romanian", code: "ro-RO", flag: "/icons/Flags/ro-RO.svg" },
  { lang: "Russian", code: "ru-RU", flag: "/icons/Flags/ru-RU.svg" },
  { lang: "Samoan", code: "sm", flag: "/icons/Flags/sm.svg" },
  { lang: "Serbian (Cyrillic)", code: "sr-RS", flag: "/icons/Flags/sr-RS.svg" },
  { lang: "Serbian (Latin)", code: "sr-Latn", flag: "/icons/Flags/sr-Latn.svg" },
  { lang: "Slovak", code: "sk-SK", flag: "/icons/Flags/sk-SK.svg" },
  { lang: "Slovenian", code: "sl-SL", flag: "/icons/Flags/sl-SL.svg" },
  { lang: "Spanish", code: "es-ES", flag: "/icons/Flags/es-ES.svg" },
  { lang: "Swahili", code: "sw-KE", flag: "/icons/Flags/sw-KE.svg" },
  { lang: "Swedish", code: "sv-SE", flag: "/icons/Flags/sv-SE.svg" },
  { lang: "Tahitian", code: "ty", flag: "/icons/Flags/ty.svg" },
  { lang: "Tamil", code: "ta-IN", flag: "/icons/Flags/ta-IN.svg" },
  { lang: "Telugu", code: "te-IN", flag: "/icons/Flags/te-IN.svg" },
  { lang: "Thai", code: "th-TH", flag: "/icons/Flags/th-TH.svg" },
  { lang: "Tigrinya", code: "ti", flag: "/icons/Flags/ti.svg" },
  { lang: "Tongan", code: "to", flag: "/icons/Flags/to.svg" },
  { lang: "Turkish", code: "tr-TR", flag: "/icons/Flags/tr-TR.svg" },
  { lang: "Ukrainian", code: "uk-UA", flag: "/icons/Flags/uk-UA.svg" },
  { lang: "Urdu", code: "ur-IN", flag: "/icons/Flags/ur-IN.svg" },
  { lang: "Vietnamese", code: "vi-VN", flag: "/icons/Flags/vi-VN.svg" },
  { lang: "Welsh", code: "cy-GB", flag: "/icons/Flags/cy-GB.svg" },
  { lang: "Yucatec Maya", code: "yua", flag: "/icons/Flags/yua.svg" }
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