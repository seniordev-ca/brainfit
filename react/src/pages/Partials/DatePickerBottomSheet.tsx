import { BottomSheetHeader } from 'Components/BottomSheetHeader/BottomSheetHeader';
import { Button } from 'Components/Button/Button';
import { PageWrapper } from 'Components/PageWrapper/PageWrapper';
import { Scroller } from 'Components/Scroller/Scroller';
import { CustomHabitContext } from 'contexts/customhabit.context';
import { neverEndingDate } from 'helpers/utils';
import moment, { Moment } from 'moment';
import { useContext, useEffect, useState } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { DialogProps } from 'types/types';

interface DatePickerProps extends DialogProps {
  id: 'startDate' | 'endDate';
  label?: string;
}

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

export const DatePickerBottomSheet = ({
  id,
  open,
  setOpen,
  label = 'Set date'
}: DatePickerProps) => {
  const { setCustomHabitValue, habit } = useContext(CustomHabitContext);

  const habitDate = () => {
    let field = id === 'startDate' ? habit.startDate : habit.endDate;

    if (field > moment().add(30, 'year').valueOf()) {
      field = moment('12/31/2099').valueOf();
    }

    return moment(field);
  };

  const [date, setDate] = useState<Moment>(habitDate());

  // const date = habitDate();
  const monthSource: any = new Array(12)
    .fill(1)
    .map((_v, i) => ({ value: i, text: months[i] }));

  const getYears = () => {
    let currentYear = new Date().getFullYear();
    let years = [];

    for (let i = currentYear; i < currentYear + 20; i++) {
      years.push({
        value: i,
        text: i
      });
    }
    return years;
  };

  const getDays = () => {
    const dayCount = date.daysInMonth();
    // console.log(
    //   'GETDAYS',
    //   id,
    //   dayCount,
    //   date,
    //   moment(habit[id]).toString(),
    //   moment().daysInMonth()
    // );

    let days = [];
    for (let i = 1; i <= dayCount; i++) {
      days.push({
        value: i,
        text: i
      });
    }
    return days;
  };

  let neverEnding = date.year() === 2099;
  const [days, setDays] = useState(getDays());

  const handleChange = async (type: 'year' | 'month' | 'date', value: any) => {
    const copyDate = date.clone();
    copyDate.set({ [type]: value });

    // setCustomHabitValue(id, copyDate.valueOf());
    setDate(copyDate);
    if (type !== 'date') {
      setDays(getDays());
    }
  };

  useEffect(() => {
    setCustomHabitValue(id, date.valueOf());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const saveOnClick = () => {
    const copyDate = date.clone();
    if (neverEnding) {
      copyDate.set({ year: 2099 });
    } else if (copyDate.year() === 2099) {
      copyDate.set({ year: moment().year() });
    }
    setCustomHabitValue(id, copyDate.valueOf());
    setOpen(false);
  };

  const removeEndDate = () => {
    setCustomHabitValue('endDate', neverEndingDate);
    setOpen(false);
  };

  return (
    <BottomSheet
      id="datepickerBottomSheet"
      className="z-50 pb-10 h-screen"
      open={open}
      defaultSnap={({ maxHeight }) => maxHeight * 0.94}
      snapPoints={({ maxHeight }) => [maxHeight * 0.94]}
      header={
        <BottomSheetHeader
          title={label}
          leftSideActionLabel="Back"
          leftSideActionOnClick={saveOnClick}
        />
      }
    >
      <PageWrapper sidesOnly>
        <div className="container mx-auto pb-10 pt-7 h-5/6">
          <div
            id="datepickerContent"
            className="w-full inline-flex scrollerContainer"
          >
            <Scroller
              source={monthSource}
              onChange={(value: any) => handleChange('month', value)}
              value={date.month()}
            />
            <Scroller
              source={days}
              onChange={(value: any) => handleChange('date', value)}
              value={date.date()}
            />
            <Scroller
              source={getYears()}
              onChange={(value: any) => handleChange('year', value)}
              value={date.year() === 2099 ? moment().year() : date.year()}
            />
          </div>
          {label === 'Set end date' && (
            <div className={'mt-6'}>
              <Button
                onClick={() => removeEndDate()}
                buttonType={'btn-tertiary'}
                label={'Remove end date'}
              />
            </div>
          )}
        </div>
      </PageWrapper>
    </BottomSheet>
  );
};
