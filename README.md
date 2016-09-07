# webpack-generate-umd-externals
The function is created for very rare use case. Basically it's created for Matreshka.js needs. This doesn't mean you cannot use it in your project, this means I just doubt it :). Anyway the project will become a dependency for things made by me, that's why I publish it.

------


Matreshka.js framework makes possible to use a global variable ``Matreshka``, require itself via AMD and require itself via CJS. Using CJS I can import specific functions or classes to make application bundle smaller. For example when I want to import ``bindNode`` I don't want to load all the framework.

```js
const bindNode = require('matreshka/bindnode');
```

Matreshka.js is extensible so we can make plugins for it. Plugins should make possible to use global variable, import itself as AMD module and import itself as CJS module as the framework does. But how can we import only needed functions when CJS is used? We need to import all the framework to support all these ways!

This function makes possible to get an access to only needed parts of the framework when you develop a plugin. It gets an object with keys as paths to modules and values as global vars which represent these modules and returns webpack externals and a plugin which concatenates a bundle with named AMD definitions.

```js
const generateExternals = require('webpack-generate-umd-externals');

const { externals, NamedAMDModulesPlugin } = generateExternals({
    'matreshka/bindnode': 'Matreshka.bindNode',
    'matreshka/binders/prop': 'Matreshka.binders.prop'
});

module.exports = {
    entry: '...',
    output: { /* */ },
    externals,
    plugins: [
        new NamedAMDModulesPlugin()
    ]
};
```

Now you can import listed modules as you usually do in applications.

```js
import bindNode from 'matreshka/bindnode';
// ...
```
