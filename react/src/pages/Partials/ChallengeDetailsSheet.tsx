import {
  calculateWhichCycle,
  formatDateForDisplay,
  HabitListItem,
  randomForNotifId
} from 'helpers/utils';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { Challenge, DialogProps, HabitReminder } from 'types/types';

import { Button } from 'Components/Button/Button';
import { ListGroup } from 'Components/ListGroup/ListGroup';
import { ListItem } from 'Components/ListItem/ListItem';
import { PageWrapper } from 'Components/PageWrapper/PageWrapper';
import { Typography } from 'Components/Typography/Typography';
import dayjs from 'dayjs';
import localization from 'helpers/localizationHelper';

import { Dialog } from '@capacitor/dialog';
import { BottomSheetHeader } from 'Components/BottomSheetHeader/BottomSheetHeader';
import { CardChallenge } from 'Components/CardChallenge/CardChallenge';
import { Scroller } from 'Components/Scroller/Scroller';
import { CustomHabitContext } from 'contexts/customhabit.context';
import { SyncHelper } from 'helpers/syncHelper';
import { ReactComponent as BrainIcon } from 'img/home_last_logo.svg';
import { Habit } from 'models/habit';
import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { LocalNotifications } from '@capacitor/local-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { getData, setDataFieldWithID } from 'slices/dataSlice';
import { RemindPickerBottomSheet } from './RemindPickerBottomSheet';

type ChallengeDetailsSheetProps = DialogProps & {
  challenge: Challenge;
  viewMode?: boolean;
};

const currentYear = moment().get('year');

const years = new Array(21).fill(1).map((_v, i) => ({
  value: currentYear + i,
  text: String(currentYear + i)
}));

function DatePickerBottomSheet({
  open,
  setOpen,
  onChange,
  date: inDate
}: DialogProps & {
  onChange: (date: number) => void;
  date: number;
}) {
  const [date, setDate] = useState(inDate);

  const d = moment(date);
  const monthSource: any = new Array(12)
    .fill(1)
    .map((_v, i) => ({ value: i + 1, text: moment.months()[i] }));

  const daysSource = new Array(d.daysInMonth()).fill(1).map((_v, i) => ({
    text: String(i + 1),
    value: i + 1
  }));

  const dateValue = d.get('date');
  const monthValue = d.get('month');
  const yearValue = d.get('year');

  let closing = false;

  const change = (what: 'day' | 'month' | 'year', value: number) => {
    if (!open || closing) {
      return;
    }
    d.set(what, value);
    const nb = moment(date);
    nb.set(what, value);
    setDate(nb.valueOf());

    onChange(nb.valueOf());

    // onChange(d.valueOf());
  };

  return (
    <BottomSheet
      id="datepickerBottomSheet"
      className="z-50 pb-10 h-screen"
      open={open}
      defaultSnap={({ maxHeight }) => maxHeight * 0.94}
      snapPoints={({ maxHeight }) => [maxHeight * 0.94]}
      header={
        <BottomSheetHeader
          title="Set start date"
          leftSideActionLabel="Back"
          leftSideActionOnClick={() => {
            closing = true;
            setOpen(false);
          }}
        />
      }
    >
      <PageWrapper sidesOnly>
        <div className="container mx-auto px-3 pb-10 pt-7 h-5/6">
          <div id="datepickerContent" className="w-full inline-flex">
            <Scroller
              source={monthSource}
              onChange={(value: any) => change('month', value)}
              value={monthValue}
            />
            <Scroller
              source={daysSource}
              onChange={(value: any) => change('day', value)}
              value={dateValue}
            />
            <Scroller
              source={years}
              onChange={(value: any) => change('year', value)}
              value={yearValue}
            />
          </div>
        </div>
      </PageWrapper>
    </BottomSheet>
  );
}

function DurationPickerBottomSheet({
  open,
  setOpen,
  onChange,
  duration
}: DialogProps & {
  onChange: (duration: number) => void;
  duration: number;
}) {
  const monthSource: any = new Array(90)
    .fill(1)
    .map((_v, i) => ({ value: i + 1, text: String(i + 1) }));

  const change = (value: number) => {
    onChange(value);

    // onChange(d.valueOf());
  };

  return (
    <BottomSheet
      id="datepickerBottomSheet"
      className="z-50 pb-10 h-screen"
      open={open}
      defaultSnap={({ maxHeight }) => maxHeight * 0.9}
      snapPoints={({ maxHeight }) => [
        maxHeight - maxHeight / 10,
        maxHeight / 4,
        maxHeight * 0.6
      ]}
      header={
        <BottomSheetHeader
          title="Set duration"
          leftSideActionLabel="Back"
          leftSideActionOnClick={() => {
            setOpen(false);
          }}
        />
      }
    >
      <PageWrapper sidesOnly>
        <div className="container mx-auto px-3 pb-10 pt-7 h-5/6">
          <div id="datepickerContent" className="w-full inline-flex">
            <Scroller
              source={monthSource}
              onChange={(value: any) => change(value)}
              value={duration}
            />

            {/* Locked frequency scroller */}
            <Scroller
              source={[
                {
                  text: 'days',
                  value: 'day'
                }
              ]}
              type="normal"
              value={'day'}
            />
          </div>
        </div>
      </PageWrapper>
    </BottomSheet>
  );
}

