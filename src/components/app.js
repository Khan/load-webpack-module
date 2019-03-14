import * as React from "react";
import { hot } from "react-hot-loader/root.js";

import lazy from "./lazy.js";

const LoadableFoo = lazy({
    loader: () => import("./foo.js"),
    loading() {
        return <div>Loading...</div>
    }
});

const LoadableBar = lazy({
    loader: () => import("./bar.js"),
    loading() {
        return <div>Loading...</div>
    }
});

class App extends React.Component {
    render() {
        return <div>
            <h1>Hello, world</h1>
            <LoadableFoo/>
            <LoadableBar/>
        </div>;
    }
}

export default hot(App);

if (module.hot) module.hot.accept();
