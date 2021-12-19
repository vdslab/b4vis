import * as d3 from "d3";
import { useState, useEffect, useRef } from "react";

const ZoomableSVG = ({ width, height, children }) => {
  const svgRef = useRef();
  const [k, setK] = useState(1);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  useEffect(() => {
    const zoom = d3.zoom().on("zoom", (event) => {
      const { x, y, k } = event.transform;
      setK(k);
      setX(x);
      setY(y);
    });
    d3.select(svgRef.current).call(zoom);
  }, []);
  return (
    <svg
      ref={svgRef}
      className="graph"
      width="100%"
      height="100%"
      viewBox={`0 0 ${width} ${height}`}
      style={{ border: "solid 1px" }}
    >
      <g transform={`translate(${x},${y})scale(${k})`}>{children}</g>
    </svg>
  );
};

export default ZoomableSVG;
