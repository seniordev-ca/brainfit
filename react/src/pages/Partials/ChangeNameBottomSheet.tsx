import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BottomSheet } from 'react-spring-bottom-sheet';

import { DialogProps } from 'types/types';
import { getData, answerQuestion } from 'slices/dataSlice';

import { PageWrapper } from 'Components/PageWrapper/PageWrapper';
import { Input } from 'Components/Input/Input';
import { ListItem } from 'Components/ListItem/ListItem'
import { BottomSheetHeader } from 'Components/BottomSheetHeader/BottomSheetHeader';



export const ChangeNameBottomSheet = ({ open, setOpen }: DialogProps) => {
  const dispatch = useDispatch();
  const { data } = useSelector(getData);
  const defaultName = data.questionnaireAnswers?.[0] ?? '';
  const [name, setName] = useState<string>(defaultName);

  useEffect(() => {
    setName(defaultName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onSave = async () => {
    dispatch(answerQuestion({ answerIndex: 0, value: name?.trim() }));
    setOpen(false);
  }

  return (
    <BottomSheet
      id='changeNameBottomSheet'
      open={open}
      defaultSnap={({ maxHeight }) => maxHeight * 0.94}
      snapPoints={({ maxHeight }) => [
        maxHeight * 0.94
      ]}
      header={
        <BottomSheetHeader title={defaultName ? 'Change name' : 'Add name'} leftSideActionLabel='Back' leftSideActionOnClick={() => setOpen(false)} rightSideActionLabel="Save" rightSideActionOnClick={onSave} />
      } >
      <PageWrapper sidesOnly>
        <div id='changeNameContent' className='w-full block text-left mt-8'>
          <ListItem
            listType='list-primary'
            label={
              <Input
                id='input'
                type='text'
                value={name}
                defaultValue={name}
                onChange={e => setName(e.target.value)}
              />
            }
          />
        </div>
      </PageWrapper>
    </BottomSheet>
  );
}
