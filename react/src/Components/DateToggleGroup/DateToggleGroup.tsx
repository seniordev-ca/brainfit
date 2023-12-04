import React, { ReactElement, useState } from 'react';
import { DateToggle } from 'Components/DateToggle/DateToggle';

interface DataToggleGroupProps {
  onSelectedDaysChanged?: Function;
  wrapperClass?: string;
  selectedDays?: number[];
}

export const DateToggleGroup = function ({
  wrapperClass = '',
  ...props
}: DataToggleGroupProps): ReactElement {
  const [selectedDays, setSelectedDays] = useState<any>(props.selectedDays || []);
  const labels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const handleClick = (label: string, i: number) => {
    if (selectedDays.includes(i)) {
      // remove day
      setSelectedDays(selectedDays.filter((x: number) => x !== i));
      props.onSelectedDaysChanged && props.onSelectedDaysChanged(selectedDays.filter((x: number) => x !== i));
    } else {
      setSelectedDays((prev: any) => [
        ...prev,
        i
      ]);
      props.onSelectedDaysChanged && props.onSelectedDaysChanged([...selectedDays, i]);
    }
  }

  return (
    <div className={`flex flex-row justify-between ${wrapperClass}`.trim()}>
      {labels.map((label, i) => (
        <DateToggle
          label={label.substring(0, 1)}
          selected={selectedDays.includes(i)}
          onClick={() => handleClick(label, i)} />
      ))}
    </div>
  )
};