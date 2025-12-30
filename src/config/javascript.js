const esbuild = require("esbuild");
const path = require("node:path");
const server = require("../config/server");
const isProduction = server.isProduction;

module.exports = {
    outputFileExtension: "js",
    
    compile: async (content, inputPath) => {
        // If the file isn't from the assets directory, ignore it
        if (!inputPath.includes("./src/assets/")) {
            return;
        }

        // Build JS with ESBuild
        const result = await esbuild.build({
            stdin: {
                contents: content,
                resolveDir: path.dirname(inputPath),
                sourcefile: inputPath,
            },
            bundle: true,
            minify: isProduction,
            sourcemap: !isProduction,
            target: isProduction ? "es6" : "esnext",
            write: false,
        });

        // Return the compiled content for Eleventy to write
        return async () => {
            return result.outputFiles[0].text;
        };
    },
};