function ChallengeRemindersBottomSheet({
  open,
  setOpen,
  reminders,
  onChange
}: DialogProps & {
  reminders: HabitReminder[];
  onChange: (reminders: HabitReminder[]) => void;
}) {
  const [timeOpen, setTimeOpen] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(-1);

  // const onTimeChange = (value: any) => {
  //   const r = reminders[selectedIndex];
  //   r.time = value.text;
  //   onChange([...reminders]);
  // };

  const ReminderListItems = [
    ...reminders.map((r, i) => (
      <ListItem
        label={r.time}
        onClick={() => {
          setSelectedIndex(i);
          setTimeOpen(true);
        }}
        chevron
      />
    )),
    <ListItem
      label={'Add Reminder'}
      chevron
      onClick={() => {
        const id = randomForNotifId();
        console.log('Added', id);
        onChange([...reminders, { time: '9:00 AM', id }]);
        // setReminders((rs) => [...rs, { time: '9:00AM' }]);
        setSelectedIndex(reminders.length);
        setTimeOpen(true);
      }}
    />
  ];

  const reminderChanged = (reminder: HabitReminder) => {
    reminders[selectedIndex] = reminder;

    onChange([...reminders]);
  };

  const deleteReminder = (reminder: HabitReminder) => {
    setTimeOpen(false);

    reminders = reminders.filter((r) => r.id !== reminder.id);

    onChange([...reminders]);

    LocalNotifications.cancel({
      notifications: [{ id: reminder.id }]
    });
  };

  // const TimeSpinnerHeader = (
  //   <BottomSheetHeader
  //     title="Select time"
  //     leftSideActionLabel="Back"
  //     leftSideActionOnClick={() => {
  //       setTimeOpen(false);
  //     }}
  //   />
  // );

  return (
    <>
      <RemindPickerBottomSheet
        open={timeOpen}
        reminder={reminders[selectedIndex]}
        setOpen={setTimeOpen}
        onChange={reminderChanged}
        onDelete={deleteReminder}
      />
      <BottomSheet
        id="challengeReminderPickerBottomSheet"
        className=""
        open={open}
        header={
          <BottomSheetHeader
            title="Reminders"
            leftSideActionLabel="Done"
            leftSideActionOnClick={() => {
              setOpen(false);
            }}
          />
        }
        defaultSnap={({ maxHeight }) => maxHeight * 0.94}
        snapPoints={({ maxHeight }) => [maxHeight * 0.94]}
      >
        <PageWrapper sidesOnly>
          <div className={'py-4'}>
            <ListGroup
              items={ReminderListItems}
              listGroupType="listGroup_primary"
            />
          </div>
        </PageWrapper>
      </BottomSheet>

      {/* <BottomSheet open={timeOpen} header={TimeSpinnerHeader}>
        <PageWrapper sidesOnly>
          <TimeSpinner
            numberValue={false}
            value={'9:00 AM'}
            onChange={onTimeChange}
          />
        </PageWrapper>
      </BottomSheet> */}
    </>
  );
}

