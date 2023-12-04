import { Icon } from '@iconify/react';
import { BottomSheetHeader } from 'Components/BottomSheetHeader/BottomSheetHeader';
import { Input } from 'Components/Input/Input';
import { ListGroup } from 'Components/ListGroup/ListGroup';
import { ListItem } from 'Components/ListItem/ListItem';
import { PageWrapper } from 'Components/PageWrapper/PageWrapper';
import { CustomHabitContext } from 'contexts/customhabit.context';
import { ReactElement, useContext, useEffect, useState } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { DialogProps } from 'types/types';

export const UnitPickerModal = ({
  open,
  setOpen
}: DialogProps): ReactElement => {
  const { habit, setCustomHabitValue } = useContext(CustomHabitContext);

  const customUnits = () =>
    habit.units && !['Count', 'Time'].includes(habit.units);

  const [selected, setSelected] = useState<'Count' | 'Time' | 'Custom'>(
    'Count'
  );

  const unitList: string[] = ['Count', 'Time', 'Custom'];
  const [text, setText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  function listUnit() {
    var list: JSX.Element[] = [];
    unitList.forEach((currentUnit) => {
      list.push(
        <ListItem
          label={`${habit.breakHabit ? 'Max ' : ''}${currentUnit}`}
          chevron={false}
          onClick={() => {
            if (currentUnit === 'Custom') {
              setCustomHabitValue('units', text);
            } else {
              setCustomHabitValue('units', currentUnit);
            }
            setCustomHabitValue('targetValue', 5);
            setSelected(currentUnit as any);
          }}
          suffix={
            selected === currentUnit ? (
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
      );
    });

    return list;
  }

  const UnitPickerHeaderClose = () => {
    if (selected === 'Custom' && !text) {
      setErrorMessage('Please input a custom habit name');
      return;
    }
    setText('');
    setOpen(false);
  };

  const UnitPickerHeader = (): ReactElement => {
    return (
      <BottomSheetHeader title='Units' leftSideActionLabel='Back' leftSideActionOnClick={UnitPickerHeaderClose} />
    );
  };

  const onSubmit = async (formObj: any) => {
    const val = formObj.target.value;
    setCustomHabitValue('units', val);
    setText(val);
    setErrorMessage('');

    if (!val && customUnits()) {
      setErrorMessage('Please input a custom habit name');
    }
  };
  useEffect(() => {
    if (open) {
      setText('');

      if (customUnits()) {
        setText(habit.units);
        setSelected('Custom')
      }
      else if (habit.units.includes('Count')) {
        setSelected('Count')
      }
      else if (habit.units.includes('Time')) {
        setSelected('Time')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <BottomSheet header={UnitPickerHeader()} open={open}
      defaultSnap={({ maxHeight }) => maxHeight * 0.94}
      snapPoints={({ maxHeight }) => [
        maxHeight * 0.94
      ]}>
      <PageWrapper sidesOnly keyboardPadding>
        <div className="my-8">
          <ListGroup listGroupType="listGroup_primary" items={listUnit()} />
          {selected === 'Custom' ? (
            <div data-testid="textbar" className="my-4">
              <ListItem
                listType="list-primary"
                label={
                  <Input
                    value={text}
                    placeholder="Enter custom unit name"
                    id="unitName"
                    errorText={errorMessage}
                    onChange={(e: any) => onSubmit(e)}
                  />
                }
              />
            </div>
          ) : (
            <></>
          )}
        </div>
      </PageWrapper>
    </BottomSheet>
  );
};
