# three-bmfont-text


This is basically an ES version of mattdesl's original npm package at https://jam3.github.io/three-bmfont-text/

[![unstable](http://badges.github.io/stability-badges/dist/unstable.svg)](http://github.com/badges/stability-badges)

[<img src="http://i.imgur.com/3Tswdau.png" width="65%" />](https://jam3.github.io/three-bmfont-text/test)

[(click for demo)](https://jam3.github.io/three-bmfont-text/test) - [(source)](test/test-shader.js)

Bitmap font rendering for ThreeJS, batching glyphs into a single BufferGeometry. Supports word-wrapping, letter spacing, kerning, [signed distance fields](./docs/sdf.md) with standard derivatives, [multi-channel signed distance fields](./docs/sdf.md#msdf-shader), multi-texture fonts, and more. About 12kb after minification.

The is version should work with Three JS Version 145

Below is an example that uses [load-bmfont](https://www.npmjs.com/package/load-bmfont) to parse BMFont files on the fly with XHR:

```js
var createGeometry = require('three-bmfont-text')
var loadFont = require('load-bmfont')

loadFont('fonts/Arial.fnt', function(err, font) {
  // create a geometry of packed bitmap glyphs, 
  // word wrapped to 300px and right-aligned
  var geometry = createGeometry({
    width: 300,
    align: 'right',
    font: font
  })

  // change text and other options as desired
  // the options sepcified in constructor will
  // be used as defaults
  geometry.update('Lorem ipsum\nDolor sit amet.')
  
  // the resulting layout has metrics and bounds
  console.log(geometry.layout.height)
  console.log(geometry.layout.descender)
    
  // the texture atlas containing our glyphs
  var textureLoader = new THREE.TextureLoader();
  textureLoader.load('fonts/Arial.png', function (texture) {
    // we can use a simple ThreeJS material
    var material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      color: 0xaaffff
    })

    // now do something with our mesh!
    var mesh = new THREE.Mesh(geometry, material)
  })
})
```

The glyph layout is built on [layout-bmfont-text](https://github.com/Jam3/layout-bmfont-text).

## Usage

[![NPM](https://nodei.co/npm/three-bmfont-text.png)](https://www.npmjs.com/package/three-bmfont-text)

#### `geometry = createText(opt)`

Returns a new BufferGeometry with the given options. 

**Note:** The options set in the constructor become the defaults for any subsequent calls to `update()`.

`opt` can be an options object, or a String – equivalent to `{ text: str }`.

Options specific to ThreeJS:

- `flipY` (boolean) whether the texture will be Y-flipped (default true)
- `multipage` (boolean) whether to construct this geometry with an extra buffer containing page IDs. This is necessary for multi-texture fonts (default false)

The rest of the options are passed to [layout-bmfont-text](https://github.com/Jam3/layout-bmfont-text):

- `font` (required) the BMFont definition which holds chars, kernings, etc
- `text` (string) the text to layout. Newline characters (`\n`) will cause line breaks
- `width` (number, optional) the desired width of the text box, causes word-wrapping and clipping in `"pre"` mode. Leave as undefined to remove word-wrapping (default behaviour)
- `mode` (string) a mode for [word-wrapper](https://www.npmjs.com/package/word-wrapper); can be 'pre' (maintain spacing), or 'nowrap' (collapse whitespace but only break on newline characters), otherwise assumes normal word-wrap behaviour (collapse whitespace, break at width or newlines)
- `align` (string) can be `"left"`, `"center"` or `"right"` (default: left)
- `letterSpacing` (number) the letter spacing in pixels (default: 0)
- `lineHeight` (number) the line height in pixels (default to `font.common.lineHeight`)
- `tabSize` (number) the number of spaces to use in a single tab (default 4)
- `start` (number) the starting index into the text to layout (default 0)
- `end` (number) the ending index (exclusive) into the text to layout (default `text.length`)

#### `geometry.update(opt)`

Re-builds the geometry using the given options. Any options not specified here will default to those set in the constructor.

This method will recompute the text layout and rebuild the WebGL buffers.

`opt` can be a string, which is equivalent to:

```js
geometry.update({ text: 'new text' })
```

#### `geometry.layout`

This is an instance of [layout-bmfont-text](https://github.com/Jam3/layout-bmfont-text). This supports metrics for `descender`, `baseline`, `xHeight`, `width`, `height`, `capHeight`, etc.

#### `geometry.visibleGlyphs`

A filtered set from `geometry.layout.glyphs` intended to align with the vertex data being used by the underlying BufferAttributes.

This is an array of `{ line, position, index, data }` objects, [see here](https://github.com/Jam3/layout-bmfont-text#layoutglyphs). For example, this could be used to add a new BufferAttribute for `line` offset.

## Demos

To run/build the demos:

```sh
git clone https://github.com/Jam3/three-bmfont-text.git
cd three-bmfont-text
npm install
```

Then choose one of the demos to run:

```sh
# 3D SDF rendering
npm run test-3d

# 2d bitmap rendering
npm run test-2d

# 2D MSDF rendering
npm run test-msdf

# multi-page rendering
npm run test-multi

# custom text shaders
npm run start
```

Open up `localhost:9966` (it may take a few seconds for the initial bundle). Then when you save the corresponding JS file (in [test/](test/)) it should re-bundle and trigger a live-reload event on the browser.

To build the distribution demo:

```sh
npm run build
```

## Help

### Asset Handling

See [docs/assets.md](docs/assets.md)

### (Multi-)Signed Distance Field Rendering

See [docs/sdf.md](docs/sdf.md)

### Multi-Texture Rendering

See [docs/multi.md](docs/multi.md)

### See Also

See [text-modules](https://github.com/mattdesl/text-modules) for more text and font related tools.


## License

MIT, see [LICENSE.md](http://github.com/Jam3/three-bmfont-text/blob/master/LICENSE.md) for details.
