var itemSize = 3
var box = { min: [0, 0, 0], max: [0, 0, 0] }

function bounds (positions) {
  var count = positions.length / itemSize

  box.min[0] = positions[0]
  box.min[1] = positions[1]
  box.min[2] = positions[2]

  box.max[0] = positions[0]
  box.max[1] = positions[1]
  box.max[2] = positions[2]

  for (var i = 0; i < count; i++) {
    var x = positions[i * itemSize + 0]
    var y = positions[i * itemSize + 1]
    var z = positions[i * itemSize + 2]

    box.min[0] = Math.min(x, box.min[0])
    box.min[1] = Math.min(y, box.min[1])
    box.min[2] = Math.min(z, box.min[2])

    box.max[0] = Math.max(x, box.max[0])
    box.max[1] = Math.max(y, box.max[1])
    box.max[2] = Math.max(z, box.max[2])
  }
}

export function computeBox(positions, output) {
  bounds(positions)
  output.min.set(box.min[0], box.min[1], box.min[2])
  output.max.set(box.max[0], box.max[1], box.max[2])
}

export function computeSphere(positions, output) {
  bounds(positions)
  var minX = box.min[0]
  var minY = box.min[1]
  var minZ = box.min[2]
  var maxX = box.max[0]
  var maxY = box.max[1]
  var maxZ = box.max[2]

  var width = maxX - minX
  var height = maxY - minY
  var depth = maxZ - minZ

  var length = Math.sqrt(width * width + height * height)
  output.center.set(minX + width / 2, minY + height / 2, minZ + depth / 2)
  output.radius = length / 2
}
