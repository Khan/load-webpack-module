import React from "react";
import { hot } from "react-hot-loader/root.js";

import {createLoadModuleFn} from "./module-loader.js";
import fixtures from "./fixtures.js";

class Sandbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Component: null,
            fixture: null,
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
        const modules = Object.keys(fixtures);

        if (index > 0 && !!loadModule) {
            const moduleId = modules[index - 1];
            Promise.all([
                loadModule(moduleId),
                fixtures[moduleId](),
            ]).then(([component, fixture]) => {
                this.setState({
                    Component: component.__esModule ? component.default : component,
                    fixture: fixture.__esModule ? fixture.default : fixture,
                    index,
                });
                console.log(`${moduleId} loaded`);
            });

        }
    }

    render() {
        const {Component, fixture, loadModule, index} = this.state;
        const modules = Object.keys(fixtures);

        return <div>
            <h1>Sandbox</h1>
            <select onChange={this.handleChange} disabled={!loadModule}>
                <option>Select a value</option>
                {modules.map(m =>
                    <option key={m} value={m}>{m}</option>)}
            </select>
            <div>
                {Component && fixture && 
                    fixture.instances.map((props, key) => 
                        <Component key={key} {...props} />)}
            </div>
        </div>
    }
}

export default hot(Sandbox);
