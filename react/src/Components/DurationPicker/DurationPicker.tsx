import { Scroller } from 'Components/Scroller/Scroller';
import { CustomHabitContext } from 'contexts/customhabit.context';
import React, { useContext } from 'react';

interface DurationPickerProps {
  value?: string;
  onChange?: any;
  numberValue?: boolean;
}
const hourSource: any = new Array(48)
  .fill(1)
  .map((v, i) => ({ value: i, text: `${i} hr` }));

const minuteSecondSource: any = new Array(60)
  .fill(1)
  .map((v, i) => ({ value: i, text: i < 10 ? `0${i} min` : `${i} min` }));

export const DurationPicker = ({
  value = '3:00 AM',
  numberValue = true,
  ...props
}: DurationPickerProps) => {
  const { habit, setCustomHabitValue } = useContext(CustomHabitContext);
  const { targetValue = 0 } = habit;
  let hour = Math.round(targetValue / 3600);
  let minute = Math.round((targetValue % 3600) / 60);

  const handleChange = async (
    type: 'hour' | 'minute' | 'second',
    value: number
  ) => {
    if (type === 'hour') {
      hour = value;
    } else if (type === 'minute') {
      minute = value;
    }

    const totalDuration = hour * 60 * 60 + minute * 60;
    setCustomHabitValue('targetValue', totalDuration);
  };
  return (
    <div className="w-full inline-flex scrollerContainer">
      <Scroller
        value={hour}
        type="normal"
        source={hourSource}
        onChange={(value: any) => handleChange('hour', value)}
      />
      <Scroller
        value={minute}
        type="normal"
        source={minuteSecondSource}
        onChange={(value: any) => handleChange('minute', value)}
      />
      {/* <Scroller
        value={second}
        type="normal"
        source={minuteSecondSource}
        onChange={(value: any) => handleChange('second', value)}
      /> */}
    </div>
  );
};
