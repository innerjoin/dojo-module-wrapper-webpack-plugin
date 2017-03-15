[![npm][npm]][npm-url]

# dojo-module-wrapper-webpack-plugin

## Usage
This plugin requires a valid webpack configuration. It should contain the following information:
```javascript
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
            app: {
                moduleName: '<the full name of your bundle>'
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





[npm]: https://img.shields.io/npm/v/i18n-webpack-plugin.svg
[npm-url]: https://www.npmjs.com/package/dojo-module-wrapper-webpack-plugin