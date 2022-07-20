/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "computeBox": () => (/* reexport */ computeBox),
  "computeSphere": () => (/* reexport */ computeSphere),
  "createBasicShader": () => (/* reexport */ createBasicShader),
  "createMSDFShader": () => (/* reexport */ createMSDFShader),
  "createMultipageShader": () => (/* reexport */ createMultipageShader),
  "createSDFShader": () => (/* reexport */ createSDFShader),
  "createTextGeometry": () => (/* reexport */ createTextGeometry),
  "pages": () => (/* reexport */ vertices_pages),
  "positions": () => (/* reexport */ vertices_positions),
  "uvs": () => (/* reexport */ vertices_uvs)
});

;// CONCATENATED MODULE: ./src/lib/word-wrapper.js
var newline = /\n/;
var newlineChar = '\n';
var whitespace = /\s/;
function makeLines(text, opt) {
  opt = opt || {}; //zero width results in nothing visible

  if (opt.width === 0 && opt.mode !== 'nowrap') return [];
  text = text || '';
  var width = typeof opt.width === 'number' ? opt.width : Number.MAX_VALUE;
  var start = Math.max(0, opt.start || 0);
  var end = typeof opt.end === 'number' ? opt.end : text.length;
  var mode = opt.mode;
  var measure = opt.measure || monospace;
  if (mode === 'pre') return pre(measure, text, start, end, width);else return greedy(measure, text, start, end, width, mode);
}

function idxOf(text, chr, start, end) {
  var idx = text.indexOf(chr, start);
  if (idx === -1 || idx > end) return end;
  return idx;
}

function isWhitespace(chr) {
  return whitespace.test(chr);
}

function pre(measure, text, start, end, width) {
  var lines = [];
  var lineStart = start;

  for (var i = start; i < end && i < text.length; i++) {
    var chr = text.charAt(i);
    var isNewline = newline.test(chr); //If we've reached a newline, then step down a line
    //Or if we've reached the EOF

    if (isNewline || i === end - 1) {
      var lineEnd = isNewline ? i : i + 1;
      var measured = measure(text, lineStart, lineEnd, width);
      lines.push(measured);
      lineStart = i + 1;
    }
  }

  return lines;
}

function greedy(measure, text, start, end, width, mode) {
  //A greedy word wrapper based on LibGDX algorithm
  //https://github.com/libgdx/libgdx/blob/master/gdx/src/com/badlogic/gdx/graphics/g2d/BitmapFontCache.java
  var lines = [];
  var testWidth = width; //if 'nowrap' is specified, we only wrap on newline chars

  if (mode === 'nowrap') testWidth = Number.MAX_VALUE;

  while (start < end && start < text.length) {
    //get next newline position
    var newLine = idxOf(text, newlineChar, start, end); //eat whitespace at start of line

    while (start < newLine) {
      if (!isWhitespace(text.charAt(start))) break;
      start++;
    } //determine visible # of glyphs for the available width


    var measured = measure(text, start, newLine, testWidth);
    var lineEnd = start + (measured.end - measured.start);
    var nextStart = lineEnd + newlineChar.length; //if we had to cut the line before the next newline...

    if (lineEnd < newLine) {
      //find char to break on
      while (lineEnd > start) {
        if (isWhitespace(text.charAt(lineEnd))) break;
        lineEnd--;
      }

      if (lineEnd === start) {
        if (nextStart > start + newlineChar.length) nextStart--;
        lineEnd = nextStart; // If no characters to break, show all.
      } else {
        nextStart = lineEnd; //eat whitespace at end of line

        while (lineEnd > start) {
          if (!isWhitespace(text.charAt(lineEnd - newlineChar.length))) break;
          lineEnd--;
        }
      }
    }

    if (lineEnd >= start) {
      var result = measure(text, start, lineEnd, testWidth);
      lines.push(result);
    }

    start = nextStart;
  }

  return lines;
} //determines the visible number of glyphs within a given width


