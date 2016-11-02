var path = require('path');
var fs = require('fs');

function StaticAssetHashReplace() {
}

function findByPathFragment(assetList, pathFragment) {
    var simplePath = path.dirname(pathFragment).replace("../", "").replace("./", "");
    var ext = path.extname(pathFragment);
    var baseName = path.basename(pathFragment);
    baseName = baseName.substr(0, baseName.length - ext.length);
    var query = new RegExp(simplePath + "/.*" + baseName + ".*" + ext);

    for (var i = 0; i < assetList.length; i++) {
        var asset = assetList[i];
        if (query.test(asset)) {
            return path.basename(asset);
        }
    }

    return null;
}

function replacePathsInFile(asset, assetList, expression) {
    var source = asset.source().toString();
    var matches, output = [];
    while (matches = expression.exec(source)) {
        output.push(matches[1]);
    }

    for (var i = 0; i < output.length; i++) {
        var match = output[i];
        if (match.indexOf("data:") !== -1) {
            continue;
        }

        var hasQuotes = match.indexOf("\"") !== -1 || match.indexOf("'") !== -1;
        var argsSeparatorIndex = match.indexOf("?");

        var endIndex = argsSeparatorIndex !== -1 ? argsSeparatorIndex - 1 : hasQuotes ? match.length - 2 : match.length;
        var refFilePath = match.substr(hasQuotes ? 1 : 0, endIndex);

        var referencedAsset = findByPathFragment(assetList, refFilePath);
        var refBaseName = path.basename(refFilePath);

        var query = match.replace(new RegExp("\/", "g"), "\\/").replace("\?", "\\?");
        source = source.replace(new RegExp(query, "g"), match.replace(refBaseName, referencedAsset));
    }

    return source;
}

StaticAssetHashReplace.prototype.apply = function (compiler) {
    compiler.plugin("emit", function (compilation, done) {
        var assetList = Object.keys(compilation.assets);
        for (var i = 0; i < assetList.length; i++) {
            var baseName = assetList[i];
            var asset = compilation.assets[baseName];

            var expression;
            if (baseName.indexOf(".css") !== -1) {
                expression = /url\((.+?)\)/ig;
            } else if (baseName.indexOf(".html") !== -1) {
                expression = /src="(.+?)"/ig;
            } else {
                continue;
            }

            var replaced = replacePathsInFile(asset, assetList, expression);

            asset.source = function () { return replaced; };
            asset.size = function () { return replaced.length; };
        }

        done();
    });
};

module.exports = StaticAssetHashReplace;
