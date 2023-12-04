import { linearGradientDef } from '@nivo/core';
import { CustomLayer, Point, ResponsiveLine as NivoLine } from '@nivo/line';
import { colToRGB, rgbToHex } from 'helpers/utils';

import { useEffect, useState } from 'react';
import { HabitColour } from 'types/types';

// function pointsToPath(points: string) {
//   var p = points.split(/\s+/);
//   var path = '';
//   for (var i = 0, len = p.length; i < len; i++) {
//     path += ((i && 'L') || 'M') + p[i];
//   }
//   return path;
// }

export const StatsChart = function ({
  labels,
  values,
  color = 'orange'
}: {
  labels: string[];
  values: number[];
  color?: HabitColour;
}) {
  const RoundedOutlineLayer: CustomLayer = ({
    innerWidth,
    innerHeight
  }: any) => {
    //  Offset controls
    const xOffset = 3;
    const yOffset = 6;

    const w = innerWidth;
    const h = innerHeight;

    const radius = 12;

    const roundedRect = function (
      tlr: number,
      trr: number,
      brr: number,
      blr: number
    ) {
      return `
         M ${-xOffset} ${tlr}
         A ${tlr + xOffset} ${tlr + xOffset} 0 0 1 ${tlr} ${-yOffset}
         L ${w - trr} ${-yOffset}
         A ${trr + yOffset} ${trr + yOffset}  0 0 1 ${w + xOffset}  ${trr}
         L ${w + xOffset} ${h - brr + yOffset}
         A ${brr + xOffset} ${brr + xOffset} 0 0 1 ${w - brr + xOffset} ${
        h + yOffset
      }
         L ${blr - xOffset} ${h + yOffset}
         A ${blr + xOffset} ${blr + xOffset} 0 0 1 ${-xOffset} ${h - blr}
         Z`;
    };

    const rp = roundedRect(radius, radius, radius, radius);
    const borderColor = dark ? '#584F59' : '#E1E1E1';

    return (
      <>
        <path
          d={rp}
          fill="none"
          stroke={borderColor}
          stroke-width="2"
          strokeLinejoin="round"
          stroke-line-join="round"
          className={'rounded-lg'}
        />
      </>
    );
  };

  const [selectedPoint, setSelectedPoint] = useState(0);

  const [dark, setDark] = useState(false);
  console.log('The color is', color, colToRGB(color));

  const hex = rgbToHex(colToRGB(color, dark));

  useEffect(() => {
    // Add listener to update styles
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => setDark(e.matches));

    // Setup dark/light mode for the first time
    setDark(window.matchMedia('(prefers-color-scheme: dark)').matches);

    // Remove listener
    return () => {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .removeEventListener('change', () => {});
    };
  }, []);

  let pointColorCallCount = 0;

  return (
    <div
      className="statsChart_container"
      data-testid="statsChart"
      style={{ height: 250 }}
    >
      <div className={'flex justify-center items-center content-center'}>
        {selectedPoint !== -1 ? (
          <div
            className={
              'text-xs py-1 px-2 shadow-md rounded-lg bg-gray-100  border-[#efefef]'
            }
            style={{
              color: hex
            }}
          >
            {labels[selectedPoint]} • {values[selectedPoint]}%
          </div>
        ) : (
          <> </>
        )}
      </div>

      <NivoLine
        margin={{
          top: 10,
          right: 10,
          bottom: 50,
          left: 30
        }}
        animate={false}
        crosshairType={'x'}
        enableCrosshair={true}
        layers={[
          'crosshair',
          'markers',
          'axes',
          'areas',
          'lines',
          'points',
          'slices',
          'mesh',
          RoundedOutlineLayer

          // 'legends'
        ]}
        theme={{
          axis: {
            domain: {
              line: {}
            },
            legend: {}
          },
          crosshair: {
            line: {
              strokeWidth: 2,
              stroke: hex,
              strokeOpacity: 1,
              strokeDasharray: 'black'
            }
          }
        }}
        curve="monotoneX"
        data={[
          {
            id: 'Timeline',
            data: values.map((v, i) => {
              return {
                x: labels[i],
                y: v
              };
            })
          }
        ]}
        colors={hex}
        pointColor={(p: Point, x: any) => {
          const curPCI = pointColorCallCount;
          pointColorCallCount = (pointColorCallCount + 1) % labels.length;

          // A little bit of hackery but hey
          if (curPCI === selectedPoint) {
            return 'white';
          }

          return 'transparent';
        }}
        pointBorderColor={(p: Point) => {
          return p.index === selectedPoint ? hex : 'transparent';
        }}
        pointSize={8}
        pointBorderWidth={1}
        enableGridX={false}
        enableGridY={false}
        enableArea={true}
        onMouseMove={(point: any, e: any) => {
          if (selectedPoint !== point.index) {
            setSelectedPoint(point.index);
          }
        }}
        defs={[
          linearGradientDef('gradientA', [
            { offset: 0, color: hex },
            { offset: 100, color: hex, opacity: 0.25 }
          ])
        ]}
        fill={[
          {
            match: '*',
            id: 'gradientA'
          }
        ]}
        useMesh={true}
        axisLeft={{
          tickValues: [100, 50, 0],
          renderTick: (props: any) => {
            return (
              <g transform={`translate(${props.x}, ${props.y})`}>
                <text
                  dominant-baseline="central"
                  text-anchor="end"
                  transform="translate(-10,0) rotate(0)"
                  className={'fill-current dark:text-white text-xs'}
                >
                  {props.value}
                </text>
              </g>
            );
          }
        }}
        axisBottom={{
          renderTick: (props: any) => {
            return (
              <g transform={`translate(${props.x}, ${props.y})`}>
                <text
                  dominant-baseline="central"
                  text-anchor="end"
                  transform="translate(10,20) rotate(0)"
                  className={'fill-current dark:text-white text-xs'}
                >
                  {props.value}
                </text>
              </g>
            );
          }
        }}
        yScale={{
          type: 'linear',
          min: 0,
          max: 100
        }}
        tooltip={({ point }: any) => <></>}
      />
    </div>
  );
};
