/*

TABLE OF CONTENTS:
1. Form Section
2. Footer Section
3. Listgroup Section
4. Dropdown Section
5. Contexts
6. Playbutton Section

*/


// 1. Form Section
export interface FormData {
    formText: string;
}

// 2. Footer section
export interface FooterLink {
    text: string;
    url: string;
    imgUrl: string;
}
  
export interface FooterData {
    links: FooterLink[]; // Array of FooterLink objects
}

// 3. Listgroup Section
export interface ListgroupLink {
    linkHeader: string;
}

export interface Listgroup {
    links: ListgroupLink[]; // Array of FooterLink objects
}

// 4. Dropdown Section

export interface DropdownData<T> {
    btnDrpDwnTxt: string;
    links: T[];
    config: {
        displayText: keyof T;  // Property name for the text to display on the button
        renderItemText: keyof T;  // Property name for the text to render in the list
    };
}

export interface DropdownButtons {
    lang: string;
    flag: string;
}

export interface DropdownMenuProps<T> {
    data: DropdownData<T>;
    renderItem: (item: T) => React.ReactNode;
    handleTarLang?: (newLocale: string, newVoiceLocale: string) => void;
    handleShortName?: (newShortName: string) => void;
    isDisabled?: boolean;
    actTransClick?: (e: any) => void;
    requiredFields?: Array<any>;
}

export interface Voice {
    LocalName: string;
    ShortName: string;
    Gender: string;
    Locale: string;
    SampleRateHertz: string;
    WordsPerMinute: string;
}

// 5. Contexts
    // 5a. API Key Context
    export interface ApiKeyContextType {
        apiKey: string;
        setApiKey: (key: string) => void;
    };

    // 5b. Locale Context
    export interface LocaleContextType {
        locale: string;
        tarLocale: string;
        setLocale: (locale: string) => void;
        setTarLocale: (tarLocale: string) => void;
    };

// 6. Playbutton Section
export interface PlaybuttonProps {
    isPlaying: boolean;
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
    requiredFields: Array<any>;
    data: PlaybuttonData;
    isWarmingUp: boolean;
    setIsWarmingUp: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface PlaybuttonData {
    errorMessage: string;
}