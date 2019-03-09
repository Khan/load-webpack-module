// react-hot-loader doesn't know how to patch:
// import * as React from "react";
// import * as ReactDOM from "react-dom";
import React from "react";
import ReactDOM from "react-dom";
import Loadable from "react-loadable";
import {createLoadModuleFn} from "./module-loader.js";

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

// TODO: generate this list based on fixture tests
const modules = [
    "./src/app.js",
    "./src/foo.js",
    "./src/bar.js",
];

class Sandbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Component: null,
            loadModule: null,
            index: 0,
        };
    }

    componentDidMount() {
        createLoadModuleFn("/module-chunk-deps.json").then(loadModule => {
            this.setState({loadModule});
            // export global for debugging purposes
            window.loadModule = loadModule;
        });

        if (module.hot) {
            module.hot.addStatusHandler(status => {
                const {loadModule, index} = this.state;
                // An "idle" status indicates that a hot update has been 
                // successfully accept, let's try updating the current
                // module.
                if (status === "idle") {
                    this.loadModuleAtIndex(index);
                }
            });
        }
    }

    handleChange = (e) => {
        const index = e.currentTarget.selectedIndex;
        this.loadModuleAtIndex(index);
    }

    loadModuleAtIndex(index) {
        const {loadModule} = this.state;

        if (index > 0 && !!loadModule) {
            const moduleId = modules[index - 1];
            loadModule(moduleId).then(m => {
                if (m.__esModule) {
                    this.setState({Component: m.default, index});
                    console.log(`${moduleId} loaded`);
                } else {
                    this.setState({Component: m, index});
                    console.log(`${moduleId} loaded`);
                }
            });
        }
    }

    render() {
        const {Component, loadModule} = this.state;
        return <div>
            <h1>Sandbox</h1>
            <select onChange={this.handleChange} disabled={!loadModule}>
                <option>Select a value</option>
                {modules.map(m =>
                    <option key={m} value={m}>{m}</option>)}
            </select>
            <div>
                {Component && <Component/>}
            </div>
        </div>
    }
}

// We don't need AppContainer for the Sandbox unless we want the Sandbox
// code itself to be hot-loadable.
ReactDOM.render(<Sandbox/>, container);
