"use strict";

var deps1 = '"dojo/request/xhr"';
var deps2 = '__WEBPACK_EXTERNAL_MODULE_17__';
// var moduleName = "com.siemens.bt.jazz.ui.WorkItemBulkMover.bundling.bundle";

// var startStatement = 'define(["dojo/_base/declare", ' + deps1 + '],'
//                     + 'function(declare, ' + deps2 + ') {'
//                     + 'return declare("' + moduleName + '", null, {'
//                     + 'executeBundle: function() {'

var removeBefore = '';

var endStatement = ']);   }   });   });';

var findRegex = /(define\(\[.*\]\,\s?function\(.*\)\s?\{\s?return.*)\(function\([a-z]*\)\s?\{\s?.*/;
var beforeRegex = /define\(\[(.*)\]\,\s?function\((.*)\)\s?\{\s?return.*(\(function\([a-z]*\)\s?\{)\s?.*/;
var endRegex = /.*\]\)\}\);;$/;

var ConcatSource;
try {
    ConcatSource = require("webpack-core/lib/ConcatSource");
} catch(e) {
    ConcatSource = require("webpack-sources").ConcatSource;
}

function DojoModuleWrapperPlugin(options) {
    this.options = options || {};
    this.chunks = this.options.chunks || {};
}
 
DojoModuleWrapperPlugin.prototype.apply = function(compiler) {
    compiler.plugin("emit", (compilation, callback) => {
        let chunkKey = Object.keys(this.chunks);
        chunkKey.map((chunk, key) => {
            let distChunk = this.findAsset(compilation, chunk),
                beforeContent = this.chunks[chunk].beforeContent || '',
                afterContent = this.chunks[chunk].afterContent || '',
                removeBefore = this.chunks[chunk].removeBefore || '',
                removeAfter = this.chunks[chunk].removeAfter || '';

            let source = compilation.assets[distChunk].source();
            
            var ele = source.match(beforeRegex);
            var toReplace = source.match(findRegex)[1];

            var moduleName = "com.siemens.bt.jazz.ui.WorkItemBulkMover.bundling.bundle";

            var startStatement = 'define(["dojo/_base/declare", ' + ele[1] + '],'
                                + 'function(declare, ' + ele[2] + ') {'
                                + 'return declare("' + moduleName + '", null, {'
                                + 'executeBundle: function() {';
                                //+ 'toreplace is : ---> ' + toReplace + '<----'

            
            source = source.replace(toReplace, startStatement);
            source = source.replace(endRegex, endStatement);
            //source = (removeBefore) ? source.replace(new RegExp('^' + removeBefore), "") : source;
            //source = (removeAfter) ? source.replace(new RegExp(removeAfter + '$'), "") : source;

            compilation.assets[distChunk].source = () => {
                return source;
            };

            compilation.assets[distChunk] = new ConcatSource(beforeContent, compilation.assets[distChunk], afterContent);
        });
        callback();
    });

};

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