import * as React from "react";
import {hot} from "react-hot-loader/root.js";

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

export default hot(Baz);