export function ChallengeDetailsSheet({
  open,
  setOpen,
  challenge: inChallenge,
  viewMode = false
}: ChallengeDetailsSheetProps) {
  const [challenge, setChallenge] = useState<Challenge>({ ...inChallenge });
  const [startPickerOpen, setStartPickerOpen] = useState(false);
  const [durationPickerOpen, setDurationPickerOpen] = useState(false);
  const [remindersOpen, setRemindersOpen] = useState(false);
  const [takingChallenge, setTakingChallenge] = useState(false);
  const navigate = useNavigate();
  const { closeAllInterfaces, setInterfaceOpen, setCustomHabit } =
    useContext(CustomHabitContext);

  const [reminders, setReminders] = useState(
    inChallenge?.challengeHabits[0]?.reminders || []
  );

  const startDate = dayjs(challenge.startDate);
  const dispatch = useDispatch();

  const { data } = useSelector(getData);
  const { appearanceOption } = data;

  const checkMono = (content: string) => {
    return data && data.monoOption && data.colourOption
      ? data.colourOption
      : content.split(' ')[0].toLowerCase();
  };

  useEffect(() => {
    if (!inChallenge) {
      setOpen(false);
      return;
    }

    setChallenge({ ...inChallenge });
    setReminders(inChallenge?.challengeHabits[0]?.reminders || []);
  }, [inChallenge, setOpen]);

  const openHabit = (h: Habit) => {
    setCustomHabit(h);
    setInterfaceOpen('customHabitOpen', true);
    dispatch(setDataFieldWithID({ id: 'newHabitType', value: 'view' }));
  };

  const DetailItems = [
    <ListItem
      chevron
      label={'Duration'}
      suffix={challenge.duration + ' days'}
      onClick={() => {
        if (!challenge.active) {
          setDurationPickerOpen(true);
        }
      }}
    />,
    <ListItem
      chevron
      label={'Starts'}
      suffix={
        dayjs.duration(startDate.diff(dayjs().startOf('day'))).days() === 1
          ? 'Tomorrow'
          : //   Yup. Mixing date libraries.
          formatDateForDisplay(moment(challenge.startDate))
      }
      onClick={() => {
        if (!challenge.active) {
          setStartPickerOpen(true);
        }
      }}
    />,
    <ListItem
      chevron
      label={'Habit reminders'}
      onClick={() => {
        if (!challenge.active) {
          console.log('OPEN');
          setRemindersOpen(true);
        }
      }}
    />
  ];
  const DailyItems = challenge.challengeHabits
    .filter((c) => c.frequencyUnit === 'day')
    .map((habit) => (
      <HabitListItem
        habit={habit}
        iconColourClass={checkMono(habit.pillars[0])}
        onClick={() => openHabit(habit)}
      />
    ));
  const WeeklyItems = challenge.challengeHabits
    .filter((c) => c.frequencyUnit === 'week')
    .map((habit) => (
      <HabitListItem
        habit={habit}
        iconColourClass={checkMono(habit.pillars[0])}
        onClick={() => openHabit(habit)}
      />
    ));
  const MonthlyItems = challenge.challengeHabits
    .filter((c) => c.frequencyUnit === 'month')
    .map((habit) => (
      <HabitListItem
        habit={habit}
        iconColourClass={checkMono(habit.pillars[0])}
        onClick={() => openHabit(habit)}
      />
    ));

  const takeChallengeClicked = async () => {
    let challengeToTake = challenge;
    setTakingChallenge(true);

    // Cancel any current notifications because we're about to update them for thes habits.
    SyncHelper.removeNotifications(challengeToTake.challengeHabits);

    // Go ahead and update the reminders/notifications (these will get a new ID)
    setChallenge(
      (c) =>
      (challengeToTake = {
        ...c,
        challengeHabits: c.challengeHabits?.map((h) =>
          Habit.create({
            ...h,
            reminders: reminders
          })
        )
      })
    );
    // It's now active.
    challengeToTake.active = true;

    // Proceed to take the challenge as normal.
    await SyncHelper.takeChallenge(challengeToTake).then(() => {
      setOpen(false);
      closeAllInterfaces();
      navigate('/');
    });
  };

  const cur =
    calculateWhichCycle({
      start: challenge.startDate,
      frequency: challenge.frequency,
      frequencyCount: 1,
      target: Date.now()
    }) - 1;

  async function endChallengeClicked() {
    const { value } = await Dialog.confirm({
      title: 'Are you sure?',
      message: `Do you really want to end the "${challenge.title}" challenge?`,
      okButtonTitle: 'Yes',
      cancelButtonTitle: 'No'
    });

    if (value) {
      const { value: keep } = await Dialog.confirm({
        title: 'Do you want to keep the associates habits?',
        message: localization.getString('endChallengeExplainer'),
        okButtonTitle: 'Yes',
        cancelButtonTitle: 'No'
      });
      SyncHelper.endChallenge(challenge, keep);

      setOpen(false);
      closeAllInterfaces();
    }
  }

  const challengeIcon = (challenge: Challenge, appearanceOption: string) => {
    if (
      challenge.darkModeHeaderImage &&
      (appearanceOption === 'dark' ||
        (appearanceOption === 'system' &&
          window.matchMedia('(prefers-color-scheme: dark)').matches))
    ) {
      return (
        <img
          width={181}
          height={122}
          alt="challenge icon"
          src={challenge.darkModeHeaderImage}
        />
      );
    }

    if (challenge.headerImage) {
      return (
        <img
          width={181}
          height={122}
          alt="challenge icon"
          src={challenge.headerImage}
        />
      );
    }
    return <BrainIcon width={181} height={122} />;
  };

  return (
    <>
      <BottomSheet
        open={open}
        header={
          <div className="inline-flex justify-start w-full">
            <Typography
              typeClass={[
                'text-mom_lightMode_text-primary dark:text-mom_darkMode_text-primary'
              ]}
              usage="body"
              content="Back"
              onClick={() => setOpen(false)}
            />
            <Typography
              typeClass={[
                'text-mom_lightMode_text-neutral dark:text-mom_darkMode_text-neutral absolute left-1/2 -translate-x-1/2'
              ]}
              usage="headingSmall"
              content="Challenge"
            />
          </div>
        }
        defaultSnap={({ maxHeight }) => maxHeight * 0.94}
        snapPoints={({ maxHeight }) => [maxHeight * 0.94]}
      >
        <PageWrapper sidesOnly>
          <div className={'py-6 relative'}>
            {/* Hidden button to make sure we at the top when it opens */}
            <button type={'button'} className={'w-0 h-0'} />
            <div className={'flex items-center content-center justify-center'}>
              {/* Pulled dimensions from the design */}
              {challengeIcon(challenge, appearanceOption)}
            </div>
            <Typography typeClass={['my-4']} usage="headingMedium">
              {challenge.title}
            </Typography>
            <Typography usage="body">{challenge.subtitle}</Typography>

            <div className={'my-6'}>
              {!viewMode ? (
                <ListGroup
                  heading="Details"
                  items={DetailItems}
                  listGroupType="listGroup_primary"
                />
              ) : (
                <>
                  <CardChallenge
                    cardType="card-notactionable"
                    completedDuration={cur}
                    totalDuration={challenge.duration}
                    challengeName={challenge.progress + '%'}
                    timeUnit={challenge.frequency.concat('s')}
                  />
                </>
              )}
            </div>

            {DailyItems.length ? (
              <div className={'mb-6'}>
                <ListGroup
                  heading="Daily goals"
                  items={DailyItems}
                  listGroupType="listGroup_primary"
                />
              </div>
            ) : (
              <></>
            )}
            {WeeklyItems.length ? (
              <div className={'mb-6'}>
                <ListGroup
                  heading="Weekly goals"
                  items={WeeklyItems}
                  listGroupType="listGroup_primary"
                />
              </div>
            ) : (
              <></>
            )}
            {MonthlyItems.length ? (
              <div className={'mb-6'}>
                <ListGroup
                  heading="Monthly goals"
                  items={MonthlyItems}
                  listGroupType="listGroup_primary"
                />
              </div>
            ) : (
              <></>
            )}

            {!challenge.active || takingChallenge ? (
              <Button
                buttonType="btn-primary"
                buttonClass={['my-6 headingSmall']}
                onClick={() => takeChallengeClicked()}
                tabIndex={-1}
                disabledState={takingChallenge}
                loading={takingChallenge}
                label="Take the challenge"
              />
            ) : (
              <Button
                buttonType="btn-primary"
                buttonClass={['my-6 headingSmall']}
                onClick={() => endChallengeClicked()}
                tabIndex={-1}
              >
                End challenge
              </Button>
            )}
          </div>
        </PageWrapper>
      </BottomSheet>
      <DatePickerBottomSheet
        date={challenge.startDate}
        open={startPickerOpen}
        setOpen={setStartPickerOpen}
        onChange={(v) => {
          setChallenge((c) => ({
            ...c,
            startDate: v
          }));
        }}
      />
      <DurationPickerBottomSheet
        open={durationPickerOpen}
        duration={challenge.duration}
        setOpen={setDurationPickerOpen}
        onChange={(v) => {
          const endDate = moment(challenge.startDate)
            .add(v, challenge.frequency)
            .valueOf();

          // Update the duration and end date
          setChallenge((c) => ({
            ...c,
            duration: v,
            endDate: endDate,
            challengeHabits: c.challengeHabits.map((c) =>
              Habit.create({
                ...c,
                endDate: endDate
              })
            )
          }));
        }}
      />
      <ChallengeRemindersBottomSheet
        open={remindersOpen}
        setOpen={setRemindersOpen}
        // All habits will have the same reminders
        reminders={reminders}
        onChange={(rs) => {
          setReminders(rs);
        }}
      />
    </>
  );
}
