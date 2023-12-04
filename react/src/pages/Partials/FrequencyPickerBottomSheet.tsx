import { Dialog } from '@capacitor/dialog';
import { BottomSheetHeader } from 'Components/BottomSheetHeader/BottomSheetHeader';
import { DateToggleGroup } from 'Components/DateToggleGroup/DateToggleGroup';
import { ListGroup } from 'Components/ListGroup/ListGroup';
import { ListItem } from 'Components/ListItem/ListItem';
import { PageWrapper } from 'Components/PageWrapper/PageWrapper';
import { Scroller } from 'Components/Scroller/Scroller';
import { Typography } from 'Components/Typography/Typography';
import { CustomHabitContext } from 'contexts/customhabit.context';
import { ReactComponent as CheckSVG } from 'img/icon_check.svg';
import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { DialogProps, HabitFrequency } from 'types/types';

const frequencySizes = {
  day: 1,
  week: 2,
  month: 3
};

const getOrdinalNumber = (n: number) =>
  n +
  (n % 10 === 1 && n % 100 !== 11
    ? 'st'
    : n % 10 === 2 && n % 100 !== 12
      ? 'nd'
      : n % 10 === 3 && n % 100 !== 13
        ? 'rd'
        : 'th');

const frequencySpecificDateSource: any = new Array(30).fill(1).map((v, i) => ({
  value: i + 1,
  text: getOrdinalNumber(i + 1)
}));
const frequencySpecificDaySource = [
  { value: -1, text: 'day' },
  { value: 0, text: 'Sunday' },
  { value: 1, text: 'Monday' },
  { value: 2, text: 'Tuesday' },
  { value: 3, text: 'Wednesday' },
  { value: 4, text: 'Thursday' },
  { value: 5, text: 'Friday' },
  { value: 6, text: 'Saturday' }
];

