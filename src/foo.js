import * as React from "react";
import Baz from "./baz.js";

export default class Foo extends React.Component {
    render() {
        return <Baz color="plum">
            Foo
        </Baz>;
    }
}
