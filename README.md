# Static Asset Hash Replace Webpack Plugin

# Not actively maintained. Use [cache-bust-loader](https://github.com/code-chris/cache-bust-loader) instead.

[![NPM](https://img.shields.io/npm/v/static-asset-hash-replace-webpack-plugin.svg)](https://www.npmjs.com/package/static-asset-hash-replace-webpack-plugin)


This Webpack plugin replaces all file references inside assets which names changed during build process. Preconditions are, that the original basename of the file still exists and that the changed file is saved as asset from webpack.

Examples:
- "../images/button.png" => "../images/button.46e48ce0628835f68a73.png"
- "../images/icon.png" => "../images/46e48ce0628835f68a73-icon.png"

This replace logic is applied to .css and .html assets.


## Installation

```
npm install static-asset-hash-replace-webpack-plugin
```


## Usage

Add this to your webpack.config.js

```js
var StaticAssetHashReplace = require('static-asset-hash-replace-webpack-plugin');

module.exports = {
  ...
  plugins: [
    new StaticAssetHashReplace()
  ]
  ...
};
```

[License](https://github.com/code-chris/static-asset-hash-replace-webpack-plugin/blob/master/LICENSE)
------
