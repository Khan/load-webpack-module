import * as React from "react";
import * as ReactDOM from "react-dom";

import App from "./app.js";

window.Require = __webpack_require__;

const container = document.querySelector("#container");

if (!window.__Sandbox__) {
    ReactDOM.render(<App/>, container);
}
