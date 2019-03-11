import * as React from "react";

import style from "./style.js";

class Baz extends React.Component {
    render() {
        return <div style={{...style, color: this.props.color}}>
            {this.props.children}
        </div>
    }
}

export default Baz;

// components that aren't directly rendered in the sandbox don't need
// to self accept for hot-loading.
