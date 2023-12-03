import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import us from '../../data/us.json';
import './StateMap.scss';

interface StateMapProps {
  selectedState: string;
  selectedCounty: string;
}

const StateMap: React.FC<StateMapProps> = ({ selectedState, selectedCounty }) => {
  const mapRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const width = 975;
    const height = 610;

    // Clear the SVG content
    d3.select(mapRef.current).selectAll('*').remove();

    const svg = d3.select(mapRef.current)
      .attr('viewBox', [0, 0, width, height])
      .attr('width', width)
      .attr('height', height)
      .attr('style', 'max-width: 100%; height: auto;');

    const path = d3.geoPath();

    const g = svg.append('g');

    const _us: any = us;

    const states = g.append('g')
      .attr('cursor', 'pointer')
      .selectAll('path')
      .data((topojson.feature(_us, _us.objects.states) as any).features)
      .join('path')
      .on('click', clickedState)
      .style('fill', d => {
        const state: any = d;
        return state.properties.name === selectedState ? 'darkgray' : 'lightgray';
      })
      .attr('d', path as any);

    const counties = g.append('g')
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .attr('stroke-linejoin', 'round')
      .style('stroke', '#fff')
      .selectAll('path')
      .data((topojson.feature(_us, _us.objects.counties) as any).features)
      .join('path')
      .on('click', clickedCounty)
      .style('fill', d => {
        const county: any = d;
        return county.properties.name === selectedCounty ? '#69b3a2' : 'none';
      })
      .attr('d', path as any);

    counties.append('title')
      .text(d => {
        const county: any = d;
        return county.properties.name;
      });

    states.append('title')
      .text(d => {
        const state: any = d;
        return state.properties.name;
      });

    g.append('path')
      .attr('fill', 'none')
      .attr('stroke', 'white')
      .attr('stroke-linejoin', 'round')
      .attr('d', path(topojson.mesh(_us, _us.objects.states, (a, b) => a !== b)));

    const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on('zoom', zoomed);

    svg.call(zoom as any);

    function clickedState(event: any, d: any) {
      const [[x0, y0], [x1, y1]] = path.bounds(d);
      event.stopPropagation();
      states.transition().style('fill', null);
      d3.select(event.target).transition().style('fill', '#69b3a2');
      svg.transition().duration(750).call(
        zoom.transform as any,
        d3.zoomIdentity
          .translate(width / 2, height / 2)
          .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
          .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
        d3.pointer(event, svg.node())
      );
    }

    function clickedCounty(event: any, d: any) {
      event.stopPropagation();
      counties.transition().style('fill', 'none');
      d3.select(event.target).transition().style('fill', '#69b3a2');
    }

    function zoomed(event: any) {
      const { transform } = event;
      g.attr('transform', transform);
      g.attr('stroke-width', 1 / transform.k);
    }

    if (selectedState) {
      const selectedPath: any = states.filter((d: any) => (d as any).properties.name === selectedState);
      if (!selectedPath.empty()) {
        const [[x0, y0], [x1, y1]] = path.bounds(selectedPath.datum());
        const scale = 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height);
        const translateX = -(x0 + x1) / 2;
        const translateY = -(y0 + y1) / 2;

        svg.transition().duration(750).call(
          zoom.transform as any,
          d3.zoomIdentity
            .translate(width / 2, height / 2)
            .scale(Math.min(8, scale))
            .translate(translateX, translateY)
        );
      }
    }

    return () => {
      svg.on('.zoom', null);
    };
  }, [selectedState, selectedCounty]);

  return (
    <div className='state-map'>
      <svg ref={mapRef} />
    </div>
  );
};

export default StateMap;
