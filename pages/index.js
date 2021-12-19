import * as d3 from "d3";
import { useState, useEffect, useRef } from "react";
import ZoomableSVG from "../components/ZoomableSVG";

export default function Home() {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [nodeCount, setNodeCount] = useState(1);
  const [linkCount, setLinkCount] = useState(1);
  const [linkLength, setLinkLength] = useState(400);
  const [nodeSize, setNodeSize] = useState(40);
  const [strength, setStrength] = useState(-800);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(1);
  const [selected, setSelected] = useState([]);

  const contentWidth = 400;
  const contentHeight = 400;
  const strokeColor = "#888";

  useEffect(() => {
    const startSimulation = (nodes, links) => {
      const simulation = d3
        .forceSimulation()
        .force(
          "collide",
          d3
            .forceCollide()
            .radius(function (d) {
              return d.r;
            })
            .iterations(32) // 計算回数 default=1
        )
        .force(
          "link",
          d3
            .forceLink()
            .distance(() => linkLength)
            .id((d) => d.id)
            .iterations(1)
        ) //stength:linkの強さ（元に戻る力 distance: linkの長さ iterations: 計算回数 default=1
        .force("charge", d3.forceManyBody().strength(strength)) // 引き合う力を設定
        .force("x", d3.forceX().x(200))
        .force("y", d3.forceY().y(200))
        .force("center", d3.forceCenter(200, 200)); // 描画するときの中心を設定

      // forceSimulationの影響下にnodesを置く
      simulation.nodes(nodes).on("tick", ticked);
      simulation.force("link").links(links);

      // 呼び出して新しい座標をsetStateする
      function ticked() {
        setNodes(nodes.slice());
        setLinks(links.slice());
      }
    };

    const startLineChart = async () => {
      const [nodes, links] = await (async () => {
        const response = await fetch("./data.json");
        const data = await response.json();
        const nodes = [];
        const links = [];

        for (const item of data.nodes) {
          if (item.value >= nodeCount) {
            nodes.push({
              id: item.id,
              label: item.label,
              r: nodeSize,
              value: item.value,
            });
          }
        }
        for (const link of data.links) {
          let isSource = false;
          let isTarget = false;
          for (const node of nodes) {
            if (node.id === link.source) {
              isSource = true;
            }
            if (node.id === link.target) {
              isTarget = true;
            }
            if (isSource && isTarget) {
              break;
            }
          }

          // sourceとtargetのnodeが存在する かつ 共起回数が設定された値以上ならlinkを表示
          if (isSource && isTarget && link.value >= linkCount) {
            links.push({
              source: link.source,
              target: link.target,
              value: link.value,
            });
          }
        }
        setMin(nodes.reduce((a, b) => (a.value < b.value ? a : b)).value);
        setMax(nodes.reduce((a, b) => (a.value > b.value ? a : b)).value);

        const tmp = [];
        for (const node of nodes) {
          for (const select of selected) {
            if (node.id === select) {
              tmp.push(select);
              break;
            }
          }
        }
        setSelected(tmp);
        return [nodes, links];
      })();
      startSimulation(nodes, links);
    };

    startLineChart();
  }, [nodeCount, linkCount, linkLength, nodeSize, strength]);

  const colorScale = d3.interpolateBlues;

  const a = (link) => {
    for (let i = 0; i < selected.length; i++) {
      for (let j = i + 1; j < selected.length; j++) {
        // console.log(selected[i], selected[j]);
        if (
          (selected[i] == link.target.id || selected[j] == link.source.id) &&
          (selected[j] == link.target.id || selected[i] == link.source.id)
        ) {
          return true;
        }
      }
    }
    return false;
  };

  return (
    <div>
      <ZoomableSVG width={contentWidth} height={contentHeight}>
        <g>
          <g>
            {links.map((link) => {
              const www = a(link);
              return (
                <line
                  key={link.source.id + "-" + link.target.id}
                  stroke={
                    // selected.length === 0
                    //   ? "black"
                    //   : selected.includes(link.source.id) ||
                    //     selected.includes(link.target.id)
                    //   ? "black"
                    //   : "#f5f5f5"

                    selected.length === 0
                      ? "black"
                      : selected.length === 1
                      ? selected.includes(link.source.id) ||
                        selected.includes(link.target.id)
                        ? "black"
                        : "#f5f5f5"
                      : www
                      ? "black"
                      : "#f5f5f5"
                  }
                  // stroke={"black"}
                  strokeWidth="1"
                  className="link"
                  x1={link.source.x}
                  y1={link.source.y}
                  x2={link.target.x}
                  y2={link.target.y}
                ></line>
              );
            })}
          </g>
          <g>
            {nodes.map((node) => {
              const normalizedValue = (node.value - min) / (max - min);
              // console.log(normalizedValue);
              return (
                <g className="node" key={node.id}>
                  <circle
                    r={node.r}
                    stroke="black"
                    fill={
                      selected && selected.length === 0
                        ? colorScale(normalizedValue)
                        : selected.includes(node.id)
                        ? "#FF6600"
                        : colorScale(normalizedValue)
                    }
                    cx={node.x}
                    cy={node.y}
                    onClick={() => handleSelect(node)}
                  ></circle>
                  <text
                    className="node-label"
                    textAnchor="middle"
                    stroke="black"
                    fill="white"
                    fontSize={"20px"}
                    onClick={() => handleSelect(node)}
                    x={node.x}
                    y={node.y}
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </g>
        </g>
      </ZoomableSVG>
    </div>
  );
}
