import { SegmentedControl } from 'Components/SegmentedControl/SegmentedControl';
import { StatsChart } from 'Components/StatsChart/StatsChart';
import { averageCompletionForDate, frequencyUnitToMS } from 'helpers/utils';
import _ from 'lodash';
import { Habit } from 'models/habit';
import moment from 'moment';
import { useMemo, useState } from 'react';
import { HabitColour, HabitFrequency } from 'types/types';

type Props = {
  habits: Habit[];
  frequency: HabitFrequency;
  colour: HabitColour;
};
const optionLabels = ['1W', '1M', '3M', '6M', '1Y', 'All'];

export function StatsChartWithHistory({ habits, frequency, colour }: Props) {
  const [selected, setSelected] = useState(0);

  const [labels, values] = useMemo(() => {
    const label = optionLabels[selected];

    const averageForDate: {
      [date: string]: number;
    } = {};

    const earliestDate = moment(
      _.minBy(habits, (a) => a.startDate)!.startDate
    ).startOf('day');

    const daysBetween = moment().diff(earliestDate, 'day');

    const edV = earliestDate.valueOf();

    for (let i = 0; i < daysBetween + 1; i += 1) {
      // Use fast math because this will be converted to a moment object in Habit.isScheduledFor
      // const date = earliestDate.clone().add(i, 'day').valueOf();
      const date = edV + i * frequencyUnitToMS['day'];
      // Just in case I did some jank.
      if (date > Date.now()) {
        break;
      }
      const avg = averageCompletionForDate(habits, date);
      averageForDate[date] = avg;
    }

    const today = moment().startOf('day');
    const labels: string[] = [];
    const values: number[] = [];

    const daysBefore = [];
    const dayOfWeek = today.day();

    const nowMS = today.valueOf();

    function timespanAverage(start: number, end: number) {
      const averagesInRange = Object.keys(averageForDate)
        .filter((k) => {
          const _n = Number(k);
          return _n >= start && _n <= end;
        })
        .map((d) => averageForDate[d]);

      console.log('Chart averages in range ', averagesInRange);

      const res = averagesInRange.length
        ? averagesInRange.reduce((a, b) => a + b) / averagesInRange.length
        : 0;
      return Math.round(res);
    }

    function monthSlices(resolution = 3, spanMonths = 1) {
      const today = moment().startOf('day');
      // spanMonths = 1;
      const oL: string[] = [];
      const oV: number[] = [];
      for (let i = 0; i < resolution; i += 1) {
        // for (let i = resolution; i > -1; i -= 1) {
        const date = today
          .clone()
          .subtract(i * spanMonths, 'month')
          .startOf('month');

        console.log('Charts span months and date is', date.toLocaleString());
        const avg = timespanAverage(
          date.valueOf(),
          date.endOf('month').valueOf()
        );

        oL.push(moment.monthsShort()[date.month()]);
        oV.push(avg);
      }
      _.reverse(oL);
      _.reverse(oV);
      labels.push(...oL);
      values.push(...oV);
    }

    for (let i = 6; i > 0; i -= 1) {
      const diff = dayOfWeek - i;
      const day = diff < 0 ? 7 + diff : diff;
      const wkDay = moment.weekdaysShort()[day];
      daysBefore.push(wkDay);
    }

    // First set of data
    // if (results.length === 1) {
    //   console.log('1st');
    //   labels.push(...daysBefore);
    //   values.push(...daysBefore.map(() => 0));

    //   labels.push('Today');
    //   values.push(calculateActivityCompletion(results[0]));
    if (label === '1W') {
      if (frequency === 'day') {
        labels.push(...daysBefore);

        for (let i = 7; i > -1; i--) {
          const date = nowMS - i * frequencyUnitToMS['day'];
          // const date = today.clone().subtract(i, 'day').valueOf();
          // console.log(
          //   'Chart wants it for',
          //   new Date(date).toLocaleDateString(),
          //   averageForDate[date],
          //   date
          // );
          values.push(averageForDate[date] || 0);
        }
        console.log('Chart values', values, Object.keys(averageForDate));

        // console.log(allActs);
        labels.push('Today');
      } else {
        // We're guaranteed this will be a thing because we first check if we only have 1 results.

        labels.push('Last ');
        values.push(averageForDate[today.subtract(1, 'week').valueOf()] || 0);

        labels.push('This');
        values.push(averageForDate[nowMS]);
        //  month
      }
    } else if (label === '1M') {
      if (frequency === 'week') {
        // This is fine because there will be more than one
        const weeksBetween = today.diff(earliestDate, 'week');
        for (let i = 0; i < weeksBetween; i += 1) {
          labels.push(`w${i + 1}`);
          values.push(
            averageForDate[today.clone().subtract(i, 'week').valueOf()] || 0
          );
        }

        labels.push('This');
        values.push(averageForDate[nowMS]);
      } else if (frequency === 'month') {
        labels.push(`${moment.monthsShort()[today.month()]} 1st`);
        values.push(averageForDate[today.startOf('month').valueOf()] || 0);

        labels.push('Today');
        values.push(averageForDate[nowMS]);
      } else {
        const monthsBetween = today.diff(earliestDate, 'months');

        for (let i = 0; i < Math.max(monthsBetween, 1); i += 1) {
          const date = today.subtract(i, 'month').startOf('month');
          const avg = timespanAverage(
            date.valueOf(),
            date.endOf('month').valueOf()
          );

          labels.push(`m${i + 1}`);
          values.push(avg);
        }

        if (labels.length === 1) {
          labels.unshift('Day 1');
          values.unshift(averageForDate[edV]);
        }
      }
    } else if (label === '3M') {
      monthSlices(3);
    } else if (label === '6M') {
      monthSlices(6);
    } else if (label === '1Y') {
      monthSlices(6, 2);

      // All
    } else {
      const earliestDate = moment(
        _.minBy(habits, (a) => a.startDate)!.startDate
      )
        .startOf('day')
        .valueOf();

      const firstProgress = averageCompletionForDate(habits, earliestDate);

      const lastProgress = averageCompletionForDate(
        habits,
        moment().startOf('day').valueOf()
      );
      labels.push('Day 1');
      values.push(firstProgress);

      labels.push('Today');
      values.push(lastProgress);
    }
    return [
      _.takeRight(labels, label === '1Y' ? 7 : 7),
      _.takeRight(values, label === '1Y' ? 7 : 7)
    ];
  }, [selected, habits, frequency]);

  return (
    <>
      <SegmentedControl
        onOptionSelected={(opt) => setSelected(opt)}
        optionLabels={optionLabels}
      />
      <div className="mt-4">
        <StatsChart labels={labels} values={values} color={colour} />
      </div>
    </>
  );
}