function monospace(text, start, end, width) {
  var glyphs = Math.min(width, end - start);
  return {
    start: start,
    end: start + glyphs
  };
}
;// CONCATENATED MODULE: ./src/lib/layout-bmfont-text.js
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }


var X_HEIGHTS = ['x', 'e', 'a', 'o', 'n', 's', 'r', 'c', 'u', 'm', 'v', 'w', 'z'];
var M_WIDTHS = ['m', 'w'];
var CAP_HEIGHTS = ['H', 'I', 'N', 'E', 'F', 'K', 'L', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
var TAB_ID = '\t'.charCodeAt(0);
var SPACE_ID = ' '.charCodeAt(0);
var ALIGN_LEFT = 0,
    ALIGN_CENTER = 1,
    ALIGN_RIGHT = 2;
function createLayout(opt) {
  return new TextLayout(opt);
}

function number(num, def) {
  return typeof num === 'number' ? num : typeof def === 'number' ? def : 0;
}

var TextLayout = /*#__PURE__*/function () {
  function TextLayout(opt) {
    _classCallCheck(this, TextLayout);

    //getters for the private vars
    ['width', 'height', 'descender', 'ascender', 'xHeight', 'baseline', 'capHeight', 'lineHeight'].forEach(function (name) {
      Object.defineProperty(TextLayout, name, {
        get: wrapper(name),
        configurable: true
      });
    });
    this.glyphs = [];
    this._measure = this.computeMetrics.bind(this);
    this.update(opt);
  }

  _createClass(TextLayout, [{
    key: "update",
    value: function update(opt) {
      var _this = this;

      opt = Object.assign({
        measure: this._measure
      }, opt);
      this._opt = opt;
      this._opt.tabSize = number(this._opt.tabSize, 4);
      if (!opt.font) throw new Error('must provide a valid bitmap font');
      var glyphs = this.glyphs;
      var text = opt.text || '';
      var font = opt.font;

      this._setupSpaceGlyphs(font);

      var lines = makeLines(text, opt);
      var minWidth = opt.width || 0; //clear glyphs

      glyphs.length = 0; //get max line width

      var maxLineWidth = lines.reduce(function (prev, line) {
        return Math.max(prev, line.width, minWidth);
      }, 0); //the pen position

      var x = 0;
      var y = 0;
      var lineHeight = number(opt.lineHeight, font.common.lineHeight);
      var baseline = font.common.base;
      var descender = lineHeight - baseline;
      var letterSpacing = opt.letterSpacing || 0;
      var height = lineHeight * lines.length - descender;
      var align = getAlignType(this._opt.align); //draw text along baseline

      y -= height; //the metrics for this text layout

      this._width = maxLineWidth;
      this._height = height;
      this._descender = lineHeight - baseline;
      this._baseline = baseline;
      this._xHeight = getXHeight(font);
      this._capHeight = getCapHeight(font);
      this._lineHeight = lineHeight;
      this._ascender = lineHeight - descender - this._xHeight; //layout each glyph

      lines.forEach(function (line, lineIndex) {
        var start = line.start;
        var end = line.end;
        var lineWidth = line.width;
        var lastGlyph; //for each glyph in that line...

        for (var i = start; i < end; i++) {
          var id = text.charCodeAt(i);

          var glyph = _this.getGlyph(font, id);

          if (glyph) {
            if (lastGlyph) x += getKerning(font, lastGlyph.id, glyph.id);
            var tx = x;
            if (align === ALIGN_CENTER) tx += (maxLineWidth - lineWidth) / 2;else if (align === ALIGN_RIGHT) tx += maxLineWidth - lineWidth;
            glyphs.push({
              position: [tx, y],
              data: glyph,
              index: i,
              line: lineIndex
            }); //move pen forward

            x += glyph.xadvance + letterSpacing;
            lastGlyph = glyph;
          }
        } //next line down


        y += lineHeight;
        x = 0;
      });
      this._linesTotal = lines.length;
    }
  }, {
    key: "_setupSpaceGlyphs",
    value: function _setupSpaceGlyphs(font) {
      //These are fallbacks, when the font doesn't include
      //' ' or '\t' glyphs
      this._fallbackSpaceGlyph = null;
      this._fallbackTabGlyph = null;
      if (!font.chars || font.chars.length === 0) return; //try to get space glyph
      //then fall back to the 'm' or 'w' glyphs
      //then fall back to the first glyph available

      var space = getGlyphById(font, SPACE_ID) || getMGlyph(font) || font.chars[0];
      var space = JSON.parse(JSON.stringify(space)); //and create a fallback for tab

      var tabWidth = this._opt.tabSize * space.xadvance;
      this._fallbackSpaceGlyph = space;
      this._fallbackTabGlyph = Object.assign(space, {
        x: 0,
        y: 0,
        xadvance: tabWidth,
        id: TAB_ID,
        xoffset: 0,
        yoffset: 0,
        width: 0,
        height: 0
      });
    }
  }, {
    key: "getGlyph",
    value: function getGlyph(font, id) {
      var glyph = getGlyphById(font, id);
      if (glyph) return glyph;else if (id === TAB_ID) return this._fallbackTabGlyph;else if (id === SPACE_ID) return this._fallbackSpaceGlyph;
      return null;
    }
  }, {
    key: "computeMetrics",
    value: function computeMetrics(text, start, end, width) {
      var letterSpacing = this._opt.letterSpacing || 0;
      var font = this._opt.font;
      var curPen = 0;
      var curWidth = 0;
      var count = 0;
      var glyph;
      var lastGlyph;

      if (!font.chars || font.chars.length === 0) {
        return {
          start: start,
          end: start,
          width: 0
        };
      }

      end = Math.min(text.length, end);

      for (var i = start; i < end; i++) {
        var id = text.charCodeAt(i);
        var glyph = this.getGlyph(font, id);

        if (glyph) {
          //move pen forward
          var xoff = glyph.xoffset;
          var kern = lastGlyph ? getKerning(font, lastGlyph.id, glyph.id) : 0;
          curPen += kern;
          var nextPen = curPen + glyph.xadvance + letterSpacing;
          var nextWidth = curPen + glyph.width; //we've hit our limit; we can't move onto the next glyph

          if (nextWidth >= width || nextPen >= width) break; //otherwise continue along our line

          curPen = nextPen;
          curWidth = nextWidth;
          lastGlyph = glyph;
        }

        count++;
      } //make sure rightmost edge lines up with rendered glyphs


      if (lastGlyph) curWidth += lastGlyph.xoffset;
      return {
        start: start,
        end: start + count,
        width: curWidth
      };
    }
  }]);

  return TextLayout;
}(); //create lookups for private vars


function wrapper(name) {
  return new Function(['return function ' + name + '() {', '  return this._' + name, '}'].join('\n'))();
}

function getGlyphById(font, id) {
  if (!font.chars || font.chars.length === 0) return null;
  var glyphIdx = findChar(font.chars, id);
  if (glyphIdx >= 0) return font.chars[glyphIdx];
  return null;
}

function getXHeight(font) {
  for (var i = 0; i < X_HEIGHTS.length; i++) {
    var id = X_HEIGHTS[i].charCodeAt(0);
    var idx = findChar(font.chars, id);
    if (idx >= 0) return font.chars[idx].height;
  }

  return 0;
}

function getMGlyph(font) {
  for (var i = 0; i < M_WIDTHS.length; i++) {
    var id = M_WIDTHS[i].charCodeAt(0);
    var idx = findChar(font.chars, id);
    if (idx >= 0) return font.chars[idx];
  }

  return 0;
}

function getCapHeight(font) {
  for (var i = 0; i < CAP_HEIGHTS.length; i++) {
    var id = CAP_HEIGHTS[i].charCodeAt(0);
    var idx = findChar(font.chars, id);
    if (idx >= 0) return font.chars[idx].height;
  }

  return 0;
}

function getKerning(font, left, right) {
  if (!font.kernings || font.kernings.length === 0) return 0;
  var table = font.kernings;

  for (var i = 0; i < table.length; i++) {
    var kern = table[i];
    if (kern.first === left && kern.second === right) return kern.amount;
  }

  return 0;
}

function getAlignType(align) {
  if (align === 'center') return ALIGN_CENTER;else if (align === 'right') return ALIGN_RIGHT;
  return ALIGN_LEFT;
}

function findChar(array, value, start) {
  start = start || 0;

  for (var i = start; i < array.length; i++) {
    if (array[i].id === value) {
      return i;
    }
  }

  return -1;
}
;// CONCATENATED MODULE: ./src/lib/quad-indices.js
var CW = [0, 2, 3];
var CCW = [2, 1, 3];

function dtype(dtype) {
  switch (dtype) {
    case 'int8':
      return Int8Array;

    case 'int16':
      return Int16Array;

    case 'int32':
      return Int32Array;

    case 'uint8':
      return Uint8Array;

    case 'uint16':
      return Uint16Array;

    case 'uint32':
      return Uint32Array;

    case 'float32':
      return Float32Array;

    case 'float64':
      return Float64Array;

    case 'array':
      return Array;

    case 'uint8_clamped':
      return Uint8ClampedArray;
  }
}

function isBuffer(obj) {
  return obj != null && obj.constructor != null && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj);
}

