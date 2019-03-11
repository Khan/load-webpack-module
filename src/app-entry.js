// react-hot-loader doesn't know how to patch:
// import * as React from "react";
// import * as ReactDOM from "react-dom";
import React from "react";
import ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";
import App from "./components/app.js";
import Loadable from "react-loadable";

window.Require = __webpack_require__;

if (!window.__Sandbox__) {
    const container = document.querySelector("#container") || document.createElement("div");
    container.id = "container";
    document.body.appendChild(container);

    ReactDOM.render(<App/>, container);

    // If there is some entry point that doesn't seem to work with the
    // hot wrapper for some reason, we can still use AppContainer with
    // it.

    // const render = Component => {
    //     ReactDOM.render(
    //         <AppContainer>
    //             <Component />
    //         </AppContainer>,
    //         container,
    //     );
    // }
      
    // render(App)

    // if (module.hot) {
    //     module.hot.accept("./app.js", () => {
    //         const App = require("./app.js").default;
    //         // wait until all async components are loaded before rendering
    //         Loadable.preloadAll().then(() => {
    //             console.log("re-rendering!")
    //             render(App);
    //         });
    //     });
    // }
}
