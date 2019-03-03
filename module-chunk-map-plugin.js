/**
 * Writes a JSON file containing a map from moduleId to chunkId, e.g.
 * 
 * {
 *     "./src/bar.js": 0,
 *     "./src/foo.js": 1,        // unnamed async bundle
 *     "./src/app.js": "index",  // named entry point bundle
 *     ...
 * }
 */
const fs = require("fs");

class ModuleChunkMapPlugin {
    constructor(options = {}) {
        this.options = options;
    }

    apply(compiler) {
        const pluginName = "FailOnErrorPlugin";
        let isWatching = false;

        compiler.hooks.watchRun.tap(pluginName, compiler => {
            isWatching = true;
        });

        compiler.hooks.done.tap(pluginName, stats => {
            if (!stats.hasErrors()) {
                
                const map = {};
                for (const chunk of stats.compilation.chunks) {
                    for (const module of [...chunk._modules]) {
                        map[module.id] = chunk.id;
                    }
                }         
                
                fs.writeFileSync("./module-chunk-map.json", JSON.stringify(map, null, 4));
            }
        });
    }
}

module.exports = ModuleChunkMapPlugin;