function anArray(arr) {
  var str = Object.prototype.toString;
  return arr.BYTES_PER_ELEMENT && str.call(arr.buffer) === '[object ArrayBuffer]' || Array.isArray(arr);
}

function createIndices(array, opt) {
  //if user didn't specify an output array
  if (!array || !(anArray(array) || isBuffer(array))) {
    opt = array || {};
    array = null;
  }

  if (typeof opt === 'number') //backwards-compatible
    opt = {
      count: opt
    };else opt = opt || {};
  var type = typeof opt.type === 'string' ? opt.type : 'uint16';
  var count = typeof opt.count === 'number' ? opt.count : 1;
  var start = opt.start || 0;
  var dir = opt.clockwise !== false ? CW : CCW,
      a = dir[0],
      b = dir[1],
      c = dir[2];
  var numIndices = count * 6;
  var indices = array || new (dtype(type))(numIndices);

  for (var i = 0, j = 0; i < numIndices; i += 6, j += 4) {
    var x = i + start;
    indices[x + 0] = j + 0;
    indices[x + 1] = j + 1;
    indices[x + 2] = j + 2;
    indices[x + 3] = j + a;
    indices[x + 4] = j + b;
    indices[x + 5] = j + c;
  }

  return indices;
}
;// CONCATENATED MODULE: ./src/lib/utils.js
var itemSize = 3;
var box = {
  min: [0, 0, 0],
  max: [0, 0, 0]
};

