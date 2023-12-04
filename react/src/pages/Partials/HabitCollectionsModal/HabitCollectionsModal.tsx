import { Capacitor } from '@capacitor/core';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { Button } from 'Components/Button/Button';
import { ListGroup } from 'Components/ListGroup/ListGroup';
import { ListItem } from 'Components/ListItem/ListItem';
import { Toast } from 'Components/Toast/Toast';
import { Typography } from 'Components/Typography/Typography';
import { CustomHabitContext } from 'contexts/customhabit.context';
import { SyncHelper } from 'helpers/syncHelper';
import { Habit } from 'models/habit';
import { ReactElement, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { getData } from 'slices/dataSlice';
import { DialogProps } from 'types/types';
import './HabitCollectionsModal.scss';

export const HabitCollectionsModal = ({
  open,
  setOpen
}: DialogProps): ReactElement => {
  const [habitGroupUi, setHabitGroupUi] = useState<ReactElement>(<></>);
  const platform = Capacitor.getPlatform();
  const { data } = useSelector(getData);
  const [confirmationToast, setConfirmationToast] = useState(<></>);
  const dailyData: any = data.dailyData || [];

  const { collection, setCustomHabit, setInterfaceOpen } =
    useContext(CustomHabitContext);

  useEffect(() => {
    if (open === true && collection !== undefined) {
      let tempHabits = collection.habits;

      tempHabits = tempHabits.filter((habit) => {
        for (let i = 0; i < dailyData.length; i++) {
          if (habit.fields.title === dailyData[i].title) {
            return false;
          }
        }
        return true;
      });

      collection.habits = tempHabits;

      let habitItems: ReactElement[] = [];
      for (let i = 0; i < collection.habits.length; i++) {
        let currentHabit = collection.habits[i];
        let icon = '';
        if (currentHabit.fields.icon !== undefined) {
          icon = currentHabit.fields.icon;
        } else {
          icon = '🔥';
        }

        const habitOnClick = () => {
          setCustomHabit(Habit.createFromContentfulHabit(currentHabit));
          setInterfaceOpen('customHabitOpen', true);
        };

        let habitItem = (
          <ListItem
            onClick={habitOnClick}
            prefix={icon}
            key={currentHabit.fields.title}
            label={currentHabit.fields.title}
            chevron
          />
        );
        habitItems.push(habitItem);
      }

      let habitGroup = <ListGroup key={collection.title} items={habitItems} />;
      setHabitGroupUi(habitGroup);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection, dailyData]);

  const header = (): ReactElement => {
    return (
      <div>
        <p
          className={['sheet-header', platform !== 'web' ? 'pt-7' : ''].join(
            ' '
          )}
        >
          <span className="float-left" onClick={() => setOpen(false)}>
            Close
          </span>
          <span className="text-center">
            <Typography content={collection?.title} />
          </span>
        </p>
      </div>
    );
  };

  const displayHabitUi = (): ReactElement => {
    return <div key={'displayHabit'}>{habitGroupUi}</div>;
  };

  const addAllHabits = async () => {
    if (collection) {
      await SyncHelper.putManyHabits(
        collection.habits.map((c) => Habit.createFromContentfulHabit(c))
      );

      setConfirmationToast(
        <Toast type="success" content="Habits successfully added" fadeOut />
      );
    }
  };

  return (
    <BottomSheet open={open} header={header()}>
      <div>
        <img
          className="image-cls"
          alt="contentful content"
          src={`https:${collection?.themeImage.fields.file.url}`}
        ></img>
      </div>
      <p>{collection ? documentToHtmlString(collection.description) : ''}</p>
      {displayHabitUi()}
      <br />
      <div className="text-center">
        <Button onClick={addAllHabits} label="Add them all" />
      </div>
      <br />
      <div className="toast-bottom">{confirmationToast}</div>
    </BottomSheet>
  );
};
