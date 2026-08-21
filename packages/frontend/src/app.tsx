import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";

import Template from "./pages/template";
import { Provider } from "react-redux";
import store from "./@store/store";
import { Helmet } from "react-helmet";
import { useMatomo } from '@datapunt/matomo-tracker-react'
import { useEffect } from 'react'

// create conetex for types const [isLoggedin, setIsLoggedin] = useState(false);

const App = () => {
	return (
		<Provider store={store}>
			<Toaster position="bottom-left" reverseOrder={false} />
			<BrowserRouter basename="/chaos/">
				<Helmet>
					<title>Classical Chaos</title>
					<meta name="description" content="Interactive sketches of classical dynamical systems." />
					<meta name="theme-color" content="#008f68" />
					<meta property="og:title" content="Classical Chaos" />
					<meta property="og:description" content="Interactive sketches of classical dynamical systems." />
					<meta property="og:url" content="https://matf.dev/chaos/" />
					<meta property="og:image" content="https://matf.dev/chaos/icons/mandelbrot_set.png" />
					<meta name="twitter:title" content="Classical Chaos" />
					<meta name="twitter:description" content="Interactive sketches of classical dynamical systems." />
					<meta name="twitter:image" content="https://matf.dev/chaos/icons/mandelbrot_set.png" />
					<meta name="twitter:card" content="summary_large_image" />
				</Helmet>
				{/* <Index /> */}
				<Template />
			</BrowserRouter>
		</Provider>
	)
}

export default App;