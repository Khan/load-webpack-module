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

        compiler.hooks.emit.tap(pluginName, compilation => {
            const chunkMap = {};
            for (const chunk of compilation.chunks) {
                for (const module of [...chunk._modules]) {
                    chunkMap[module.id] = chunk.id;
                }
            }
            
            const moduleDeps = {};
            for (const chunk of compilation.chunks) {
                for (const module of [...chunk._modules]) {
                    for (const reason of module.reasons) {
                        if (reason.module) {
                            // console.log(reason.module.type);
                            
                            if (!moduleDeps.hasOwnProperty(reason.module.id)) {
                                moduleDeps[reason.module.id] = new Set();
                            }
                            moduleDeps[reason.module.id].add(module.id);
                        }
                    }
                }
            }
            
            const output = {};

            const getChunksForModule = (moduleId) => {
                if (output.hasOwnProperty(moduleId)) {
                    return output[moduleId];
                } else {
                    const containingChunk = chunkMap[moduleId];
                    const directModuleDeps = [...(moduleDeps[moduleId] || [])];
                    const chunkDeps = new Set();

                    // compute
                    chunkDeps.add(containingChunk);
                    for (const moduleDep of directModuleDeps) {
                        for (const chunk of getChunksForModule(moduleDep)) {
                            chunkDeps.add(chunk);
                        }
                    }

                    // memoize
                    output[moduleId] = [...chunkDeps];

                    // return
                    return output[moduleId];
                }
            }

            for (const moduleId of Object.keys(moduleDeps)) {
                getChunksForModule(moduleId);
            }

            const json = JSON.stringify(output, null, 4);
            
            compilation.assets["module-chunk-deps.json"] = {
				source: () => json,
				size: () => json.length
			};

            fs.writeFileSync("./module-chunk-deps.json", json);
        });
    }
}

module.exports = ModuleChunkMapPlugin;
