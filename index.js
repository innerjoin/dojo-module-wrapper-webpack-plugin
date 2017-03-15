"use strict";

/**
 * used to parse the AMD source built by webpack 
 * Matches the following items:
 * - $1: extract the dependency list (e.g. "dojo/request/xhr") 
 * - $2: extract the variables referring to the dependency (e.g. "xhr")
 */ 
const replacementExpr = /(define\(\[.*\]\,\s?function\(.*\)\s?\{\s?return.*)\(function\([a-z]*\)\s?\{\s?.*/;
/**
 * Matches the entire AMD header (excluding the webpack return statement)
 * $1: e.g.: define("dojo/request/xhr", function(xhr) {
 */
const dependencyExtractorExpr = /define\(\[(.*)\]\,\s?function\((.*)\)\s?\{\s?return.*(\(function\([a-z]*\)\s?\{)\s?.*/;
/** expression to catch the end of the webpack AMD file */
const endBracketExpr = /.*\]\)\}\);;$/;
/** this brackets will be inserted as a replacement for endBracketExpr */
const endBracketString = "]);";
/** This suffix will be appended to the name defined in libraryName */
const fileNameSuffix = "Scripts.js";

/**
 * DojoModuleWrapperPlugin constructor
 * @param {*} options list of chunks to be processed. Each chunk must have a fileName specified
 */
function DojoModuleWrapperPlugin(options) {
    this.options = options || {};
}

DojoModuleWrapperPlugin.prototype.apply = function(compiler) {
    compiler.plugin("emit", (compilation, callback) => {
        let chunkKey = Object.keys(this.options);
        chunkKey.map((chunk, key) => {
            const distChunk = this.findFile(compilation, chunk);
            const baseUrl = this.options[chunk].baseUrl || '';
            const moduleName = this.options[chunk].moduleName || '';

            let source = compilation.assets[distChunk].source();
            
            const depExtractions = source.match(dependencyExtractorExpr);
            const toReplace = source.match(replacementExpr)[1];

            const dojoDeclareLoaderStatement = this.generateStartStatement(moduleName, depExtractions[1], depExtractions[2], baseUrl, fileNameSuffix);

            source = source.replace(toReplace, "");
            source = source.replace(endBracketExpr, endBracketString);

            const newName = distChunk.substring(0, distChunk.indexOf(".js")) + fileNameSuffix;

            compilation.assets[newName] = {
                source: function() {
                    return source;
                },
                size: function() {
                    return source.length;
                }
            };

            compilation.assets[distChunk].source = () => {
                return dojoDeclareLoaderStatement;
            };
        });
        callback();
    });
};

DojoModuleWrapperPlugin.prototype.generateStartStatement = function(moduleName, dependencies, dependencyVariables, baseUrl, fileNameSuffix) {
    var windowDeps = "";
    var deps = dependencyVariables.split(",");
    for(var i = 0; i < deps.length; i++) {
        windowDeps += '      window.' + deps[i] + ' = ' + deps[i] + ';\n';
    }

    return 'define(["dojo/_base/declare", "dojo/request/script", ' + dependencies + '],'
         + 'function(declare, script, ' + dependencyVariables + ') {  \n'
         + '  return declare("' + moduleName.replace(/\//g, ".") + '", null, {  \n'
         + '    executeBundle: function() {\n'
         + windowDeps + '\n'
         + '      script.get(' + baseUrl + ' + "' + moduleName + fileNameSuffix + '");  \n'
         + '    }  \n'
         + '  });  \n'
         + '});  \n';
}

DojoModuleWrapperPlugin.prototype.findFile = function(compilation, chunk) {
    let chunks = compilation.chunks;
    for (let i = 0; i < chunks.length; i++) {
        if (chunk === chunks[i].name) {
            return chunks[i].files[0];
        }
    }
    return null;
};

// Make plugin visible for webpack
module.exports = DojoModuleWrapperPlugin;