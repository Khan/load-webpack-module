import * as React from "react";
import Baz from "./baz.js";
import {hot} from "react-hot-loader/root.js";

class Foo extends React.Component {
    render() {
        return <Baz color="plum">
            Foo
        </Baz>;
    }
}

export default hot(Foo);
