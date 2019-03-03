import * as React from "react";
import * as ReactDOM from "react-dom";

import {createLoadModuleFn} from "./module-loader.js";

// Prevents entry points from rendering when loading entry bundles
// in the sandbox.  The sandbox loads bundles for access to the
// modules they contain and we don't actually want them to render
// anything in this situation.
window.__Sandbox__ = true;

const container = document.querySelector("#container");
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
        };
    }

    componentDidMount() {
        createLoadModuleFn("/module-chunk-deps.json").then(loadModule => {
            this.setState({loadModule});
            // export global for debugging purposes
            window.loadModule = loadModule;
        });
    }

    handleChange = (e) => {
        const index = e.currentTarget.selectedIndex;
        const {loadModule} = this.state;

        if (index > 0 && !!loadModule) {
            const moduleId = modules[index - 1];
            console.log(`loading ${moduleId}`);
            loadModule(moduleId).then(m => {
                if (m.__esModule) {
                    this.setState({Component: m.default});
                    console.log(`${moduleId} loaded`);
                } else {
                    this.setState({Component: m});
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

ReactDOM.render(<Sandbox/>, container);
