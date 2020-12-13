import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';

const DEFAULT_DATA = [
  { name: 'a', value: 1 },
  { name: 'b', value: 2 },
  { name: 'c', value: 2 },
];

function D3Chart({ data = DEFAULT_DATA }) {
  const svgRef = useRef(null);
  const width = 700;
  const height = 700;
  const margin = {
    left: 125,
    right: 20,
    top: 100,
    bottom: 125,
  };
  const color = 'white';

  useEffect(() => {}, []);

  const x = d3
    .scaleBand()
    .domain(d3.range(data.length))
    .range([margin.left, width - margin.right])
    .padding(0.5);
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.value)])
    .nice()
    .range([height - margin.bottom, margin.top]);
  const xAxis = (g) =>
    g.attr('transform', `translate(0,${height - margin.bottom})`).call(
      d3
        .axisBottom(x)
        .tickFormat((i) => data[i].name)
        .tickSizeOuter(0),
    );
  const yAxis = (g) =>
    g
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(null, data.format))
      .call((g) => g.select('.domain').remove())
      .call((g) =>
        g
          .append('text')
          .attr('x', -margin.left)
          .attr('y', 10)
          .attr('fill', 'currentColor')
          .attr('text-anchor', 'start')
          .text(data.y),
      );

  const svg = d3.select(svgRef.current).attr('viewBox', [0, 0, width, height]);

  svg
    .append('g')
    .attr('fill', color)
    .selectAll('rect')
    .data(data)
    .join('rect')
    .attr('x', (_d, i) => x(i))
    .attr('y', (d) => y(d.value))
    .attr('height', (d) => y(0) - y(d.value))
    .attr('width', x.bandwidth());

  svg
    .append('g')
    .call(xAxis)
    .selectAll('text')
    .style('text-anchor', 'end')
    .attr('transform', 'rotate(-45)');
  svg.append('g').call(yAxis);

  return (
    <div>
      <svg ref={svgRef} height={height} width={width}></svg>
    </div>
  );
}

D3Chart.propTypes = {
  data: PropTypes.object,
};

export default D3Chart;
