import React, {  } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import store from './@store/store';
import App from './app';
import Template from './pages/template';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        {/* <Provider store={store}> */}

            {/* reactrouter */}
        <App />


        {/* </Provider> */}
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
