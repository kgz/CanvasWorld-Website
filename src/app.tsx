import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";

import Template from "./pages/template";
import { Provider } from "react-redux";
import store from "./@store/store";

// create conetex for types const [isLoggedin, setIsLoggedin] = useState(false);

const App = () => {
    return (
        <Provider store={store}><Toaster
            position="bottom-left"
            reverseOrder={false}
        />
            <BrowserRouter basename="/chaos">
                {/* <Index /> */}
                <Template />

            </BrowserRouter>
        </Provider>
    )
}

export default App;