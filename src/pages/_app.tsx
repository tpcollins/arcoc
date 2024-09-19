// import '../styles/globals.css'; 
import { AppProps } from 'next/app';
import { ApiKeyProvider } from '@/Contexts/ApiKeyContext';

function MyApp({Component, pageProps}: AppProps) {
    return (
        <ApiKeyProvider>
            <Component {...pageProps} />
        </ApiKeyProvider>
    );
}

export default MyApp;