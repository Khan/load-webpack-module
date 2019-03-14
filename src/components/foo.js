import * as React from "react";

import lazy from "./lazy.js";
// import Baz from "./baz.js";

const LoadableBaz = lazy({
    loader: () => import("./baz.js"),
    loading() {
        return <div>Loading...</div>
    }
});

class Foo extends React.Component {
    render() {
        return <LoadableBaz color="plum">
            Foo
        </LoadableBaz>;
    }
}

export default Foo;

if (module.hot) module.hot.accept();
