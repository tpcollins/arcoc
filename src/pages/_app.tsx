
import { AppProps } from 'next/app';
import { LocalizationProvider } from '@/Contexts/LocalizationContext';

import { Provider } from 'react-redux';
import store from '@/store/store';

function MyApp({Component, pageProps}: AppProps) {
    return (
        <Provider store={store}>
            <LocalizationProvider>
                <Component {...pageProps} />
            </LocalizationProvider>
        </Provider>
    );
}

export default MyApp;