function bounds(positions) {
  var count = positions.length / itemSize;
  box.min[0] = positions[0];
  box.min[1] = positions[1];
  box.min[2] = positions[2];
  box.max[0] = positions[0];
  box.max[1] = positions[1];
  box.max[2] = positions[2];

  for (var i = 0; i < count; i++) {
    var x = positions[i * itemSize + 0];
    var y = positions[i * itemSize + 1];
    var z = positions[i * itemSize + 2];
    box.min[0] = Math.min(x, box.min[0]);
    box.min[1] = Math.min(y, box.min[1]);
    box.min[2] = Math.min(z, box.min[2]);
    box.max[0] = Math.max(x, box.max[0]);
    box.max[1] = Math.max(y, box.max[1]);
    box.max[2] = Math.max(z, box.max[2]);
  }
}

function computeBox(positions, output) {
  bounds(positions);
  output.min.set(box.min[0], box.min[1], box.min[2]);
  output.max.set(box.max[0], box.max[1], box.max[2]);
}
function computeSphere(positions, output) {
  bounds(positions);
  var minX = box.min[0];
  var minY = box.min[1];
  var minZ = box.min[2];
  var maxX = box.max[0];
  var maxY = box.max[1];
  var maxZ = box.max[2];
  var width = maxX - minX;
  var height = maxY - minY;
  var depth = maxZ - minZ;
  var length = Math.sqrt(width * width + height * height);
  output.center.set(minX + width / 2, minY + height / 2, minZ + depth / 2);
  output.radius = length / 2;
}
;// CONCATENATED MODULE: ./src/lib/vertices.js
function vertices_pages(glyphs) {
  var pages = new Float32Array(glyphs.length * 4 * 1);
  var i = 0;
  glyphs.forEach(function (glyph) {
    var id = glyph.data.page || 0;
    pages[i++] = id;
    pages[i++] = id;
    pages[i++] = id;
    pages[i++] = id;
  });
  return pages;
}
function vertices_uvs(glyphs, texWidth, texHeight, flipY) {
  var uvs = new Float32Array(glyphs.length * 4 * 2);
  var i = 0;
  glyphs.forEach(function (glyph) {
    var bitmap = glyph.data;
    var bw = bitmap.x + bitmap.width;
    var bh = bitmap.y + bitmap.height; // top left position

    var u0 = bitmap.x / texWidth;
    var v1 = bitmap.y / texHeight;
    var u1 = bw / texWidth;
    var v0 = bh / texHeight;

    if (flipY) {
      v1 = (texHeight - bitmap.y) / texHeight;
      v0 = (texHeight - bh) / texHeight;
    } // BL


    uvs[i++] = u0;
    uvs[i++] = v1; // TL

    uvs[i++] = u0;
    uvs[i++] = v0; // TR

    uvs[i++] = u1;
    uvs[i++] = v0; // BR

    uvs[i++] = u1;
    uvs[i++] = v1;
  });
  return uvs;
}
function vertices_positions(glyphs) {
  var positions = new Float32Array(glyphs.length * 4 * 3);
  var i = 0;
  glyphs.forEach(function (glyph) {
    var bitmap = glyph.data; // bottom left position

    var x = glyph.position[0] + bitmap.xoffset;
    var y = glyph.position[1] + bitmap.yoffset; // quad size

    var w = bitmap.width;
    var h = bitmap.height; // BL

    positions[i++] = x;
    positions[i++] = y;
    positions[i++] = 0; // TL

    positions[i++] = x;
    positions[i++] = y + h;
    positions[i++] = 0; // TR

    positions[i++] = x + w;
    positions[i++] = y + h;
    positions[i++] = 0; // BR

    positions[i++] = x + w;
    positions[i++] = y;
    positions[i++] = 0;
  });
  return positions;
}
;// CONCATENATED MODULE: external "three"
const external_three_namespaceObject = require("three");
;// CONCATENATED MODULE: ./src/lib/createTextGeometry.js
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function createTextGeometry_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function createTextGeometry_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function createTextGeometry_createClass(Constructor, protoProps, staticProps) { if (protoProps) createTextGeometry_defineProperties(Constructor.prototype, protoProps); if (staticProps) createTextGeometry_defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }





 // const THREE = require('three');
