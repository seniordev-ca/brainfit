import { PageWrapper } from 'Components/PageWrapper/PageWrapper';
import { ReactElement, useState } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { DialogProps } from 'types/types';
import { ThemePicker } from 'Components/ThemePicker/ThemePicker';
import { BottomSheetHeader } from 'Components/BottomSheetHeader/BottomSheetHeader';
//import { ReactComponent as IconCheck } from '../../img/icon_check.svg';

export interface TermsContentProps {
  pillar: string;
}

export const Appearance = ({ open, setOpen }: DialogProps): ReactElement => {
  const [colour, setColour] = useState('red');

  const newAppearanceHeader = (): ReactElement => {
    return (
      <BottomSheetHeader title='Appearance' leftSideActionLabel='Back' leftSideActionOnClick={() => setOpen(false)} />
    );
  };

  return (
    <BottomSheet header={newAppearanceHeader()} open={open}
      defaultSnap={({ maxHeight }) => maxHeight * 0.94}
      snapPoints={({ maxHeight }) => [
        maxHeight * 0.94
      ]}>
      <PageWrapper sidesOnly>
        <ThemePicker colour={colour} setColour={setColour} mono={true} />
        <br />
        <br />
      </PageWrapper>
    </BottomSheet>
  );
};
