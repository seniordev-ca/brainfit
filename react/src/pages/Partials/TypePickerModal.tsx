import { ReactElement, useContext } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { ListGroup } from 'Components/ListGroup/ListGroup';
import { ListItem } from 'Components/ListItem/ListItem';
import { Icon } from '@iconify/react';
import { CustomHabitContext } from 'contexts/customhabit.context';
import { DialogProps } from 'types/types';
import { PageWrapper } from 'Components/PageWrapper/PageWrapper';
import { BottomSheetHeader } from 'Components/BottomSheetHeader/BottomSheetHeader';

export const TypePickerModal = ({
  open,
  setOpen
}: DialogProps): ReactElement => {
  const typeList = [
    {
      break: true,
      text: 'Break a habit'
    },
    {
      break: false,
      text: 'Build a habit'
    }
  ];

  const { habit, setCustomHabitValue } = useContext(CustomHabitContext);

  const listType = () =>
    typeList.map((type, _idx) => (
      <ListItem
        label={type.text}
        chevron={false}
        onClick={() => setCustomHabitValue('breakHabit', type.break)}
        suffix={
          type.break === habit?.breakHabit ? (
            <Icon
              icon="eva:checkmark-circle-2-outline"
              width="75"
              height="75"
              inline={true}
            />
          ) : (
            <></>
          )
        }
      />
    ));

  const newTypePickerHeader = (): ReactElement => {
    return (
      <BottomSheetHeader title='Select type' leftSideActionLabel='Close' leftSideActionOnClick={() => setOpen(false)} />
    );
  };

  return (
    <BottomSheet header={newTypePickerHeader()} open={open}
      defaultSnap={({ maxHeight }) => maxHeight * 0.94}
      snapPoints={({ maxHeight }) => [
        maxHeight * 0.94
      ]}>
      <PageWrapper sidesOnly>
        {/* @ts-ignore */}
        <ListGroup items={listType()} />
      </PageWrapper>
    </BottomSheet>
  );
};
