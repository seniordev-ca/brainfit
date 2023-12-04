import { BottomSheetHeader } from 'Components/BottomSheetHeader/BottomSheetHeader';
import { ListGroup } from 'Components/ListGroup/ListGroup';
import { ListItem } from 'Components/ListItem/ListItem';
import { PageWrapper } from 'Components/PageWrapper/PageWrapper';
import { Typography } from 'Components/Typography/Typography';
import localization from 'helpers/localizationHelper';
import { ReactComponent as CheckSVG } from 'img/check-bold.svg';
import { Habit } from 'models/habit';
import { ReactElement, useEffect, useState } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { DialogProps, HabitStatus } from 'types/types';

type Props = DialogProps & {
  habit: Habit;
  onStatusSelected: (status: HabitStatus) => void;
};

export const HabitStatusPickerModal = ({
  open,
  setOpen,
  habit,
  onStatusSelected
}: Props): ReactElement => {
  const typeList: HabitStatus[] = ['Active', 'Paused', 'Archived'];
  const [status, setStatus] = useState<HabitStatus>(habit.status);

  useEffect(() => {
    setStatus(habit.status);
  }, [habit.status]);

  function listType() {
    var list: JSX.Element[] = [];
    typeList.forEach((currentType: any) => {
      list.push(
        <ListItem
          label={currentType}
          chevron={false}
          onClick={() => {
            setStatus(currentType);
          }}
          suffix={currentType === status ? <CheckSVG /> : <></>}
        />
      );
    });

    return list;
  }

  const newTypePickerHeader = (): ReactElement => {
    return (
      <BottomSheetHeader
        title="Set status"
        leftSideActionLabel="Back"
        leftSideActionOnClick={() => {
          onStatusSelected(status);
          // setCustomHabitValue('status', status);
          setOpen(false);
        }}
      />
    );
  };

  return (
    <BottomSheet
      header={newTypePickerHeader()}
      open={open}
      defaultSnap={({ maxHeight }) => maxHeight * 0.94}
      snapPoints={({ maxHeight }) => [maxHeight * 0.94]}
    >
      <PageWrapper sidesOnly>
        <div className={'p-2 h-full'}>
          <div>
            <ListGroup items={listType()} listGroupType="listGroup_primary" />
          </div>
          <div
            className={
              'mt-2 text-sm text-mom_lightMode_text-primary dark:text-mom_darkMode_text-primary'
            }
          >
            {status !== 'Active' && (
              <Typography
                usage="body"
                typeClass={['opacity-75 text-mom_lightMode_text-neutral']}
                content={
                  localization.getString(`${status}HabitStatusExplainer`) || ''
                }
              />
            )}
          </div>
        </div>
      </PageWrapper>
    </BottomSheet>
  );
};
