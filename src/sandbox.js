import * as React from "react";
import * as ReactDOM from "react-dom";

// Prevents entry points from rendering when loading entry bundles
// in the sandbox.  The sandbox loads bundles for access to the
// modules they contain and we don't actually want them to render
// anything in this situation.
window.__Sandbox__ = true;

const init = () => 
    fetch("/module-chunk-map.json")
        .then(res => res.json())
        .then(chunkMap => {
            const require = (moduleId) => {
                return new Promise((resolve, reject) => {
                    if (moduleId in chunkMap) {
                        const chunkId = chunkMap[moduleId];
                        __webpack_chunk_load__(chunkId).then(promises => {
                            resolve(__webpack_require__(moduleId));
                        });
                    } else {
                        reject(`${moduleId} not found`);
                    }
                });
            };
            return require;
        });

init().then(require => {
    window.require = require;
});

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
        };
    }

    handleChange = (e) => {
        const index = e.currentTarget.selectedIndex;
        if (index > 0) {
            const moduleId = modules[index - 1];
            console.log(`loading ${moduleId}`);
            window.require(moduleId).then(m => {
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
        const {Component} = this.state;
        return <div>
            <h1>Sandbox</h1>
            <select onChange={this.handleChange}>
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
