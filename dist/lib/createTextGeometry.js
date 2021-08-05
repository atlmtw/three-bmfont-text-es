"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTextGeometry = createTextGeometry;

var utils = _interopRequireWildcard(require("./utils"));

var vertices = _interopRequireWildcard(require("./vertices"));

var THREE = _interopRequireWildcard(require("three"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var createLayout = require('layout-bmfont-text');

var createIndices = require('quad-indices');

function createTextGeometry(opt) {
  return new TextGeometry(opt);
}

var TextGeometry = /*#__PURE__*/function (_THREE$BufferGeometry) {
  _inherits(TextGeometry, _THREE$BufferGeometry);

  var _super = _createSuper(TextGeometry);

  function TextGeometry(opt) {
    var _this;

    _classCallCheck(this, TextGeometry);

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

  _createClass(TextGeometry, [{
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

      var positions = vertices.positions(glyphs);
      var uvs = vertices.uvs(glyphs, texWidth, texHeight, flipY);
      var indices = createIndices([], {
        clockwise: true,
        type: 'uint16',
        count: glyphs.length
      }); // update vertex data

      this.setIndex(indices);
      this.setAttribute('position', new THREE.BufferAttribute(positions, 2));
      this.setAttribute('uv', new THREE.BufferAttribute(uvs, 2)); // update multipage data

      if (!opt.multipage && 'page' in this.attributes) {
        // disable multipage rendering
        this.removeAttribute('page');
      } else if (opt.multipage) {
        // enable multipage rendering
        var pages = vertices.pages(glyphs);
        this.setAttribute('page', new THREE.BufferAttribute(pages, 1));
      }
    }
  }, {
    key: "computeBoundingSphere",
    value: function computeBoundingSphere() {
      if (this.boundingSphere === null) {
        this.boundingSphere = new THREE.Sphere();
      }

      var positions = this.attributes.position.array;
      var itemSize = this.attributes.position.itemSize;

      if (!positions || !itemSize || positions.length < 2) {
        this.boundingSphere.radius = 0;
        this.boundingSphere.center.set(0, 0, 0);
        return;
      }

      utils.computeSphere(positions, this.boundingSphere);

      if (isNaN(this.boundingSphere.radius)) {
        console.error('THREE.BufferGeometry.computeBoundingSphere(): ' + 'Computed radius is NaN. The ' + '"position" attribute is likely to have NaN values.');
      }
    }
  }, {
    key: "computeBoundingBox",
    value: function computeBoundingBox() {
      if (this.boundingBox === null) {
        this.boundingBox = new THREE.Box3();
      }

      var bbox = this.boundingBox;
      var positions = this.attributes.position.array;
      var itemSize = this.attributes.position.itemSize;

      if (!positions || !itemSize || positions.length < 2) {
        bbox.makeEmpty();
        return;
      }

      utils.computeBox(positions, bbox);
    }
  }]);

  return TextGeometry;
}(THREE.BufferGeometry);