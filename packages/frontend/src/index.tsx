import React, {  } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import store from './@store/store';
import App from './app';
import Template from './pages/template';
import { MatomoProvider, createInstance } from '@datapunt/matomo-tracker-react'
import './index.css'

// Traefik + Vite base use /chaos/; RR Links with basename /chaos omit the slash.
if (window.location.pathname === '/chaos') {
	window.location.replace(`/chaos/${window.location.search}${window.location.hash}`)
}

// Suppress react-dat-gui UNSAFE_componentWillMount warning
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
	if (args[0] && typeof args[0] === 'string' && args[0].includes('UNSAFE_componentWillMount')) {
		// Suppress react-dat-gui warnings
		return;
	}
	originalConsoleWarn.apply(console, args);
};

const rootEl = document.getElementById('root')
if (!rootEl) {
	throw new Error('root element missing')
}
const root = ReactDOM.createRoot(rootEl)

// const instance = createInstance({
// 	urlBase: 'http://localhost:9000',
// 	siteId: 1,
// 	trackerUrl: 'http://localhost:9000/matomo.php', // optional, default value: `${urlBase}matomo.php`
// 	srcUrl: 'http://localhost:9000/matomo.js', // optional, default value: `${urlBase}matomo.js`
// 	disabled: false, // optional, false by default. Makes all tracking calls no-ops if set to true.
// 	heartBeat: {
// 		// optional, enabled by default
// 		active: true, // optional, default value: true
// 		seconds: 10, // optional, default value: `15
// 	},
// 	linkTracking: true, // optional, default value: true
// 	configurations: {
// 		// optional, default value: {}
// 		// any valid matomo configuration, all below are optional
// 		disableCookies: true,
// 		setSecureCookie: true,
// 		setRequestMethod: 'POST',
// 	},
// })

root.render(
	<React.StrictMode>
		{/* <MatomoProvider value={instance}> */}
		{/* <Provider store={store}> */}

		{/* reactrouter */}
		<App />
		{/* </MatomoProvider> */}
		{/* </Provider> */}
	</React.StrictMode>,
)


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
