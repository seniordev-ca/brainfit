import { Capacitor } from '@capacitor/core';
import { BottomSheetHeader } from 'Components/BottomSheetHeader/BottomSheetHeader';
import { ExpandedCalendar } from 'Components/ExpandedCalendar/ExpandedCalendar';
import { PageWrapper } from 'Components/PageWrapper/PageWrapper';
import { CustomHabitContext } from 'contexts/customhabit.context';
import { useDates } from 'helpers/stateHelper';
import { Moment } from 'moment';
import { useContext, useState } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { SpringEvent } from 'react-spring-bottom-sheet/dist/types';
import { DialogProps } from 'types/types';

interface CalendarSheetProps extends DialogProps {
  onDayClick?: any;
}

export const CalendarBottomSheet = ({ open, setOpen, ...props }: CalendarSheetProps) => {
  const platform = Capacitor.getPlatform();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showCalendar, setShowCalendar] = useState(false);
  const { dates, setDates } = useDates();

  const onDayClickDefault = (date: Moment) => {
    setDates({
      ...dates,
      selected: date
    });
    setOpen(false);
  }

  const { setInterfaceOpen } = useContext(CustomHabitContext);

  return (
    <BottomSheet
      open={open}
      className="z-50 pb-10 h-screen"
      onSpringEnd={(e: SpringEvent) => {
        if (e.type === 'OPEN') {
          setShowCalendar(true);
        }
      }}
      onSpringStart={(e: SpringEvent) => {
        if (e.type === 'CLOSE') {
          setShowCalendar(false);
        }
      }}
      defaultSnap={({ maxHeight }) => maxHeight * 0.94}
      snapPoints={({ maxHeight }) => [
        maxHeight * 0.94
      ]}
      header={
        <BottomSheetHeader title='History' leftSideActionLabel='Done' leftSideActionOnClick={() => setOpen(false)} rightSideActionLabel='Upcoming' rightSideActionOnClick={() => setInterfaceOpen('upcomingOpen', true)} />
      }
    >
      <PageWrapper sidesOnly>
        {/* For whatever reason this sheet would'nt render without an element. */}
        <div></div>

        <ExpandedCalendar
          onDayClick={props.onDayClick || onDayClickDefault}
          showCalendar={true}
          dayClass={platform === 'ios' ? 'w-12 h-12' : ''}
        />
      </PageWrapper>
    </BottomSheet>
  );
};
