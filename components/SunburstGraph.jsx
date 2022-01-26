import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import { install } from "resize-observer";
import dynamic from 'next/dynamic'


const MyResponsiveSunburst = dynamic(() => import('./test'),{ ssr: false });

import {
  Tooltip,
  FormControl,
  Select,
  MenuItem,
  Box,
  InputLabel,
} from "@mui/material";



function SunburstGraph(props) {
    const [schoolCount, setSchoolCount] = useState(null);
    
    
    if (process.browser) {
        // windowやdocumentを使う処理を記述
        install();
      }

  useEffect(() => {
    const dividedData = props.data[props.selectedPrefecture];
    const data = {
      baseball: dividedData.baseball + dividedData.baseballPrivate,
    };
  }, [props]);

  return (
    <Box px={{ padding: "0.5rem", height: "100%" }}>
      <MyResponsiveSunburst data={data2} style={{height:"300px"}} />
    </Box>
  );
}

// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/sunburst


// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

const data2 = {
  name: "nivo",
  color: "hsl(290, 70%, 50%)",
  children: [
    {
      name: "viz",
      color: "hsl(151, 70%, 50%)",
      children: [
        {
          name: "stack",
          color: "hsl(141, 70%, 50%)",
          children: [
            {
              name: "cchart",
              color: "hsl(100, 70%, 50%)",
              loc: 68134,
            },
            {
              name: "xAxis",
              color: "hsl(241, 70%, 50%)",
              loc: 175317,
            },
            {
              name: "yAxis",
              color: "hsl(254, 70%, 50%)",
              loc: 158072,
            },
            {
              name: "layers",
              color: "hsl(285, 70%, 50%)",
              loc: 50609,
            },
          ],
        },
        {
          name: "ppie",
          color: "hsl(272, 70%, 50%)",
          children: [
            {
              name: "chart",
              color: "hsl(221, 70%, 50%)",
              children: [
                {
                  name: "pie",
                  color: "hsl(288, 70%, 50%)",
                  children: [
                    {
                      name: "outline",
                      color: "hsl(72, 70%, 50%)",
                      loc: 55265,
                    },
                    {
                      name: "slices",
                      color: "hsl(113, 70%, 50%)",
                      loc: 141164,
                    },
                    {
                      name: "bbox",
                      color: "hsl(33, 70%, 50%)",
                      loc: 23834,
                    },
                  ],
                },
                {
                  name: "donut",
                  color: "hsl(84, 70%, 50%)",
                  loc: 180496,
                },
                {
                  name: "gauge",
                  color: "hsl(169, 70%, 50%)",
                  loc: 70509,
                },
              ],
            },
            {
              name: "legends",
              color: "hsl(146, 70%, 50%)",
              loc: 21257,
            },
          ],
        },
      ],
    },
    {
      name: "colors",
      color: "hsl(14, 70%, 50%)",
      children: [
        {
          name: "rgb",
          color: "hsl(9, 70%, 50%)",
          loc: 78509,
        },
        {
          name: "hsl",
          color: "hsl(352, 70%, 50%)",
          loc: 99858,
        },
      ],
    },
    {
      name: "utils",
      color: "hsl(303, 70%, 50%)",
      children: [
        {
          name: "randomize",
          color: "hsl(308, 70%, 50%)",
          loc: 112688,
        },
        {
          name: "resetClock",
          color: "hsl(309, 70%, 50%)",
          loc: 61763,
        },
        {
          name: "noop",
          color: "hsl(66, 70%, 50%)",
          loc: 114825,
        },
        {
          name: "tick",
          color: "hsl(181, 70%, 50%)",
          loc: 137364,
        },
        {
          name: "forceGC",
          color: "hsl(27, 70%, 50%)",
          loc: 110040,
        },
        {
          name: "stackTrace",
          color: "hsl(211, 70%, 50%)",
          loc: 63048,
        },
        {
          name: "dbg",
          color: "hsl(246, 70%, 50%)",
          loc: 141634,
        },
      ],
    },
    {
      name: "generators",
      color: "hsl(136, 70%, 50%)",
      children: [
        {
          name: "address",
          color: "hsl(227, 70%, 50%)",
          loc: 147523,
        },
        {
          name: "city",
          color: "hsl(342, 70%, 50%)",
          loc: 115307,
        },
        {
          name: "animal",
          color: "hsl(32, 70%, 50%)",
          loc: 61559,
        },
        {
          name: "movie",
          color: "hsl(182, 70%, 50%)",
          loc: 2797,
        },
        {
          name: "user",
          color: "hsl(25, 70%, 50%)",
          loc: 150578,
        },
      ],
    },
    {
      name: "set",
      color: "hsl(45, 70%, 50%)",
      children: [
        {
          name: "clone",
          color: "hsl(163, 70%, 50%)",
          loc: 113919,
        },
        {
          name: "intersect",
          color: "hsl(144, 70%, 50%)",
          loc: 16140,
        },
        {
          name: "merge",
          color: "hsl(213, 70%, 50%)",
          loc: 54145,
        },
        {
          name: "reverse",
          color: "hsl(257, 70%, 50%)",
          loc: 55871,
        },
        {
          name: "toArray",
          color: "hsl(348, 70%, 50%)",
          loc: 7754,
        },
        {
          name: "toObject",
          color: "hsl(122, 70%, 50%)",
          loc: 43344,
        },
        {
          name: "fromCSV",
          color: "hsl(311, 70%, 50%)",
          loc: 194300,
        },
        {
          name: "slice",
          color: "hsl(15, 70%, 50%)",
          loc: 51501,
        },
        {
          name: "append",
          color: "hsl(253, 70%, 50%)",
          loc: 43136,
        },
        {
          name: "prepend",
          color: "hsl(41, 70%, 50%)",
          loc: 185965,
        },
        {
          name: "shuffle",
          color: "hsl(172, 70%, 50%)",
          loc: 65031,
        },
        {
          name: "pick",
          color: "hsl(66, 70%, 50%)",
          loc: 53971,
        },
        {
          name: "plouc",
          color: "hsl(286, 70%, 50%)",
          loc: 165332,
        },
      ],
    },
    {
      name: "text",
      color: "hsl(154, 70%, 50%)",
      children: [
        {
          name: "trim",
          color: "hsl(96, 70%, 50%)",
          loc: 18872,
        },
        {
          name: "slugify",
          color: "hsl(157, 70%, 50%)",
          loc: 46090,
        },
        {
          name: "snakeCase",
          color: "hsl(153, 70%, 50%)",
          loc: 52713,
        },
        {
          name: "camelCase",
          color: "hsl(159, 70%, 50%)",
          loc: 27645,
        },
        {
          name: "repeat",
          color: "hsl(96, 70%, 50%)",
          loc: 650,
        },
        {
          name: "padLeft",
          color: "hsl(204, 70%, 50%)",
          loc: 41335,
        },
        {
          name: "padRight",
          color: "hsl(199, 70%, 50%)",
          loc: 198121,
        },
        {
          name: "sanitize",
          color: "hsl(60, 70%, 50%)",
          loc: 185506,
        },
        {
          name: "ploucify",
          color: "hsl(83, 70%, 50%)",
          loc: 7608,
        },
      ],
    },
    {
      name: "misc",
      color: "hsl(48, 70%, 50%)",
      children: [
        {
          name: "greetings",
          color: "hsl(311, 70%, 50%)",
          children: [
            {
              name: "hey",
              color: "hsl(223, 70%, 50%)",
              loc: 87791,
            },
            {
              name: "HOWDY",
              color: "hsl(9, 70%, 50%)",
              loc: 127845,
            },
            {
              name: "aloha",
              color: "hsl(241, 70%, 50%)",
              loc: 15272,
            },
            {
              name: "AHOY",
              color: "hsl(100, 70%, 50%)",
              loc: 161892,
            },
          ],
        },
        {
          name: "other",
          color: "hsl(230, 70%, 50%)",
          loc: 41701,
        },
        {
          name: "path",
          color: "hsl(285, 70%, 50%)",
          children: [
            {
              name: "pathA",
              color: "hsl(285, 70%, 50%)",
              loc: 42463,
            },
            {
              name: "pathB",
              color: "hsl(36, 70%, 50%)",
              children: [
                {
                  name: "pathB1",
                  color: "hsl(351, 70%, 50%)",
                  loc: 119096,
                },
                {
                  name: "pathB2",
                  color: "hsl(335, 70%, 50%)",
                  loc: 102236,
                },
                {
                  name: "pathB3",
                  color: "hsl(57, 70%, 50%)",
                  loc: 11175,
                },
                {
                  name: "pathB4",
                  color: "hsl(198, 70%, 50%)",
                  loc: 110650,
                },
              ],
            },
            {
              name: "pathC",
              color: "hsl(123, 70%, 50%)",
              children: [
                {
                  name: "pathC1",
                  color: "hsl(177, 70%, 50%)",
                  loc: 184877,
                },
                {
                  name: "pathC2",
                  color: "hsl(233, 70%, 50%)",
                  loc: 7533,
                },
                {
                  name: "pathC3",
                  color: "hsl(155, 70%, 50%)",
                  loc: 26963,
                },
                {
                  name: "pathC4",
                  color: "hsl(16, 70%, 50%)",
                  loc: 143689,
                },
                {
                  name: "pathC5",
                  color: "hsl(112, 70%, 50%)",
                  loc: 13852,
                },
                {
                  name: "pathC6",
                  color: "hsl(94, 70%, 50%)",
                  loc: 157071,
                },
                {
                  name: "pathC7",
                  color: "hsl(161, 70%, 50%)",
                  loc: 65718,
                },
                {
                  name: "pathC8",
                  color: "hsl(301, 70%, 50%)",
                  loc: 15597,
                },
                {
                  name: "pathC9",
                  color: "hsl(322, 70%, 50%)",
                  loc: 12595,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
export default SunburstGraph;
