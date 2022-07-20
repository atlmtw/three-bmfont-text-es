var CW = [0, 2, 3]
var CCW = [2, 1, 3]

function dtype(dtype) {
    switch (dtype) {
        case 'int8':
          return Int8Array
        case 'int16':
          return Int16Array
        case 'int32':
          return Int32Array
        case 'uint8':
          return Uint8Array
        case 'uint16':
          return Uint16Array
        case 'uint32':
          return Uint32Array
        case 'float32':
          return Float32Array
        case 'float64':
          return Float64Array
        case 'array':
          return Array
        case 'uint8_clamped':
          return Uint8ClampedArray
      }
}

function isBuffer(obj) {
    return obj != null && obj.constructor != null &&
    typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

function anArray(arr) {
    var str = Object.prototype.toString

    return (
        arr.BYTES_PER_ELEMENT
     && str.call(arr.buffer) === '[object ArrayBuffer]'
     || Array.isArray(arr)
   )
}

export function createIndices(array, opt) {
    //if user didn't specify an output array
    if (!array || !(anArray(array) || isBuffer(array))) {
        opt = array || {}
        array = null
    }

    if (typeof opt === 'number') //backwards-compatible
        opt = { count: opt }
    else
        opt = opt || {}

    var type = typeof opt.type === 'string' ? opt.type : 'uint16'
    var count = typeof opt.count === 'number' ? opt.count : 1
    var start = (opt.start || 0) 

    var dir = opt.clockwise !== false ? CW : CCW,
        a = dir[0], 
        b = dir[1],
        c = dir[2]

    var numIndices = count * 6

    var indices = array || new (dtype(type))(numIndices)
    for (var i = 0, j = 0; i < numIndices; i += 6, j += 4) {
        var x = i + start
        indices[x + 0] = j + 0
        indices[x + 1] = j + 1
        indices[x + 2] = j + 2
        indices[x + 3] = j + a
        indices[x + 4] = j + b
        indices[x + 5] = j + c
    }
    return indices
}