// import * as THREE from 'three';

function createTextGeometry(opt) {
  return new TextGeometry(opt);
}

var TextGeometry = /*#__PURE__*/function (_BufferGeometry) {
  _inherits(TextGeometry, _BufferGeometry);

  var _super = _createSuper(TextGeometry);

  function TextGeometry(opt) {
    var _this;

    createTextGeometry_classCallCheck(this, TextGeometry);

    _this = _super.call(this);

    if (typeof opt === 'string') {
      opt = {
        text: opt
      };
    } // use these as default values for any subsequent
    // calls to update()


    _this._opt = Object.assign({}, opt); // also do an initial setup...

    if (opt) _this.update(opt);
    return _this;
  }

  createTextGeometry_createClass(TextGeometry, [{
    key: "update",
    value: function update(opt) {
      if (typeof opt === 'string') {
        opt = {
          text: opt
        };
      } // use constructor defaults


      opt = Object.assign({}, this._opt, opt);

      if (!opt.font) {
        throw new TypeError('must specify a { font } in options');
      }

      this.layout = createLayout(opt); // get vec2 texcoords

      var flipY = opt.flipY !== false; // the desired BMFont data

      var font = opt.font; // determine texture size from font file

      var texWidth = font.common.scaleW;
      var texHeight = font.common.scaleH; // get visible glyphs

      var glyphs = this.layout.glyphs.filter(function (glyph) {
        var bitmap = glyph.data;
        return bitmap.width * bitmap.height > 0;
      }); // provide visible glyphs for convenience

      this.visibleGlyphs = glyphs; // get common vertex data

      var positions = vertices_positions(glyphs);
      var uvs = vertices_uvs(glyphs, texWidth, texHeight, flipY);
      var indices = createIndices([], {
        clockwise: true,
        type: 'uint16',
        count: glyphs.length
      }); // update vertex data

      this.setIndex(indices);
      this.setAttribute('position', new external_three_namespaceObject.BufferAttribute(positions, 3));
      this.setAttribute('uv', new external_three_namespaceObject.BufferAttribute(uvs, 2)); // update multipage data

      if (!opt.multipage && 'page' in this.attributes) {
        // disable multipage rendering
        this.removeAttribute('page');
      } else if (opt.multipage) {
        // enable multipage rendering
        var pages = vertices_pages(glyphs);
        this.setAttribute('page', new external_three_namespaceObject.BufferAttribute(pages, 1));
      }
    }
  }, {
    key: "computeBoundingSphere",
    value: function computeBoundingSphere() {
      if (this.boundingSphere === null) {
        this.boundingSphere = new external_three_namespaceObject.Sphere();
      }

      var positions = this.attributes.position.array;
      var itemSize = this.attributes.position.itemSize;

      if (!positions || !itemSize || positions.length < 3) {
        this.boundingSphere.radius = 0;
        this.boundingSphere.center.set(0, 0, 0);
        return;
      }

      computeSphere(positions, this.boundingSphere);

      if (isNaN(this.boundingSphere.radius)) {
        console.error('BufferGeometry.computeBoundingSphere(): ' + 'Computed radius is NaN. The ' + '"position" attribute is likely to have NaN values.');
      }
    }
  }, {
    key: "computeBoundingBox",
    value: function computeBoundingBox() {
      if (this.boundingBox === null) {
        this.boundingBox = new external_three_namespaceObject.Box3();
      }

      var bbox = this.boundingBox;
      var positions = this.attributes.position.array;
      var itemSize = this.attributes.position.itemSize;

      if (!positions || !itemSize || positions.length < 3) {
        bbox.makeEmpty();
        return;
      }

      computeBox(positions, bbox);
    }
  }]);

  return TextGeometry;
}(external_three_namespaceObject.BufferGeometry);
;// CONCATENATED MODULE: ./src/lib/index.js




