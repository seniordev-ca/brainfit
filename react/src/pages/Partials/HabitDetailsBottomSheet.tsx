import { HabitComplete } from 'Components/HabitComplete/HabitComplete';
import { HabitIcon } from 'Components/HabitIcon/HabitIcon';
import { ListGroup } from 'Components/ListGroup/ListGroup';
import { ListItem } from 'Components/ListItem/ListItem';
import { PageWrapper } from 'Components/PageWrapper/PageWrapper';
import { StatsChartWithHistory } from 'Components/StatsChartWithHistory/StatsChartWithHistory';
import { StatsGroup } from 'Components/StatsGroup/StatsGroup';
import { Typography } from 'Components/Typography/Typography';
import { CustomHabitContext } from 'contexts/customhabit.context';
import {
  displayStatusAndGoalString,
  displayStatusString,
  habitFrequencyToDisplayText,
  habitIcon
} from 'helpers/utils';
import _ from 'lodash';
import { Activity } from 'models/activity';
import { Habit } from 'models/habit';
import moment from 'moment';
import { ReactElement, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { setDataFieldWithID } from 'slices/dataSlice';
import { DialogProps } from 'types/types';
import { HabitCompletionBottomSheet } from './HabitCompletionBottomSheet';

type HabitDetailsBottomSheetProps = DialogProps & {
  habitSelected: Habit;
};

export const HabitDetailsBottomSheet = ({
  open,
  setOpen,
  habitSelected: habit
}: HabitDetailsBottomSheetProps) => {
  const dispatch = useDispatch();
  const { setCustomHabit, setInterfaceOpen } = useContext(CustomHabitContext);

  const [history, setHistory] = useState<Activity[]>([]);

  useEffect(() => {
    if (!habit.id) {
      setOpen(false);
    } else {
      setHistory(_.chain(habit.activities).takeRight(7).reverse().value());
    }
  }, [habit, setOpen]);

  // const [habitSelected, setHabitSelected] = useState<SavedHabit>();
  const [habitOptions, setHabitOptions] = useState<any>();
  const [habitCompletionOpen, setHabitCompletionOpen] = useState(false);

  const HabitHeader = (): ReactElement => {
    return (
      <div className="inline-flex justify-between w-full">
        <Typography
          typeClass={[
            'header_primary'
          ]}
          usage="body"
          content="Close"
          onClick={() => setOpen(false)}
        />
        {/* <span onClick={() => setOpen(false)}>Close</span> */}
        <div className="inline-flex gap-x-3">
          <Typography
            typeClass={[
              'header_primary'
            ]}
            usage="headingSmall"
            content="Edit"
            onClick={() => {
              setCustomHabit(habit);
              dispatch(
                setDataFieldWithID({ id: 'newHabitType', value: 'edit' })
              );
              setInterfaceOpen('customHabitOpen', true);
            }}
          />
          <Typography
            typeClass={[
              'header_primary'
            ]}
            usage="headingSmall"
            content="Share"
          />
        </div>
      </div>
    );
  };

  const handleHistoricalHabitOnClick = async (
    item: Activity,
    label: string
  ) => {
    await setHabitOptions({
      completionLabel: label,
      selectedDate: moment(item.actDate)
    });
    setHabitCompletionOpen(true);
  };

  const checkMono = (content: any) => {
    // if (data.monoOption) {
    //   console.log(data.monoOption);
    //   console.log(data.colourOption);
    //   return data.colourOption;
    // } else {
    //   return content;
    // }
    return content;
  };

  const onStartDateClicked = () => {
    setCustomHabit(habit);
    dispatch(setDataFieldWithID({ id: 'newHabitType', value: 'edit' }));
    setInterfaceOpen('customHabitOpen', true);
  };

  return (
    <BottomSheet
      id="habitDetailsBottomSheet"
      open={open}
      header={HabitHeader()}
      defaultSnap={({ maxHeight }) => maxHeight * 0.94}
      snapPoints={({ maxHeight }) => [maxHeight * 0.94]}
    >
      <PageWrapper sidesOnly>
        <div>
          <div className="text-center w-full block">
            <div className="w-full flex justify-center mt-8">
              <HabitIcon
                className="w-20 h-20"
                habitColour={checkMono(habit.colour)}
                Icon={() => habitIcon(habit.colour, habit.pillars, habit.icon)}
              />
            </div>
            {/* <div className={`w-1/4`}>
            </div> */}
            <Typography
              content={habit.pillars.map((pillar) => pillar).join(', ')}
              usage="captionRegular"
              typeClass={['opacity-50 mt-4']}
            />
            <Typography
              content={habit.title}
              usage="headingLarge"
              typeClass={[
                'mt-1 text-mom_lightMode_text-neutral dark:text-mom_darkMode_text-neutral'
              ]}
            />
            <Typography
              typeClass={['opacity-75 mt-1']}
              content={`${habit.breakHabit ? 'Max ' : ''
                }${habitFrequencyToDisplayText(
                  habit.frequencyUnit,
                  habit.frequencyUnitQuantity
                )} goal: ${displayStatusString(habit)}`}
              usage="captionRegular"
            />

            {habit && habit.completionStats && (
              <StatsGroup
                habit={habit}
                stats={habit.completionStats}
                className="mt-8"
              />
            )}

            {habit && (
              <div className="mt-8">
                <StatsChartWithHistory
                  colour={habit.colour}
                  habits={[habit]}
                  frequency={habit.frequencyUnit}
                />
              </div>
            )}
          </div>
          <Typography
            content="History"
            usage="headingMedium"
            typeClass={['mt-8']}
          />
          <div className="mt-4">
            <ListGroup
              items={history.map((item) => {
                const actDate = moment(item.actDate);
                const now = moment();
                let label = moment.weekdaysShort()[actDate.day()];

                if (habit.frequencyUnit === 'day') {
                  if (now.isSame(actDate, 'day')) {
                    label = 'Today';
                  } else if (now.isSame(now.clone().subtract(1, 'd'), 'd')) {
                    label = 'Yesterday';
                  }
                } else if (habit.frequencyUnit === 'week') {
                  if (now.isSame(actDate, 'week')) {
                    label = 'This Week';
                  } else {
                    const sDate = moment(item.actDate);

                    label = `${sDate
                      .startOf('week')
                      .toDate()
                      .toLocaleDateString()} - ${sDate
                        .endOf('week')
                        .toDate()
                        .toLocaleDateString()}`;
                  }
                } else if (habit.frequencyUnit === 'month') {
                  if (now.isSame(actDate, 'month')) {
                    label = 'This Month';
                  } else {
                    const sDate = moment(item.actDate);

                    label = `${moment.months()[sDate.month()]} ${sDate.year()}`;
                  }
                }

                return (
                  <HabitComplete
                    key={`historical-progress-${item.id}`}
                    title={label}
                    habit={habit}
                    progress={item.completion}
                    colour={habit.colour || 'default'}
                    onClick={() => handleHistoricalHabitOnClick(item, label)}
                    sublabel={displayStatusAndGoalString(
                      habit,
                      item.progress || 0,
                      item.skipped
                    )}
                  />
                );
              })}
              listGroupType="listGroup_primary"
            />
            {/* <ListItem
              className='mt-2'
              label='Days to display (change to date)'
              chevron={true}
              suffix={
                <Input
                  inputClass='text-right focus:border-none'
                  type='number'
                  id='displayDays'
                  defaultValue={historySettings.daysToDisplay}
                  onBlur={(e) => setHistorySettings((prev: any) => ({
                    ...prev,
                    daysToDisplay: e.target.value
                  }))}
                />
              } /> */}
          </div>
          <div className={'mt-4'}>
            <ListGroup
              items={[
                <ListItem
                  onClick={() => onStartDateClicked()}
                  chevron
                  label={'Start Date'}
                  suffix={moment(habit.startDate).format('MMMM DD')}
                />
              ]}
            />
          </div>
        </div>
      </PageWrapper>

      <HabitCompletionBottomSheet
        habitSelected={habit}
        open={habitCompletionOpen}
        setOpen={setHabitCompletionOpen}
        // setHabitSelected={setHabitSelected}
        {...habitOptions}
      />
    </BottomSheet>
  );
};
