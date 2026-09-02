import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app'
import './index.css'

// Traefik + Vite base use /chaos/; RR Links with basename /chaos omit the slash.
if (window.location.pathname === '/chaos') {
	window.location.replace(`/chaos/${window.location.search}${window.location.hash}`)
}

const rootEl = document.getElementById('root')
if (!rootEl) {
	throw new Error('root element missing')
}
// Crawler-visible copy injected by the backend; drop once the SPA mounts.
document.getElementById('cw-seo')?.remove()
const root = ReactDOM.createRoot(rootEl)

root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
)
