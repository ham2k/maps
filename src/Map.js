import React, { useRef } from 'react'

import * as d3 from 'd3'
import * as topojson from 'topojson'
import d3GeoZoom from 'd3-geo-zoom'

import useResizeObserver from './utils/useResizeObserver'
// import projectionTween from './maps/utils/projectionTween'

import commonStyles from './styles/common'

import { makeStyles } from '@material-ui/core'

import originalWorldTopoJSON from './data/countries-10m-2.0.2.topo.json'
import mufGeoJSON from './data/mufd-normal-now.geojson'

const worldTopoJSON = topojson.presimplify(originalWorldTopoJSON)

const PROJECTIONS = {
  ortho: d3.geoOrthographic(),
  equirect: d3.geoEquirectangular(),
  mercator: d3.geoMercator().scale(490 / 2 / Math.PI),
  equalEarth: d3.geoEqualEarth(),
  equalArea: d3.geoConicEqualArea(),
}
const DEFAULT_PROJECTION = 'ortho'

const useStyles = makeStyles((theme) => ({
  ...commonStyles(theme),

  map: {
    width: '100%',
    height: '100%',
    backgroundColor: '#aaa',

    '& .stroke': {
      fill: 'none',
      stroke: '#000',
      strokeWidth: '3px',
    },

    '& .fill': {
      fill: '#C0D1EB',
    },

    '& .graticule': {
      fill: 'none',
      stroke: '#777',
      strokeWidth: '0.5px',
      strokeOpacity: '0.5',
    },

    '& .countries': {
      fill: '#cbccbe',
      stroke: '#999',
    },

    '& .muf': {
      fill: 'none',
      stroke: '#900',
    },
  },
}))

// function showFPSCounter() {
//   const counter = d3.select('body').append('div')
//   const styles = {
//     'font-family': 'monospace',
//     position: 'fixed',
//     top: '0',
//     left: '0',
//     'z-index': '100000',
//     padding: '8px',
//     background: 'black',
//     color: 'white',
//   }
//   Object.keys(styles).forEach((attr) => counter.style(attr, styles[attr]))

//   const ticks = []

//   d3.timer(function (t) {
//     ticks.push(t)
//     if (ticks.length > 15) ticks.shift()

//     const avgFrameLength = (ticks[ticks.length - 1] - ticks[0]) / ticks.length
//     counter.text(Math.round((1 / avgFrameLength) * 1000) + ' fps')
//   })
// }
// showFPSCounter()

export default function Map({ id, style, className }) {
  const classes = useStyles()

  const svgRef = useRef(null)
  const wrapperRef = useRef()
  const dimensions = useResizeObserver(wrapperRef)

  // const [selectedProjection, setSelectedProjection] = useState(DEFAULT_PROJECTION)

  React.useEffect(() => {
    const simplifiedTopos = {
      low: topojson.simplify(worldTopoJSON, 0.1),
      mid: topojson.simplify(worldTopoJSON, 0.01),
      high: topojson.simplify(worldTopoJSON, 0.005),
      max: topojson.simplify(worldTopoJSON, 0.0001),
    }

    const svg = d3.select(svgRef.current)

    const { width, height } = dimensions || wrapperRef.current.getBoundingClientRect()

    const projection = PROJECTIONS[DEFAULT_PROJECTION]
    projection.fitSize([width, height], topojson.feature(simplifiedTopos.low, simplifiedTopos.low.objects.countries))

    const geoGenerator = d3.geoPath().projection(projection)

    svg.selectAll('*').remove()

    svg.append('defs').append('path').datum({ type: 'Sphere' }).attr('id', 'sphere').attr('d', geoGenerator)

    svg.append('use').attr('class', 'stroke').attr('xlink:href', '#sphere')

    svg.append('use').attr('class', 'fill').attr('xlink:href', '#sphere')

    const graticule = d3.geoGraticule()
    svg.append('path').datum(graticule).attr('class', 'graticule').attr('d', geoGenerator)

    let lastTopo

    const countriesPath = svg
      .append('g')
      .selectAll('path')
      .data(topojson.feature(simplifiedTopos.low, simplifiedTopos.low.objects.countries).features)
      .join('path')
      .attr('d', geoGenerator)
      .attr('class', 'countries')

    svg
      .append('g')
      .selectAll('path')
      .data(mufGeoJSON.features)
      .join('path')
      .attr('d', geoGenerator)
      .attr('class', 'muf')

    const rerenderOnZoom = ({ scale, rotation }) => {
      let topo

      if (scale < 500) topo = simplifiedTopos.low
      else if (scale < 1000) topo = simplifiedTopos.mid
      else if (scale < 3000) topo = simplifiedTopos.high
      else topo = simplifiedTopos.max

      if (topo !== lastTopo) {
        countriesPath.data(topojson.feature(topo, topo.objects.countries).features)
        lastTopo = topo
      }

      svg.selectAll('path').attr('d', geoGenerator)
    }
    d3GeoZoom()
      .projection(projection)
      .northUp(true)
      .scaleExtent([height / width, 20])
      .onMove(rerenderOnZoom)(svg.node())
  }, [dimensions])

  // const switchToMercator = () => {
  //   const newProjection = 'mercator'

  //   const svg = d3.select(svgRef.current)

  //   svg
  //     .selectAll('path')
  //     .transition()
  //     .duration(750)
  //     .attrTween('d', projectionTween(PROJECTIONS[selectedProjection], PROJECTIONS[newProjection]))

  //   setSelectedProjection(newProjection)
  // }

  // const switchToNatural = () => {
  //   const newProjection = 'equalEarth'

  //   const svg = d3.select(svgRef.current)

  //   svg
  //     .selectAll('path')
  //     .transition()
  //     .duration(750)
  //     .attrTween('d', projectionTween(PROJECTIONS[selectedProjection], PROJECTIONS[newProjection]))

  //   setSelectedProjection(newProjection)
  // }

  return (
    <div id={id} style={style} className={className} ref={wrapperRef}>
      <svg className={classes.map} ref={svgRef} />
      {/* <button onClick={switchToMercator}>Mercator</button>
      <button onClick={switchToNatural}>Natural</button> */}
    </div>
  )
}
