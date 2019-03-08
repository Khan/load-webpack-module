const React = require("react");
const {hot} = require("react-hot-loader/root.js");
const Baz = require("./baz.js").default;

class Bar extends React.Component {
    render() {
        return <Baz color="orange">
            Bar!!
        </Baz>;
    }
}

module.exports = hot(Bar);
