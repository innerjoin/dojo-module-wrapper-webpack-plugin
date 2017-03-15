

## Prerequisites
This plugin requires a valid webpack configuration. It should contain the following information:
```
const DojoModuleWrapperPlugin = require('dojo-module-wrapper-webpack-plugin');

module.exports = {
    entry: {
        app: '<entry point of main JS class>',
    },
    output: {
        libraryTarget: 'amd',
        filename: '<bundle destination>',
    },
    module: {
        // module transformations
    },

    plugins: [
        new DojoModuleWrapperPlugin({
            chunks: {
                app: {
                    removeBefore: 'var installedModules'
                },
            },
        }),
    ],

    externals: [
        // exclude dojo, dijit and dojox from bundling
        (context, request, callback) => {
            if (/^dojo/.test(request) ||
                /^dojox/.test(request) ||
                /^dijit/.test(request)
            ) {
                return callback(null, `amd ${request}`);
            }
            callback();
        },
    ],
};
```
