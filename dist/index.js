"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createTextGeometry = require("./createTextGeometry");

Object.keys(_createTextGeometry).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _createTextGeometry[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _createTextGeometry[key];
    }
  });
});

var _basic = require("./shaders/basic");

Object.keys(_basic).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _basic[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _basic[key];
    }
  });
});

var _msdf = require("./shaders/msdf");

Object.keys(_msdf).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _msdf[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _msdf[key];
    }
  });
});

var _multipage = require("./shaders/multipage");

Object.keys(_multipage).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _multipage[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _multipage[key];
    }
  });
});

var _sdf = require("./shaders/sdf");

Object.keys(_sdf).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _sdf[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _sdf[key];
    }
  });
});

var _utils = require("./lib/utils");

Object.keys(_utils).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _utils[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _utils[key];
    }
  });
});

var _vertices = require("./lib/vertices");

Object.keys(_vertices).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _vertices[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _vertices[key];
    }
  });
});