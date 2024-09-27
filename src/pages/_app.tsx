
import { AppProps } from 'next/app';
import { ApiKeyProvider } from '@/Contexts/ApiKeyContext';
import { LocalizationProvider } from '@/Contexts/LocalizationContext';

function MyApp({Component, pageProps}: AppProps) {
    return (
        <ApiKeyProvider>
            <LocalizationProvider>
                <Component {...pageProps} />
            </LocalizationProvider>
        </ApiKeyProvider>
    );
}

export default MyApp;