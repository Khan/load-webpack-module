const React = require("react");
const Baz = require("./baz.js").default;

class Bar extends React.Component {
    render() {
        return <Baz color="orange">
            Bar
        </Baz>;
    }
}

module.exports = Bar;
