import React, { useMemo } from 'react';
import { AreaClosed, Bar } from '@visx/shape';
import { AppleStock } from '@visx/mock-data/lib/mocks/appleStock';
import { curveMonotoneX } from '@visx/curve';
import { GridRows, GridColumns } from '@visx/grid';
import { scaleTime, scaleLinear } from '@visx/scale';
import { LinearGradient } from '@visx/gradient';
import { max, extent, bisector } from 'd3-array';

export const background = '#3b6978';
export const background2 = '#204051';
export const accentColor = '#edffea';

// accessors
const getDate = (d: AppleStock) => new Date(d.date);
const getStockValue = (d: AppleStock) => d.close;
// @ts-ignore
const bisectDate = bisector<AppleStock, Date>(d => new Date(d.date)).left;

export type AreaProps = {
  stock: AppleStock[];
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
};

const AreaChart = ({
  stock,
  width,
  height,
  margin = { top: 0, right: 0, bottom: 0, left: 0 },
}: AreaProps) => {
  if (width < 10) return null;

  // bounds
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // scales
  const dateScale = useMemo(
    () =>
      scaleTime({
        range: [margin.left, innerWidth + margin.left],
        domain: extent(stock, getDate) as [Date, Date],
      }),
    [innerWidth, margin.left]
  );

  const stockValueScale = useMemo(
    () =>
      scaleLinear({
        range: [innerHeight + margin.top, margin.top],
        domain: [0, (max(stock, getStockValue) || 0) + innerHeight / 3],
        nice: true,
      }),
    [margin.top, innerHeight]
  );

  return (
    <div>
      <svg width={width} height={height}>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill="url(#area-background-gradient)"
          // fill="blue"
          rx={0} // corners
        />
        <LinearGradient
          id="area-background-gradient"
          from={background}
          to={background2}
        />
        <LinearGradient
          id="area-gradient"
          from={accentColor}
          to={accentColor}
          toOpacity={0.3}
        />
        <GridRows
          left={margin.left}
          scale={stockValueScale}
          width={innerWidth}
          strokeDasharray="1,3"
          stroke={accentColor}
          strokeOpacity={0.2}
          pointerEvents="none"
        />
        <GridColumns
          top={margin.top}
          scale={dateScale}
          height={innerHeight}
          strokeDasharray="1,3"
          stroke={accentColor}
          strokeOpacity={0.2}
          pointerEvents="none"
        />
        <AreaClosed<AppleStock>
          data={stock}
          x={d => dateScale(getDate(d)) ?? 0}
          y={d => stockValueScale(getStockValue(d)) ?? 0}
          yScale={stockValueScale}
          strokeWidth={1}
          stroke="url(#area-gradient)"
          fill="url(#area-gradient)"
          curve={curveMonotoneX}
        />

        <Bar
          x={margin.left}
          y={margin.top}
          width={innerWidth}
          height={innerHeight}
          fill="transparent"
          rx={14}
          // onTouchStart={handleTooltip}
          // onTouchMove={handleTooltip}
          // onMouseMove={handleTooltip}
          // onMouseLeave={() => hideTooltip()}
        />
      </svg>
    </div>
  );
};

export default AreaChart;
