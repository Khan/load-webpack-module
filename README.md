# load-webpack-module

Sometimes it's useful to be able to load modules from a webpack-based project
at runtime for debugging or rendering component fixtures.  The benefit of using
this approach as opposed to loading components with `import()` is that no additional
bundles will be created.

# Quick Start

- yarn
- yarn start
- open http://localhost:8080/dist/sandbox.html
- open http://localhost:8080/dist/index.html
