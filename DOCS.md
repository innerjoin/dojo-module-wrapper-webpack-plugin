# Development Documentation
As a consumer of this plugin, you don't have to worry about the information in here. It is just to summarize the publish process and other background information for myself. Consult the [README.md](https://github.com/innerjoin/dojo-module-wrapper-webpack-plugin/README.md) for more information on how to use this plugin.
## Publish package to NPM
 - Make sure that you are using the latest source code by running either `git pull` OR `git clone https://github.com/innerjoin/dojo-module-wrapper-webpack-plugin.git`  
 - verify that package.json contains the correct version to publish
 - If you are working within a corporate environment, you typically have a proxy and package manager like artifactory behind you and npmjs.com. If this applies to you, follow the instructions:
     - `npm config get registry` (remember the name if it unequal to the default source)
     - `npm config rm registry` (disables your local registry)
     - `npm config set proxy "<your proxy URL>"` OR `npm config set https-proxy "<your proxy URL>"`
 - `npm adduser` (authenticate against npmjs.com)
 - `npm publish`
 - Ramp up for corporate users:
    - `npm config rm proxy` OR `npm config rm https-proxy`
    - `npm config set registry "<your registry URL>"`