;// CONCATENATED MODULE: ./src/shaders/basic.js
function createBasicShader(opt) {
  opt = opt || {};
  var opacity = typeof opt.opacity === 'number' ? opt.opacity : 1;
  var alphaTest = typeof opt.alphaTest === 'number' ? opt.alphaTest : 0.0001;
  var precision = opt.precision || 'highp';
  var color = opt.color;
  var map = opt.map; // remove to satisfy r73

  delete opt.map;
  delete opt.color;
  delete opt.precision;
  delete opt.opacity;
  return Object.assign({
    uniforms: {
      opacity: {
        type: 'f',
        value: opacity
      },
      map: {
        type: 't',
        value: map || new THREE.Texture()
      },
      color: {
        type: 'c',
        value: new THREE.Color(color)
      }
    },
    vertexShader: ['attribute vec2 uv;', 'attribute vec4 position;', 'uniform mat4 projectionMatrix;', 'uniform mat4 modelViewMatrix;', 'varying vec2 vUv;', 'void main() {', 'vUv = uv;', 'gl_Position = projectionMatrix * modelViewMatrix * position;', '}'].join('\n'),
    fragmentShader: ['precision ' + precision + ' float;', 'uniform float opacity;', 'uniform vec3 color;', 'uniform sampler2D map;', 'varying vec2 vUv;', 'void main() {', '  gl_FragColor = texture2D(map, vUv) * vec4(color, opacity);', alphaTest === 0 ? '' : '  if (gl_FragColor.a < ' + alphaTest + ') discard;', '}'].join('\n')
  }, opt);
}
;// CONCATENATED MODULE: ./src/shaders/msdf.js
function createMSDFShader(opt) {
  opt = opt || {};
  var opacity = typeof opt.opacity === 'number' ? opt.opacity : 1;
  var alphaTest = typeof opt.alphaTest === 'number' ? opt.alphaTest : 0.0001;
  var precision = opt.precision || 'highp';
  var color = opt.color;
  var map = opt.map;
  var negate = typeof opt.negate === 'boolean' ? opt.negate : true; // remove to satisfy r73

  delete opt.map;
  delete opt.color;
  delete opt.precision;
  delete opt.opacity;
  delete opt.negate;
  return Object.assign({
    uniforms: {
      opacity: {
        type: 'f',
        value: opacity
      },
      map: {
        type: 't',
        value: map || new THREE.Texture()
      },
      color: {
        type: 'c',
        value: new THREE.Color(color)
      }
    },
    vertexShader: ['attribute vec2 uv;', 'attribute vec4 position;', 'uniform mat4 projectionMatrix;', 'uniform mat4 modelViewMatrix;', 'varying vec2 vUv;', 'void main() {', 'vUv = uv;', 'gl_Position = projectionMatrix * modelViewMatrix * position;', '}'].join('\n'),
    fragmentShader: ['#ifdef GL_OES_standard_derivatives', '#extension GL_OES_standard_derivatives : enable', '#endif', 'precision ' + precision + ' float;', 'uniform float opacity;', 'uniform vec3 color;', 'uniform sampler2D map;', 'varying vec2 vUv;', 'float median(float r, float g, float b) {', '  return max(min(r, g), min(max(r, g), b));', '}', 'void main() {', '  vec3 sample = ' + (negate ? '1.0 - ' : '') + 'texture2D(map, vUv).rgb;', '  float sigDist = median(sample.r, sample.g, sample.b) - 0.5;', '  float alpha = clamp(sigDist/fwidth(sigDist) + 0.5, 0.0, 1.0);', '  gl_FragColor = vec4(color.xyz, alpha * opacity);', alphaTest === 0 ? '' : '  if (gl_FragColor.a < ' + alphaTest + ') discard;', '}'].join('\n')
  }, opt);
}
;
;// CONCATENATED MODULE: ./src/shaders/multipage.js
function createMultipageShader(opt) {
  opt = opt || {};
  var opacity = typeof opt.opacity === 'number' ? opt.opacity : 1;
  var precision = opt.precision || 'highp';
  var alphaTest = typeof opt.alphaTest === 'number' ? opt.alphaTest : 0.0001;
  var textures = opt.textures || [];
  textures = Array.isArray(textures) ? textures : [textures];
  var baseUniforms = {};
  textures.forEach(function (tex, i) {
    baseUniforms['texture' + i] = {
      type: 't',
      value: tex
    };
  });
  var samplers = textures.map(function (tex, i) {
    return 'uniform sampler2D texture' + i + ';';
  }).join('\n');
  var body = textures.map(function (tex, i) {
    var cond = i === 0 ? 'if' : 'else if';
    return [cond + ' (vPage == ' + i + '.0) {', 'sampleColor = texture2D(texture' + i + ', vUv);', '}'].join('\n');
  }).join('\n');
  var color = opt.color; // remove to satisfy r73

  delete opt.textures;
  delete opt.color;
  delete opt.precision;
  delete opt.opacity;
  var attributes = {
    attributes: {
      page: {
        type: 'f',
        value: 0
      }
    }
  };
  var threeVers = (parseInt(THREE.REVISION, 10) || 0) | 0;

  if (threeVers >= 72) {
    attributes = undefined;
  }

  return Object.assign({
    uniforms: Object.assign({}, baseUniforms, {
      opacity: {
        type: 'f',
        value: opacity
      },
      color: {
        type: 'c',
        value: new THREE.Color(color)
      }
    }),
    vertexShader: ['attribute vec4 position;', 'attribute vec2 uv;', 'attribute float page;', 'uniform mat4 projectionMatrix;', 'uniform mat4 modelViewMatrix;', 'varying vec2 vUv;', 'varying float vPage;', 'void main() {', 'vUv = uv;', 'vPage = page;', 'gl_Position = projectionMatrix * modelViewMatrix * position;', '}'].join('\n'),
    fragmentShader: ['precision ' + precision + ' float;', 'uniform float opacity;', 'uniform vec3 color;', samplers, 'varying float vPage;', 'varying vec2 vUv;', 'void main() {', 'vec4 sampleColor = vec4(0.0);', body, 'gl_FragColor = sampleColor * vec4(color, opacity);', alphaTest === 0 ? '' : '  if (gl_FragColor.a < ' + alphaTest + ') discard;', '}'].join('\n')
  }, attributes, opt);
}
;// CONCATENATED MODULE: ./src/shaders/sdf.js
function createSDFShader(opt) {
  opt = opt || {};
  var opacity = typeof opt.opacity === 'number' ? opt.opacity : 1;
  var alphaTest = typeof opt.alphaTest === 'number' ? opt.alphaTest : 0.0001;
  var precision = opt.precision || 'highp';
  var color = opt.color;
  var map = opt.map; // remove to satisfy r73

  delete opt.map;
  delete opt.color;
  delete opt.precision;
  delete opt.opacity;
  return Object.assign({
    uniforms: {
      opacity: {
        type: 'f',
        value: opacity
      },
      map: {
        type: 't',
        value: map || new THREE.Texture()
      },
      color: {
        type: 'c',
        value: new THREE.Color(color)
      }
    },
    vertexShader: ['attribute vec2 uv;', 'attribute vec4 position;', 'uniform mat4 projectionMatrix;', 'uniform mat4 modelViewMatrix;', 'varying vec2 vUv;', 'void main() {', 'vUv = uv;', 'gl_Position = projectionMatrix * modelViewMatrix * position;', '}'].join('\n'),
    fragmentShader: ['#ifdef GL_OES_standard_derivatives', '#extension GL_OES_standard_derivatives : enable', '#endif', 'precision ' + precision + ' float;', 'uniform float opacity;', 'uniform vec3 color;', 'uniform sampler2D map;', 'varying vec2 vUv;', 'float aastep(float value) {', '  #ifdef GL_OES_standard_derivatives', '    float afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;', '  #else', '    float afwidth = (1.0 / 32.0) * (1.4142135623730951 / (2.0 * gl_FragCoord.w));', '  #endif', '  return smoothstep(0.5 - afwidth, 0.5 + afwidth, value);', '}', 'void main() {', '  vec4 texColor = texture2D(map, vUv);', '  float alpha = aastep(texColor.a);', '  gl_FragColor = vec4(color, opacity * alpha);', alphaTest === 0 ? '' : '  if (gl_FragColor.a < ' + alphaTest + ') discard;', '}'].join('\n')
  }, opt);
}
;// CONCATENATED MODULE: ./src/index.js



var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;