"use strict";

const replacementExpr = /(define\(\[.*\]\,\s?function\(.*\)\s?\{\s?return.*)\(function\([a-z]*\)\s?\{\s?.*/;
const dependencyExtractorExpr = /define\(\[(.*)\]\,\s?function\((.*)\)\s?\{\s?return.*(\(function\([a-z]*\)\s?\{)\s?.*/;
const endBracketExpr = /.*\]\)\}\);;$/;
const postfix = "Scripts.js";

function DojoModuleWrapperPlugin(options) {
    this.options = options || {};
}
 
DojoModuleWrapperPlugin.prototype.apply = function(compiler) {
    compiler.plugin("emit", (compilation, callback) => {
        let chunkKey = Object.keys(this.options);
        chunkKey.map((chunk, key) => {
            const distChunk = this.findAsset(compilation, chunk);
            const moduleName = this.options[chunk].moduleName || '';

            let source = compilation.assets[distChunk].source();
            
            const depExtractions = source.match(dependencyExtractorExpr);
            const toReplace = source.match(replacementExpr)[1];

            const dojoDeclareLoaderStatement = this.generateStartStatement(moduleName, depExtractions[1], depExtractions[2]);

            source = source.replace(toReplace, "");
            source = source.replace(endBracketExpr, "]);");

            const newName = distChunk.substring(0, distChunk.indexOf(".js")) + postfix;

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

DojoModuleWrapperPlugin.prototype.generateStartStatement = function(moduleName, dependencies, dependencyVariables) {
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
         + '      script.get("./' + moduleName + postFix + '");  \n'
         + '    }  \n'
         + '  });  \n'
         + '});  \n';
}

DojoModuleWrapperPlugin.prototype.findAsset = function(compilation, chunk) {
    let chunks = compilation.chunks;
    for (let i = 0, len = chunks.length; i < len; i++) {
        if (chunks[i].name === chunk) {
            return chunks[i].files[0];
        }
    }

    return null;
};

module.exports = DojoModuleWrapperPlugin;