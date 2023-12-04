import { BottomSheetHeader } from 'Components/BottomSheetHeader/BottomSheetHeader';
import { Button } from 'Components/Button/Button';
import { DateToggleGroup } from 'Components/DateToggleGroup/DateToggleGroup';
import { PageWrapper } from 'Components/PageWrapper/PageWrapper';
import { Scroller } from 'Components/Scroller/Scroller';
import { TimeSpinner } from 'Components/TimeSpinner/TimeSpinner';
import { randomForNotifId } from 'helpers/utils';
import { useEffect, useState } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { DialogProps, HabitReminder } from 'types/types';
// import { OrdinalDaysSpinner } from 'Components/OrdinalDaySpinner/OrdinalDaysSpinner';

interface RemindPickerProps extends DialogProps {
  reminder?: HabitReminder;
  daySelection?: 'week' | 'month';
  onChange: (reminder: HabitReminder) => void;
  onDelete: (reminder: HabitReminder) => void;
}

function newReminder() {
  return {
    id: randomForNotifId(),
    time: '9:00 AM'
  };
}

export const RemindPickerBottomSheet = ({
  open,
  setOpen,
  onChange,
  onDelete,
  daySelection,
  reminder: input
}: RemindPickerProps) => {
  const [reminder, setReminder] = useState<HabitReminder>(
    input || newReminder()
  );

  useEffect(() => {
    console.log('The input changed', input);
    setReminder(input || newReminder());
  }, [input]);

  const handleChange = async (type: 'time' | 'day' | 'days', value: any) => {
    const nr = reminder;

    if (type === 'time') {
      nr.time = value;
    } else if (type === 'days') {
      nr.days = value;
    } else if (type === 'day') {
      nr.day = value;
    }

    setReminder(() => ({ ...nr }));
    onChange(nr);
  };

  const DaysSelection = (): React.ReactElement => {
    return (
      <>
        {daySelection === 'week' ? (
          <div className="my-5">
            <DateToggleGroup
              selectedDays={reminder.days}
              onSelectedDaysChanged={(value: any) => {
                handleChange('days', value);
              }}
            />
          </div>
        ) : daySelection === 'month' ? (
          <div className="my-5">
            <OrdinalDaysScroller />
          </div>
        ) : (
          <></>
        )}
      </>
    );
  };

  const OrdinalDaysScroller = (): React.ReactElement => {
    const [day = '1st', dayUnitStr = 'day'] = (reminder.day || '').split(' ');
    const getOrdinalNumber = (n: number) =>
      n +
      (n % 10 === 1 && n % 100 !== 11
        ? 'st'
        : n % 10 === 2 && n % 100 !== 12
        ? 'nd'
        : n % 10 === 3 && n % 100 !== 13
        ? 'rd'
        : 'th');
    const daySource: any = new Array(30).fill(1).map((v, i) => ({
      value: getOrdinalNumber(i + 1),
      text: getOrdinalNumber(i + 1)
    }));
    const dayUnitSource = [
      { value: 0, text: 'day' },
      { value: 1, text: 'Sunday' },
      { value: 2, text: 'Monday' },
      { value: 3, text: 'Tuesday' },
      { value: 4, text: 'Wednesday' },
      { value: 5, text: 'Thursday' },
      { value: 6, text: 'Friday' },
      { value: 7, text: 'Saturday' }
    ];
    const dayUnit =
      dayUnitSource.find(
        (x: any) => x.text.toLowerCase() === dayUnitStr.toLowerCase()
      )?.value || 0;
    const [reminderDay, setReminderDay] = useState<any>({
      day,
      dayUnit
    });

    useEffect(() => {
      if (reminderDay) {
        handleChange(
          'day',
          `${reminderDay.day} ${dayUnitSource[reminderDay.dayUnit].text}`
        );
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reminderDay]);

    return (
      <div className="w-full inline-flex scrollerContainer">
        <Scroller
          type="normal"
          value={+day}
          source={daySource}
          onChange={(value: any) => {
            setReminderDay((prev: any) => ({
              ...prev,
              day: value
            }));
          }}
        />
        <Scroller
          type="normal"
          value={+dayUnit}
          source={dayUnitSource}
          onChange={(value: any) => {
            setReminderDay((prev: any) => ({
              ...prev,
              dayUnit: value
            }));
          }}
        />
      </div>
    );
  };

  const handleCloseBottomSheet = () => {
    setOpen(false);
  };

  return (
    <BottomSheet
      id="FrequencyPickerBottomSheet"
      className="z-50 pb-10 h-screen"
      open={open}
      defaultSnap={({ maxHeight }) => maxHeight * 0.94}
      snapPoints={({ maxHeight }) => [maxHeight * 0.94]}
      header={
        <BottomSheetHeader
          title="Select reminder"
          leftSideActionLabel="Back"
          leftSideActionOnClick={handleCloseBottomSheet}
        />
      }
    >
      <PageWrapper sidesOnly>
        <div className="container mx-auto flex flex-col justify-between h-full pb-10 pt-7  ">
          <div id="frequencyContent" className="w-full block">
            <TimeSpinner
              value={reminder.time}
              numberValue={false}
              onChange={(value) => {
                if (value) {
                  handleChange('time', value.text);
                }
              }}
            />
            <DaysSelection />
          </div>
          <div className={'relative top-0'}>
            <Button
              onClick={() => onDelete(reminder)}
              buttonType={'btn-tertiary'}
              label="Delete Reminder"
            />
          </div>
        </div>
      </PageWrapper>
    </BottomSheet>
  );
};
