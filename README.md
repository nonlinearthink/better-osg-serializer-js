# browser-osg-serializer-js

browser-osg-serializier-js is PureJS module for serializing `.osgt` and `.osgb` files.

**The tool is still in development** but I will be happy to your issues and contributions

UPDATE: Consider using `wasm` using OpenSceneGraph's most updated code ([osg-wasm](https://github.com/cubicool/osg-wasm), [openscenegraph-cross-platform-guide](https://github.com/OGStudio/openscenegraph-cross-platform-guide/tree/master/1.10.SampleWeb)).

## installation and usage

In terminal: `npm install --save browser-osg-serializer-js`

for browser users:

```javascript
import osg from "browser-osg-serializer-js";

const buffer = await fetch("http://127.0.0.1/MyAwesome3DModel.osgb").then(res=> res.arrayBuffer());
const osgObj = osg.readBuffer(buffer, filePath);

// start workin with 3d data

```

and still work for nodejs users:

```javascript
const osg = require('browser-osg-serializer-js');

file = osg.readFile("MyAwesome3DModel.osgb");

// start workin with 3d data

```
