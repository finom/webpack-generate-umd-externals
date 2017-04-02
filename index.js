const { ConcatSource } = require("webpack-sources");

module.exports = function generateExternals(data) {
    const paths = Object.keys(data);
    const externals = {};
    let namedAMDModulesStr = '';

    for(let i = 0; i < paths.length; i++) {
        const path = paths[i];
        const value = data[path];
        const [ rootModuleName ] = path.split('/');
        const [ rootVariableName ] = value.split('.');

        externals[path] = {
            root: value.split('.'),
            commonjs: path,
            commonjs2: path,
            amd: path
        };

        namedAMDModulesStr += `define('${path}', ['${rootModuleName}'], function(${rootVariableName}){
            return ${value};
        });`;
    }

    class NamedAMDModulesPlugin {
        apply(compiler) {
            compiler.plugin('compilation', compilation => {
                compilation.plugin('optimize-chunk-assets', (chunks, callback) => {
                    Object.keys(compilation.assets).forEach(file => {
                        const newSource = new ConcatSource(compilation.assets[file],
                            `if(typeof define === 'function' && define.amd){
                                ${namedAMDModulesStr}
                            }`);
                        compilation.assets[file] = newSource;
                    });

                    callback();
                });
            });
        }
    }

    return { externals, NamedAMDModulesPlugin };
}
