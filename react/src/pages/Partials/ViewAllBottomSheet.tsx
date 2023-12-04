import { BottomSheetHeader } from 'Components/BottomSheetHeader/BottomSheetHeader';
import { HabitIcon } from 'Components/HabitIcon/HabitIcon';
import { ListGroup } from 'Components/ListGroup/ListGroup';
import { ListItem } from 'Components/ListItem/ListItem';
import { PageWrapper } from 'Components/PageWrapper/PageWrapper';
import { pillars } from 'constants/pillars';
import { CustomHabitContext } from 'contexts/customhabit.context';
import { useFilteredContentfulHabits } from 'helpers/contentfulHelper';
import { habitFrequencyToDisplayText, habitIcon } from 'helpers/utils';
import { Habit } from 'models/habit';
import { ReactElement, useContext, useEffect, useState } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';

interface ViewAllBottomSheetProps {
  open: any;
  setOpen: any;
}

export const ViewAllBottomSheet = ({
  open,
  setOpen
}: ViewAllBottomSheetProps) => {
  const { setInterfaceOpen, setCustomHabit, pillar } =
    useContext(CustomHabitContext);

  const { habits: filtered } = useFilteredContentfulHabits();

  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    if (filtered) {
      // MIND-666
      setHabits(
        filtered?.filter((h) => (!pillar ? h : h.pillars.includes(pillar))) ||
        []
      );
    }
  }, [filtered, pillar]);

  function capitalizeFirstLetter(text: string | undefined) {
    return text ? text.charAt(0).toUpperCase() + text.slice(1) : '';
  }

  const newViewAllHeader = (): ReactElement => {
    return (
      <BottomSheetHeader
        title={capitalizeFirstLetter(pillar)}
        leftSideActionLabel="Back"
        leftSideActionOnClick={() => setOpen(false)}
      />
    );
  };

  const checkMono = (content: any) => {
    // if (data.monoOption) {
    //   return data.colourOption;
    // } else {
    //   return firstPillar(content) as typeof pillars;
    // }
    return firstPillar(content) as typeof pillars;
  };

  const firstPillar = (icon: string): string => {
    const result = icon.split(',');
    return result[0];
  };

  const listGroupForPillar = (): ReactElement => {
    let importantHabits: React.ReactElement[] = [];
    let buildHabits: React.ReactElement[] = [];
    let breakHabits: React.ReactElement[] = [];

    habits.forEach((habit) => {
      const CurrentIcon = (): ReactElement => {
        return (
          <div className="display-default-icon relative left-1/4 right-1/4">
            {habitIcon(habit.colour, habit.pillars, habit.icon)}
          </div>
        );
      };

      const item = (
        <ListItem
          prefix={
            habit.pillars[0] ? (
              <HabitIcon
                Icon={CurrentIcon}
                habitColour={checkMono(habit.pillars[0]) as typeof pillar}
              />
            ) : (
              <></>
            )
          }
          label={habit.title}
          sublabel={habitFrequencyToDisplayText(habit.frequencyUnit, habit.frequencyUnitQuantity)}
          data-testid={habit.title}
          chevron={true}
          onClick={() => {
            setCustomHabit(habit);
            setInterfaceOpen('customHabitOpen', true);
          }}
        />
      );
      if (habit.important) {
        importantHabits.push(item);
      } else if (habit.breakHabit) {
        breakHabits.push(item);
      } else {
        buildHabits.push(item);
      }
    });

    return (
      <div>
        {importantHabits.length > 0 && (
          <ListGroup
            heading="The most important habits"
            items={importantHabits}
          />
        )}
        {buildHabits.length > 0 && (
          <ListGroup heading="Build a habit" items={buildHabits} />
        )}
        {breakHabits.length > 0 && (
          <ListGroup heading="Break a habit" items={breakHabits} />
        )}
      </div>
    );
  };

  const displayHabitInfo = (): ReactElement => {
    if (habits) {
      return (
        <div>
          {listGroupForPillar()}
          <br />
        </div>
      );
    } else {
      return <></>;
    }
  };

  return (
    <BottomSheet
      id="habitCompletionBottomSheet"
      className="z-50 pb-10"
      open={open}
      header={newViewAllHeader()}
      defaultSnap={({ maxHeight }) => maxHeight * 0.94}
      snapPoints={({ maxHeight }) => [maxHeight * 0.94]}
    >
      <PageWrapper sidesOnly>
        <br />
        {displayHabitInfo()}
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </PageWrapper>
    </BottomSheet>
  );
};
