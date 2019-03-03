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
                
                const chunkMap = {};
                for (const chunk of stats.compilation.chunks) {
                    for (const module of [...chunk._modules]) {
                        chunkMap[module.id] = chunk.id;
                    }
                }
                
                const chunkDeps = {};
                for (const chunk of stats.compilation.chunks) {
                    for (const module of [...chunk._modules]) {
                        for (const reason of module.reasons) {
                            if (reason.module) {
                                const reasonChunk = chunkMap[reason.module.id];
                                const depChunk = chunkMap[module.id];

                                if (reasonChunk !== depChunk) {
                                    if (!(chunkDeps.hasOwnProperty(reasonChunk))) {
                                        chunkDeps[reasonChunk] = new Set();
                                    }
                                    chunkDeps[reasonChunk].add(depChunk);
                                }
                            }
                        }
                    }
                }

                for (const [key, value] of Object.entries(chunkDeps)) {
                    chunkDeps[key] = [...value];
                }
                
                const output = {
                    chunkMap,
                    chunkDeps,
                };

                fs.writeFileSync("./module-chunk-deps.json", JSON.stringify(output, null, 4));
            }
        });
    }
}

module.exports = ModuleChunkMapPlugin;
