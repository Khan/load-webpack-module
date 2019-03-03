import * as React from "react";

export default class Baz extends React.Component {
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
