import "./BarSegment.scss";

interface BarSegmentProps {
  foregroundColourClass?: string;
  backgroundColourClass?: string;
  percentComplete: number;
  horizontal?: boolean;
}

export const BarSegment = function ({
  horizontal = false,
  foregroundColourClass,
  backgroundColourClass,
  percentComplete,
  ...props
}: BarSegmentProps) {
  return (horizontal ?
    <div data-testid={'segment'}
      className={`barHorizontal_Container ${backgroundColourClass ? backgroundColourClass : 'bar_bgColor'}`}>
      <div
        className={`barHorizontal_Layout ${foregroundColourClass ? foregroundColourClass : 'barHorizontal_Colour'}`}
        style={{ width: `${percentComplete}%` }} />
    </div>
    :
    <div data-testid={'segment'}
      className={`barVertical_Container ${backgroundColourClass ? backgroundColourClass : 'bar_bgColor'} `}>
      <div
        className={`barVertical_Layout ${foregroundColourClass ? foregroundColourClass : 'barVertical_Colour'}`}
        style={{
          height: `${percentComplete}%`
        }} />
    </div>
  )
}
