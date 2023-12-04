import { BottomSheet } from 'react-spring-bottom-sheet';
import { DialogProps } from 'types/types';
import { PageWrapper } from 'Components/PageWrapper/PageWrapper';
import { DurationPicker } from 'Components/DurationPicker/DurationPicker';
import { BottomSheetHeader } from 'Components/BottomSheetHeader/BottomSheetHeader';
import { useContext } from 'react';
import { CustomHabitContext } from 'contexts/customhabit.context';

export const DurationPickerBottomSheet = ({ open, setOpen }: DialogProps) => {
  const { habit } = useContext(CustomHabitContext);
  return (
    <BottomSheet
      id="DurationPickerBottomSheet"
      className="z-50 pb-10 h-screen"
      open={open}
      defaultSnap={({ maxHeight }) => maxHeight * 0.94}
      snapPoints={({ maxHeight }) => [maxHeight * 0.94]}
      header={
        <BottomSheetHeader
          title={`Set ${habit.breakHabit ? 'max time' : 'time'}`}
          leftSideActionLabel="Back"
          leftSideActionOnClick={() => setOpen(false)}
        />
      }
    >
      <PageWrapper sidesOnly>
        <DurationPicker />
      </PageWrapper>
    </BottomSheet>
  );
};
