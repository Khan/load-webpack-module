import * as React from "react";

class Baz extends React.Component {
    render() {
        const style = {
            color: this.props.color, 
            fontFamily: "sans-serif", 
            fontSize: 32,
        };
        return <div style={style}>
            {this.props.children}
        </div>
    }
}

export default Baz;

// components that aren't directly rendered in the sandbox don't need
// to self accept for hot-loading.