export const FrequencyPickerBottomSheet = ({ open, setOpen }: DialogProps) => {
  const { setCustomHabitValue, habit } = useContext(CustomHabitContext);
  const [showDaySelection, setShowDaySelection] = useState(false);
  const [showDayPicker, setShowDayPicker] = useState(false);

  const CountScroller = (): React.ReactElement => {
    const frequencyUnitQuantitySource: any = new Array(100)
      .fill(1)
      .map((v, i) => ({ value: i + 1, text: i + 1 }));
    const isPlural =
      habit && habit.frequencyUnitQuantity && habit.frequencyUnitQuantity > 1;
    const [frequencyUnitSource] = useState([
      { value: 'day', text: `day${isPlural ? 's' : ''}` },
      { value: 'week', text: `week${isPlural ? 's' : ''}` },
      { value: 'month', text: `month${isPlural ? 's' : ''}` }
    ]);

    const handleChange = async (
      type: 'frequencyUnitQuantity' | 'frequencyUnit',
      value: any
    ) => {
      // setCustomHabitValue(type, value);
      // console.log(`${habit.frequencyUnitQuantity} ${habit.frequencyUnit}`);
      const inF: HabitFrequency = value as HabitFrequency;

      if (
        type === 'frequencyUnit' &&
        frequencySizes[habit[type]] < frequencySizes[inF]
      ) {
        const cD = moment(habit.startDate);
        const switchTo = cD.startOf(inF);

        if (!switchTo.isSame(new Date(habit.startDate), 'day')) {
          const { value: confirmed } = await Dialog.confirm({
            title: 'Confirm change',
            message: `Your start date will be moved from ${new Date(
              habit.startDate
            ).toLocaleDateString()} to ${switchTo
              .toDate()
              .toLocaleDateString()}. Are you sure?`
          });
          if (confirmed) {
            setCustomHabitValue('startDate', switchTo.valueOf());
          } else {
            return;
          }
        }
      }

      if (type === 'frequencyUnit' && value !== 'month') {
        setCustomHabitValue('frequencySpecificDate', -1);
      } else if (
        type === 'frequencyUnit' &&
        value === 'month' &&
        showDayPicker
      ) {
        setCustomHabitValue('frequencySpecificDate', 0);
      }

      if (habit[type] !== value) {
        setCustomHabitValue(type, value);
        // setHabit((prev: any) => ({
        //   ...prev,
        //   [type]: value
        // }));
      }
    };

    // useEffect(() => {
    //   if (habit && habit.frequencyUnitQuantity && ((habit.frequencyUnitQuantity === 1 && frequencyUnitSource[0].text !== 'day') || (habit.frequencyUnitQuantity > 1 && frequencyUnitSource[0].text !== 'days'))) {
    //     setFrequencyUnitSource([
    //       { value: 'day', text: `day${habit.frequencyUnitQuantity > 1 ? 's' : ''}` },
    //       { value: 'week', text: `month${habit.frequencyUnitQuantity > 1 ? 's' : ''}` },
    //       { value: 'month', text: `year${habit.frequencyUnitQuantity > 1 ? 's' : ''}` }
    //     ]);
    //   }
    //   // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [habit.frequencyUnitQuantity]);

    // useEffect(() => {
    //   if ((habit.frequencyUnit !== 'day') !== showDaySelection) {
    //     setShowDaySelection(habit.frequencyUnit !== 'day');
    //   }

    //   if (habit.frequencyUnit !== 'day' && showDaySelection === false) {
    //     setGuideText(habit.frequencyUnit === 'week' ?
    //       `Anytime goals will appear on the Home under This week.` :
    //       `Anytime goals will appear on the Home under This month.`);
    //   } else if (habit.frequencyUnit === 'day') {
    //     setGuideText('');
    //   }
    //   // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [habit.frequencyUnit])

    useEffect(() => {
      if (habit.frequencyUnit !== 'day') {
        setShowDaySelection(true);

        if (
          habit.frequencySpecificDay !== -1 ||
          habit.frequencySpecificDate !== -1
        ) {
          setShowDayPicker(true);
        }
      } else {
        setShowDaySelection(false);
        setShowDayPicker(false);
      }
    }, []);

    return (
      <div className="w-full inline-flex">
        <Scroller
          source={frequencyUnitQuantitySource}
          onChange={(value: any) => {
            handleChange('frequencyUnitQuantity', value);
          }}
          value={habit.frequencyUnitQuantity}
          type="normal"
        />
        <Scroller
          source={frequencyUnitSource}
          onChange={(value: any) => {
            setShowDaySelection(value !== 'day');
            handleChange('frequencyUnit', value);
          }}
          value={habit.frequencyUnit}
          type="normal"
        />
      </div>
    );
  };

  const DaysSelection = (): React.ReactElement => {
    // useEffect(() => {
    //   if (habit.frequencyUnit === 'week') {
    //     setGuideText(showDayPicker === false ?
    //       `Anytime goals will appear on the Home under This week.` :
    //       `On specific day goals will appear on Home under Today on the days of the week you’ve selected.`);
    //   } else if (habit.frequencyUnit === 'month') {
    //     setGuideText(showDayPicker === false ?
    //       `Anytime goals will appear on the Home under This month.` :
    //       `Specific day goals will appear on Home under Today on the days you’ve selected.`);
    //   }
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [showDayPicker])

    return (
      <>
        <ListGroup
          items={[
            <ListItem
              label="Anytime"
              listType="list-primary"
              {...(showDayPicker === false ? { suffix: <CheckSVG /> } : null)}
              onClick={() => {
                setCustomHabitValue('frequencyDays', [0, 1, 2, 3, 4, 5, 6]);
                setShowDayPicker(false);
                setCustomHabitValue('frequencySpecificDate', -1);
              }}
            />,
            <ListItem
              label="Specific days"
              listType="list-primary"
              {...(showDayPicker === true ? { suffix: <CheckSVG /> } : null)}
              onClick={() => {
                if (habit.frequencyUnit === 'month') {
                  setCustomHabitValue('frequencySpecificDate', 0);
                }
                setShowDayPicker(true);
              }}
            />
          ]}
        />
        {showDayPicker ? (
          habit.frequencyUnit === 'week' ? (
            <div className="my-5">
              <DateToggleGroup
                selectedDays={habit.frequencyDays || [0, 1, 2, 3, 4, 5, 6]}
                onSelectedDaysChanged={(value: any) =>
                  // setHabit((prev: any) => ({
                  //   ...prev,
                  //   frequencyDays: value
                  // }))
                  setCustomHabitValue('frequencyDays', value)
                }
              />
            </div>
          ) : (
            <div className="my-5">
              <OrdinalDaysScroller />
            </div>
          )
        ) : (
          <></>
        )}
      </>
    );
  };

  const OrdinalDaysScroller = (): React.ReactElement => {
    const handleChange = async (
      type: 'frequencySpecificDay' | 'frequencySpecificDate',
      value: number
    ) => {
      if (habit[type] !== value) {
        setCustomHabitValue(type, value);
        // setHabit((prev: any) => ({
        //   ...prev,
        //   [type]: value
        // }));
      }
    };

    return (
      <div className="w-full inline-flex scrollerContainer">
        <Scroller
          type="normal"
          value={habit.frequencySpecificDate}
          source={frequencySpecificDateSource}
          onChange={(value: any) =>
            handleChange('frequencySpecificDate', value)
          }
        />
        <Scroller
          type="normal"
          value={habit.frequencySpecificDay}
          source={frequencySpecificDaySource}
          onChange={(value: any) => handleChange('frequencySpecificDay', value)}
        />
      </div>
    );
  };

  const handleCloseBottomSheet = () => {
    // console.log({ ...previousHabit, ...habit });
    // setCustomHabit(Habit.create({ ...previousHabit, ...habit }));
    setOpen(false);
  };

  function guideText() {
    if (habit.frequencyUnit === 'week') {
      return showDayPicker === false ? (
        <Typography usage="body">
          Anytime goals will appear on the <strong>Home</strong> under{' '}
          <strong>This week</strong>.
        </Typography>
      ) : (
        <Typography usage="body">
          On specific day goals will appear on <strong>Home</strong> under{' '}
          <strong>Today</strong> on the days of the week you’ve selected.
        </Typography>
      );
    } else if (habit.frequencyUnit === 'month') {
      return showDayPicker === false ? (
        <Typography usage="body">
          Anytime goals will appear on the <strong>Home</strong> under{' '}
          <strong>This month</strong>.
        </Typography>
      ) : (
        <Typography usage="body">
          Specific day goals will appear on <strong>Home</strong> under{' '}
          <strong>Today</strong> on the days you’ve selected.
        </Typography>
      );
    }
    return <></>;
  }

  return (
    <BottomSheet
      id="FrequencyPickerBottomSheet"
      className="z-50 pb-10 h-screen"
      open={open}
      defaultSnap={({ maxHeight }) => maxHeight * 0.94}
      snapPoints={({ maxHeight }) => [maxHeight * 0.94]}
      header={
        <BottomSheetHeader
          title="Set frequency"
          leftSideActionLabel="Back"
          leftSideActionOnClick={handleCloseBottomSheet}
        />
      }
    >
      <PageWrapper>
        <div className="container pb-10 pt-7 h-5/6">
          <div id="frequencyContent" className="w-full block">
            <CountScroller />
            {showDaySelection === true ? <DaysSelection /> : <></>}
            {guideText()}
          </div>
        </div>
      </PageWrapper>
    </BottomSheet>
  );
};
