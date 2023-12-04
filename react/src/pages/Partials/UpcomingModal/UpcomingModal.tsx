import { SegmentedControl } from 'Components/SegmentedControl/SegmentedControl';
import { ReactElement, useContext, useMemo, useState } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { DialogProps, HabitPillarFilter } from 'types/types';
// import {
//   default as networkHelper,
//   default as NetworkHelper
// } from 'helpers/web/networkHelper';
import { BottomSheetHeader } from 'Components/BottomSheetHeader/BottomSheetHeader';
import { BottomVisibilityObserver } from 'Components/BottomVisibilityObserver/BottomVisibilityObserver';
import { ListGroup } from 'Components/ListGroup/ListGroup';
import { PageWrapper } from 'Components/PageWrapper/PageWrapper';
import { PillarFilter } from 'Components/PillarFilter/PillarFilter';
import { CustomHabitContext } from 'contexts/customhabit.context';
import { useUserHabits } from 'helpers/stateHelper';
import {
  daysOfWeek,
  displayStatusString,
  habitFrequencyToDisplayText,
  HabitListItem,
  isHabitPillar
} from 'helpers/utils';
import _ from 'lodash';
import { Habit } from 'models/habit';
import moment from 'moment';

export const UpcomingModal = ({ open, setOpen }: DialogProps): ReactElement => {
  const { habits: allHabits } = useUserHabits();

  // MIND-667
  const userHabits = useMemo(
    () => allHabits?.filter((h) => h.status !== 'Archived'),
    [allHabits]
  );

  const { setInterfaceOpen, setCustomHabit } = useContext(CustomHabitContext);

  const [pillarFilter, setPillarFilter] = useState<HabitPillarFilter>('all');

  const [pageState, setPageState] = useState('Daily');
  const [dailyMaxIndex, setDailyMaxIndex] = useState(7);
  const [weeklyMaxIndex, setWeeklyMaxIndex] = useState(4);
  const [monthlyMaxIndex, setMonthlyMaxIndex] = useState(4);
  const [segControlIndex, setSegControlIndex] = useState(0);

  const onClose = () => {
    setOpen(false);
    setSegControlIndex(0);
    setPageState('Daily');
  };

  const Header = (): ReactElement => {
    return (
      <BottomSheetHeader
        title="Upcoming"
        leftSideActionLabel="Back"
        leftSideActionOnClick={onClose}
      />
    );
  };

  const getDaily = (): ReactElement[] => {
    let listGroups: ReactElement[] = [];

    for (let i = 0; i < dailyMaxIndex; i++) {
      let date: string = '';
      const dateN = moment().add(i, 'day').valueOf();

      if (i === 0) {
        date = 'Today';
      } else if (i === 1) {
        date = 'Tomorrow';
      } else {
        date = moment().add(i, 'day').format('MMM D');
      }

      let listItems = userHabits;
      if (pillarFilter !== 'all' && pillarFilter !== 'archived') {
        listItems = listItems?.filter((item: Habit) =>
          item.pillars.includes(pillarFilter)
        );
      }

      let dayListItems = listItems
        ?.filter(
          (item: Habit) =>
            (item.isScheduledFor(dateN) && item.frequencyUnit === 'day') ||
            (item.isScheduledFor(dateN) &&
              item.isShowingSpecificallyForDate(dateN))
        )
        .map((item: Habit) => {
          const itemOnClick = () => {
            setCustomHabit(item);
            setInterfaceOpen('customHabitOpen', true);
          };

          return (
            <HabitListItem
              sublabel={displayStatusString(item)}
              onClick={itemOnClick}
              habit={item}
            />
          );
        });

      let listGroup = <ListGroup heading={date} items={dayListItems} />;
      listGroups.push(listGroup);
    }

    return listGroups;
  };

  const getWeekly = (): ReactElement[] => {
    let listGroups: ReactElement[] = [];

    for (let i = 0; i < weeklyMaxIndex; i++) {
      let date: string = '';

      if (i === 0) {
        date = 'This week';
      } else if (i === 1) {
        date = 'Next week';
      } else {
        let tempDate = moment().startOf('week').add(i, 'weeks');
        let firstDate = tempDate.startOf('week').format('MMMM D');
        let endDate = tempDate.endOf('week').format('D');
        date = firstDate + '-' + endDate;
      }

      const startOfDate = moment().startOf('week').add(i, 'week');

      const dateN = startOfDate.clone().add(i, 'weeks').valueOf();

      let listItems = userHabits;
      if (isHabitPillar(pillarFilter)) {
        listItems = listItems?.filter((item: Habit) =>
          item.pillars.includes(pillarFilter)
        );
      }
      const allSevenDays = _.range(0, 7).map((n) =>
        startOfDate.clone().add(n, 'day').valueOf()
      );

      listItems = listItems?.filter((item: Habit) => {
        if (item.isScheduledFor(dateN) && item.frequencyUnit !== 'month') {
          return true;
        }
        for (let i = 0; i < allSevenDays.length; i += 1) {
          const theDate = allSevenDays[i];
          if (
            item.isShowingSpecificallyForDate(theDate) &&
            item.isScheduledFor(theDate)
          ) {
            return true;
          }
        }
        return false;
      });

      // listItems = listItems?.filter((item: Habit) => {
      //   if (item.endDate < currentTime) {
      //     return false;
      //   }
      //   if (item.frequencyUnit === 'month' && item.frequencyDays.length === 7) {
      //     return false;
      //   }
      //   return true;
      // });

      let weekListItems = listItems.map((item: Habit) => {
        let sublabel = displayStatusString(item);

        if (item.frequencyUnit === 'day' && item.frequencyDays.length === 7) {
          sublabel = sublabel.concat(
            ` ${habitFrequencyToDisplayText(
              item.frequencyUnit,
              item.frequencyUnitQuantity
            ).toLowerCase()}`
          );
        } else if (item.frequencyDays.length !== 7) {
          sublabel = sublabel.concat(
            ' on ' + item.frequencyDays?.map((d) => daysOfWeek[d]).join(', ')
          );
        }

        const itemOnClick = () => {
          setCustomHabit(item);
          setInterfaceOpen('customHabitOpen', true);
        };

        return (
          <HabitListItem
            sublabel={sublabel}
            onClick={itemOnClick}
            habit={item}
          />
        );
      });

      let listGroup = <ListGroup heading={date} items={weekListItems} />;
      listGroups.push(listGroup);
    }

    return listGroups;
  };

  const getMonthly = (): ReactElement[] => {
    let listGroups: ReactElement[] = [];

    for (let i = 0; i < monthlyMaxIndex; i++) {
      let date: string = '';

      if (i === 0) {
        date = 'This month';
      } else if (i === 1) {
        date = 'Next month';
      } else {
        date = moment().add(i, 'months').format('MMMM');
      }

      const currentTime = moment().unix();
      let listItems = userHabits;
      if (isHabitPillar(pillarFilter)) {
        listItems = listItems?.filter((item: Habit) =>
          item.pillars.includes(pillarFilter)
        );
      }

      listItems = listItems?.filter((item: Habit) => {
        if (item.endDate < currentTime) {
          return false;
        }
        return true;
      });

      let weekListItems = listItems.map((item: Habit) => {
        let sublabel = displayStatusString(item);

        if (item.frequencyUnit === 'day' && item.frequencyDays.length === 7) {
          sublabel = sublabel.concat(
            ` ${habitFrequencyToDisplayText(
              item.frequencyUnit,
              item.frequencyUnitQuantity
            ).toLowerCase()}`
          );
        } else if (item.frequencyUnit === 'week') {
          if (item.frequencyDays.length === 7) {
            sublabel = sublabel.concat(
              ` ${habitFrequencyToDisplayText(
                item.frequencyUnit,
                item.frequencyUnitQuantity
              ).toLowerCase()}`
            );
          } else {
            sublabel = sublabel.concat(
              ' weekly on ' +
              item.frequencyDays?.map((d) => daysOfWeek[d]).join(', ')
            );
          }
        } else if (item.frequencyDays.length !== 7) {
          sublabel = sublabel.concat(
            ' on ' + item.frequencyDays?.map((d) => daysOfWeek[d]).join(', ')
          );
        }

        const itemOnClick = () => {
          setCustomHabit(item);
          setInterfaceOpen('customHabitOpen', true);
        };
        return (
          <HabitListItem
            sublabel={sublabel}
            onClick={itemOnClick}
            habit={item}
          />
        );
      });

      let listGroup = <ListGroup heading={date} items={weekListItems} />;
      listGroups.push(listGroup);
    }

    return listGroups;
  };

  const displayUpcomingData = (): ReactElement => {
    let upComing: ReactElement[] = [];
    if (pageState === 'Daily') {
      upComing = getDaily();
    } else if (pageState === 'Weekly') {
      upComing = getWeekly();
    } else if (pageState === 'Monthly') {
      upComing = getMonthly();
    }

    return (
      <div>
        {upComing.map((item, i: number) => {
          return (
            <div key={i + 1} className="mb-4">
              {item}
            </div>
          );
        })}
      </div>
    );
  };

  const onSelectChange = (index: number): void => {
    setSegControlIndex(index);
    if (index === 0) {
      setPageState('Daily');
    }

    if (index === 1) {
      setPageState('Weekly');
    }

    if (index === 2) {
      setPageState('Monthly');
    }
  };

  const getMoreData = () => {
    if (pageState === 'Daily') {
      setDailyMaxIndex(dailyMaxIndex + 7);
    }

    if (pageState === 'Weekly') {
      setWeeklyMaxIndex(weeklyMaxIndex + 4);
    }

    if (pageState === 'Monthly') {
      setMonthlyMaxIndex(monthlyMaxIndex + 4);
    }
  };

  return (
    <BottomSheet
      header={Header()}
      open={open}
      onSpringStart={(ev) => {
        if (ev.type === 'CLOSE') {
          setWeeklyMaxIndex(0);
          setDailyMaxIndex(0);
          setMonthlyMaxIndex(0);
        }
      }}
      defaultSnap={({ maxHeight }) => maxHeight * 0.94}
      snapPoints={({ maxHeight }) => [maxHeight * 0.94]}
    >
      <BottomVisibilityObserver onBottomVisible={() => getMoreData()}>
        <PageWrapper sidesOnly>
          <div className="p-2"></div>
          <SegmentedControl
            optionLabels={['Date', 'Weekly', 'Monthly']}
            onOptionSelected={onSelectChange}
            indexSelected={segControlIndex}
          />
          <br />
          <PillarFilter onPillarChanged={(p) => setPillarFilter(p)} />
          <br />
          {displayUpcomingData()}
          {/* <div className="text-center pb-4">
            <Button label="More data" onClick={getMoreData} />
          </div> */}
        </PageWrapper>
      </BottomVisibilityObserver>
    </BottomSheet>
  );
};
