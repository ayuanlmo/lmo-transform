import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import Root from './Root';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import Store from "./lib/Store";
import './bin/ffmpeg';

ReactDOM.createRoot(document.getElementById('__lmo__') as HTMLElement).render(
    <Provider store={Store}>
        <React.StrictMode>
            <Root />
        </React.StrictMode>
    </Provider>
);
reportWebVitals();
