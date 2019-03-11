// react-hot-loader doesn't know how to patch:
// import * as React from "react";
// import * as ReactDOM from "react-dom";
import React from "react";
import ReactDOM from "react-dom";

import Sandbox from "./sandbox/sandbox.js";

// Prevents entry points from rendering when loading entry bundles
// in the sandbox.  The sandbox loads bundles for access to the
// modules they contain and we don't actually want them to render
// anything in this situation.
window.__Sandbox__ = true;
window.React = React;
window.ReactDOM = ReactDOM;

const container = document.querySelector("#container") || document.createElement("div");
container.id = "container";
document.body.appendChild(container);

// We don't need AppContainer for the Sandbox unless we want the Sandbox
// code itself to be hot-loadable.
ReactDOM.render(<Sandbox/>, container);
