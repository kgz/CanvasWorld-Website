import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";

import Template from "./pages/template";
import { Provider } from "react-redux";
import store from "./@store/store";
import { Helmet } from "react-helmet";

// create conetex for types const [isLoggedin, setIsLoggedin] = useState(false);

const App = () => {
    return (
        <Provider store={store}><Toaster
            position="bottom-left"
            reverseOrder={false}
        />
            <BrowserRouter basename="/chaos">
                <Helmet>
                    <title>Chaos</title>
                    <meta name="description" content="Chaos Attractors" />
                    <meta name="theme-color" content="#008f68" />

                    <meta property="og:title" content="Chaos Attractors" />
                    <meta property="og:description" content="Chaos Attractors" />
                    {/* <meta property="og:image" content="https://i.imgur.com/4M7IWwP.png" /> */}
                    <meta property="og:url" content="https://matf.dev/chaos" />
                    <meta name="twitter:title" content="Chaos Attractors" />
                    <meta name="twitter:description" content="Chaos Attractors" />
                    {/* <meta name="twitter:image" content="https://i.imgur.com/4M7IWwP.png" /> */}
                    <meta name="twitter:card" content="summary_large_image" />
                </Helmet>
                {/* <Index /> */}
                <Template />

            </BrowserRouter>
        </Provider>
    )
}

export default App;