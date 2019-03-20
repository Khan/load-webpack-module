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
                for (const module of stats.compilation.modules) {
                    console.log(module.type);
                }
                
                const chunkMap = {};
                for (const chunk of stats.compilation.chunks) {
                    for (const module of [...chunk._modules]) {
                        chunkMap[module.id] = chunk.id;
                    }
                }
                
                const moduleDeps = {};
                for (const chunk of stats.compilation.chunks) {
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
                        // compute
                        const chunkDeps = new Set();
                        chunkDeps.add(containingChunk);
                        for (const moduleDep of directModuleDeps) {
                            for (const chunk of getChunksForModule(moduleDep)) {
                                chunkDeps.add(chunk);
                            }
                        }
                        // const allDeps = new Set(directModuleDeps.reduce((allDeps, modDepId) => {
                            
                        //     return [...allDeps, ...getChunksForModule(modDepId)];
                        // }, [containingChunk]));
                        // memoize
                        output[moduleId] = [...chunkDeps];
                        // return
                        return output[moduleId];
                    }
                }

                for (const moduleId of Object.keys(moduleDeps)) {
                    getChunksForModule(moduleId);
                }
                

                // for (const [key, deps] of Object.entries(moduleDeps)) {
                //     const set = new Set([...deps].map(dep => chunkMap[dep]));
                //     output[key] = [...set];
                // }

                fs.writeFileSync("./module-chunk-deps.json", JSON.stringify(output, null, 4));
            }
        });
    }
}

module.exports = ModuleChunkMapPlugin;
