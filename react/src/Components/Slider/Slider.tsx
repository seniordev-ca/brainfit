import "./Slider.scss";
import { Slider as MUISlider } from '@mui/material';

export interface SliderProps {
  minimumValue?: number
  maximumValue: number
  stepInterval?: number
  value?: number
  onValueChanged: (currentValue: number) => void,
}

export const Slider = function ({
  minimumValue = 1,
  maximumValue = 5,
  stepInterval = 0.01,
  onValueChanged,
  value,
  ...props
}: SliderProps) {

  return (
    <div className="slider-container">
      <MUISlider marks={false} value={value} min={minimumValue} max={maximumValue} step={stepInterval} onChange={(event, value) => onValueChanged(typeof value === 'object' ? value[0] : value)} onChangeCommitted={(event, value) => onValueChanged(typeof value === 'object' ? Math.round(value[0]) : Math.round(value))} />
    </div>
  )
};
