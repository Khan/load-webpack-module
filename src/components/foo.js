import * as React from "react";
import Baz from "./baz.js";

class Foo extends React.Component {
    render() {
        return <Baz color="plum">
            Foo
        </Baz>;
    }
}

export default Foo;

if (module.hot) module.hot.accept();
