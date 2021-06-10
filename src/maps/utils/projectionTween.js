import * as d3 from 'd3'

// From https://bl.ocks.org/mbostock/3711652

const projectionTween = (projection0, projection1, width, height) => {
  return function (d) {
    var t = 0

    var projection = d3
      .geoProjection(intermediateProjection)
      .scale(1)
      .translate([width / 2, height / 2])

    var path = d3.geoPath().projection(projection)

    function intermediateProjection(λ, φ) {
      λ *= 180 / Math.PI
      φ *= 180 / Math.PI

      var p0 = projection0([λ, φ]),
        p1 = projection1([λ, φ])
      return [(1 - t) * p0[0] + t * p1[0], (1 - t) * -p0[1] + t * -p1[1]]
    }

    return function (_) {
      t = _
      return path(d)
    }
  }
}

export default projectionTween
