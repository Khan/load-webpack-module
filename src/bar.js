const React = require("react");
const Baz = require("./baz.js").default;

class Bar extends React.Component {
    render() {
        return <Baz color="orange">
            Bar!
        </Baz>;
    }
}

module.exports = Bar;

// All components loaded directly by the sandbox need to self-accept
// since they're loaded independently and don't have a parent to accept
// for them.
if (module.hot && window.__Sandbox__) module.hot.accept();
