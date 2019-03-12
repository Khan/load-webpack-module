import Baz from "../components/baz.js";

module.exports = {
    instances: [
        {
            children: "Hello, world!",
        },
        {
            children: "testing one two",
        },
        () => <Baz>direct instantiation test!</Baz>,
    ],
};
