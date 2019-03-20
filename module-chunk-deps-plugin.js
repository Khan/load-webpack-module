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
        const pluginName = "ModuleChunkDepsPlugin";
        // let isWatching = false;

        // compiler.hooks.watchRun.tap(pluginName, compiler => {
        //     isWatching = true;
        // });
        
        compiler.hooks.done.tap(pluginName, stats => {
            if (stats.hasErrors()) {
                throw new Error("stats.hasErrors");
            }

            const json = stats.toJson();
            
            const chunkMap = {};
            for (const chunk of json.chunks) {
                for (const module of chunk.modules) {
                    chunkMap[module.id] = chunk.id;
                }
            }

            const moduleDeps = {};
            for (const module of json.modules) {
                for (const reason of module.reasons) {
                    if (reason.moduleId === null) {
                        continue;
                    }
                    // Don't include dynamic imports() since they aren't needed
                    // to load the module and webpack will load these deps for
                    // us whenever `import()` is called.
                    if (reason.type !== "import()") {
                        if (!moduleDeps.hasOwnProperty(reason.moduleId)) {
                            moduleDeps[reason.moduleId] = new Set();
                        }
                        moduleDeps[reason.moduleId].add(module.id);
                    }
                }
            }

            // for (const [mod, deps] of Object.entries(moduleDeps)) {
            //     console.log(`${mod}: ${[...deps]}`);
            // }
           
            const output = {};

            const getChunksForModule = (moduleId) => {
                if (output.hasOwnProperty(moduleId)) {
                    return output[moduleId];
                } else {
                    const containingChunk = chunkMap[moduleId];
                    const directModuleDeps = [...(moduleDeps[moduleId] || [])];
                    const chunkDeps = new Set();

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

            fs.writeFileSync("./module-chunk-deps.json", JSON.stringify(output, null, 4));
        });
    }
}

module.exports = ModuleChunkMapPlugin;
