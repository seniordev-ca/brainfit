import { Scroller } from 'Components/Scroller/Scroller';
import { useEffect, useMemo } from 'react';

interface TimeSpinnerProps {
  value?: string;
  onChange?: (value: TimeSpinnerTime) => void;
  numberValue?: boolean;
}

type TimeSpinnerTime = {
  hour: number;
  minute: number;
  ampm: number;
  text: string;
  value: number | string;
  value24: string;
};

export const TimeSpinner = ({
  value = '9:00 AM',
  numberValue = true,
  onChange
}: TimeSpinnerProps) => {
  const { hour, minute, prevHour, prevMinute, ampm, meridiem } = useMemo(() => {
    const [time, meridiem] = value.split(' ');
    const [prevHour, prevMinute] = time.split(':');

    let hour = +prevHour;
    let minute = +prevMinute;
    let ampm = meridiem === 'AM' ? 0 : 1;

    return {
      prevHour,
      prevMinute,
      hour,
      minute,
      ampm,
      meridiem
    };
  }, [value]);

  useEffect(() => {
    console.log('Hour changed', hour);
  }, [hour]);

  const hourSource: any = new Array(12)
    .fill(1)
    .map((v, i) => ({ value: i + 1, text: i + 1 }));
  const minuteSource: any = new Array(60)
    .fill(1)
    .map((v, i) => ({ value: i, text: i < 10 ? `0${i}` : i }));
  const ampmSource = [
    { value: 0, text: 'AM' },
    { value: 1, text: 'PM' }
  ];

  const handleChange = async (
    type: 'hour' | 'minute' | 'ampm',
    value: number
  ) => {
    let oHour = hour;
    let oMinute = minute;
    let oAMPM = ampm;
    if (type === 'hour') {
      oHour = value;
    } else if (type === 'minute') {
      oMinute = value;
    } else {
      oAMPM = value;
    }

    const text = `${oHour}:${oMinute < 10 ? `0${oMinute}` : oMinute} ${
      oAMPM === 0 ? 'AM' : 'PM'
    }`;
    console.log(
      `${text} = ${(ampm === 1 && hour < 12 ? 12 : 0) + hour + minute / 60}`
    );
    if (onChange) {
      onChange({
        hour: oHour,
        minute: oMinute,
        ampm: oAMPM,
        text,
        value: numberValue
          ? (ampm === 1 && hour < 12 ? 12 : 0) + hour + minute / 60
          : text,
        value24: `${hour < 12 ? 12 + hour : hour}:${
          minute < 10 ? `0${minute}` : minute
        }`
      });
    }
  };

  return (
    <div className="w-full inline-flex scrollerContainer">
      <Scroller
        value={+prevHour}
        source={hourSource}
        onChange={(value: any) => handleChange('hour', value)}
      />
      <Scroller
        value={+prevMinute}
        source={minuteSource}
        onChange={(value: any) => handleChange('minute', value)}
      />
      <Scroller
        value={meridiem === 'AM' ? 0 : 1}
        type="normal"
        source={ampmSource}
        onChange={(value: any) => handleChange('ampm', value)}
      />
    </div>
  );
};
