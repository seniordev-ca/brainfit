import { BottomSheetHeader } from 'Components/BottomSheetHeader/BottomSheetHeader';
import { PageWrapper } from 'Components/PageWrapper/PageWrapper';
import { CustomHabitContext } from 'contexts/customhabit.context';
import { ReactElement, useContext } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { DialogProps } from 'types/types';
import { ColourPicker } from '../../Components/ColourPicker/ColourPicker';

export const ColourPickerModal = ({
  open,
  setOpen
}: DialogProps): ReactElement => {

  const { habit, setCustomHabitValue } = useContext(CustomHabitContext);

  const selectedColourWrapper = (colour: string) => {
    setCustomHabitValue('colour', colour);
  }

  const newColourPickerHeader = (): ReactElement => {
    return (
      <BottomSheetHeader title='Select colour' leftSideActionLabel='Close' leftSideActionOnClick={() => setOpen(false)} />
    );
  };

  return (
    <BottomSheet header={newColourPickerHeader()} open={open}
      defaultSnap={({ maxHeight }) => maxHeight * 0.94}
      snapPoints={({ maxHeight }) => [
        maxHeight * 0.94
      ]}>
      <PageWrapper sidesOnly>
        <br />
        <br />
        <ColourPicker selectedColour={habit.colour} setSelectedColour={selectedColourWrapper} />
        <br />
        <br />
        <br />
        <br />
      </PageWrapper>
    </BottomSheet>
  );
};
