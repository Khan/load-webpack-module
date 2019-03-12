// TODO: autogenerate this file
// any fixture that doesn't manually import/require a file can go in the same chunk
// those that do will each get their own chunk

const fixtures = {
    "./src/components/app.js": () => import(/* webpackChunkName: "fixtures-common" */ "../fixtures/app.fixture.js"),
    "./src/components/bar.js": () => import(/* webpackChunkName: "fixtures-common" */ "../fixtures/bar.fixture.js"),
    "./src/components/baz.js": () => import(/* webpackChunkName: "fixtures-baz" */ "../fixtures/baz.fixture.js"),
    "./src/components/foo.js": () => import(/* webpackChunkName: "fixtures-foo" */ "../fixtures/foo.fixture.js"),
};

export default fixtures;
