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
export const targetLangData: DropdownData<{ lang: string; flag: string }> = {
  btnDrpDwnTxt: "Target Language",
  links: [
    { lang: "English", flag: "/icons/america.svg" },
    { lang: "Español", flag: "/icons/spain.svg" },
    { lang: "Chinese", flag: "/icons/china.svg" }
  ]
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