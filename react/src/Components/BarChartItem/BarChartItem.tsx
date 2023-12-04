import "./BarChartItem.scss";
import { BarSegment } from "Components/BarSegment/BarSegment";
import { Typography } from "Components/Typography/Typography";

export interface BarChartData {
  label?: string;
  percentage: number;
  width?: string;
  color?: string;
  bgClass?: string;
  bgColor?: string;
  fgClass?: string;
  fgColor?: string;
}

interface BarChartItemProps {
  label?: string;
  showPercentageLabel?: boolean;
  percentComplete: number;
  horizontal?: boolean;
  foregroundColourClass?: string;
  backgroundColourClass?: string;
}

export const BarChartItem = function ({
  horizontal = false,
  label,
  percentComplete,
  showPercentageLabel = false,
  foregroundColourClass,
  backgroundColourClass,
  ...props
}: BarChartItemProps) {
  return (!horizontal ?
    <div className="barChartItem_VerticalContainer">
      {showPercentageLabel && <label className='text-right'>{percentComplete >= 0 ? `${percentComplete}%` : 'N/A'}</label>}
      <BarSegment horizontal={horizontal} percentComplete={percentComplete} foregroundColourClass={foregroundColourClass} backgroundColourClass={backgroundColourClass} />
      <Typography usage="captionRegular" typeClass={['mt-2']} content={label} />
    </div>
    :
    <div className="barChartItem_HorizontalContainer">
      {label && <Typography usage="headingSmall" typeClass={['barChartItem_Label']} content={label} />}
      <div className="barChartItem_HorizontalBar">
        <BarSegment horizontal={horizontal} percentComplete={percentComplete} foregroundColourClass={foregroundColourClass} backgroundColourClass={backgroundColourClass} />
      </div>
      {showPercentageLabel && <Typography usage="body" typeClass={['barChartItem_Value']}  content={percentComplete >= 0 ? `${percentComplete}%` : 'N/A'} />}
    </div>
  )
}