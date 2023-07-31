import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import Root from './Root';
import reportWebVitals from './reportWebVitals';
import {RequireNodeModule} from "./utils";

ReactDOM.createRoot(document.getElementById('__lmo__') as HTMLElement).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
reportWebVitals();
