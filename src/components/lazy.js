import * as React from "react";
import Loadable from "react-loadable";
// import loadable from '@loadable/component'

// facade for react-loadable
const lazy = ({loader, loading}) => Loadable({loader, loading});

// facade for loadable-components
// const lazy = ({loader, loading}) => loadable(loader, {fallback: loading});

// TODO: expose delay, timeout, pre-fetching, etc.

export default lazy;
