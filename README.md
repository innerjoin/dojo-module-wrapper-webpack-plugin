# Deprecated - Do not use this project anymore!

This package has been deprecated as it considered bad practice to do it like this. Use [dojo/request/script](https://dojotoolkit.org/reference-guide/1.10/dojo/request/script.html) instead!

Example:

```javascript
define([
   "dojo/_base/declare",
   "dijit/_WidgetBase",
   "dijit/_TemplatedMixin",
   "dojo/text!com.mymodule/jazz/MyWidget.html",
   "dojo/request/script"
], function(declare, _WidgetBase, _TemplatedMixin, template, script) {
   return declare("com.mymodule.jazz.MyWidget", [_WidgetBase, _TemplatedMixin], {

      templateString: template,

      startup: function() {
         script.get(net.jazz.ajax._contextRoot + "/web/com.mymodule/ui/MyBundle.js");
   });
});
```

A reference implementation can be found [here](https://github.com/jazz-community/rtc-workitem-bulk-mover-ui)







________________________________________________________________________________________








[![npm-v-svg][npm-v-svg]][npm-url]
[![npm-dt-svg][npm-dt-svg]][npm-url]
[![issues-svg][issues-svg]][issues-url]

# Wrap webpack code to run within a Dojo powered Web App
In many enterprise and even open source projects, you will likely stumble across an exising application which is based on the [Dojo Toolkit](http://dojotoolkit.org/). While (at the time of writing) the whole Web Development world is talking about Angular, React, Webpack, Babel and all those modern web development tools, framworks and platforms, many developers are confronted with extending mature tools using older (and sometimes) not up-to-date libraries. 
This plug-in aims to help developers to integrate today's web technologies into mature Dojo based applications, which will allow to modernize your application step-by-step.

## Installation
The plug-in is being published through `npm`, so running the following installation command is sufficient to get started using this plug-in
`npm install --save-dev dojo-module-wrapper-webpack-plugin`

## Usage
This plug-in requires a valid webpack configuration. It should contain the following information:
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
                baseUrl: '<the base URL your app-bundle is running>'
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

## Projects using this plug-in
Stay tuned, the first project using this plug-in will be open-sourced in the nearer future. If you have a project which is using this plug-in successfully, feel free to contribute to this section through a pull request.

## Contributing
Please use the [Issue Tracker](https://github.com/innerjoin/dojo-module-wrapper-webpack-plugin/issues) of this repository to report issues or suggest enhancements. 

Pull requests are very welcome.

## Licensing
Copyright (c) Lukas Steiger. All rights reserved.

Licensed under the [MIT](https://github.com/innerjoin/dojo-module-wrapper-webpack-plugin/blob/master/LICENSE) License.

[npm-dt-svg]: https://img.shields.io/npm/dt/dojo-module-wrapper-webpack-plugin.svg
[npm-v-svg]: https://img.shields.io/npm/v/dojo-module-wrapper-webpack-plugin.svg
[npm-url]: https://www.npmjs.com/package/dojo-module-wrapper-webpack-plugin
[issues-svg]: https://img.shields.io/github/issues/innerjoin/dojo-module-wrapper-webpack-plugin.svg
[issues-url]: https://github.com/innerjoin/dojo-module-wrapper-webpack-plugin/issues
